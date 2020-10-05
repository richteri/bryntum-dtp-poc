using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;

namespace Bryntum.Gantt
{
    [MetadataType(typeof(AssignmentMetadata))]
    public partial class Assignment : General
    {
        [JsonIgnore]
        public string PhantomTaskId { get; set; }

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
        public string PhantomResourceId { get; set; }

        public string ResourceId
        {
            set
            {
                PhantomResourceId = value;
                if (value == null) return;

                int v;
                if (int.TryParse(value, out v))
                {
                    ResourceIdRaw = v;
                    PhantomResourceId = value;
                }
                else
                {
                    ResourceIdRaw = 0;
                }
            }

            get
            {
                return ResourceIdRaw > 0 ? Convert.ToString(ResourceIdRaw) : PhantomResourceId;
            }
        }
    }

    public class AssignmentMetadata {
        [JsonIgnore]
        public int TaskIdRaw { get; set; }
        [JsonIgnore]
        public int ResourceIdRaw { get; set; }
        [JsonIgnore]
        public virtual Resource Resource { get; set; }
        [JsonIgnore]
        public virtual Task Task { get; set; }
    }
}