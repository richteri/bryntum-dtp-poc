using Bryntum.CRUD.Request;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt.Request
{
    /// <summary>
    /// This class implements load request structure.
    /// </summary>
    public class GanttLoadRequest : LoadRequest
    {

        /// <summary>
        /// Calendars store request parameters.
        /// Contains null if calendars store is not requested.
        /// </summary>
        public IDictionary<String, Object> calendars;

        /// <summary>
        /// Resources store request parameters.
        /// Contains null if resources store is not requested.
        /// </summary>
        public IDictionary<String, Object> resources;

        /// <summary>
        /// Tasks store request parameters.
        /// Contains null if tasks store is not requested.
        /// </summary>
        public IDictionary<String, Object> tasks;

        /// <summary>
        /// Assignments store request parameters.
        /// Contains null if assignments store is not requested.
        /// </summary>
        public IDictionary<String, Object> assignments;

        /// <summary>
        /// Dependencies store request parameters.
        /// Contains null if dependencies store is not requested.
        /// </summary>
        public IDictionary<String, Object> dependencies;

        public override IList<Object> stores {
            set
            {
                base.stores = value;

                // map known Gantt related stores properties to public fields
                calendars = getStoreParams("calendars");
                resources = getStoreParams("resources");
                tasks = getStoreParams("tasks");
                assignments = getStoreParams("assignments");
                dependencies = getStoreParams("dependencies");
            }
        }
    }
}
