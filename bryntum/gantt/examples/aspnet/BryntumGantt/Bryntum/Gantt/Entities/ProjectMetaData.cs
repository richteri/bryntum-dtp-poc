using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bryntum.Gantt
{
    public class ProjectMetaData
    {
        [JsonProperty("calendar")]
        public int Calendar { get; set; }
    }
}
