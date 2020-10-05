(function () {
const targetElement = document.querySelector('div[data-file="feature/GroupSummary.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

//START

// grid with Search feature
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        group        : 'city',
        groupSummary : true
    },

    data : DataGenerator.generateData(10),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1, summaries : [{ sum : 'count', label : 'Rows' }] },
        { field : 'score', text : 'Score', flex : 1, summaries : [{ sum : 'avg', label : 'Average' }] }
    ]
});

//END
})();
