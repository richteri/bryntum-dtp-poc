using Bryntum.CRUD.Entities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bryntum.Gantt
{
    public class CalendarInterval : General
    {
        public override int Id { get; set; }

        [JsonIgnore]
        public int CalendarIdRaw { get; set; }

        public string RecurrentStartDate { get; set; }

        public string RecurrentEndDate { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [JsonIgnore]
        public byte? IsWorkingRaw { get; set; }

        public bool IsWorking
        {
            get { return IsWorkingRaw == 1; }
            set { IsWorkingRaw = Convert.ToByte(value); }
        }

        public string Cls { get; set; }

        [JsonIgnore]
        public virtual Calendar Calendar { get; set; }
    }
}
