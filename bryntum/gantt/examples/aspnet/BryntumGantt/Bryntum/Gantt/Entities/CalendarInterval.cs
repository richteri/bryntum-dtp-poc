using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bryntum.Gantt
{
    [MetadataType(typeof(CalendarIntervalMetadata))]
    public partial class CalendarInterval : General
    {
        public bool IsWorking
        {
            get { return IsWorkingRaw == 1; }
            set { IsWorkingRaw = Convert.ToByte(value); }
        }
    }

    public class CalendarIntervalMetadata : NodeMetadata<CalendarInterval>
    {
        [JsonIgnore]
        public int CalendarIdRaw { get; set; }

        [JsonIgnore]
        public byte? IsWorkingRaw { get; set; }

        [JsonIgnore]
        public virtual Calendar Calendar { get; set; }
    }
}
