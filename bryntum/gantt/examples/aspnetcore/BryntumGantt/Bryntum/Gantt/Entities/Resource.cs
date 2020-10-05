using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt
{
    public partial class Resource : General
    {
        public Resource()
        {
            Assignments = new HashSet<Assignment>();
        }
                
        public override int Id { get; set; }
        
        public string Name { get; set; }
        
        [JsonIgnore]
        public int? CalendarIdRaw { get; set; }

        [JsonIgnore]
        public string PhantomCalendarId { set; get; }

        // Since CalendarId transfered from the client may contain a phantom calendar identifier
        // we cannot use just a EDM generated CalendarIdRaw property
        public string CalendarId {
            set
            {
                PhantomCalendarId = value;
                if (value == null) return;

                int v;
                if (int.TryParse(value, out v))
                {
                    CalendarIdRaw = v;
                }
                else
                {
                    CalendarIdRaw = null;
                }
            }

            get 
            {
                return Convert.ToString(CalendarIdRaw) ?? PhantomCalendarId;
            }
        }

        [JsonIgnore]
        public virtual ICollection<Assignment> Assignments { get; set; }
        
        [JsonIgnore]
        public virtual Calendar Calendar { get; set; }
    }
}
