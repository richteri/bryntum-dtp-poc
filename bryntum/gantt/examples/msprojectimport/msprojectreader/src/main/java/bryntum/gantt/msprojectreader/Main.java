/**
 * MSProject import example.
 * Copyright Bryntum, 2015
 */
package bryntum.gantt.msprojectreader;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import net.sf.mpxj.Column;
import net.sf.mpxj.ConstraintType;
import net.sf.mpxj.DateRange;
import net.sf.mpxj.Day;
import net.sf.mpxj.FieldType;
import net.sf.mpxj.MPXJException;
import net.sf.mpxj.ProjectCalendar;
import net.sf.mpxj.ProjectCalendarContainer;
import net.sf.mpxj.ProjectCalendarHours;
import net.sf.mpxj.ProjectFile;
import net.sf.mpxj.ProjectProperties;
import net.sf.mpxj.Relation;
import net.sf.mpxj.Resource;
import net.sf.mpxj.ResourceAssignment;
import net.sf.mpxj.Table;
import net.sf.mpxj.Task;
import net.sf.mpxj.TaskMode;
import net.sf.mpxj.TimeUnit;
import net.sf.mpxj.mpp.MPPReader;

public class Main {
    private static String errorMessage = "There was an exception raised during the operation. Exception message: ";
    private static String wrongUsageMessage = "Usage: java -jar bryntum-msproject-reader.jar mpp-file output-file \nNote: provide \"1\" instead of output-file path to return JSON into stdout.";

    static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    static SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

    static int indentFactor = 4;

    static Map<String, Integer> dependencyTypesByAlias;
    static Map<String, String> columnXTypesByName;
    static Map<String, JSONObject> columnOptionsByName;
    static Map<String, String> unitNamesByTimeUnitName;

    static {
        unitNamesByTimeUnitName = new Hashtable<String, String>();
        // TimeUnit supported names are: [m, h, d, w, mo, %, y, em, eh, ed, ew, emo, ey, e%]
        // but the Gantt needs minutes to be marked as "mi" but not "m"
        unitNamesByTimeUnitName.put("m", "mi");
        // TODO: so far we add elapsed time units support this way
        unitNamesByTimeUnitName.put("em", "mi");
        unitNamesByTimeUnitName.put("eh", "h");
        unitNamesByTimeUnitName.put("ed", "d");
        unitNamesByTimeUnitName.put("ew", "w");
        unitNamesByTimeUnitName.put("emo", "mo");
        unitNamesByTimeUnitName.put("ey", "y");
    }

    // initialize dependency/column types mappings
    static {
        // dependency types codes
        dependencyTypesByAlias = new Hashtable<String, Integer>();
        dependencyTypesByAlias.put("FF", 3);
        dependencyTypesByAlias.put("FS", 2);
        dependencyTypesByAlias.put("SF", 1);
        dependencyTypesByAlias.put("SS", 0);

        // list of known columns
        columnXTypesByName = new Hashtable<String, String>();
        columnXTypesByName.put("Task Name", "namecolumn");
        columnXTypesByName.put("Duration", "durationcolumn");
        columnXTypesByName.put("Start", "startdatecolumn");
        columnXTypesByName.put("Finish", "enddatecolumn");
        columnXTypesByName.put("% Complete", "percentdonecolumn");
        columnXTypesByName.put("Resource Names", "resourceassignmentcolumn");
        columnXTypesByName.put("Early Start", "earlystartdatecolumn");
        columnXTypesByName.put("Early Finish", "earlyenddatecolumn");
        columnXTypesByName.put("Late Start", "latestartdatecolumn");
        columnXTypesByName.put("Late Finish", "lateenddatecolumn");
        columnXTypesByName.put("Total Slack", "totalslackcolumn");
        columnXTypesByName.put("Free Slack", "freeslackcolumn");
        columnXTypesByName.put("Constraint Type", "constrainttypecolumn");
        columnXTypesByName.put("Constraint Date", "constraintdatecolumn");
        columnXTypesByName.put("Rollup", "rollupcolumn");
        columnXTypesByName.put("Baseline Start", "baselinestartdatecolumn");
        columnXTypesByName.put("Baseline Finish", "baselineenddatecolumn");

        // some of columns should have extra options
        columnOptionsByName = new Hashtable<String, JSONObject>();
        columnOptionsByName.put("Predecessors",
                new JSONObject("{ xtype : \"predecessorcolumn\", useSequenceNumber : true }"));
    }

