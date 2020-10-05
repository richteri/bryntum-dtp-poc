import { ColumnStore, NameColumn } from '../../build/gantt.module.js';

StartTest(t => {

    let gantt;

    t.beforeEach(() => {
        gantt && gantt.destroy();

    });

    t.it('Name column should be always added if not provided in columns config', (t) => {

        gantt = t.getGantt({
            appendTo : document.body,
            columns  : []
        });

        t.ok(gantt.columns.count, 1, '1 column');
        t.ok(gantt.columns.first.type, 'name', 'Name column added');
    });

    t.it('Name column should NOT be added if already provided in columns config', (t) => {

        gantt = t.getGantt({
            appendTo : document.body,
            columns  : [
                { type : 'name' }
            ]
        });

        t.ok(gantt.columns.count, 1, '1 column');
        t.ok(gantt.columns.first.type, 'name', 'Name column added');
    });

    t.it('Name column should NOT be added if a subclass of Name column is provided in columns config', (t) => {

        class MyNameColumn extends NameColumn {
            static get type() {
                return 'myname';
            }

            static get isGanttColumn() {
                return true;
            }
        }

        ColumnStore.registerColumnType(MyNameColumn);

        gantt = t.getGantt({
            appendTo : document.body,
            columns  : [
                { type : 'myname' }
            ]
        });

        t.ok(gantt.columns.count, 1, '1 column');
        t.ok(gantt.columns.first.type, 'myname', 'MyName column added');
    });
});
