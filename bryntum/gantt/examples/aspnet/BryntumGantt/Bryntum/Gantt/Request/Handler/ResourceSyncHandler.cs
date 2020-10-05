using Bryntum.CRUD.Request;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt.Request.Handler
{
    public class ResourceSyncHandler : SyncStoreRequestHandler<Resource> {

        private Gantt gantt;

        public ResourceSyncHandler(Gantt gantt) {
            this.gantt = gantt;
        }

        public override Resource GetEntity(IDictionary<String, Object> changes) {
            return gantt.getResource(Convert.ToInt32(changes["Id"]));
        }

        protected IDictionary<String, Object> PrepareData(Resource resource) {
            IDictionary<String, Object> result = new Dictionary<String, Object>();

            String phantomCalendarId = resource.PhantomCalendarId;
            if (!resource.CalendarIdRaw.HasValue && !String.IsNullOrEmpty(phantomCalendarId)) {
                int? calendarId = gantt.getCalendarIdByPhantom(phantomCalendarId);
                if (calendarId.HasValue) {
                    resource.CalendarIdRaw = calendarId;
                    result.Add("CalendarId", calendarId);
                }
            }

            return result;
        }

        public override IDictionary<String, Object> Add(Resource resource)
        {
            IDictionary<String, Object> response = PrepareData(resource);
            gantt.saveResource(resource);
            return response;
        }

        public override IDictionary<String, Object> Update(Resource resource, IDictionary<String, Object> changes)
        {
            // apply changes to the entity
            if (changes.ContainsKey("Name")) resource.Name = Convert.ToString(changes["Name"]);
            if (changes.ContainsKey("CalendarId")) resource.CalendarId = Convert.ToString(changes["CalendarId"]);
            if (changes.ContainsKey(resource.PhantomIdField))
                resource.PhantomId = Convert.ToString(changes[resource.PhantomIdField]);
            
            IDictionary<String, Object> response = PrepareData(resource);
            gantt.saveResource(resource);
            return response;
        }

        public override IDictionary<String, Object> Remove(Resource resource)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.removeResource(resource);
            return response;
        }
    }
}
