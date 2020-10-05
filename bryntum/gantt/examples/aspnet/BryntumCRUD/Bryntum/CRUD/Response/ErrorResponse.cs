using Bryntum.CRUD.Exception;
using System;

namespace Bryntum.CRUD.Response
{
    /// <summary>
    /// Defines an object to be sent to the client in case of some exception has been thrown.
    /// In case of exception the controller creates instance of this class and passes it to the client.
    /// For the instances of CrudException this class also has `code` property.
    /// </summary>
    public class ErrorResponse : GeneralResponse
    {

        public override Boolean success { get { return false; } }

        /// <summary>
        /// Error message.
        /// </summary>
        public String message { get; set; }

        /// <summary>
        /// Error code of thrown CrudException. For other types of exceptions this property is `null`.
        /// </summary>
        public int? code { get; set; }

        public ErrorResponse(String message, ulong? requestId, int? code)
            : base(requestId)
        {
            Initialize(message, requestId, code);
        }

        public ErrorResponse(System.Exception e, ulong? requestId)
            : base(requestId)
        {
            int? c = null;
            if (e is CrudException) c = (e as CrudException).code;

            Initialize(e.Message, requestId, c);
        }

        protected void Initialize(String message, ulong? requestId, int? code)
        {
            this.code = code;
            this.message = message;
            this.requestId = requestId;
        }
    }
}
