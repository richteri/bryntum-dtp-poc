(function () {
    const targetElement = document.querySelector('div[data-file="gantt/widget/TaskEditor.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    targetElement.innerHTML = '<p>This demo shows how to use TaskEditor as a standalone widget</p>';

//START
const project = new bryntum.gantt.ProjectModel({
    startDate  : new Date(2020, 0, 1),

    eventsData : [
        {
            id : 1,
            name : 'Write docs',
            expanded : true,
            children : [
                { id : 2, name : 'Proof-read docs', startDate : '2020-01-02', endDate : '2020-01-05', effort : 0 },
                { id : 3, name : 'Release docs', startDate : '2020-01-09', endDate : '2020-01-10', effort : 0 }
            ]
        }
    ],

    dependenciesData : [
        { fromEvent : 2, toEvent : 3 }
    ]
});

const taskEditor = new bryntum.gantt.TaskEditor({
    listeners: {
        save: () => taskEditor.hide(),
        cancel: () => taskEditor.hide(),
    }
});

taskEditor.loadEvent(project.getEventStore().getById(2));

const button = new bryntum.gantt.Button({
    appendTo : targetElement,
    text     : 'Show TaskEditor',
    cls      : 'b-raised b-blue',
    onClick  : () => {
        taskEditor.showBy({
            target : button.element,
            align  : 'l-r',
            offset : 5
        });
    }
})
//END
})();
