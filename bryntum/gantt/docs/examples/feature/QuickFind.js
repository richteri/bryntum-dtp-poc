(function () {
const targetElement = document.querySelector('div[data-file="feature/QuickFind.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>Select a cell and start typing to search in that column. Go to next hit using F3 or CMD+g</p>';
//START
// grid with QuickFind feature
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // enable quickfind
        quickFind : true
    },

    data : DataGenerator.generateData(10),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1 }
    ]
});
//END
})();