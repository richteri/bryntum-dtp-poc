namespace Bryntum.CRUD.Exception
{
    /// <summary>
    /// Contains possible CrudException codes.
    /// </summary>
    public static class Codes {

        /// <summary>
        /// Error of getting number of rows found by the last query.
        /// </summary>
        public static int FOUND_ROWS = 3;
        /// <summary>
        /// Error of table columns list retrieving.
        /// </summary>
        public static int SHOW_COLUMNS = 4;
        /// <summary>
        /// Error of revision updating.
        /// </summary>
        public static int UPDATE_REVISION = 6;
        /// <summary>
        /// No changes passed in a sync request.
        /// </summary>
        public static int NO_SYNC_DATA = 7;
        /// <summary>
        /// The data revision passed from client is older than server one.
        /// </summary>
        public static int OUTDATED_REVISION = 8;
        /// <summary>
        /// Error of option getting.
        /// </summary>
        public static int GET_OPTION = 9;
        /// <summary>
        /// Error of option setting.
        /// </summary>
        public static int SET_OPTION = 10;
    }
}