    public static void main(String[] args) throws IOException {
        String sourceFile, targetFile;
        Boolean printResult;

        try {
            if (args.length < 2) {
                System.out.println(wrongUsageMessage);
                System.exit(0);
            }

            sourceFile = args[0];
            targetFile = args[1];
            printResult = targetFile.equals("1");

            // optional indent size for resulting JSON string
            if (args.length > 2 && args[2] != null) {
                indentFactor = Integer.parseInt(args[2]);
            }

            if (args.length > 3 && args[3] != null) {
                dateFormat = new SimpleDateFormat(args[3]);
            }

            String result = getProjectJSONString(sourceFile, indentFactor);

            if (printResult) {
                System.out.println(result);
            } else {
                BufferedWriter out = new BufferedWriter(new FileWriter(targetFile));
                out.write(result);
                out.close();
            }

        } catch (Exception e) {
            System.out.println(errorMessage + e);
            System.exit(0);
        }
    }

    private static String getConstraintType(ConstraintType constraintType) {
        String result = null;

        switch (constraintType) {
        /*
        case AS_LATE_AS_POSSIBLE:
            result = "aslateaspossible";
            break;

        case AS_SOON_AS_POSSIBLE:
            result = "assoonaspossible";
            break;
        */
        case FINISH_NO_EARLIER_THAN:
            result = "finishnoearlierthan";
            break;

        case FINISH_NO_LATER_THAN:
            result = "finishnolaterthan";
            break;

        case MUST_FINISH_ON:
            result = "mustfinishon";
            break;

        case MUST_START_ON:
            result = "muststarton";
            break;

        case START_NO_EARLIER_THAN:
            result = "startnoearlierthan";
            break;

        case START_NO_LATER_THAN:
            result = "startnolaterthan";
            break;
        default:
            break;
        }

        return result;
    }

    /**
     * Extracts the provided task data into JSON object.
     *
     * @param task
     *            Task to extract
     * @return JSON object keeping the extracted task data
     */
    private static JSONObject getTaskJSON(Task task) {
        JSONObject object = new JSONObject();

        object.put("Id", task.getUniqueID());
        object.put("Name", task.getName());
        object.put("StartDate", dateFormat.format(task.getStart()));
        object.put("EndDate", dateFormat.format(task.getFinish()));
        object.put("Duration", task.getDuration().getDuration());
        object.put("DurationUnit", getUnitByTimeUnit(task.getDuration().getUnits()));
        object.put("PercentDone", task.getPercentageComplete());
        object.put("Milestone", task.getMilestone());
        object.put("Rollup", task.getRollup());
        object.put("ManuallyScheduled", task.getTaskMode() == TaskMode.MANUALLY_SCHEDULED);

        Date constraintDate = task.getConstraintDate();
        if (constraintDate != null) {
            object.put("ConstraintDate", dateFormat.format(task.getConstraintDate()));
        }
        object.put("ConstraintType", getConstraintType(task.getConstraintType()));

        if (task.getBaselineStart() != null) {
            object.put("BaselineStartDate", dateFormat.format(task.getBaselineStart()));
        } else {
            object.put("BaselineStartDate", "");
        }
        if (task.getBaselineFinish() != null) {
            object.put("BaselineEndDate", dateFormat.format(task.getBaselineFinish()));
        } else {
            object.put("BaselineEndDate", "");
        }
        // TODO: BaselineDuration is not supported by the Gantt Task model at the moment, so this code doesn't work really
        if (task.getBaselineDuration() != null) {
            object.put("BaselineDuration", task.getBaselineDuration());
        } else {
            object.put("BaselineDuration", "");
        }

        // retrieve the task children info
        JSONArray children = new JSONArray();

        for (Task child : task.getChildTasks()) {
            children.put(getTaskJSON(child));
        }

        if (children.length() > 0) {
            object.put("children", children);
            object.put("expanded", task.getExpanded());
            object.put("leaf", false);
        } else {
            object.put("leaf", true);
        }

        return object;
    }

