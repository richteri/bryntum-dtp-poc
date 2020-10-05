using System;

namespace Bryntum.CRUD.Request
{
    /// <summary>
    /// This class implements base structure of the Bryntum CRUD manager request.
    /// </summary>
    public class GeneralRequest {
        /// <summary>
        /// Request type (either "load" or "sync").
        /// </summary>
        public String type { set; get; }

        /// <summary>
        /// Request identifier.
        /// </summary>
        public ulong requestId { set; get; }

    }
}
