using Bryntum.CRUD.Entities;
using Bryntum.CRUD.Exception;
using Bryntum.CRUD.Response;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Bryntum.CRUD.Request
{
    /// <summary>
    /// An object used by controller to apply changes specified in sync request to a store.
    /// Classes extending this abstraction should perform actual work using DAO to get, add, update and removed
    /// real specific records.
    /// </summary>
    /// <param name="T">Entity class representing specific store.</para>
    public abstract class SyncStoreRequestHandler<T>  where T: General {

        /// <summary>
        /// An option used to specify which records have to be processed during <see cref="Handle()"/> method call.
        /// </summary>
        public enum Rows
        {
            /// <summary>Perform records adding.</summary>
            Added,
            /// <summary>Perform records updating.</summary>
            Updated,
            /// <summary>Perform records adding and updating.</summary>
            AddedAndUpdated,
            /// <summary>Perform records removing.</summary>
            Removed,
            /// <summary>Perform all requested changes.</summary>
            All
        };

        string dateFormat;

        /// <summary>
        /// Constructs a new SyncStoreRequest, given a dateFormat to parse text to a date.
        /// </summary>
        /// <param name="dateFormat">Date format is required to use `strToDate` method.</para>
        public SyncStoreRequestHandler(string dateFormat) {
            this.dateFormat = dateFormat;
        }

        /// <summary>
        /// Constructs a new SyncStoreRequest.
        /// </summary>
        public SyncStoreRequestHandler()
        {
        }

        /// <summary>
        /// Parses text from a string to produce a `Date`.
        /// This method can be used in actual `getRecord` implementation to
        /// convert corresponding fields from `changes` Map into a proper dates.
        /// </summary>
        /// <param name="date">A `String` to be parsed.</param>
        /// <returns>A `Date` parsed from a the string.</returns>
        protected DateTime StrToDate(String date) {
            return DateTime.ParseExact(date, dateFormat, null);
        }

        /// <summary>
        /// Gets entity by provided data.
        /// </summary>
        /// <param name="data">Record data.</param>
        /// <returns>Instance of record.</returns>
        public abstract T GetEntity(IDictionary<String, Object> data);

        /// <summary>
        /// Adds record. This method must call DAO to persist a record.
        /// </summary>
        /// <param name="record">Record to add.</param>
        /// <returns>Record data to respond.</returns>
        public abstract IDictionary<String, Object> Add(T record);

        /// <summary>
        /// Updates record. This method must call DAO to persist a record changes.
        /// </summary>
        /// <param name="record">Record to update.</param>
        /// <returns>Record data to respond. By default it's a record identifier.</returns>
        public abstract IDictionary<String, Object> Update(T record, IDictionary<String, Object> changes);

        /// <summary>
        /// Removes record. This method must call DAO to remove a record.
        /// </summary>
        /// <param name="record">Record to remove.</param>
        /// <returns>Record data to respond.</returns>
        public abstract IDictionary<String, Object> Remove(T record);

        /// <summary>
        /// Performs post processing of the data returned by `add` method.
        /// Adds the processed record phantom and real identifiers.
        /// </summary>
        /// <param name="record">The added record.</param>
        /// <param name="recordResponse">The response part related to the record.</param>
        /// <returns>Processed response.</returns>
        protected virtual IDictionary<String, Object> OnRecordAdded(T record, IDictionary<String, Object> recordResponse) {
            recordResponse.Add(record.PhantomIdField, record.PhantomId);
            recordResponse.Add("Id", record.Id);

            return recordResponse;
        }

        /// <summary>
        /// Performs post processing of the data returned by `update` method.
        /// Adds the processed record real identifier.
        /// </summary>
        /// <param name="record">The updated record.</param>
        /// <param name="recordResponse">The response part related to the record.</param>
        /// <returns>Processed response.</returns>
        protected virtual IDictionary<String, Object> OnRecordUpdated(T record, IDictionary<String, Object> recordResponse) {
            recordResponse.Add("Id", record.Id);

            return recordResponse;
        }

        /// <summary>
        /// Performs post processing of the data returned by `remove` method.
        /// Adds the processed record real identifier.
        /// </summary>
        /// <param name="record">The removed record.</param>
        /// <param name="recordResponse">The response part related to the record.</param>
        /// <returns>Processed response.</returns>
        protected virtual IDictionary<String, Object> OnRecordRemoved(T record, IDictionary<String, Object> recordResponse) {
            recordResponse.Add("Id", record.Id);

            return recordResponse;
        }

        protected virtual SyncStoreResponse OnAddedHandled(SyncStoreResponse response)
        {
            return response;
        }

        protected virtual SyncStoreResponse OnUpdatedHandled(SyncStoreResponse response)
        {
            return response;
        }

        protected virtual SyncStoreResponse OnRemovedHandled(SyncStoreResponse response)
        {
            return response;
        }

        protected virtual SyncStoreResponse OnHandled(SyncStoreResponse response)
        {
            return response;
        }

        /// <summary>
        /// Performs adding of requested records.
        /// </summary>
        /// <param name="request">Request holding store changes.</param>
        /// <param name="response">Response to put adding results into.</param>
        /// <returns>Response object.</returns>
        public SyncStoreResponse HandleAdded(SyncStoreRequest<T> request, SyncStoreResponse response)
        {
            IList<IDictionary<String, Object>> added = new List<IDictionary<String, Object>>();

            SyncStoreResponse resp = response ?? new SyncStoreResponse();

            if (request.added != null)
            {
                foreach (T row in request.added)
                {
                    added.Add(OnRecordAdded(row, Add(row)));
                }
            }

            if (added.Count > 0)
            {
                if (resp.rows != null)
                {
                    resp.rows = resp.rows.Concat(added).ToList();
                }
                else
                {
                    resp.rows = added;
                }
            }

            return OnAddedHandled(resp);
        }

        /// <summary>
        /// Performs updating of requested records.
        /// </summary>
        /// <param name="request">Request holding store changes.</param>
        /// <param name="response">Response to put updating results into.</param>
        /// <returns>Response object.</returns>
        public SyncStoreResponse HandleUpdated(SyncStoreRequest<T> request, SyncStoreResponse response)
        {
            IList<IDictionary<String, Object>> updated = new List<IDictionary<String, Object>>();

            SyncStoreResponse resp = response ?? new SyncStoreResponse();

            if (request.updated != null)
            {
                foreach (IDictionary<String, Object> changes in request.updated)
                {
                    T record = GetEntity(changes);
                    updated.Add(OnRecordUpdated(record, Update(record, changes)));
                }
            }

            if (updated.Count > 0)
            {
                if (resp.rows != null)
                {
                    resp.rows = resp.rows.Concat(updated).ToList();
                }
                else
                {
                    resp.rows = updated;
                }
            }

            return OnUpdatedHandled(resp);
        }

        /// <summary>
        /// Performs removing of requested records.
        /// </summary>
        /// <param name="request">Request holding store changes.</param>
        /// <param name="response">Response to put updating results into.</param>
        /// <returns>Response object.</returns>
        public SyncStoreResponse HandleRemoved(SyncStoreRequest<T> request, SyncStoreResponse response)
        {
            IList<IDictionary<String, Object>> removed = new List<IDictionary<String, Object>>();

            SyncStoreResponse resp = response ?? new SyncStoreResponse();

            if (request.removed != null)
            {
                foreach (T row in request.removed)
                {
                    removed.Add(OnRecordRemoved(row, Remove(row)));
                }
            }

            if (removed.Count > 0)
            {
                if (resp.removed != null)
                {
                    resp.removed = resp.removed.Concat(removed).ToList();
                }
                else
                {
                    resp.removed = removed;
                }
            }

            return OnRemovedHandled(resp);
        }

        /// <summary>
        /// Applies changes passed in a sync request to the store.
        /// </summary>
        /// <param name="request">A sync request.</param>
        /// <returns>Response object for the applied changes.</returns>
        public SyncStoreResponse Handle(SyncStoreRequest<T> request, Rows mode = Rows.All) {
            SyncStoreResponse res = new SyncStoreResponse();

            if (mode == Rows.All || mode == Rows.Added || mode == Rows.AddedAndUpdated) HandleAdded(request, res);
            if (mode == Rows.All || mode == Rows.Updated || mode == Rows.AddedAndUpdated) HandleUpdated(request, res);
            if (mode == Rows.All || mode == Rows.Removed) HandleRemoved(request, res);

            if (mode == Rows.All)
            {
                bool hasRows = res.rows != null && res.rows.Count > 0;
                bool hasRemoved = res.removed != null && res.removed.Count > 0;

                if (!hasRows && !hasRemoved) throw new CrudException("No data to save.", Codes.NO_SYNC_DATA);
            }

            return OnHandled(res);
        }
    }
}