    public static JSONObject getCalendarJSON(ProjectCalendar calendar, Map<Integer, List<ProjectCalendar>> childrenById) {
        JSONObject calendarJSON = new JSONObject();

        calendarJSON.put("Id", calendar.getUniqueID());
        calendarJSON.put("Name", calendar.getName());

        ProjectCalendar parentCalendar = calendar.getParent();
        if (parentCalendar != null) {
            calendarJSON.put("parentId", parentCalendar.getUniqueID());
        }

        // calculate unit conversion ratios
        calendarJSON.put("DaysPerWeek", calendar.getMinutesPerWeek() / calendar.getMinutesPerDay());
        calendarJSON.put("DaysPerMonth", calendar.getMinutesPerMonth() / calendar.getMinutesPerDay());
        calendarJSON.put("HoursPerDay", calendar.getMinutesPerDay() / 60);

        // let's try to find weekends

        // if Sunday or Saturday is a working day
        boolean weekendsAreWorkdays = calendar.isWorkingDay(Day.getInstance(1)) || calendar.isWorkingDay(Day.getInstance(7));

        // if both Sunday & Saturday are non-working
        if (!calendar.isWorkingDay(Day.getInstance(1)) && !calendar.isWorkingDay(Day.getInstance(7))) {
            calendarJSON.put("WeekendFirstDay", 6);
            calendarJSON.put("WeekendSecondDay", 0);

        // ..otherwise let's get first two non-working days in a row
        } else {
            for (int i= 1; i < 7; i++) {
                if (!calendar.isWorkingDay(Day.getInstance(i)) && !calendar.isWorkingDay(Day.getInstance(i+1))) {
                    weekendsAreWorkdays = true;
                    calendarJSON.put("WeekendFirstDay", i - 1);
                    calendarJSON.put("WeekendSecondDay", i);
                    break;
                }
            }
        }

        calendarJSON.put("WeekendsAreWorkdays", weekendsAreWorkdays);

        // let's try to find defaultAvailability

        JSONArray defaultAvailabilityList = new JSONArray();

        ProjectCalendarHours hours = null;

        for (int i = 1; i < 7; i++) {
            hours = calendar.getHours(Day.getInstance(i));
            // let's get the 1st working day availability and hope for the best
            if (calendar.isWorkingDay(Day.getInstance(i))) {
                for (DateRange range : hours) {
                    defaultAvailabilityList.put(timeFormat.format(range.getStart()) + "-" + timeFormat.format(range.getEnd()));
                }
                break;
            }
        }

        calendarJSON.put("DefaultAvailability", defaultAvailabilityList);

        // if the calendar has children
        if (childrenById.containsKey(calendar.getUniqueID())) {
            calendarJSON.put("leaf", false);

            // let's build JSON for the children
            JSONArray childrenJSON = new JSONArray();
            List<ProjectCalendar> children = childrenById.get(calendar.getUniqueID());
            for (ProjectCalendar child : children) {
                childrenJSON.put(getCalendarJSON(child, childrenById));
            }

            calendarJSON.put("children", childrenJSON);

        } else {
            calendarJSON.put("leaf", true);
        }

        // TODO: need to export day/week overrides
        // calendarObject.put("Days", .....);
        // day overrides are returned:
        // calendarJSON.put("exceptions", calendar.getCalendarExceptions().toString());
        // but week overrides are since MPXJ does not return them (https://sourceforge.net/p/mpxj/bugs/258/):
        // calendarJSON.put("weeks", calendar.getWorkWeeks().toString());

        return calendarJSON;
    }

