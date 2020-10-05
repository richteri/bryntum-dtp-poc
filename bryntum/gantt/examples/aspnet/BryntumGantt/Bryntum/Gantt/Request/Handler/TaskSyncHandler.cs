using Bryntum.CRUD.Request;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bryntum.Gantt.Request.Handler
{
    public class TaskSyncHandler : SyncStoreRequestHandler<Task> {

        private Gantt gantt;

        public TaskSyncHandler(Gantt gantt, string dateFormat) : base(dateFormat) {
            this.gantt = gantt;
        }

        public override Task GetEntity(IDictionary<String, Object> changes) {
            return gantt.getTask(Convert.ToInt32(changes["Id"]));
        }

        /// <summary>
        /// Fills response with segments data.
        /// Used to return identifiers of newly created segments.
        /// </summary>
        /// <param name="response">Whole task related response.</param>
        /// <param name="segments">List of segments to return.</param>
        protected void AddSegmentsResponse(IDictionary<String, Object> response, IList<TaskSegment> segments)
        {
            IList<IDictionary<String, Object>> segmentsResponse = new List<IDictionary<String, Object>>();

            if (segments != null) {
                IDictionary<String, Object> segmentResponse;

                foreach (TaskSegment segment in segments) {
                    segmentResponse = new Dictionary<String, Object>();
                    segmentResponse.Add("Id", segment.Id);
                    segmentResponse.Add(segment.PhantomIdField, segment.PhantomId);
                    segmentsResponse.Add(segmentResponse);
                }

                response.Add("Segments", segmentsResponse);
            } else {
                response.Add("Segments", null);
            }
        }

        protected TaskSegment GetTaskSegment(IDictionary<String, Object> changes)
        {
            TaskSegment segment;

            if (changes.ContainsKey("Id") && changes["Id"] != null)
            {
                segment = gantt.getTaskSegment(Convert.ToInt32(changes["Id"]));
            }
            // for a phantom segment we make a new TaskSegment() instance
            else
            {
                segment = new TaskSegment();
            }

            if (segment == null) return null;

            if (changes.ContainsKey("Cls")) segment.Cls = Convert.ToString(changes["Cls"]);
            if (changes.ContainsKey("Duration")) segment.Duration = Convert.ToDecimal(changes["Duration"]);
            if (changes.ContainsKey("DurationUnit")) segment.DurationUnit = Convert.ToString(changes["DurationUnit"]);
            if (changes.ContainsKey("StartDate")) segment.StartDate = Convert.ToDateTime(changes["StartDate"]);
            if (changes.ContainsKey("EndDate")) segment.EndDate = Convert.ToDateTime(changes["EndDate"]);
            if (changes.ContainsKey(segment.PhantomIdField))
            {
                segment.PhantomId = Convert.ToString(changes[segment.PhantomIdField]);
            }

            return segment;
        }

        protected IDictionary<String, Object> PrepareTask(Task task)
        {
            // initialize returning hash
            IDictionary<String, Object> result = new Dictionary<String, Object>();

            String phantomTaskId = task.PhantomParentId;
            if (task.parentId == null && !String.IsNullOrEmpty(phantomTaskId)
                && !phantomTaskId.Equals("root", StringComparison.InvariantCultureIgnoreCase))
            {
                int? taskId = gantt.getTaskIdByPhantom(phantomTaskId);
                task.parentIdRaw = taskId.Value;
                result.Add("parentId", taskId);
            }

            String phantomCalendarId = task.PhantomCalendarId;
            if (task.CalendarIdRaw == null && !String.IsNullOrEmpty(phantomCalendarId))
            {
                int? calendarId = gantt.getCalendarIdByPhantom(phantomCalendarId);
                task.CalendarIdRaw = calendarId.Value;
                result.Add("CalendarId", calendarId);
            }

            return result;
        }

        public override IDictionary<String, Object> Add(Task task) {
            IDictionary<String, Object> response = PrepareTask(task);
            gantt.saveTask(task);

            // put segments related response
            if (task.Segments != null) AddSegmentsResponse(response, task.Segments.ToList());

            return response;
        }

        public override IDictionary<String, Object> Update(Task task, IDictionary<String, Object> changes)
        {
            // first let's apply provided changes to the task

            if (changes.ContainsKey("CalendarId")) task.CalendarId = Convert.ToString(changes["CalendarId"]);
            if (changes.ContainsKey("Cls")) task.Cls = Convert.ToString(changes["Cls"]);
            if (changes.ContainsKey("Duration")) task.Duration = Convert.ToDecimal(changes["Duration"]);
            if (changes.ContainsKey("DurationUnit")) task.DurationUnit = Convert.ToString(changes["DurationUnit"]);
            if (changes.ContainsKey("Name")) task.Name = Convert.ToString(changes["Name"]);
            if (changes.ContainsKey("StartDate")) task.StartDate = Convert.ToDateTime(changes["StartDate"]);
            if (changes.ContainsKey("EndDate")) task.EndDate = Convert.ToDateTime(changes["EndDate"]);
            if (changes.ContainsKey("PercentDone")) task.PercentDone = Convert.ToDecimal(changes["PercentDone"]);
            if (changes.ContainsKey("SchedulingMode")) task.SchedulingMode = Convert.ToString(changes["SchedulingMode"]);
            if (changes.ContainsKey("BaselinePercentDone")) task.BaselinePercentDone = Convert.ToDecimal(changes["BaselinePercentDone"]);
            if (changes.ContainsKey("BaselineStartDate")) task.BaselineStartDate = Convert.ToDateTime(changes["BaselineStartDate"]);
            if (changes.ContainsKey("BaselineEndDate")) task.BaselineEndDate = Convert.ToDateTime(changes["BaselineEndDate"]);
            if (changes.ContainsKey("Effort")) task.Effort = Convert.ToDecimal(changes["Effort"]);
            if (changes.ContainsKey("EffortUnit")) task.EffortUnit = Convert.ToString(changes["EffortUnit"]);
            if (changes.ContainsKey("Note")) task.Note = Convert.ToString(changes["Note"]);
            if (changes.ContainsKey("ConstraintDate"))
            {
                var value = changes["ConstraintDate"];
                if (value == null)
                {
                    task.ConstraintDate = null;
                }
                else
                {
                    task.ConstraintDate = Convert.ToDateTime(changes["ConstraintDate"]);
                }
            }
            if (changes.ContainsKey("ConstraintType")) task.ConstraintType = Convert.ToString(changes["ConstraintType"]);
            if (changes.ContainsKey("ManuallyScheduled")) task.ManuallyScheduled = Convert.ToBoolean(changes["ManuallyScheduled"]);
            if (changes.ContainsKey("Draggable")) task.Draggable = Convert.ToBoolean(changes["Draggable"]);
            if (changes.ContainsKey("Resizable")) task.Resizable = Convert.ToBoolean(changes["Resizable"]);
            if (changes.ContainsKey("Rollup")) task.Rollup = Convert.ToBoolean(changes["Rollup"]);
            if (changes.ContainsKey("$PhantomParentId")) task.PhantomParentId = Convert.ToString(changes["$PhantomParentId"]);
            if (changes.ContainsKey("DeadlineDate")) task.DeadlineDate = Convert.ToDateTime(changes["DeadlineDate"]);

            if (changes.ContainsKey("parentId")) task.parentId = Convert.ToString(changes["parentId"]);
            if (changes.ContainsKey("expanded")) task.expanded = Convert.ToBoolean(changes["expanded"]);
            if (changes.ContainsKey("index")) task.index = Convert.ToInt32(changes["index"]);

            bool isSegmentsProvided = false;

            // if segments changes are provided
            if (changes.ContainsKey("Segments"))
            {
                isSegmentsProvided = true;

                // Segments might be null if we merge the task back
                if (changes["Segments"] != null)
                {
                    IList<TaskSegment> segments = new List<TaskSegment>();

                    IList<IDictionary<String, Object>> segmentsChanges = ((Newtonsoft.Json.Linq.JArray) changes["Segments"]).ToObject<List<IDictionary<String, Object>>>();

                    foreach (IDictionary<String, Object> segmentChanges in segmentsChanges)
                    {
                        segments.Add(GetTaskSegment(segmentChanges));
                    }

                    task.Segments = segments;
                }
                else
                {
                    task.Segments.Clear();
                }
            }

            if (changes.ContainsKey(task.PhantomIdField)) task.PhantomId = Convert.ToString(changes[task.PhantomIdField]);

            IDictionary<String, Object> response = PrepareTask(task);

            gantt.saveTask(task);

            // put segments related response ..if segments changes were provided
            if (isSegmentsProvided)
            {
                AddSegmentsResponse(response, task.Segments.ToList());
            }

            return response;
        }

        public override IDictionary<String, Object> Remove(Task task)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.removeTask(task.Id);
            return response;
        }
    }
}
