using System;

namespace Bryntum.CRUD.Response
{
    /// <summary>
    /// This abstract class implements common response structure.
    /// </summary>
    public abstract class GeneralResponse {
        /// <summary>
        /// Status of request processing.
        /// True if request was processed successfully and False otherwise.
        /// </summary>
        public abstract Boolean success { get; }

        /// <summary>
        /// Identifier of request as reaction on which this respond is sent.
        /// </summary>
        public ulong? requestId { set; get; }

        public GeneralResponse()
        {
            requestId = null;
        }

        public GeneralResponse(ulong? requestId)
        {
            this.requestId = requestId;
        }
    }
}
