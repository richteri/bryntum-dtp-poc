(function () {
const targetElement = document.querySelector('div[data-file="guides/features/RegionResize.js"]');
if (!targetElement) return;
//START
// grid with RegionResize feature
let grid = new Grid({
    appendTo : targetElement,

    autoHeight: true,

    features : {
        // enabled region resize
        regionResize: true
    },

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'firstName', text : 'First name', width: 150, locked: true },
        { field : 'surName', text : 'Surname', width: 150, locked: true },
        { field : 'city', text : 'City', flex : 1 },
        { field : 'team', text : 'Team', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 },
        { field : 'rank', text : 'Rank', flex : 1 }
    ]
});
//END
})();