    public static JSONObject getCalendarsJSON(ProjectFile projectFile) {
        JSONObject calendarsJSON = new JSONObject();

        JSONObject calendarsMetaDataJSON = new JSONObject();
        calendarsMetaDataJSON.put("projectCalendar", projectFile.getDefaultCalendar().getUniqueID());
        calendarsJSON.put("metaData", calendarsMetaDataJSON);

        ProjectCalendarContainer calendars = projectFile.getCalendars();

        Map<Integer, List<ProjectCalendar>> childrenById = new Hashtable<Integer, List<ProjectCalendar>>();
        ProjectCalendar parent = null;
        List<ProjectCalendar> children = null;
        // loop over calendars and collect children indexed by their parent ids
        // since calendars don't have ready "children" property
        for (ProjectCalendar calendar : calendars) {
            parent = calendar.getParent();

            if (parent != null) {
                if (!childrenById.containsKey(parent.getUniqueID())) {
                    children = new ArrayList<ProjectCalendar>();
                    childrenById.put(parent.getUniqueID(), children);
                } else {
                    children = childrenById.get(parent.getUniqueID());
                }
                children.add(calendar);
            }
        }

        // now let's loop and start building JSON from root nodes
        JSONArray calendarListJSON = new JSONArray();
        for (ProjectCalendar calendar : calendars) {
            // if it's a root node
            if (!calendar.isDerived()) {
                calendarListJSON.put(getCalendarJSON(calendar, childrenById));
            }
        }

        calendarsJSON.put("children", calendarListJSON);

        return calendarsJSON;
    }

