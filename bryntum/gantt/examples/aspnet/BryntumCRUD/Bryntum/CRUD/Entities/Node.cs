using Newtonsoft.Json;
using System;

namespace Bryntum.CRUD.Entities
{
    /// <summary>
    /// The base implementation of a node entity. A node entity is an entity supposed to keep a tree store model instance.
    /// </summary>
    /// <typeparam name="T">Entity sub-class implementing this node abstraction.</typeparam>
    public abstract class Node<T> : General
    {
        /// <summary>
        /// Raw parent node identifier (identifier of the record in the database).
        /// Has `null` if parent node is phantom (not persisted yet).
        /// </summary>
        [JsonIgnore]
        public virtual Nullable<int> parentIdRaw { get; set; }

        /// <summary>
        /// Parent node identifier.
        /// Used for more type flexible parent identifier processing since parentId provided
        /// from the client side may contain string value.
        /// So this property tries to convert string value to integer and sets it to `null` in case of failed attempt.
        /// </summary>
        public virtual string parentId
        {
            set
            {
                // for root level nodes we keep `null`
                if (String.IsNullOrEmpty(value) || value.Equals("root", StringComparison.InvariantCultureIgnoreCase))
                {
                    parentIdRaw = null;
                    return;
                }

                int v;
                if (int.TryParse(value, out v))
                {
                    parentIdRaw = v;
                }
                else
                {
                    parentIdRaw = null;
                }
            }

            get
            {
                return !parentIdRaw.HasValue ? null : Convert.ToString(parentIdRaw.Value);
            }
        }

        /// <summary>
        /// Phantom parent identifier.
        /// </summary>
        [JsonProperty("$PhantomParentId")]
        public virtual string PhantomParentId { get; set; }

        /// <summary>
        /// Used by `Newtonsoft.JSON` to exclude phantom parent identifier during entity serialization.
        /// </summary>
        /// <returns>false</returns>
        public bool ShouldSerializePhantomParentId() { return false; }

        /// <summary>
        /// Returns true if this node is a leaf.
        /// </summary>
        public abstract bool leaf { get; }

        [JsonIgnore]
        public override String PhantomIdField { get { return "$PhantomId"; } }

        [JsonProperty("$PhantomId")]
        public override string PhantomId { get; set; }
    }

    /// <summary>
    /// Meta data class used to configure a class implementing `Node` abstraction.
    /// </summary>
    /// <typeparam name="T">Class implementing `Node` abstraction</typeparam>
    public abstract class NodeMetadata<T>
    {
        [JsonIgnore]
        public T Parent { get; set; }
    }
}
