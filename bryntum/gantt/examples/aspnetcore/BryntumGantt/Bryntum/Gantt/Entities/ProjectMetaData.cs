using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bryntum.Gantt
{
    public class ProjectMetaData
    {
        [JsonProperty("calendar")]
        public int Calendar;
    }
}
