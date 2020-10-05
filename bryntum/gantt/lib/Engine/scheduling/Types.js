export var TimeUnit;
(function (TimeUnit) {
    TimeUnit["Millisecond"] = "millisecond";
    TimeUnit["Second"] = "second";
    TimeUnit["Minute"] = "minute";
    TimeUnit["Hour"] = "hour";
    TimeUnit["Day"] = "day";
    TimeUnit["Week"] = "week";
    TimeUnit["Month"] = "month";
    TimeUnit["Quarter"] = "quarter";
    TimeUnit["Year"] = "year";
})(TimeUnit || (TimeUnit = {}));
export var ConstraintType;
(function (ConstraintType) {
    ConstraintType["MustStartOn"] = "muststarton";
    ConstraintType["MustFinishOn"] = "mustfinishon";
    ConstraintType["StartNoEarlierThan"] = "startnoearlierthan";
    ConstraintType["StartNoLaterThan"] = "startnolaterthan";
    ConstraintType["FinishNoEarlierThan"] = "finishnoearlierthan";
    ConstraintType["FinishNoLaterThan"] = "finishnolaterthan";
})(ConstraintType || (ConstraintType = {}));
export var SchedulingMode;
(function (SchedulingMode) {
    SchedulingMode["Normal"] = "Normal";
    SchedulingMode["FixedDuration"] = "FixedDuration";
    SchedulingMode["FixedEffort"] = "FixedEffort";
    SchedulingMode["FixedUnits"] = "FixedUnits";
})(SchedulingMode || (SchedulingMode = {}));
export var DependencyType;
(function (DependencyType) {
    DependencyType[DependencyType["StartToStart"] = 0] = "StartToStart";
    DependencyType[DependencyType["StartToEnd"] = 1] = "StartToEnd";
    DependencyType[DependencyType["EndToStart"] = 2] = "EndToStart";
    DependencyType[DependencyType["EndToEnd"] = 3] = "EndToEnd";
})(DependencyType || (DependencyType = {}));
export var DependenciesCalendar;
(function (DependenciesCalendar) {
    DependenciesCalendar["Project"] = "Project";
    DependenciesCalendar["FromEvent"] = "FromEvent";
    DependenciesCalendar["ToEvent"] = "ToEvent";
})(DependenciesCalendar || (DependenciesCalendar = {}));
export var ProjectType;
(function (ProjectType) {
    ProjectType[ProjectType["Unknown"] = 0] = "Unknown";
    ProjectType[ProjectType["Gantt"] = 1] = "Gantt";
    ProjectType[ProjectType["Scheduler"] = 2] = "Scheduler";
})(ProjectType || (ProjectType = {}));
export var Direction;
(function (Direction) {
    Direction["Forward"] = "Forward";
    Direction["Backward"] = "Backward";
    Direction["None"] = "None";
})(Direction || (Direction = {}));
//# sourceMappingURL=Types.js.map