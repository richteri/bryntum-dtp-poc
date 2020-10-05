import ColumnStore from '../../lib/Grid/data/ColumnStore.js';
import '../../lib/Gantt/column/NoteColumn.js';

StartTest(t => {

    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();

    });

    t.it('Should be possible to edit / clear note column', (t) => {

        gantt = t.getGantt({
            appendTo : document.body,
            columns  : [
                { type : 'note'}
            ],

            tasks : [
                { id : 1 }
            ]
        });

        const task = gantt.taskStore.getById(1);

        t.ok(gantt.columns.count, 1, '1 column');
        t.ok(gantt.columns.first.type, 'name', 'Name column added');

        t.chain(
            { dblclick : '[data-column="note"].b-grid-cell' },

            { click : ".b-align-end" },

            { type : "foo[TAB]" },

            { waitForSelector : '[data-field="name"].b-cell-editor', desc : 'Editor moved to name'},

            () => {
                t.selectorExists('[data-column="note"]:textEquals(foo)', 'Could edit value');

                t.is(task.note, 'foo')

                task.note = '';

                t.selectorNotExists('[data-column="note"]:textEquals(foo)', 'Cell updated after clearing value');
            }
        );
    });
});
