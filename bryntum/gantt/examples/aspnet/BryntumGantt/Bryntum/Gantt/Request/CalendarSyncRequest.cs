using Bryntum.CRUD.Request;
using Newtonsoft.Json;

namespace Bryntum.Gantt
{
    /// This class is a wrapper over Calendar domain class used for proper calendar data deserialization
    /// during sync request processing.
    /// To be specific it adds embedded calendar days changes support.
    public partial class CalendarSyncRequest : Calendar {
        
        [JsonIgnore]
        public Calendar calendar;

        public CalendarSyncRequest()
        {
        }

        public CalendarSyncRequest(Calendar calendar)
        {
            this.calendar = calendar;
            Copy(calendar, this);
        }

        public void LoadFromCalendar()
        {
            Copy(calendar, this);
        }

        public void ApplyToCalendar()
        {
            Copy(this, calendar);
        }

        public void Copy(Calendar from, Calendar to)
        {
            to.Id = from.Id;
            to.Name = from.Name;
            to.parentId = from.parentId;
            to.PhantomId = from.PhantomId;
            to.PhantomParentId = from.PhantomParentId;
            to.DaysPerMonth = from.DaysPerMonth;
            to.DaysPerWeek = from.DaysPerWeek;
            to.HoursPerDay = from.HoursPerDay;
            //to.Children = from.Children;
            //to.Parent = from.Parent;
        }

        /// Sub-request containing changes of calendar intervals.
        [JsonProperty("Intervals")]
        public SyncStoreRequest<CalendarInterval> daysRequest;

    }
}
