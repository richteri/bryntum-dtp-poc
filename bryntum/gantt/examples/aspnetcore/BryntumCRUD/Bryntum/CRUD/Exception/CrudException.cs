using System;

namespace Bryntum.CRUD.Exception
{
    /// <summary>
    /// Class implementing an exception to signal about
    /// an error has been faced unexpectedly while processing sync or load request.
    /// The code of error (contained by `code` property) might give an idea on the error reason.
    /// <see cref="Codes"/>
    /// </summary>
    public class CrudException : System.Exception {

        /// <summary>
        /// The error code.
        /// <see cref="Codes"/>
        /// </summary>
        public int code { get; set; }
        
        /// <summary>
        /// Constructs exception instance.
        /// </summary>
        /// <param name="message">Human readable exception text.</param>
        /// <param name="code">Exception code <see cref="Codes"/></param>
        public CrudException(String message, int code) : base(message) {
            this.code = code;
        }
    }
}
