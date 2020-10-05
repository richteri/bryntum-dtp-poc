(function () {
const targetElement = document.querySelector('div[data-file="guides/features/Filter.js"]');
if (!targetElement) return;

let data = DataGenerator.generateData(5);

//START
let grid = new Grid({
    appendTo : targetElement,

    autoHeight: true,

    features : {
        filter: {
            property : 'city',
            value    : data[0].city
        }
    },

    data,

    columns : [
        { field : 'name', text : 'Traveller', flex : 1 },
        { field : 'city', text : 'Visited', flex : 1 },
        { field : 'food', text : 'Ate', flex : 1 },
        { field : 'rating', text : 'Score', flex : 1 }
    ]
});
//END
})();
