using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Bryntum.CRUD.Request
{
    /// <summary>
    /// This class implements general load request structure.
    /// </summary>
    public class LoadRequest : GeneralRequest 
    {
        /// <summary>
        /// Internally keeps of all stores request parameters.
        /// </summary>
        protected IDictionary<String, IDictionary<String, Object>> storeParams;

        /// <summary>
        /// Sets all stores parameters.
        /// Note: this property is used during request deserialization.
        /// </summary>
        public virtual IList<Object> stores
        {
            set
            {
                storeParams = new Dictionary<String, IDictionary<String, Object>>();

                foreach (Object store in value)
                {
                    // if store is specified as an object with extra request parameters
                    if (store is JObject)
                    {
                        // let's keep request parameters for the store
                        storeParams.Add((string)(store as JObject)["storeId"], (store as JObject).ToObject<Dictionary<String, Object>>());
                        // if just store Id specified
                    }
                    else if (store is String)
                    {
                        String storeId = Convert.ToString(store);
                        // let's keep identifier
                        storeParams.Add(storeId, new Dictionary<String, Object>());
                    }
                }
            }
        }

        /// <summary>
        /// Gets an arbitrary store request parameters.
        /// </summary>
        /// <param name="storeId">Store identifier.</param>
        /// <returns>Request parameters.</returns>
        public IDictionary<String, Object> getStoreParams(String storeId)
        {
            return storeParams.ContainsKey(storeId) ? storeParams[storeId] : null;
        }

        /// <summary>
        /// Checks if an arbitrary store is requested.
        /// </summary>
        /// <param name="storeId">Store identifier.</param>
        /// <returns>`True` if store is requested.</returns>
        public Boolean hasStore(String storeId)
        {
            return storeParams.ContainsKey(storeId);
        }
    }
}
