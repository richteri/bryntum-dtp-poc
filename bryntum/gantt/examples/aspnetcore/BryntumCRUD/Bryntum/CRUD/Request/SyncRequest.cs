namespace Bryntum.CRUD.Request
{
    /// <summary>
    /// This class implements general sync request structure.
    /// </summary>
    public class SyncRequest : GeneralRequest {
        /// <summary>
        /// Client side revision stamp.
        /// </summary>
        public int? revision;
    }
}
