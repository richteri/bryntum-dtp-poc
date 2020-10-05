
StartTest(t => {

    const gantt = t.getGantt({
        appendTo : document.body,

        id : 'gantt',

        columns : [
            { type : 'name' },
            { type : 'sequence' }
        ]
    });

    function getNumbers() {
        const cells   = Array.from(document.querySelectorAll('.b-grid-cell[data-column=sequenceNumber]'));
        return cells.map(cell => Number(cell.innerText));
    }

    t.chain(
        { waitForRowsVisible : gantt },

        next => {
            t.isDeeply(getNumbers(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'Correct sequence numbers from start');

            gantt.store.sort('name');

            t.isDeeply(getNumbers(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'Correct sequence numbers after sort');

            next();
        },

        { click : '.id2 .b-tree-expander', desc : 'Collapsing' },

        next => {
            t.isDeeply(getNumbers(), [1, 2, 3, 11, 12, 13, 14, 15], 'Correct sequence numbers after collapse');

            next();
        },

        { click : '.id2 .b-tree-expander', desc : 'Expanding' },

        () => {
            t.isDeeply(getNumbers(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 'Correct sequence numbers after expand');
        }
    );
});
