using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace Bryntum.Gantt
{
    [MetadataType(typeof(TaskSegmentMetadata))]
    public partial class TaskSegment : General
    {
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
    }

    public class TaskSegmentMetadata
    {
        [JsonIgnore]
        public int TaskIdRaw { get; set; }
        [JsonIgnore]
        public virtual Task Task { get; set; }
    }
}
