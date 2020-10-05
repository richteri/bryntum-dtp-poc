/**
 * The enumeration for the time units
 */
export enum TimeUnit {
    Millisecond     = 'millisecond',
    Second          = 'second',
    Minute          = 'minute',
    Hour            = 'hour',
    Day             = 'day',
    Week            = 'week',
    Month           = 'month',
    Quarter         = 'quarter',
    Year            = 'year'
}

/**
 * Type alias for duration values
 */
export type Duration = number


/**
 * The enumeration for the supported constraint types
 */
export enum ConstraintType {
    MustStartOn = 'muststarton',
    MustFinishOn = 'mustfinishon',
    StartNoEarlierThan = 'startnoearlierthan',
    StartNoLaterThan = 'startnolaterthan',
    FinishNoEarlierThan = 'finishnoearlierthan',
    FinishNoLaterThan = 'finishnolaterthan'
}


/**
 * The enumeration for the supported scheduling modes
 */
export enum SchedulingMode {
    Normal              = 'Normal',
    FixedDuration       = 'FixedDuration',
    FixedEffort         = 'FixedEffort',
    FixedUnits          = 'FixedUnits'
}


/**
 * The enumeration for the supported dependency types
 */
export enum DependencyType {
    StartToStart = 0,
    StartToEnd   = 1,
    EndToStart   = 2,
    EndToEnd     = 3
}


/**
 * The enumeration for the supported sources of the calendar for the dependency.
 */
export enum DependenciesCalendar {
    Project    = "Project",
    FromEvent  = "FromEvent",
    ToEvent    = "ToEvent"
}


/**
 * Engine provides with different project types, the enumeration describes the types currently available
 */
export enum ProjectType {
    Unknown   = 0,
    Gantt     = 1,
    Scheduler = 2
}

export enum Direction {
    Forward = 'Forward',
    Backward = 'Backward',
    None = 'None'
}
