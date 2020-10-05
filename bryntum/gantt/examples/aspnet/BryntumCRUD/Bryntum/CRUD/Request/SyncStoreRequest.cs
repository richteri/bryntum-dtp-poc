using System;
using System.Collections.Generic;

namespace Bryntum.CRUD.Request
{
    /// <summary>
    /// This class implements general sync request part containing an individual store data.
    /// </summary>
    /// <typeparam name="T">Entity class representing the store model.</typeparam>
    public class SyncStoreRequest<T>
    {
        /// <summary>
        /// List of added rows.
        /// </summary>
        public IList<T> added;
        
        /// <summary>
        /// List of rows modifications.
        /// </summary>
        public IList<IDictionary<String, Object>> updated;
        
        /// <summary>
        /// List of removed rows.
        /// </summary>
        public IList<T> removed;
    }
}
