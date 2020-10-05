using Bryntum.CRUD.Request;

namespace Bryntum.Gantt.Request
{
    public class GanttSyncRequest : SyncRequest {

        /// <summary>
        /// Calendar store changes.
        /// </summary>
        public SyncStoreRequest<CalendarSyncRequest> calendars;

        /// <summary>
        /// Resource store changes.
        /// </summary>
        public SyncStoreRequest<Resource> resources;

        /// <summary>
        /// Task store changes.
        /// </summary>
        public SyncStoreRequest<Task> tasks;

        /// <summary>
        /// Assignment store changes.
        /// </summary>
        public SyncStoreRequest<Assignment> assignments;

        /// <summary>
        /// Dependency store changes.
        /// </summary>
        public SyncStoreRequest<Dependency> dependencies;

    }
}
