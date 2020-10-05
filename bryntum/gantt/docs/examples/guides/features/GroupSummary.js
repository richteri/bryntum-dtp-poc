(function () {
const targetElement = document.querySelector('div[data-file="guides/features/GroupSummary.js"]');
if (!targetElement) return;

//START
let grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    features : {
        group        : 'city',
        groupSummary : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1, summaries : [{ sum : 'count', label : 'Rows' }] },
        { field : 'score', text : 'Score', flex : 1, summaries : [{ sum : 'avg', label : 'Average' }] }
    ]
});

//END
})();
