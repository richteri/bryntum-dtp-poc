using Bryntum.CRUD.Entities;
using Bryntum.CRUD.Response;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Bryntum.Gantt
{
    [MetadataType(typeof(CalendarMetadata))]
    public partial class Calendar : Node<Calendar>
    {

        /// <summary>
        /// This property is used during serialization. It has calendar intervals collection.
        /// </summary>
        public ICollection<CalendarInterval> Intervals
        {
            get { return new List<CalendarInterval>(CalendarIntervals); }
        }

        public override bool leaf { get { return ChildrenRaw.Count == 0; } }

        public virtual ICollection<Calendar> children
        {
            get { if (!leaf) return ChildrenRaw; return null; }
            set { ChildrenRaw = value; }
        }
    }

    public class CalendarMetadata : NodeMetadata<Calendar>
    {
        [JsonIgnore]
        public virtual ICollection<Calendar> ChildrenRaw { get; set; }
        [JsonIgnore]
        public virtual ICollection<CalendarInterval> CalendarIntervals { get; set; }
        [JsonIgnore]
        public virtual ICollection<Task> Tasks { get; set; }
        [JsonIgnore]
        public virtual ICollection<Resource> Resources { get; set; }
    }
}
