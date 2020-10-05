using Bryntum.CRUD.Request;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt.Request.Handler
{
    public class AssignmentSyncHandler : SyncStoreRequestHandler<Assignment> {

        private Gantt gantt;

        public AssignmentSyncHandler(Gantt gantt) {
            this.gantt = gantt;
        }

        public override Assignment GetEntity(IDictionary<String, Object> changes) {
            return gantt.getAssignment(Convert.ToInt32(changes["Id"]));
        }

        protected IDictionary<String, Object> PrepareData(Assignment assignment) {
            // initialize returning hash
            IDictionary<String, Object> result = new Dictionary<String, Object>();

            String phantomTaskId = assignment.PhantomTaskId;
            if (assignment.TaskIdRaw == 0 && !String.IsNullOrEmpty(phantomTaskId)) {
                int? taskId = gantt.getTaskIdByPhantom(phantomTaskId);
                assignment.TaskIdRaw = taskId.Value;
                result.Add("TaskId", taskId);
            }

            String phantomResourceId = assignment.PhantomResourceId;
            if (assignment.ResourceIdRaw == 0 && !String.IsNullOrEmpty(phantomResourceId))
            {
                int? resourceId = gantt.getResourceIdByPhantom(phantomResourceId);
                assignment.ResourceIdRaw = resourceId.Value;
                result.Add("ResourceId", resourceId);
            }

            return result;
        }

        public override IDictionary<String, Object> Add(Assignment assignment) {
            IDictionary<String, Object> response = PrepareData(assignment);
            gantt.saveAssignment(assignment);
            return response;
        }

        public override IDictionary<String, Object> Update(Assignment assignment, IDictionary<String, Object> changes)
        {
            // apply changes to the record
            if (changes.ContainsKey("ResourceId")) assignment.ResourceId = Convert.ToString(changes["ResourceId"]);
            if (changes.ContainsKey("TaskId")) assignment.TaskId = Convert.ToString(changes["TaskId"]);
            if (changes.ContainsKey("Units")) assignment.Units = Convert.ToInt32(changes["Units"]);
            if (changes.ContainsKey(assignment.PhantomIdField))
                assignment.PhantomId = Convert.ToString(changes[assignment.PhantomIdField]);

            IDictionary<String, Object> response = PrepareData(assignment);
            gantt.saveAssignment(assignment);
            return response;
        }

        public override IDictionary<String, Object> Remove(Assignment assignment)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.removeAssignment(assignment);
            return response;
        }
    }
}
