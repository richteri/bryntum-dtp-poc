using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;

namespace Bryntum.Gantt
{
    public partial class Dependency : General
    {
        public override int Id { get; set; }
        [JsonIgnore]
        public int FromIdRaw { get; set; }
        [JsonIgnore]
        public int ToIdRaw { get; set; }
        public int? Type { get; set; }
        public string Cls { get; set; }
        public decimal? Lag { get; set; }
        public string LagUnit { get; set; }

        [JsonIgnore]
        public string PhantomFromId { get; set; }

        [JsonProperty("From")]
        public string FromId
        {
            set
            {
                PhantomFromId = value;
                if (value == null) return;

                int v;
                if (int.TryParse(value, out v))
                {
                    FromIdRaw = v;
                    PhantomFromId = value;
                }
                else
                {
                    FromIdRaw = 0;
                }
            }

            get
            {
                return FromIdRaw > 0 ? Convert.ToString(FromIdRaw) : PhantomFromId;
            }
        }

        [JsonIgnore]
        public string PhantomToId { get; set; }

        [JsonProperty("To")]
        public string ToId
        {
            set
            {
                PhantomToId = value;
                if (value == null) return;

                int v;
                if (int.TryParse(value, out v))
                {
                    ToIdRaw = v;
                    PhantomToId = value;
                }
                else
                {
                    ToIdRaw = 0;
                }
            }

            get
            {
                return ToIdRaw > 0 ? Convert.ToString(ToIdRaw) : PhantomToId;
            }
        }
        [JsonIgnore]
        public virtual Task FromTask { get; set; }
        [JsonIgnore]
        public virtual Task ToTask { get; set; }
    }
}
