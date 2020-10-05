(function () {
const targetElement = document.querySelector('div[data-file="feature/ContextMenu.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>Right click a header or cell to display a context menu</p>';
//START
// grid with ContextMenu feature
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // this feature is actually enabled by default,
        // so no need for this unless you have changed defaults
        contextMenu : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 }
    ]
});
//END
})();