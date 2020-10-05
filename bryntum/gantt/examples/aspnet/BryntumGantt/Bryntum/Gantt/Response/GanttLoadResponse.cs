using Bryntum.CRUD.Response;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Bryntum.Gantt.Response
{
    /// This class implements response for the load request.
    public class GanttLoadResponse : LoadResponse {
        [JsonProperty("project")]
        public ProjectMetaData Project { get; set; }

        [JsonProperty("calendars", NullValueHandling=NullValueHandling.Ignore)]
        public LoadStoreResponse<Calendar> calendars { set; get; }
        
        [JsonProperty("resources", NullValueHandling = NullValueHandling.Ignore)]
        public LoadStoreResponse<Resource> resources { set; get; }
        
        [JsonProperty("tasks", NullValueHandling = NullValueHandling.Ignore)]
        public LoadStoreResponse<Task> tasks { set; get; }
        
        [JsonProperty("assignments", NullValueHandling = NullValueHandling.Ignore)]
        public LoadStoreResponse<Assignment> assignments { set; get; }
        
        [JsonProperty("dependencies", NullValueHandling = NullValueHandling.Ignore)]
        public LoadStoreResponse<Dependency> dependencies { set; get; }

        public GanttLoadResponse() : base() {
        }

        public GanttLoadResponse(ulong? requestId) : base(requestId) {
        }

        /// <summary>
        /// Sets list of calendars to be responded.
        /// </summary>
        /// <param name="calendars">List of calendars.</param>
        /// <param name="projectCalendar">Project calendar identifier.</param>
        public void setCalendars(IEnumerable<Calendar> rows)
        {
            calendars = new LoadStoreResponse<Calendar>(rows, false);
        }

        /// <summary>
        /// Sets list of resources to be responded.
        /// </summary>
        /// <param name="resources">List of resources.</param>
        public void setResources(IEnumerable<Resource> rows)
        {
            resources = new LoadStoreResponse<Resource>(rows);
        }

        /// <summary>
        /// Sets list of tasks to be responded.
        /// </summary>
        /// <param name="tasks">List of tasks.</param>
        public void setTasks(IEnumerable<Task> rows)
        {
            tasks = new LoadStoreResponse<Task>(rows, false);
        }

        /// <summary>
        /// Sets list of assignments to be responded.
        /// </summary>
        /// <param name="assignments">List of assignments.</param>
        public void setAssignments(IEnumerable<Assignment> rows)
        {
            assignments = new LoadStoreResponse<Assignment>(rows);
        }

        /// <summary>
        /// Sets list of dependencies to be responded.
        /// </summary>
        /// <param name="dependencies">List of dependencies.</param>
        public void setDependencies(IEnumerable<Dependency> rows)
        {
            dependencies = new LoadStoreResponse<Dependency>(rows);
        }
    }
}
