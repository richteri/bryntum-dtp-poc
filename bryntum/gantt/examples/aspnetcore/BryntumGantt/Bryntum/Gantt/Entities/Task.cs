using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt
{
    public class Baseline {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? PercentDone { get; set; }
    }

    public partial class Task : Node<Task>
    {
        public Task()
        {
            Draggable = true;
            Resizable = true;
            Assignments = new HashSet<Assignment>();
            Predecessors = new HashSet<Dependency>();
            Successors = new HashSet<Dependency>();
            ChildrenRaw = new HashSet<Task>();
        }

        public override int Id { get; set; }
        [JsonIgnore]
        public override int? ParentIdRaw { get; set; }
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? Duration { get; set; }
        public string DurationUnit { get; set; }
        public decimal? PercentDone { get; set; }
        public string SchedulingMode { get; set; }
        public DateTime? BaselineStartDate { get; set; }
        public DateTime? BaselineEndDate { get; set; }
        public decimal? BaselinePercentDone { get; set; }
        public string Cls { get; set; }

        [JsonIgnore]
        public int? CalendarIdRaw { get; set; }
        public bool expanded { get; set; }
        public decimal? Effort { get; set; }
        public string EffortUnit { get; set; }
        public string Note { get; set; }
        public string ConstraintType { get; set; }
        public DateTime? ConstraintDate { get; set; }
        public bool ManuallyScheduled { get; set; }
        public bool Draggable { get; set; }
        public bool Resizable { get; set; }
        public bool Rollup { get; set; }
        public bool ShowInTimeline { get; set; }
        public string Color { get; set; }
        public DateTime? DeadlineDate { get; set; }

        public ICollection<Baseline> Baselines
        {
            get
            {
                if (BaselineStartDate.HasValue && BaselineEndDate.HasValue)
                {
                    var value = new Baseline()
                    {
                        StartDate = BaselineStartDate,
                        EndDate = BaselineEndDate,
                        PercentDone = BaselinePercentDone
                    };

                    return new List<Baseline>()
                    {
                        value
                    };
                }
                else
                {
                    return null;
                }
            }
        }

        [JsonIgnore]
        public string PhantomCalendarId { get; set; }

        public string CalendarId
        {
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
                return CalendarIdRaw > 0 ? Convert.ToString(CalendarIdRaw) : PhantomCalendarId;
            }
        }

        public override bool leaf { get { return ChildrenRaw.Count == 0; } }

        [JsonProperty("children")]
        public ICollection<Task> Children
        {
            get { if (!leaf) return ChildrenRaw; return null; }
            set { ChildrenRaw = value; }
        }

        [JsonIgnore]
        public virtual ICollection<Assignment> Assignments { get; set; }

        [JsonIgnore]
        public virtual ICollection<Dependency> Predecessors { get; set; }

        [JsonIgnore]
        public virtual ICollection<Dependency> Successors { get; set; }

        [JsonIgnore]
        public ICollection<Task> ChildrenRaw { get; set; }

        [JsonIgnore]
        public virtual Task Parent { get; set; }

        [JsonIgnore]
        public virtual Calendar Calendar { get; set; }
    }
}
