namespace Bryntum.Gantt.Exception
{
    /// <summary>
    /// Contains possible values of CrudException codes.
    /// </summary>
    public static class GanttCodes {
        /// <summary>
        /// Error of task updating.
        /// </summary>
        public static int UPDATE_TASK = 100;
        /// <summary>
        /// Error of task adding.
        /// </summary>
        public static int ADD_TASK = 101;
        /// <summary>
        /// Error of task removing.
        /// </summary>
        public static int REMOVE_TASK = 102;
        /// <summary>
        /// Error of used task removing.
        /// </summary>
        public static int REMOVE_USED_TASK = 103;
        /// <summary>
        /// Error of tasks list getting.
        /// </summary>
        public static int GET_TASKS = 104;
        public static int TASK_NOT_FOUND = 105;

        /// <summary>
        /// Error of calendar days list getting.
        /// </summary>
        public static int GET_CALENDAR_DAYS = 110;
        /// <summary>
        /// Error of calendar day updating.
        /// </summary>
        public static int UPDATE_CALENDAR_DAY = 111;
        /// <summary>
        /// Error of calendar day adding.
        /// </summary>
        public static int ADD_CALENDAR_DAY = 112;
        /// <summary>
        /// Error of calendar day removing.
        /// </summary>
        public static int REMOVE_CALENDAR_DAY = 113;
        public static int CALENDAR_DAY_NOT_FOUND = 114;

        /// <summary>
        /// Error of calendars list getting.
        /// </summary>
        public static int GET_CALENDARS = 120;
        /// <summary>
        /// Error of calendar updating.
        /// </summary>
        public static int UPDATE_CALENDAR = 121;
        /// <summary>
        /// Error of calendar adding.
        /// </summary>
        public static int ADD_CALENDAR = 122;
        /// <summary>
        /// Error of calendar removing.
        /// </summary>
        public static int REMOVE_CALENDAR = 123;
        public static int CALENDAR_NOT_FOUND = 124;
        public static int CALENDAR_HAS_CALENDARS = 125;
        public static int CALENDAR_USED_BY_RESOURCE = 126;
        public static int CALENDAR_USED_BY_TASK = 127;

        /// <summary>
        /// Error of resource updating.
        /// </summary>
        public static int UPDATE_RESOURCE = 130;
        /// <summary>
        /// Error of resource adding.
        /// </summary>
        public static int ADD_RESOURCE = 131;
        /// <summary>
        /// Error of resource removing.
        /// </summary>
        public static int REMOVE_RESOURCE = 132;
        /// <summary>
        /// Error of resources list getting.
        /// </summary>
        public static int GET_RESOURCES = 133;
        /// <summary>
        /// Cannot find resource.
        /// </summary>
        public static int RESOURCE_NOT_FOUND = 134;
        public static int REMOVE_USED_RESOURCE = 135;

        /// <summary>
        /// Error of assignment updating.
        /// </summary>
        public static int UPDATE_ASSIGNMENT = 140;
        /// <summary>
        /// Error of assignment adding.
        /// </summary>
        public static int ADD_ASSIGNMENT = 141;
        /// <summary>
        /// Error of assignment removing.
        /// </summary>
        public static int REMOVE_ASSIGNMENT = 142;
        /// <summary>
        /// Error of assignments list getting.
        /// </summary>
        public static int GET_ASSIGNMENTS = 143;
        /// <summary>
        /// Cannot find assignment.
        /// </summary>
        public static int ASSIGNMENT_NOT_FOUND = 144;

        /// <summary>
        /// Error of dependency updating.
        /// </summary>
        public static int UPDATE_DEPENDENCY = 150;
        /// <summary>
        /// Error of dependency adding.
        /// </summary>
        public static int ADD_DEPENDENCY = 151;
        /// <summary>
        /// Error of dependency removing.
        /// </summary>
        public static int REMOVE_DEPENDENCY = 152;
        /// <summary>
        /// Error of dependencies list getting.
        /// </summary>
        public static int GET_DEPENDENCIES = 153;
        /// <summary>
        /// Dpendency is not found.
        /// </summary>
        public static int DEPENDENCY_NOT_FOUND = 154;

        /// <summary>
        /// Error of task segment updating.
        /// </summary>
        public static int UPDATE_TASK_SEGMENT = 155;
        /// <summary>
        /// Error of task segment adding.
        /// </summary>
        public static int ADD_TASK_SEGMENT = 156;
        /// <summary>
        /// Error of bulk task segments removing.
        /// </summary>
        public static int REMOVE_TASK_SEGMENTS = 157;
        /// <summary>
        /// Error of task segment retrieving.
        /// </summary>
        public static int GET_TASK_SEGMENTS = 158;
        /// <summary>
        /// Segment is not found.
        /// </summary>
        public static int TASK_SEGMENT_NOT_FOUND = 159;
        /// <summary>
        /// Error of task segment removing.
        /// </summary>
        public static int REMOVE_TASK_SEGMENT = 160;
    }
}
