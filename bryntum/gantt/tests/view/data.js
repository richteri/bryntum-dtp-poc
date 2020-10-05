// prepare "namespace"
window.bryntum = window.bryntum || {};

window.bryntum.ganttTestProject = {

    events : [{
        id        : 100,
        name      : 'PROJECT: BUILD DEVICE',
        startDate : '2019-01-16T08:00:00',
        endDate   : '2019-05-12T17:00:00',
        taskType  : 'Gnt.model.Project',
        children  : [
            {
                id          : 1,
                name        : 'Planning',
                percentDone : 50,
                startDate   : '2019-01-16T08:00:00',
                endDate     : '2019-01-27T17:00:00',
                taskType    : 'Important',
                children    : [
                    {
                        duration    : 10,
                        id          : 11,
                        name        : 'Investigate',
                        percentDone : 50,
                        startDate   : '2019-01-16T08:00:00',
                        taskType    : 'LowPrio'
                    },
                    {
                        duration    : 10,
                        id          : 12,
                        name        : 'Assign resources',
                        percentDone : 50,
                        startDate   : '2019-01-16T08:00:00'
                    },
                    {
                        duration    : 10,
                        id          : 13,
                        name        : 'Gather documents (not resizable)',
                        percentDone : 50,
                        resizable   : false,
                        startDate   : '2019-01-16T08:00:00'
                    },
                    {
                        draggable         : false,
                        duration          : 0,
                        id                : 17,
                        name              : 'Report to management (not draggable)',
                        percentDone       : 0,
                        startDate         : '2019-01-27T17:00:00',
                        manuallyScheduled : true
                    }
                ],
                expanded : true
            },
            {
                duration       : 12,
                id             : 4,
                name           : 'Implementation Phase 1',
                percentDone    : 43.92857142857143,
                startDate      : '2019-01-30T08:00:00',
                constraintType : 'startnoearlierthan',
                constraintDate : '2019-01-30T08:00:00',
                taskType       : 'LowPrio',
                children       : [
                    {
                        duration    : 5,
                        id          : 34,
                        name        : 'Preparation work',
                        percentDone : 30,
                        startDate   : '2019-01-30T08:00:00'
                    },
                    {
                        duration    : 5,
                        id          : 14,
                        name        : 'Evaluate chipsets',
                        percentDone : 30,
                        startDate   : '2019-01-30T08:00:00'
                    },
                    {
                        duration    : 5,
                        id          : 16,
                        name        : 'Choose technology suite',
                        percentDone : 30,
                        startDate   : '2019-01-30T08:00:00'
                    },
                    {
                        duration    : 5,
                        id          : 15,
                        name        : 'Build prototype',
                        percentDone : 60,
                        startDate   : '2019-02-08T08:00:00',
                        children    : [
                            {
                                duration          : 4,
                                id                : 20,
                                name              : 'Step 1',
                                percentDone       : 60,
                                startDate         : '2019-02-08T08:00:00',
                                manuallyScheduled : true
                            },
                            {
                                duration          : 4,
                                id                : 19,
                                name              : 'Step 2',
                                percentDone       : 60,
                                startDate         : '2019-02-08T08:00:00',
                                manuallyScheduled : true
                            },
                            {
                                duration          : 4,
                                id                : 18,
                                name              : 'Step 3',
                                percentDone       : 60,
                                startDate         : '2019-02-08T08:00:00',
                                manuallyScheduled : true
                            },
                            {
                                duration          : 1,
                                id                : 21,
                                name              : 'Follow up with customer',
                                percentDone       : 60,
                                startDate         : '2019-02-14',
                                manuallyScheduled : true
                            }
                        ],
                        expanded : true
                    }
                ],
                expanded : true
            },
            {
                duration          : 0,
                id                : 5,
                name              : 'Customer approval',
                percentDone       : 0,
                startDate         : '2019-02-15T17:00:00',
                manuallyScheduled : true
            },
            {
                duration       : 8,
                id             : 6,
                name           : 'Implementation Phase 2',
                percentDone    : 16.666666666666668,
                startDate      : '2019-02-20T08:00:00',
                constraintType : 'startnoearlierthan',
                constraintDate : '2019-02-20T08:00:00',
                children       : [
                    {
                        duration    : 8,
                        id          : 25,
                        name        : 'Task 1',
                        percentDone : 10,
                        startDate   : '2019-02-20T08:00:00'
                    },
                    {
                        duration    : 8,
                        id          : 26,
                        name        : 'Task 2',
                        percentDone : 20,
                        startDate   : '2019-02-20T08:00:00'
                    },
                    {
                        duration    : 8,
                        id          : 27,
                        name        : 'Task 3',
                        percentDone : 20,
                        startDate   : '2019-02-20T08:00:00'
                    }
                ],
                expanded : true
            },
            {
                duration          : 0,
                id                : 10,
                name              : 'Customer approval 2',
                percentDone       : 0,
                startDate         : '2019-03-14T17:00',
                manuallyScheduled : true
            },
            {
                duration       : 35,
                id             : 8,
                name           : 'Production phase 1',
                percentDone    : 40.57142857142857,
                startDate      : '2019-03-20T08:00:00',
                constraintType : 'startnoearlierthan',
                constraintDate : '2019-03-20T08:00:00',
                children       : [
                    {
                        duration    : 12,
                        id          : 22,
                        name        : 'Assemble',
                        percentDone : 50,
                        startDate   : '2019-03-20T08:00:00'
                    },
                    {
                        duration          : 11,
                        id                : 23,
                        name              : 'Load SW',
                        percentDone       : 20,
                        startDate         : '2019-04-04T08:00:00',
                        manuallyScheduled : true
                    },
                    {
                        duration    : 12,
                        id          : 24,
                        name        : 'Basic testing (inc some test)',
                        percentDone : 50,
                        startDate   : '2019-04-20T08:00:00'
                    }
                ],
                expanded : true
            },
            {
                duration          : 6,
                id                : 9,
                name              : 'Final testing',
                percentDone       : 0,
                startDate         : '2019-05-05T08:00:00',
                manuallyScheduled : true
            },
            {
                duration          : 0,
                id                : 7,
                name              : 'Delivery',
                percentDone       : 40,
                startDate         : '2019-05-12T17:00',
                manuallyScheduled : true
            }
        ],
        'cls'    : 'project',
        expanded : true
    }],

    assignments : [
        {
            id       : 1,
            resource : 1,
            event    : 11,
            units    : 125
        },
        {
            id       : 2,
            resource : 2,
            event    : 11,
            units    : 50
        }, {
            id       : 100,
            resource : 3,
            event    : 11,
            units    : 125
        },
        {
            id       : 200,
            resource : 4,
            event    : 11,
            units    : 50
        },
        {
            id       : 3,
            resource : 3,
            event    : 12,
            units    : 50
        },
        {
            id       : 4,
            resource : 4,
            event    : 13,
            units    : 100
        },
        {
            id       : 5,
            resource : 5,
            event    : 14,
            units    : 100
        },
        {
            id       : 6,
            resource : 6,
            event    : 16,
            units    : 100
        }
    ],
    resources : [
        {
            id   : 1,
            name : 'Mike',
            type : 'user'
        },
        {
            id   : 2,
            name : 'Linda',
            type : 'user'
        },
        {
            id   : 3,
            name : 'Don',
            type : 'user-ninja'
        },
        {
            id   : 4,
            name : 'Karen',
            type : 'user'
        },
        {
            id   : 5,
            name : 'Doug',
            type : 'user'
        },
        {
            id   : 6,
            name : 'Peter',
            type : 'user-secret'
        },
        {
            calendar : 'NightShift',
            id       : 1001,
            name     : 'Drill',
            type     : 'cog'
        },
        {
            calendar : 'NightShift',
            id       : 1002,
            name     : 'Oil pump',
            type     : 'cog'
        },
        {
            calendar : 'NightShift',
            id       : 1006,
            name     : 'Crane #1',
            type     : 'cog'
        },
        {
            calendar : 'NightShift',
            id       : 1007,
            name     : 'Crane #2',
            type     : 'cog'
        },
        {
            calendar : 'NightShift',
            id       : 1008,
            name     : 'Crane #3',
            type     : 'cog'
        },
        {
            calendar : 'Default',
            id       : 1003,
            name     : 'Light truck #1',
            type     : 'truck'
        },
        {
            calendar : 'Default',
            id       : 1004,
            name     : 'Light truck #2',
            type     : 'truck'
        },
        {
            calendar : 'Default',
            id       : 1005,
            name     : 'Heavy truck',
            type     : 'truck-moving'
        },
        {
            calendar : 'Default',
            id       : 1009,
            name     : 'Cargo jet #1',
            type     : 'plane'
        },
        {
            calendar : 'Default',
            id       : 1010,
            name     : 'Cargo jet #2',
            type     : 'plane-alt'
        }
    ],
    dependencies : [
        {
            id        : 1,
            fromEvent : 12,
            toEvent   : 13,
            type      : 0
        },
        {
            id        : 2,
            fromEvent : 20,
            toEvent   : 19,
            type      : 2
        },
        {
            id        : 3,
            fromEvent : 19,
            toEvent   : 18,
            type      : 2
        },
        {
            id        : 4,
            fromEvent : 18,
            toEvent   : 21,
            type      : 2
        },
        {
            id        : 5,
            fromEvent : 21,
            toEvent   : 5,
            type      : 2
        },
        {
            id        : 6,
            fromEvent : 9,
            toEvent   : 7,
            type      : 2
        },
        {
            id        : 7,
            fromEvent : 26,
            toEvent   : 25,
            type      : 0
        },
        {
            id        : 8,
            fromEvent : 27,
            toEvent   : 26,
            type      : 0
        },
        {
            id        : 9,
            fromEvent : 6,
            toEvent   : 10,
            type      : 2
        },
        {
            id        : 10,
            fromEvent : 24,
            toEvent   : 9,
            type      : 2
        },
        {
            id        : 11,
            fromEvent : 22,
            toEvent   : 23,
            type      : 2
        },
        {
            id        : 12,
            fromEvent : 11,
            toEvent   : 12,
            type      : 0
        },
        {
            id        : 13,
            fromEvent : 34,
            toEvent   : 20,
            type      : 2
        },
        {
            id        : 14,
            fromEvent : 13,
            toEvent   : 17,
            type      : 2
        }
    ],
    calendars : [
        {
            id        : 'general',
            name      : 'General',
            intervals : [
                {
                    recurrentStartDate : 'on Sat at 0:00',
                    recurrentEndDate   : 'on Mon at 0:00',
                    isWorking          : false
                }
            ],
            expanded : true,
            children : [
                {
                    id           : 'business',
                    name         : 'Business',
                    hoursPerDay  : 8,
                    daysPerWeek  : 5,
                    daysPerMonth : 20,
                    intervals    : [
                        {
                            recurrentStartDate : 'every weekday at 12:00',
                            recurrentEndDate   : 'every weekday at 13:00',
                            isWorking          : false
                        },
                        {
                            recurrentStartDate : 'every weekday at 17:00',
                            recurrentEndDate   : 'every weekday at 08:00',
                            isWorking          : false
                        }
                    ]
                },
                {
                    id           : 'night',
                    name         : 'Night shift',
                    hoursPerDay  : 8,
                    daysPerWeek  : 5,
                    daysPerMonth : 20,
                    intervals    : [
                        {
                            recurrentStartDate : 'every weekday at 6:00',
                            recurrentEndDate   : 'every weekday at 22:00',
                            isWorking          : false
                        }
                    ]
                }
            ]
        }
    ]
};
