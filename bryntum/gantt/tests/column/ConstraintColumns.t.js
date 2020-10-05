import '../../lib/Gantt/column/ConstraintDateColumn.js';
import '../../lib/Gantt/column/ConstraintTypeColumn.js';
import DateHelper from '../../lib/Core/helper/DateHelper.js';

StartTest(t => {

    let gantt;

    t.beforeEach(t => {
        gantt && !gantt.isDestroyed && gantt.destroy();

        gantt = t.getGantt({
            appendTo : document.body,

            id : 'gantt',

            columns : [
                { type : 'constraintdate' },
                { type : 'constrainttype' }
            ],

            tasks : [
                {
                    id             : 1,
                    cls            : 'id1',
                    name           : 'Project Nodlehs',
                    expanded       : true,
                    constraintDate : '2017-01-18',
                    constraintType : 'muststarton',
                    children       : [
                        {
                            id             : 11,
                            cls            : 'id11',
                            startDate      : '2017-01-16',
                            endDate        : '2017-01-18',
                            name           : 'Organize manpower',
                            constraintDate : '2017-01-16',
                            constraintType : 'startnoearlierthan',
                            leaf           : true
                        },
                        {
                            id             : 12,
                            startDate      : '2017-01-16',
                            endDate        : '2017-01-18',
                            name           : 'Figure out name',
                            constraintDate : '2017-01-16',
                            constraintType : 'startnoearlierthan',
                            leaf           : true
                        }
                    ]
                }
            ]
        });

    });

    t.it('Should use Gantt#displayDateFormat if configured with `null`', t => {
        gantt && gantt.destroy();

        gantt = t.getGantt({
            appendTo : document.body,

            id : 'gantt',

            columns : [
                { type : 'constraintdate', format : null },
                { type : 'constrainttype' }
            ],

            tasks : [
                {
                    id             : 1,
                    cls            : 'id1',
                    name           : 'Project Nodlehs',
                    expanded       : true,
                    constraintDate : '2017-01-18',
                    constraintType : 'muststarton',
                    children       : [
                        {
                            id             : 11,
                            cls            : 'id11',
                            startDate      : '2017-01-16',
                            endDate        : '2017-01-18',
                            name           : 'Organize manpower',
                            constraintDate : '2017-01-16',
                            constraintType : 'startnoearlierthan',
                            leaf           : true
                        },
                        {
                            id             : 12,
                            startDate      : '2017-01-16',
                            endDate        : '2017-01-18',
                            name           : 'Figure out name',
                            constraintDate : '2017-01-16',
                            constraintType : 'startnoearlierthan',
                            leaf           : true
                        }
                    ]
                }
            ]
        });

        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                const date = gantt.getFormattedDate(gantt.taskStore.getById(11).constraintDate);

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${date})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should use column format', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                const dateStr =  DateHelper.format(gantt.taskStore.getById(11).constraintDate, gantt.columns.getAt(1).format);

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${dateStr})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should update when Gantt#displayDateFormat changes', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                gantt.columns.getAt(1).format = 'L';

                const dateStr =  DateHelper.format(gantt.taskStore.getById(11).constraintDate, gantt.columns.getAt(1).format);

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${dateStr})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should be able to specify explicit format', t => {
        t.chain(
            { waitForRowsVisible : gantt },

            () => {
                gantt.columns.get('constraintDate').format = 'YYYY';

                const yyyy = gantt.taskStore.getById(11).constraintDate.getFullYear();

                t.selectorExists(`.id11 [data-column=constraintDate]:textEquals(${yyyy})`, 'Constraint date rendered correctly');
            }
        );
    });

    t.it('Should be able to change constraint type/date', t => {
        const firstTask = gantt.taskStore.first,
            lastTask    = gantt.taskStore.last;

        t.chain(
            async() => gantt.project.waitForPropagateCompleted(),

            { waitForRowsVisible : gantt },

            next => {
                t.notOk(firstTask.constraintType, 'Incorrect constraint type removed');
                next();
            },

            { diag : 'Change constraint type to SNET' },

            { dblclick : '.id1 [data-column=constraintType]', desc : 'Constraint type column dbl-clicked' },

            { type : 's[ENTER][ENTER]', desc : 'Typed "s" to pick start no earlier than' },

            async() => gantt.project.waitForPropagateCompleted(),

            next => {
                t.is(firstTask.constraintDate, new Date(2017, 0, 16), 'First task constraint date is ok');
                t.is(firstTask.startDate, new Date(2017, 0, 16), 'First task start is ok');
                t.is(lastTask.startDate, new Date(2017, 0, 16), 'Last task start is ok');
                next();
            },

            { diag : 'Move constraint date further' },

            { dblclick : '.id1 [data-column=constraintDate]', desc : 'Constraint type column dbl-clicked' },

            { type : 'Jan 19, 2017[ENTER]', desc : 'Typed "Jan 19, 2017"' },

            async() => gantt.project.waitForPropagateCompleted(),

            next => {
                t.is(firstTask.constraintDate, new Date(2017, 0, 19), 'First task constraint date is ok');
                t.is(firstTask.startDate, new Date(2017, 0, 19), 'First task start is ok');
                t.is(lastTask.startDate, new Date(2017, 0, 19), 'Last task start is ok');
                next();
            },

            { dblclick : '.id1 [data-column=constraintDate]', desc : 'Move constraint date back' },

            { type : 'Jan 16, 2017[ENTER]' },

            async() => gantt.project.waitForPropagateCompleted(),

            next => {
                t.is(firstTask.constraintDate, firstTask.startDate, 'First task start is ok');
                t.is(firstTask.constraintDate, lastTask.startDate, 'Last task start is ok');
                next();
            }
        );
    });

    t.it('Constraint type column should filter picker values for parents/leafs', t => {
        t.chain(
            async() => gantt.project.waitForPropagateCompleted(),

            { dblclick : '.id1 [data-column=constraintType]', desc : 'Edit parent' },

            { type : '[DOWN]' },

            next => {
                t.selectorCountIs('.b-list-item:textEquals(Must start on)', 0, 'Invalid constraint types are filtered');
                next();
            },

            { type : '[ESC]' },

            { dblclick : '.id11 [data-column=constraintType]', desc : 'Edit leaf' },

            { type : '[DOWN]' },

            next => {
                t.selectorCountIs('.b-list-item:textEquals(Must start on)', 1, 'MSO constraint are available');
                next();
            },

            { type : '[ESC]' },

            { dblclick : '.id1 [data-column=constraintType]', desc : 'Edit parent again' },

            { type : '[DOWN]' },

            next => {
                t.selectorCountIs('.b-list-item:textEquals(Must start on)', 0, 'Invalid constraint types are filtered');
                next();
            },

            { type : '[ESC]' }
        );
    });

    t.it('ConstraintType column should be clearable by selecting the "None" list item', t => {
        const
            cellEditFeature = gantt.features.cellEdit,
            firstTask       = gantt.taskStore.first,
            secondTask      = gantt.taskStore.getAt(1);

        let constraintTypeCell, constraintTypeField, constraintRecord;

        t.chain(
            { waitForRowsVisible : gantt },

            { dblclick : () => constraintTypeCell = document.querySelector('.b-grid-cell[data-column=constraintType]') },

            {
                waitFor : () => {
                    if (cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus) {
                        constraintTypeField = cellEditFeature.editorContext.editor.inputField;
                        constraintRecord = constraintTypeField.store.getAt(1);
                        return true;
                    }
                }
            },

            // Expand the constraint type picker
            { click : () => constraintTypeField.triggers.expand.element },

            // Select list item 1
            { click : () => constraintTypeField.picker.getItem(1) },

            { type : '[ENTER]' },

            // Wait for navigation down
            { waitFor : () => cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === secondTask },

            next => {
                // Cell must contain the textual description of the constraint
                t.is(constraintTypeCell.innerText, constraintRecord[constraintTypeField.displayField]);
                next();
            },

            // Go back up to the modified cell and clear it by using the "None" dropdown item.
            { type : '[ENTER]', options : { shiftKey : true } },

            // Wait for navigation back up
            { waitFor : () => cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === firstTask },

            { click : () => constraintTypeField.triggers.expand.element },

            // Select the "None" item
            { click : () => constraintTypeField.picker.getItem(0) },

            { type : '[ENTER]' },

            next => {
                // Cell must be empty when no constraint is applied.
                t.is(constraintTypeCell.innerText, '');
                next();
            }
        );
    });

    t.it('ConstraintType column should be clearable by clicking the field\'s clear trigger', t => {
        const
            cellEditFeature = gantt.features.cellEdit,
            firstTask       = gantt.taskStore.first,
            secondTask      = gantt.taskStore.getAt(1);

        let constraintTypeCell, constraintTypeField, constraintRecord;

        t.chain(
            { waitForRowsVisible : gantt },

            { dblclick : () => constraintTypeCell = document.querySelector('.b-grid-cell[data-column=constraintType]') },

            {
                waitFor : () => {
                    if (cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus) {
                        constraintTypeField = cellEditFeature.editorContext.editor.inputField;
                        constraintRecord = constraintTypeField.store.getAt(1);
                        return true;
                    }
                }
            },

            // Expand the constraint type picker
            { click : () => constraintTypeField.triggers.expand.element },

            // Select list item 1
            { click : () => constraintTypeField.picker.getItem(1) },

            { type : '[ENTER]' },

            // Wait for navigation down
            { waitFor : () => cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === secondTask },

            next => {
                // Cell must contain the textual description of the constraint
                t.is(constraintTypeCell.innerText, constraintRecord[constraintTypeField.displayField]);
                next();
            },

            // Go back up to the modified cell and clear it by using the "None" dropdown item.
            { type : '[ENTER]', options : { shiftKey : true } },

            // Wait for navigation back up
            { waitFor : () => cellEditFeature.editorContext && cellEditFeature.editorContext.editor.containsFocus && cellEditFeature.editorContext.record === firstTask },

            // Clear the field using the clear trigger
            { click : () => constraintTypeField.triggers.clear.element },

            { type : '[ENTER]' },

            next => {
                // Cell must be empty when no constraint is applied.
                t.is(constraintTypeCell.innerText, '');
                next();
            }
        );
    });
});
