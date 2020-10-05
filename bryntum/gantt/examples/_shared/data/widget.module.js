// eslint-disable-next-line no-unused-vars
window.introWidget = {
    type       : 'gantt',
    startDate  : new Date(2018, 3, 1),
    endDate    : new Date(2018, 3, 14),
    viewPreset : 'weekAndDayLetter',
    minHeight  : 250,

    columns : [{
        type  : 'name',
        text  : 'Name',
        width : 220
    }],

    tasks : [{
        name        : 'My Project',
        expanded    : true,
        startDate   : '2018-04-02',
        percentDone : 50,
        children    : [{
            id          : 1,
            name        : 'Develop New Cool Product',
            percentDone : 50,
            startDate   : '2018-04-02',
            duration    : 5
        }, {
            id          : 2,
            name        : 'Launch Product',
            percentDone : 50,
            startDate   : '2018-04-09',
            duration    : 4
        }]
    }],

    dependencies : [{
        id        : 1,
        fromEvent : 1,
        toEvent   : 2
    }]
};
