(function () {
const targetElement = document.querySelector('div[data-file="feature/Search.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>Type in the field below to search in the grid</p>';

//START
let searchField = new TextField({
    appendTo : targetElement,
    label    : 'Search',
    icon     : 'b-icon b-icon-search',
    value    : 'on',
    style    : 'margin-bottom: 1em',
    onInput  : () => grid.features.search.search(searchField.value)
});
// grid with Search feature
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // enable searching
        search : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1 }
    ]
});

// initial search
grid.features.search.search(searchField.value);
//END
})();
