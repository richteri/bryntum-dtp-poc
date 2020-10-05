using System;

namespace Bryntum.CRUD.Response
{
    /// <summary>
    /// This class implements a response to load request structure.
    /// </summary>
    public class LoadResponse : GeneralResponse
    {
        /// <summary>
        /// Revision stamp set for the response.
        /// </summary>
        public int revision { set; get; }

        /// <summary>
        /// `True` for this type of response.
        /// </summary>
        public override Boolean success { get { return true; } }

        public LoadResponse() : base() {
        }

        public LoadResponse(ulong? requestId) : base(requestId) {
        }

        public LoadResponse(ulong? requestId, int revision) : base(requestId) {
            this.revision = revision;
        }
    }
}
