 using Bryntum.CRUD.Entities;
using Bryntum.CRUD.Response;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt
{
    public partial class Calendar : Node<Calendar>
    {
        public Calendar()
        {
            ChildrenRaw = new HashSet<Calendar>();

            Resources = new HashSet<Resource>();

            Tasks = new HashSet<Task>();

            //CalendarIntervals = new HashSet<CalendarInterval>();
        }


        public override int Id { get; set; }

        public override int? ParentIdRaw { get; set; }

        public string Name { get; set; }

        public int? DaysPerMonth { get; set; }

        public int? DaysPerWeek { get; set; }

        public int? HoursPerDay { get; set; }
        
        [JsonIgnore]
        public Calendar Parent { get; set; }

        public ICollection<CalendarInterval> Intervals { get; set; }

        public override bool leaf { get { return ChildrenRaw.Count == 0; } }

        [JsonProperty("children")]
        public virtual ICollection<Calendar> Children
        {
            get { if (!leaf) return ChildrenRaw; return null; }
            set { ChildrenRaw = value; }
        }

        [JsonIgnore]
        public ICollection<Calendar> ChildrenRaw { get; set; }

        [JsonIgnore]
        public ICollection<Task> Tasks { get; set; }

        [JsonIgnore]
        public ICollection<Resource> Resources { get; set; }
    }
}
