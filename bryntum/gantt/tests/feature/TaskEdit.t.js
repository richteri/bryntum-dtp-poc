import '../../lib/Core/adapter/widget/BryntumWidgetAdapter.js';
import '../../lib/Gantt/column/AllColumns.js';
import DateHelper from '../../lib/Core/helper/DateHelper.js';
import ProjectGenerator from '../../lib/Gantt/util/ProjectGenerator.js';
import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';
import Duration from '../../lib/Core/data/Duration.js';

StartTest(t => {
    Object.assign(window, {
        // The test harness needs this so that it can mock URLs for testing purposes.
        AjaxHelper
    });

    let gantt;

    t.beforeEach(() => gantt && gantt.destroy());

    t.it('Should show task editor when double clicking task', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },

            resources : t.getResourceStoreData()
        });

        const investigate = gantt.taskStore.getAt(2);

        let oldWidth;

        t.chain(
            { dblClick : '.b-gantt-task.id11' },

            { waitForSelector : '.b-taskeditor' },

            next => {
                const oldEl = gantt.getElementFromTaskRecord(investigate);

                oldWidth = oldEl.offsetWidth;

                t.is(document.querySelector('.b-name input').value, gantt.taskStore.getById(11).name, 'Correct name');
                next();
            },

            { click : () => gantt.features.taskEdit.editor.widgetMap.fullDurationField.triggers.spin.upButton },

            { click : () => gantt.features.taskEdit.editor.widgetMap.saveButton.element },

            { waitFor : () => gantt.getElementFromTaskRecord(investigate).offsetWidth > oldWidth },

            { waitForSelectorNotFound : '.b-taskeditor' }
        );
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9416-adding-a-resource-in-the-taskeditor--then-clicking-save-throws-an-error-/
    t.it('Should not throw error when adding resource to "from" side of new dependency.', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },

            resources : t.getResourceStoreData()
        });

        t.livesOk(() => {
            t.chain(
                { moveMouseTo : '[data-task-id="231"]' },

                { moveMouseTo : '.b-sch-terminal-right' },

                { drag : '[data-task-id="231"] .b-sch-terminal-right', to : '[data-task-id="232"]', dragOnly : true },

                { moveMouseTo : '[data-task-id="232"] .b-sch-terminal-left' },

                { mouseup : null },

                { dblclick : '[data-task-id="232"]' },

                { waitForSelector : '.b-taskeditor' },

                { click : '.b-tabpanel-tab-title:contains(Resources)' },

                { click : '.b-resourcestab .b-add-button' },

                { click : '.b-grid .b-cell-editor' },

                { click : '.b-list-item[data-index="0"]' },

                { click : '.b-button:contains(Save)' },

                { waitForPropagate : gantt.project },

                { dblclick : '[data-task-id="231"]' },

                { waitForSelector : '.b-taskeditor' },

                { click : '.b-tabpanel-tab-title:contains(Resources)' },

                { click : '.b-resourcestab .b-add-button' },

                { click : '.b-grid .b-cell-editor' },

                { click : '.b-list-item[data-index="0"]' },

                { click : '.b-button:contains(Save)' },

                { waitForPropagate : gantt.project }
            );
        });
    });

    t.describe('Advanced form works ok', t => {
        t.it('Should be able to modify rollup field', t => {
            gantt = t.getGantt({
                features : {
                    taskTooltip : false
                }
            });

            t.chain(
                { dblClick : '[data-task-id="11"]' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },

                (next) => {
                    const rollupField = gantt.features.taskEdit.editor.widgetMap.rollupField;

                    t.notOk(rollupField.checked, 'Field not checked');
                    t.notOk(gantt.taskStore.getById(11).rollup, 'Data field false');
                    next();
                },

                { click : '[data-ref=rollupField] label' },

                () => {
                    t.ok(gantt.taskStore.getById(11).rollup, 'Data field true');
                }
            );
        });

        t.it('Should set constraints', t => {
            gantt = t.getGantt({
                columns : [
                    { type : 'name', width : 200 },
                    { type : 'constrainttype', width : 100 },
                    { type : 'constraintdate', width : 100 }
                ],
                subGridConfigs : {
                    locked : { width : 400 }
                },
                features : {
                    taskTooltip : false
                }
            });

            const project = gantt.project;
            const task = gantt.taskStore.getById(13);

            t.chain(
                { waitForPropagate : project },
                async() => {
                    task.constraintType = 'muststarton';
                    task.constraintDate = task.startDate;
                    return project.propagate();
                },
                { dblclick : '.id13.b-gantt-task', desc : 'Edit task with constraint' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },
                next => {
                    t.hasValue('[name=constraintType]', 'Must start on', 'Constraint type value is ok');
                    t.hasValue('[name=constraintDate]', DateHelper.format(task.startDate, 'L'), 'Constraint date value is ok');
                    next();
                },
                { click : '[name=constraintDate]' },
                { type : '[DOWN][LEFT][ENTER]' },
                next => {
                    document.querySelector('[name=constraintType]').value = '';
                    next();
                },
                { click : '[name=constraintType]' },
                { type : 's[ENTER]' },
                { click : 'button:contains(Save)' },

                { waitForPropagate : gantt.project },

                next => {
                    t.is(task.constraintType, 'startnoearlierthan', 'Constraint type is ok');
                    t.is(task.constraintDate, task.startDate, 'Constraint date is ok');
                    next();
                },

                { dblclick : '.id13.b-gantt-task', desc : 'Edit task with constraint' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },
                { click : '[name=constraintType]' },
                next => {
                    t.hasValue('[name=constraintType]', 'Start no earlier than', 'Constraint type value is ok');
                    t.hasValue('[name=constraintDate]', DateHelper.format(task.startDate, 'L'), 'Constraint date value is ok');

                    next();
                },
                { click : '.b-constrainttypepicker .b-icon-remove' },
                { click : 'button:contains(Save)' },

                { waitForPropagate : gantt.project },

                next => {
                    t.is(task.constraintType, null, 'Constraint type is ok');
                    // t.is(task.constraintDate, new Date(2017, 0, 15), 'Constraint date is ok');
                    next();
                }
            );
        });

        t.it('Should set calendars', t => {
            gantt = t.getGantt({
                columns : [
                    { type : 'name', width : 200 },
                    { type : 'calendar', width : 100 }
                ],
                subGridConfigs : {
                    locked : { width : 300 }
                },
                features : {
                    taskTooltip : false
                }
            });

            const
                project     = gantt.project,
                task        = gantt.taskStore.getById(13),
                originalEnd = task.endDate;

            task.setCalendar('night');

            t.chain(
                { waitForPropagate : project },

                { dblclick : '.id13.b-gantt-task', desc : 'Edit task' },
                { click : '.b-tabpanel-tab-title:contains(Advanced)' },
                { waitForSelector : 'input[name=calendar]' },

                next => {
                    t.hasValue('input[name=calendar]', 'Night shift', 'Calendar value is ok');
                    next();
                },

                { click : '[name=calendar]' },
                { type : '[DOWN][UP][ENTER][ENTER]' },
                { waitForPropagate : project },

                () => {
                    t.is(task.calendar.id, 'business', 'Calendar id is ok');
                    t.notOk(task.endDate.getTime() === originalEnd.getTime(), 'Task is updated');
                    t.contentLike('.id13 [data-column=calendar]', 'Business', 'Column cell value is ok');
                }
            );
        });
    });

    t.it('Should disable certain fields for parent tasks', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            }
        });

        t.chain(
            { dblClick : '[data-task-id="1"]' },

            { waitForSelector : '.b-taskeditor' },

            () => {
                const { fullDurationField, effortField, endDateField, percentDoneField } = gantt.features.taskEdit.editor.widgetMap;

                t.ok(fullDurationField.disabled, 'Duration disabled');
                t.ok(effortField.disabled, 'Effort disabled');
                t.ok(endDateField.disabled, 'Finish disabled');
                t.ok(percentDoneField.disabled, 'Percent done disabled');
            }
        );
    });

    t.it('Should preserve scroll when cancelling changes', async(t) => {
        const config = await ProjectGenerator.generateAsync(100, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        const
            task = gantt.taskStore.getAt(gantt.taskStore.count - 1);
        let
            scroll;

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },
            async() => gantt.scrollTaskIntoView(task),
            { dblclick : () => gantt.getElementFromTaskRecord(task) },
            { waitForSelector : '.b-taskeditor' },
            { click : () => gantt.features.taskEdit.editor.widgetMap.fullDurationField.triggers.spin.upButton },
            next => {
                scroll = gantt.scrollTop;

                const detacher = gantt.on({
                    renderTask({ taskRecord }) {
                        if (taskRecord === task) {
                            detacher();
                            next();
                        }
                    }
                });

                t.click('.b-popup-close');
            },
            () => {
                t.is(gantt.scrollTop, scroll, 'Scroll is intact');
            }
        );
    });

    t.it('Should be able to show editor programmatically', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-task' },

            async() => gantt.editTask(gantt.taskStore.rootNode.firstChild),

            { waitForSelector : '.b-gantt-taskeditor' }
        );
    });

    t.it('Should fire events upon show', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskEdit');
        t.firesOnce(gantt, 'beforeTaskEditShow');

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);
    });

    t.it('Should be possible to cancel show', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskEdit');
        t.wontFire(gantt, 'beforeTaskEditShow');

        gantt.on('beforeTaskEdit', () => false);

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);
        t.selectorNotExists('.b-gantt-taskeditor', 'No editor in DOM');
    });

    t.it('Should fire events upon save', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskSave');

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.save();
    });

    t.it('Should be possible to cancel save', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskSave');
        t.wontFire(gantt.taskEdit.getEditor(), 'hide');

        gantt.on('beforeTaskSave', () => false);

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.save();

        t.selectorExists('.b-gantt-taskeditor', 'Editor still visible');
    });

    t.it('Should fire events upon delete', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskDelete');

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.delete();
    });

    t.it('Should be possible to cancel delete', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 30, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        t.firesOnce(gantt, 'beforeTaskDelete');
        t.wontFire(gantt.taskEdit.getEditor(), 'hide');

        gantt.on('beforeTaskDelete', () => false);

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);

        await gantt.features.taskEdit.delete();

        t.selectorExists('.b-gantt-taskeditor', 'Editor still visible');
    });

    t.it('Should fire events with correct params', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 1, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project
        });

        await project.waitForPropagateCompleted();

        const task = gantt.taskStore.getById(3);

        t.firesOnce(gantt, 'beforeTaskEdit');
        gantt.on('beforeTaskEdit', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskEdit, gantt.features.taskEdit, 'taskEdit');
            t.is(event.taskRecord, task, 'taskRecord');
            t.isInstanceOf(event.taskElement, HTMLElement, 'element');
        });

        t.firesOnce(gantt, 'beforeTaskEditShow');
        gantt.on('beforeTaskEditShow', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskEdit, gantt.features.taskEdit, 'taskEdit');
            t.is(event.taskRecord, task, 'taskRecord');
            t.isInstanceOf(event.taskElement, HTMLElement, 'element');
            t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
        });

        t.firesOnce(gantt, 'beforeTaskSave');
        gantt.on('beforeTaskSave', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskRecord, task, 'taskRecord');
            t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
        });

        t.firesOnce(gantt, 'beforeTaskDelete');
        gantt.on('beforeTaskDelete', (event) => {
            t.is(event.source, gantt, 'gantt');
            t.is(event.taskRecord, task, 'taskRecord');
            t.is(event.editor, gantt.features.taskEdit.getEditor(), 'editor');
        });

        gantt.on('beforeTaskSave', () => false);
        gantt.on('beforeTaskDelete', () => false);

        await gantt.editTask(task);

        await gantt.features.taskEdit.save();
        await gantt.features.taskEdit.delete();
    });

    t.it('Should be possible to hide delete button', async(t) => {
        const config = await ProjectGenerator.generateAsync(1, 1, () => {});

        const project = t.getProject(config);

        gantt = t.getGantt({
            startDate : config.startDate,
            endDate   : config.endDate,
            project,
            features  : {
                taskEdit : {
                    showDeleteButton : false
                }
            }
        });

        await project.waitForPropagateCompleted();

        await gantt.editTask(gantt.taskStore.getById(3));

        t.selectorExists('.b-gantt-taskeditor button', 'Some button found');
        t.selectorNotExists('.b-gantt-taskeditor button:textEquals(Delete)', 'No delete button');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/9108
    t.it('Should not report isEditing if a listener cancels the editing', async(t) => {
        gantt = t.getGantt();

        await gantt.project.waitForPropagateCompleted();

        t.notOk(gantt.features.taskEdit.isEditing, 'Task edit not editing initially');

        gantt.on('beforeTaskEdit', () => false);

        await gantt.editTask(gantt.taskStore.rootNode.firstChild);

        t.notOk(gantt.features.taskEdit.isEditing, 'Task edit not editing');
    });

    // https://app.assembla.com/spaces/bryntum/tickets/8276
    t.it('Should support editing an unscheduled task', async t => {
        gantt = t.getGantt();

        const added = gantt.taskStore.rootNode.appendChild({ name : 'New task' });

        // run propagation to calculate new task fields
        await gantt.project.propagate();

        await gantt.editTask(added);

        t.chain(
            { waitForSelector : '.b-gantt-taskeditor' }
        );
    });

    t.it('Should not allow to set end before start date', t => {
        gantt = t.getGantt({
            project : t.getProject({
                calendar : 'general'
            })
        });

        const task = gantt.taskStore.getById(234);

        t.chain(
            { dblclick : '.b-gantt-task.id234' },

            { click : '.b-end-date .b-icon-angle-left' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0,
                desc    : 'End date changed, duration is 0'
            },

            { click : '.b-end-date .b-icon-angle-left' },

            { waitForPropagate : gantt },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0,
                desc    : 'End date intact, duration is 0'
            },

            { type : '[DOWN][TOP][ENTER]' },

            { waitForPropagate : gantt },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0,
                desc    : 'End date intact, duration is 0'
            },

            { click : '.b-end-date .b-icon-angle-right' },

            {
                waitFor : () => task.endDate.getTime() === new Date(2017, 1, 10).getTime() && task.duration === 1,
                desc    : 'End date chaged, duration is 1'
            }
        );
    });

    // https://github.com/bryntum/support/issues/95
    t.it('Start date result should match what is selected in the picker when default 24/7 calendar is used', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            columns : [
                { type : 'name', width : 200 },
                { type : 'startdate', width : 250, format : 'YYYY-MM-DD HH:mm' },
                { type : 'enddate', width : 250, format : 'YYYY-MM-DD HH:mm' }
            ],
            listeners : {
                beforeTaskEditShow({ editor }) {
                    editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
                    editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
                }
            }
        });

        let dateField;

        t.chain(
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-16 00:00)' },
            { dblClick : '.b-gantt-task.id11' },
            { waitForSelector : '.b-gantt-taskeditor .b-start-date' },
            next => {
                dateField = gantt.features.taskEdit.editor.widgetMap.startDateField;
                t.is(dateField.input.value, '2017-01-16 00:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 16));
                next();
            },
            { click : '.b-gantt-taskeditor .b-start-date .b-icon-calendar' },
            { click : '[aria-label="January 17, 2017"]' },
            next => {
                t.is(dateField.input.value, '2017-01-17 00:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 17));
                next();
            },
            { type : '[ENTER]' },
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-17 00:00)' }
        );
    });

    t.it('Start date result should match what is selected in the picker when business 8/5 calendar is used', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            columns : [
                { type : 'name', width : 200 },
                { type : 'startdate', width : 250, format : 'YYYY-MM-DD HH:mm' },
                { type : 'enddate', width : 250, format : 'YYYY-MM-DD HH:mm' }
            ],
            listeners : {
                beforeTaskEditShow({ editor }) {
                    editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
                    editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
                }
            },
            project : {
                calendar      : 'business',
                calendarsData : [{
                    id           : 'business',
                    name         : 'Business',
                    hoursPerDay  : 8,
                    daysPerWeek  : 5,
                    daysPerMonth : 20,
                    intervals    : [
                        {
                            recurrentStartDate : 'on Sat at 0:00',
                            recurrentEndDate   : 'on Mon at 0:00',
                            isWorking          : false
                        },
                        {
                            recurrentStartDate : 'every weekday at 12:00',
                            recurrentEndDate   : 'every weekday at 13:00',
                            isWorking          : false
                        },
                        {
                            recurrentStartDate : 'every weekday at 17:00',
                            recurrentEndDate   : 'every weekday at 08:00',
                            isWorking          : false
                        }
                    ]
                }]
            }
        });

        let dateField;

        t.chain(
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-16 08:00)' },
            { dblClick : '.b-gantt-task.id11' },
            { waitForSelector : '.b-gantt-taskeditor .b-start-date' },
            next => {
                dateField = gantt.features.taskEdit.editor.widgetMap.startDateField;
                t.is(dateField.input.value, '2017-01-16 08:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 16, 8));
                next();
            },
            { click : '.b-gantt-taskeditor .b-start-date .b-icon-calendar' },
            { click : '[aria-label="January 17, 2017"]' },
            next => {
                t.is(dateField.input.value, '2017-01-17 08:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 17, 8));
                next();
            },
            { type : '[ENTER]' },
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="startDate"]:textEquals(2017-01-17 08:00)' }
        );
    });

    t.it('End date result should match what is selected in the picker when default 24/7 calendar is used', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            columns : [
                { type : 'name', width : 200 },
                { type : 'startdate', width : 250, format : 'YYYY-MM-DD HH:mm' },
                { type : 'enddate', width : 250, format : 'YYYY-MM-DD HH:mm' }
            ],
            listeners : {
                beforeTaskEditShow({ editor }) {
                    editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
                    editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
                }
            }
        });

        let dateField;

        t.chain(
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-26 00:00)' },
            { dblClick : '.b-gantt-task.id11' },
            { waitForSelector : '.b-gantt-taskeditor .b-end-date' },
            next => {
                dateField = gantt.features.taskEdit.editor.widgetMap.endDateField;
                t.is(dateField.input.value, '2017-01-26 00:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 26));
                next();
            },
            { click : '.b-gantt-taskeditor .b-end-date .b-icon-calendar' },
            { click : '[aria-label="January 25, 2017"]' },
            next => {
                t.is(dateField.input.value, '2017-01-25 00:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 25));
                next();
            },
            { type : '[ENTER]' },
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-25 00:00)' }
        );
    });

    t.it('End date result should match what is selected in the picker when business 8/5 calendar is used', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            columns : [
                { type : 'name', width : 200 },
                { type : 'startdate', width : 250, format : 'YYYY-MM-DD HH:mm' },
                { type : 'enddate', width : 250, format : 'YYYY-MM-DD HH:mm' }
            ],
            listeners : {
                beforeTaskEditShow({ editor }) {
                    editor.widgetMap.startDateField.format = 'YYYY-MM-DD HH:mm';
                    editor.widgetMap.endDateField.format = 'YYYY-MM-DD HH:mm';
                }
            },
            project : {
                calendar      : 'business',
                calendarsData : [{
                    id           : 'business',
                    name         : 'Business',
                    hoursPerDay  : 8,
                    daysPerWeek  : 5,
                    daysPerMonth : 20,
                    intervals    : [
                        {
                            recurrentStartDate : 'on Sat at 0:00',
                            recurrentEndDate   : 'on Mon at 0:00',
                            isWorking          : false
                        },
                        {
                            recurrentStartDate : 'every weekday at 12:00',
                            recurrentEndDate   : 'every weekday at 13:00',
                            isWorking          : false
                        },
                        {
                            recurrentStartDate : 'every weekday at 17:00',
                            recurrentEndDate   : 'every weekday at 08:00',
                            isWorking          : false
                        }
                    ]
                }]
            }
        });

        let dateField;

        t.chain(
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-27 17:00)' },
            { dblClick : '.b-gantt-task.id11' },
            { waitForSelector : '.b-gantt-taskeditor .b-end-date' },
            next => {
                dateField = gantt.features.taskEdit.editor.widgetMap.endDateField;
                t.is(dateField.input.value, '2017-01-27 17:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 27, 17));
                next();
            },
            { click : '.b-gantt-taskeditor .b-end-date .b-icon-calendar' },
            { click : '[aria-label="January 26, 2017"]' },
            next => {
                t.is(dateField.input.value, '2017-01-26 17:00');
                t.isDateEqual(dateField.value, new Date(2017, 0, 26, 17));
                next();
            },
            { type : '[ENTER]' },
            { waitForSelector : '.b-grid-row[data-id=11] .b-grid-cell[data-column="endDate"]:textEquals(2017-01-26 17:00)' }
        );
    });

    t.it('Should not close on Save click if any field is invalid', async(t) => {
        gantt = t.getGantt();

        await gantt.project.waitForPropagateCompleted();

        gantt.taskStore.rootNode.firstChild.name = ''; // invalid
        await gantt.editTask(gantt.taskStore.rootNode.firstChild);

        gantt.features.taskEdit.save();

        t.ok(gantt.features.taskEdit.isEditing, 'Task edit still editing');
    });

    t.it('Should support disabling', t => {
        gantt = t.getGantt();

        gantt.features.taskEdit.disabled = true;

        t.chain(
            { dblClick : '.b-gantt-task' },

            next => {
                t.selectorNotExists('.b-popup', 'Editor not shown');

                gantt.features.taskEdit.disabled = false;

                next();
            },

            { dblClick : '.b-gantt-task' },

            () => {
                t.selectorExists('.b-popup', 'Editor shown');
            }
        );
    });

    t.it('autoSync', t => {
        let syncCallCount = 0;

        t.mockUrl('test-autosync-load', (url, params, options) => {
            const
                { body } = options,
                {
                    requestId
                }        = body;

            return {
                responseText : JSON.stringify({
                    success  : true,
                    revision : 1,
                    requestId,
                    tasks    : {
                        rows : t.getProjectTaskData()
                    },
                    calendars : {
                        rows : t.getProjectCalendarsData()
                    },
                    dependencies : {
                        rows : t.getProjectDependenciesData()
                    }
                })
            };
        });
        t.mockUrl('test-autosync-update', (url, params, options) => {
            const
                { body }    = options,
                {
                    requestId,
                    revision,
                    tasks
                }           = JSON.parse(body),
                { updated } = tasks;

            syncCallCount++;

            return {
                responseText : JSON.stringify({
                    success  : true,
                    revision : revision + tasks.length,
                    requestId,
                    tasks    : {
                        rows : updated.map(t => ({ id : t.id }))
                    }
                })
            };
        });

        gantt = t.getGantt({
            features : {
                taskTooltip : false
            },
            project : {
                autoSync  : true,
                transport : {
                    load : {
                        url       : 'test-autosync-load',
                        paramName : 'q'
                    },
                    sync : {
                        url : 'test-autosync-update'
                    }
                }
            }
        });

        t.chain(
            { drag : '[data-task-id="11"]', offset : ['100%-5', '50%'], by : [gantt.tickSize + 1, 0] },

            // The autoSync setting worked
            { waitFor : () => syncCallCount === 1 },

            { dblClick : '[data-task-id="11"]' },

            next => {
                t.selectorExists('.b-popup', 'Editor shown');
                next();
            },

            next => {
                t.click(gantt.features.taskEdit.editor.widgetMap.endDateField.triggers.forward.element, next);
            },

            // Syncing is on a timer, so wait for it to cycle
            { waitFor : gantt.project.autoSyncTimeout * 2 },

            next => {
                // That must not have synced.
                t.is(syncCallCount, 1);

                // Cancel editing
                t.click(gantt.features.taskEdit.editor.widgetMap.cancelButton.element, next);
            },

            // Syncing is on a timer, so wait for it to cycle
            { waitFor : gantt.project.autoSyncTimeout * 2 },

            next => {
                // That must not have synced.
                t.is(syncCallCount, 1);
                next();
            },

            // Try again, but clicking the Save button
            { dblClick : '[data-task-id="11"]' },

            next => {
                t.selectorExists('.b-popup', 'Editor shown');
                next();
            },

            next => {
                t.click(gantt.features.taskEdit.editor.widgetMap.endDateField.triggers.forward.element, next);
            },

            // Syncing is on a timer, so wait for it to cycle
            { waitFor : gantt.project.autoSyncTimeout * 2 },

            next => {
                // That must not have synced.
                t.is(syncCallCount, 1);

                // Cancel editing
                t.click(gantt.features.taskEdit.editor.widgetMap.saveButton.element, next);
            },

            // Syncing is on a timer, so wait for it to cycle
            { waitFor : gantt.project.autoSyncTimeout * 2 },

            () => {
                // That must have synced.
                t.is(syncCallCount, 2);
            }
        );
    });

    // https://github.com/bryntum/support/issues/132
    t.it('Should open editor for new task if double clicking other task while editor is already open', async t => {
        gantt = t.getGantt();

        const
            added  = gantt.taskStore.rootNode.appendChild({ name : 'New task' }),
            added2 = gantt.taskStore.rootNode.appendChild({ name : 'Foo' });

        // run propagation to calculate new task fields
        await gantt.project.propagate();

        await gantt.editTask(added);

        t.chain(
            { waitForSelector : '.b-gantt-taskeditor' },

            async() => gantt.editTask(added2),

            { waitFor : () => document.querySelector('.b-gantt-taskeditor input[name=name]').value === 'Foo' },

            // Also should detach from project and not listen to propagation events if hidden
            // https://github.com/bryntum/support/issues/446
            async() => {
                await gantt.features.taskEdit.save();
                added2.remove();
            }
        );
    });

    t.it('Should close editor task if the edited task is removed while open', async t => {
        gantt = t.getGantt();

        const added = gantt.taskStore.rootNode.appendChild({ name : 'New task' });

        // run propagation to calculate new task fields
        await gantt.project.propagate();

        await gantt.editTask(added);

        t.chain(
            async() => added.remove(),

            { waitForSelectorNotFound : '.b-gantt-taskeditor' }
        );
    });

    // https://github.com/bryntum/support/issues/156
    t.it('Should be able to edit name of unscheduled task with Save button', async t => {
        gantt = t.getGantt();

        gantt.taskStore.removeAll();

        const added = gantt.taskStore.rootNode.appendChild({ name : 'New' });

        // run propagation to calculate new task fields and scroll it into view
        await gantt.project.propagate();
        await gantt.scrollTaskIntoView(added);

        await gantt.editTask(added);

        t.chain(
            { waitForSelector : '.b-gantt-taskeditor' },

            { click : 'input[name=name]' },
            { type : 'foo' },
            { click : '.b-button:textEquals(Save)' },
            { waitForSelectorNotFound : '.b-gantt-taskeditor' },

            () => t.is(added.name, 'Newfoo')
        );
    });

    // test for fix of https://github.com/bryntum/support/issues/166 Cannot save unscheduled task with ENTER key #166
    t.it('Should be able to edit name of unscheduled task using ENTER', async t => {
        gantt = t.getGantt();

        gantt.taskStore.removeAll();

        const added = gantt.taskStore.rootNode.appendChild({ name : 'New' });

        // run propagation to calculate new task fields and scroll it into view
        await gantt.project.propagate();
        await gantt.scrollTaskIntoView(added);

        await gantt.editTask(added);

        t.chain(
            { waitForSelector : '.b-gantt-taskeditor' },

            { click : 'input[name=name]' },
            { type : 'foo[ENTER]' },
            { waitForSelectorNotFound : '.b-gantt-taskeditor' },

            () => t.is(added.name, 'Newfoo')
        );
    });

    // fix for https://github.com/bryntum/support/issues/155
    t.it('Task editor should be placed correctly for unscheduled task', async t => {
        gantt = t.getGantt();
        let addedTask;
        await gantt.project.propagate();

        t.chain(
            { dblClick : '.b-gantt-task.id1000' },
            { waitForSelector : '.b-taskeditor' },
            async() => {
                // TaskEditor should be centered and aligned to task bottom
                const
                    editRect = t.rect('.b-gantt-taskeditor'),
                    taskRect = t.rect('.b-gantt-task');

                t.isApprox(editRect.left, taskRect.left - (editRect.width - taskRect.width) / 2, 1, 'Correct left position');
                t.isApprox(editRect.top, taskRect.bottom, 3, 'Correct left position');
            },
            { type : '[ESC]' },
            { waitForSelectorNotFound : '.b-gantt-taskeditor' },

            async() => {
                gantt.taskStore.removeAll();
                addedTask = gantt.taskStore.rootNode.appendChild({ name : 'New 1' });
                await gantt.project.propagate();
                await gantt.editTask(addedTask);
            },
            { waitForSelector : '.b-gantt-taskeditor' },
            () => {
                // TaskEditor should be centered to gantt
                const
                    editRect  = t.rect('.b-gantt-taskeditor'),
                    ganttRect = t.rect('.b-ganttbase');
                t.isApprox(editRect.left, (ganttRect.width - editRect.width) / 2, 1, 'Correct left position');
                t.isApprox(editRect.top, (ganttRect.height - editRect.height) / 2, 1, 'Correct top position');
            }
        );
    });

    // fix for https://github.com/bryntum/support/issues/154
    t.it('Task editor should allow to type in Duration for unscheduled task', async t => {
        gantt = t.getGantt();

        const added = gantt.taskStore.rootNode.appendChild({ name : 'New' });

        // run propagation to calculate new task fields and scroll it into view
        await gantt.project.propagate();
        await gantt.scrollTaskIntoView(added);

        await gantt.editTask(added);

        const
            widgetMap = gantt.features.taskEdit.editor.widgetMap;
        t.chain(
            { waitForSelector : '.b-gantt-taskeditor' },
            { click : '.b-tabpanel-tab-title:contains(Advanced)' },
            { click : widgetMap.constraintTypeField.triggers.expand.element, desc : 'Click expand constraints combo' },
            { click : '.b-list-item:contains(Must start on)', desc : 'Clicking Must start on item' },
            { click : '.b-tabpanel-tab-title:contains(General)' },
            { click : widgetMap.fullDurationField.input },
            { type : '1', clearExisting : true },
            () => t.isDeeply(widgetMap.fullDurationField.value, new Duration(1, 'day'), 'Correct value for duration field "1 day"')
        );
    });

    // https://github.com/bryntum/support/issues/429
    t.it('Should hide task editor if project is reloaded while open', async t => {
        t.mockUrl('load', (url, params, options) => {
            return {
                responseText : JSON.stringify({
                    success  : true,
                    revision : 1,
                    tasks    : {
                        rows : t.getProjectTaskData()
                    },
                    calendars : {
                        rows : t.getProjectCalendarsData()
                    },
                    dependencies : {
                        rows : t.getProjectDependenciesData()
                    }
                })
            };
        });

        gantt = t.getGantt({
            project : {
                transport : {
                    load : {
                        url : 'load'
                    }
                }
            }
        });

        await gantt.editTask(gantt.project.firstChild);

        await gantt.project.load();

        t.selectorNotExists('.b-taskeditor');
    });

    // https://github.com/bryntum/support/issues/649
    t.it('Should trigger sync upon task deletion if autoSync is true', async t => {
        t.mockUrl('sync', () => {
            return {
                responseText : JSON.stringify({
                    success : true
                })
            };
        });
        gantt = t.getGantt({
            project : {
                autoSync  : true,
                transport : {
                    sync : {
                        url : 'sync'
                    }
                }
            }
        });

        const spy = t.spyOn(gantt.project, 'sync');

        await gantt.editTask(gantt.project.firstChild.firstChild);
        await t.click('.b-button:contains(Delete)');

        t.expect(spy).toHaveBeenCalled();
    });

    // https://www.bryntum.com/forum/viewtopic.php?f=52&t=13770&p=72720#p72720
    t.it('Should not create new stores after changing value which causes propagation', async t => {
        gantt = t.getGantt();

        const project = gantt.project,
            task = project.firstChild.firstChild.firstChild;

        await gantt.editTask(task);

        const editor = gantt.features.taskEdit.getEditor(),
            resourceGrid       = editor.widgetMap.resourcestab.widgetMap['resourcestab-grid'],
            resourceComboStore = resourceGrid.columns.get('resource').editor.store;

        await t.click('[data-ref=fullDurationField] .b-spin-up');
        await project.waitForPropagateCompleted();

        t.is(resourceGrid.columns.get('resource').editor.store, resourceComboStore);
    });

    // https://github.com/bryntum/support/issues/1093
    t.it('Event editor start and end date fields should respect weekStartDay config', t => {
        gantt = t.getGantt({
            weekStartDay : 1
        });

        t.chain(
            { doubleClick : '[data-task-id="11"]' },
            { click : '[data-ref="startDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
                desc            : 'Start date picker week starts with correct day'
            },
            { click : '[data-ref="endDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
                desc            : 'End date picker week starts with correct day'
            }
        );
    });

    t.it('Event editor start and end date fields should respect DateHelper.weekStartDay config', t => {
        gantt = t.getGantt();

        t.chain(
            { doubleClick : '[data-task-id="11"]' },
            { click : '[data-ref="startDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
                desc            : 'Start date picker week starts with correct day'
            },
            { click : '[data-ref="endDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
                desc            : 'End date picker week starts with correct day'
            }
        );
    });
});
