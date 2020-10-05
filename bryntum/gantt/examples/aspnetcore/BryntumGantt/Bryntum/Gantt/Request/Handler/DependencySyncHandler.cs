using Bryntum.CRUD.Request;
using Bryntum.CRUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bryntum.Gantt.Request.Handler
{
    public class DependencySyncHandler : SyncStoreRequestHandler<Dependency> {

        private Gantt gantt;

        public DependencySyncHandler(Gantt gantt) {
            this.gantt = gantt;
        }

        public override Dependency GetEntity(IDictionary<String, Object> changes) {
            return gantt.GetDependency(Convert.ToInt32(changes["Id"]));
        }

        protected IDictionary<String, Object> PrepareData(Dependency dependency) {
            // initialize response part related to the record
            IDictionary<String, Object> response = new Dictionary<String, Object>();

            String phantomFrom = dependency.PhantomFromId;
            if (!String.IsNullOrEmpty(phantomFrom))
            {
                int? from = gantt.GetTaskIdByPhantom(phantomFrom);
                if (from.HasValue)
                {
                    dependency.FromIdRaw = from.Value;
                    // put updated From to response
                    response.Add("From", from);
                }
            }

            String phantomTo = dependency.PhantomToId;
            if (!String.IsNullOrEmpty(phantomTo))
            {
                int? to = gantt.GetTaskIdByPhantom(phantomTo);
                if (to.HasValue)
                {
                    dependency.ToIdRaw = to.Value;
                    // put updated To to response
                    response.Add("To", to);
                }
            }

            return response;
        }

        public override IDictionary<String, Object> Add(Dependency dependency)
        {
            IDictionary<String, Object> response = PrepareData(dependency);
            gantt.SaveDependency(dependency);
            return response;
        }

        public override IDictionary<String, Object> Update(Dependency dependency, IDictionary<String, Object> changes)
        {
            // apply changes to tthe entity
            if (changes.ContainsKey("Cls")) dependency.Cls = Convert.ToString(changes["Cls"]);
            if (changes.ContainsKey("From")) dependency.FromId = Convert.ToString(changes["From"]);
            if (changes.ContainsKey("To")) dependency.ToId = Convert.ToString(changes["To"]);
            if (changes.ContainsKey("Type")) dependency.Type = Convert.ToInt32(changes["Type"]);
            if (changes.ContainsKey("Lag")) dependency.Lag = Convert.ToDecimal(changes["Lag"]);
            if (changes.ContainsKey("LagUnit")) dependency.LagUnit = Convert.ToString(changes["LagUnit"]);
            if (changes.ContainsKey(dependency.PhantomIdField))
                dependency.PhantomId = Convert.ToString(changes[dependency.PhantomIdField]);

            IDictionary<String, Object> response = PrepareData(dependency);
            gantt.SaveDependency(dependency);
            return response;
        }

        public override IDictionary<String, Object> Remove(Dependency dependency)
        {
            IDictionary<String, Object> response = new Dictionary<String, Object>();
            gantt.RemoveDependency(dependency);
            return response;
        }
    }
}
