using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;

namespace Bryntum.Gantt
{
    public partial class TaskSegment : General
    {
        public override int Id { get; set; }

        [JsonIgnore]
        public int TaskIdRaw { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public decimal? Duration { get; set; }

        public string DurationUnit { get; set; }

        public string Cls { get; set; }

        [JsonIgnore]
        public string PhantomTaskId { get; set; }

        [JsonIgnore]
        public override String PhantomIdField { get { return "PhantomId"; } }

        [JsonProperty("PhantomId")]
        public override string PhantomId { get; set; }

        public string TaskId
        {
            set
            {
                PhantomTaskId = value;
                if (value == null) return;

                int v;
                if (int.TryParse(value, out v))
                {
                    TaskIdRaw = v;
                    PhantomTaskId = value;
                }
                else
                {
                    TaskIdRaw = 0;
                }
            }

            get
            {
                return TaskIdRaw > 0 ? Convert.ToString(TaskIdRaw) : PhantomTaskId;
            }
        }
                
        [JsonIgnore]
        public virtual Task Task { get; set; }
    }
}
