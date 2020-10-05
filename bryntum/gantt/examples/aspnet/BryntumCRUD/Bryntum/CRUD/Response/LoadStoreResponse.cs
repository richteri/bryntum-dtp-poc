using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bryntum.CRUD.Response
{
    /// <summary>
    /// This class defines sub-structure of response object for a particular store.
    /// </summary>
    /// <typeparam name="T">The class which defines an entity representing corresponding store record.</typeparam>
    public class LoadStoreResponse<T> {
        /// <summary>
        /// List of store records.
        /// </summary>
        public IEnumerable<T> rows;

        /// <summary>
        /// Total number of records.
        /// </summary>
        [JsonProperty("total", NullValueHandling = NullValueHandling.Ignore)]
        public int? total { set; get; }

        /// <summary>
        /// Store meta data. Might be used for returning some custom store specific extra info.
        /// </summary>
        [JsonProperty("metaData", NullValueHandling = NullValueHandling.Ignore)]
        public IDictionary<String, Object> metaData { set; get; }

        public LoadStoreResponse() {
        }

        public LoadStoreResponse(IEnumerable<T> rows) : this() {
            setRows(rows);
        }

        public LoadStoreResponse(IEnumerable<T> rows, Boolean calcTotal) : this()  {
            if (!calcTotal) {
                this.rows = rows;
            } else {
                setRows(rows);
            }
        }

        public LoadStoreResponse(IEnumerable<T> rows, Boolean calcTotal, IDictionary<String, Object> metaData)
            : this(rows, calcTotal)
        {
            this.metaData = metaData;
        }

        public LoadStoreResponse(IEnumerable<T> rows, int totalRows) : this() {
            this.rows = rows;
            total = totalRows;
        }

        public LoadStoreResponse(IEnumerable<T> rows, int totalRows, IDictionary<String, Object> metaData) : this() {
            this.rows = rows;
            total = totalRows;
            this.metaData = metaData;
        }

        /// <summary>
        /// Sets records list. Also automatically sets the total number of record
        /// to the number of items in provided list.
        /// </summary>
        /// <param name="rows">Records list.</param>
        public void setRows(IEnumerable<T> rows) {
            this.rows = rows;
            total = (rows != null ? rows.Count() : 0);
        }

    }
}
