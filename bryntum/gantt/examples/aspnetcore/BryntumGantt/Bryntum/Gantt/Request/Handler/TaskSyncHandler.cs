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
            return gantt.GetTask(Convert.ToInt32(changes["Id"]));
        }

        protected IDictionary<String, Object> PrepareTask(Task task)
        {
            // initialize returning hash
            IDictionary<String, Object> result = new Dictionary<String, Object>();

            String phantomTaskId = task.PhantomParentId;
            if (task.ParentId == null && !String.IsNullOrEmpty(phantomTaskId)
                && !phantomTaskId.Equals("root", StringComparison.InvariantCultureIgnoreCase))
            {
                int? taskId = gantt.GetTaskIdByPhantom(phantomTaskId);
                task.ParentIdRaw = taskId.Value;
            }

            String phantomCalendarId = task.PhantomCalendarId;
            if (task.CalendarIdRaw == null && !String.IsNullOrEmpty(phantomCalendarId))
            {
                int? calendarId = gantt.GetCalendarIdByPhantom(phantomCalendarId);
                task.CalendarIdRaw = calendarId.Value;
                result.Add("CalendarId", calendarId);
            }

            return result;
        }

        public override IDictionary<String, Object> Add(Task task) {
            IDictionary<String, Object> response = PrepareTask(task);
            
            gantt.SaveTask(task);

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

            if (changes.ContainsKey("parentId")) task.ParentId = Convert.ToString(changes["parentId"]);
            if (changes.ContainsKey("expanded")) task.expanded = Convert.ToBoolean(changes["expanded"]);

            if (changes.ContainsKey(task.PhantomIdField)) task.PhantomId = Convert.ToString(changes[task.PhantomIdField]);

            IDictionary<String, Object> response = PrepareTask(task);

            gantt.SaveTask(task);

            return response;
        }

        public override IDictionary<String, Object> Remove(Task task)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.RemoveTask(task.Id);
            return response;
        }
    }
}
