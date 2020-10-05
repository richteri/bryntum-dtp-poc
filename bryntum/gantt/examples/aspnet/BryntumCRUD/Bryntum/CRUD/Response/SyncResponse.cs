using System;

namespace Bryntum.CRUD.Response
{
    /// <summary>
    /// Class implementing a general response structure.
    /// </summary>
    public class SyncResponse : GeneralResponse {

        public SyncResponse() : base() {
        }

        public SyncResponse(ulong? requestId) : base(requestId) {
        }

        /// <summary>
        /// Revision stamp set for the response.
        /// </summary>
        public int revision { set; get; }

        /// <summary>
        /// `True` for this type of response.
        /// </summary>
        public override Boolean success { get { return true; } }

    }
}
