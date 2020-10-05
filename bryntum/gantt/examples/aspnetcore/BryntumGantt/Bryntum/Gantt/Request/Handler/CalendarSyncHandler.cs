using Bryntum.CRUD.Request;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt.Request.Handler
{
    public class CalendarSyncHandler : SyncStoreRequestHandler<CalendarSyncRequest> {

        private Gantt gantt;

        public CalendarSyncHandler(Gantt gantt, string dateFormat) : base(dateFormat) {
            this.gantt = gantt;
        }

        public override CalendarSyncRequest GetEntity(IDictionary<String, Object> changes) {
            int id = 0;

            int v;
            if (int.TryParse((string)changes["Id"], out v))
            {
                id = v;
            }
            else
            {
                return null;
            }

            Calendar calendar = gantt.GetCalendar(id);
            if (calendar == null) return null;

            CalendarSyncRequest record = new CalendarSyncRequest(calendar);

            if (changes.ContainsKey("DaysPerMonth")) {
                record.DaysPerMonth = Convert.ToInt32(changes["DaysPerMonth"]);
            }
            if (changes.ContainsKey("DaysPerWeek")) {
                record.DaysPerWeek = Convert.ToInt32(changes["DaysPerWeek"]);
            }
            if (changes.ContainsKey("HoursPerDay")) {
                record.HoursPerDay = Convert.ToInt32(changes["HoursPerDay"]);
            }
            if (changes.ContainsKey("Name")) {
                record.Name = Convert.ToString(changes["Name"]);
            }
            if (changes.ContainsKey("parentId"))
            {
                record.ParentId = Convert.ToString(changes["parentId"]);
            }
            if (changes.ContainsKey("$PhantomParentId"))
            {
                record.PhantomParentId = Convert.ToString(changes["$PhantomParentId"]);
            }
            if (changes.ContainsKey(record.PhantomIdField)) {
                record.PhantomId = Convert.ToString(changes[record.PhantomIdField]);
            }

            return record;
        }

        protected IDictionary<String, Object> PrepareData(CalendarSyncRequest calendar) {
            // initialize record related response part
            IDictionary<String, Object> response = new Dictionary<String, Object>();

            if (calendar.Id == 0 && calendar.calendar == null)
            {
                calendar.calendar = new Calendar();
            }
            
            // push data from the CalendarSyncRequest instance to the bound Calendar instance
            calendar.ApplyToCalendar();
            
            Calendar cal = calendar.calendar;

            String phantomParentId = cal.PhantomParentId;
            if (cal.ParentId == null && !String.IsNullOrEmpty(phantomParentId)
                && !phantomParentId.Equals("root", StringComparison.InvariantCultureIgnoreCase))
            {
                int? calendarId = gantt.GetCalendarIdByPhantom(phantomParentId);
                cal.ParentIdRaw = calendarId;
                response.Add("parentId", calendarId);
            }

            return response;
        }

        public override IDictionary<String, Object> Add(CalendarSyncRequest calendar)
        {
            IDictionary<String, Object> response = PrepareData(calendar);
            gantt.SaveCalendar(calendar.calendar);

            calendar.LoadFromCalendar();

            return response;
        }

        public override IDictionary<String, Object> Update(CalendarSyncRequest calendar, IDictionary<String, Object> changes)
        {
            IDictionary<String, Object> response = PrepareData(calendar);
            gantt.SaveCalendar(calendar.calendar);

            return response;
        }

        public override IDictionary<String, Object> Remove(CalendarSyncRequest calendar)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.RemoveCalendar(calendar);
            return response;
        }
    }
}
