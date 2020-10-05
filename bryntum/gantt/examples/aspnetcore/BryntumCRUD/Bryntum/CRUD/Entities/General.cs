using Newtonsoft.Json;
using System;

namespace Bryntum.CRUD.Entities
{
    /// <summary>
    /// This class represents base entity implementation for the Bryntum CRUD.
    /// </summary>
    public abstract class General {
        
        /// <summary>
        /// Unique entity identifier.
        /// </summary>
        public virtual int Id { get; set; }
        
        /// <summary>
        /// Name of field used for phantom entity identifier providing.
        /// </summary>
        [JsonIgnore]
        public virtual String PhantomIdField { get { return "$PhantomId"; } }

        /// <summary>
        /// Phantom entity identifier.
        /// </summary>
        [JsonProperty("$PhantomId")]
        public virtual string PhantomId { get; set; }

        /// <summary>
        /// Used by `Newtonsoft.JSON` to exclude phantom identifier during entity serialization.
        /// </summary>
        /// <returns>false</returns>
        public bool ShouldSerializePhantomId() { return false; }
    }
}
