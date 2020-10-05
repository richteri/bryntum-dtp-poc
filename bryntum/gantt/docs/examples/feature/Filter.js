(function () {
const targetElement = document.querySelector('div[data-file="feature/Filter.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>Click the filter icon on column headers to apply filters</p>';
//START
// grid with Filter feature
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        filter: true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Traveller', flex : 1 },
        { field : 'city', text : 'Visited', flex : 1 },
        { field : 'food', text : 'Ate', flex : 1 },
        { field : 'rating', text : 'Score', flex : 1 }
    ]
});
//END
})();