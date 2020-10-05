using System;
using System.Collections.Generic;

namespace Bryntum.CRUD.Response
{
    /// <summary>
    /// Class implementing a general response structure for a individual store sync.
    /// </summary>
    public class SyncStoreResponse {
        /// <summary>
        /// Added/updated records relevant response. May contain server side generated fields (like record Id-s).
        /// </summary>
        public IList<IDictionary<String, Object>> rows { get; set; }
        
        /// <summary>
        /// Removed records relevant response. For each removed record this list has to have an item having the record identifier: [{ Id : 12 }, { Id : 22 }].
        /// </summary>
        public IList<IDictionary<String, Object>> removed { get; set; }

        public SyncStoreResponse() {
        }

        public SyncStoreResponse(IList<IDictionary<String, Object>> rows, IList<IDictionary<String, Object>> removed) {
            this.rows = rows;
            this.removed = removed;
        }
    }
}