    /**
     * Extracts the provided MPP file contents into a JSON object.
     *
     * @param projectFile
     *            MPP file to process
     * @return A JSON object containing the project data (tasks, dependencies,
     *         resources, assignments).
     */
    public static JSONObject getProjectJSON(ProjectFile projectFile) {
        JSONArray taskListJSON = new JSONArray();
        Task firstTask = projectFile.getChildTasks().get(0);

        // If "Show Project Summary Task" option is enabled
        // we include firstTask into the response
        if (projectFile.getProjectProperties().getShowProjectSummaryTask()) {
            taskListJSON.put(getTaskJSON(firstTask));
        } else {
            for (Task task : firstTask.getChildTasks()) {
                taskListJSON.put(getTaskJSON(task));
            }
        }

        int dependencyId = 0;

        JSONObject dependencyJSON;
        JSONArray dependencyListJSON = new JSONArray();

        // extract all the dependencies
        for (Task task : projectFile.getAllTasks()) {

            List<Relation> predecessors = task.getPredecessors();

            if (predecessors != null && predecessors.isEmpty() == false) {
                for (Relation relation : predecessors) {
                    dependencyJSON = new JSONObject();

                    dependencyJSON.put("Id", dependencyId++);
                    dependencyJSON.put("To", relation.getSourceTask().getUniqueID());
                    dependencyJSON.put("From", relation.getTargetTask().getUniqueID());
                    dependencyJSON.put("Lag", relation.getLag().getDuration());
                    dependencyJSON.put("LagUnit", getUnitByTimeUnit(relation.getLag().getUnits()));
                    dependencyJSON.put("Type", dependencyTypesByAlias.get(relation.getType().toString()));
                    dependencyListJSON.put(dependencyJSON);
                }
            }
        }

        JSONObject resourceJSON, assignmentJSON;
        JSONArray assignmentListJSON = new JSONArray();
        JSONArray resourceListJSON = new JSONArray();

        // extract all the resources
        for (Resource resource : projectFile.getAllResources()) {
            resourceJSON = new JSONObject();

            resourceJSON.put("Id", resource.getUniqueID());
            resourceJSON.put("Name", (resource.getName() != null ? resource.getName() : "New resource"));
            resourceListJSON.put(resourceJSON);

            // corresponding resource' assignment
            for (ResourceAssignment assignment : resource.getTaskAssignments()) {
                assignmentJSON = new JSONObject();

                assignmentJSON.put("Id", assignment.getUniqueID());
                assignmentJSON.put("ResourceId", resource.getUniqueID());
                assignmentJSON.put("TaskId", assignment.getTask().getUniqueID());
                assignmentJSON.put("Units", assignment.getUnits());
                assignmentListJSON.put(assignmentJSON);
            }
        }

        FieldType fieldType;
        String fieldTypeName;
        JSONObject columnJSON;
        JSONArray columnListJSON = new JSONArray();

        Iterator<Table> i = projectFile.getTables().iterator();

        // extract columns
        if (i.hasNext()) {
            Table table = i.next();

            for (Column column : table.getColumns()) {
                fieldType = column.getFieldType();

                // skip column if we don't know its type
                if (fieldType != null) {
                    // get the column type name in US locale
                    fieldTypeName = fieldType.getName(Locale.US);

                    JSONObject columnOptions = getColumnOptions(fieldTypeName);
                    // if we have options for the column
                    if (columnOptions != null) {
                        columnJSON = new JSONObject(columnOptions, JSONObject.getNames(columnOptions));
                    } else {
                        columnJSON = new JSONObject();

                        String columnXType = getColumnXType(fieldTypeName);
                        // skip unknown columns
                        if (columnXType.equals(""))
                            continue;

                        columnJSON.put("xtype", columnXType);
                    }

                    columnListJSON.put(columnJSON);
                }
            }
        }

        JSONObject tasksJSON = new JSONObject();
        tasksJSON.put("children", taskListJSON);
        tasksJSON.put("Name", "Root Node");

        JSONObject tasksMetaDataJSON = new JSONObject();

        ProjectProperties projectProperties = projectFile.getProjectProperties();
        // TODO: review these comments when we start supporting backward scheduling
        // ScheduleFrom.START or ScheduleFrom.FINISH
        // ScheduleFrom scheduleFrom = projectProperties.getScheduleFrom();
        tasksMetaDataJSON.put("projectStartDate", dateFormat.format(projectProperties.getStartDate()));
        tasksMetaDataJSON.put("cascadeChanges", projectProperties.getHonorConstraints());
        tasksJSON.put("metaData", tasksMetaDataJSON);

        // put all the data into a single object
        JSONObject result = new JSONObject();
        result.put("calendars", getCalendarsJSON(projectFile));
        result.put("tasks", tasksJSON);
        result.put("dependencies", dependencyListJSON);
        result.put("assignments", assignmentListJSON);
        result.put("resources", resourceListJSON);
        result.put("columns", columnListJSON);
        return result;
    }

    static String getUnitByTimeUnit(TimeUnit timeUnit) {
        String unitName = null;

        if (timeUnit != null) {
            unitName = timeUnit.getName();

            if (unitNamesByTimeUnitName.containsKey(unitName)) {
                return unitNamesByTimeUnitName.get(unitName);
            }
        }

        return unitName;
    }

    static String getColumnXType(String columnName) {
        if (columnName == null || !columnXTypesByName.containsKey(columnName))
            return "";
        return columnXTypesByName.get(columnName).toString();
    }

    static JSONObject getColumnOptions(String columnName) {
        if (columnName == null || !columnOptionsByName.containsKey(columnName))
            return null;
        return columnOptionsByName.get(columnName);
    }

    /**
     * Extracts the provided MPP file contents into a string (a serialized JSON
     * object).
     *
     * @param projectFile
     *            MPP file to process
     * @param indentFactor
     *            Indentation size for JSON serializing
     * @return A serialized JSON object containing the project data (tasks,
     *         dependencies, resources, assignments).
     * @throws MPXJException
     */
    public static String getProjectJSONString(String projectFile, int indentFactor) throws MPXJException {
        return getProjectJSON(new MPPReader().read(projectFile)).toString(indentFactor);
    }
}
