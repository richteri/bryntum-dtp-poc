using Bryntum.CRUD.Request;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt.Request.Handler
{
    public class CalendarDaySyncHandler : SyncStoreRequestHandler<CalendarInterval> {

        private Gantt gantt;
        private int calendarId;

        public CalendarDaySyncHandler(Gantt gantt, string dateFormat) : base(dateFormat) {
            this.gantt = gantt;
        }

        public override CalendarInterval GetEntity(IDictionary<String, Object> changes) {
            return gantt.getCalendarInterval(Convert.ToInt32(changes["Id"]));
        }

        public void setCalendarId(int calendarId) {
            this.calendarId = calendarId;
        }

        public override IDictionary<String, Object> Add(CalendarInterval calendarDay)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            calendarDay.CalendarIdRaw = calendarId;
            gantt.saveCalendarInterval(calendarDay);
            return response;
        }

        public override IDictionary<String, Object> Update(CalendarInterval calendarDay, IDictionary<String, Object> changes)
        {
            if (changes.ContainsKey("Cls")) calendarDay.Cls = Convert.ToString(changes["Cls"]);
            if (changes.ContainsKey("StartDate")) calendarDay.StartDate = Convert.ToDateTime(changes["StartDate"]);
            if (changes.ContainsKey("EndDate")) calendarDay.EndDate = Convert.ToDateTime(changes["EndDate"]);
            if (changes.ContainsKey("RecurrentStartDate")) calendarDay.RecurrentStartDate = Convert.ToString(changes["RecurrentStartDate"]);
            if (changes.ContainsKey("RecurrentEndDate")) calendarDay.RecurrentEndDate = Convert.ToString(changes["RecurrentEndDate"]);
            if (changes.ContainsKey("IsWorking"))
                calendarDay.IsWorkingRaw = (byte) ((bool) changes["IsWorking"] ? 1 : 0);
            if (changes.ContainsKey(calendarDay.PhantomIdField))
                calendarDay.PhantomId = Convert.ToString(changes[calendarDay.PhantomIdField]);

            IDictionary<String, Object> response = new Dictionary<String, Object>();
            calendarDay.CalendarIdRaw = calendarId;
            gantt.saveCalendarInterval(calendarDay);
            return response;
        }

        public override IDictionary<String, Object> Remove(CalendarInterval calendarDay)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.removeCalendarInterval(calendarDay);
            return response;
        }

    }
}
