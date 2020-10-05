/**
 * Angular advanced demo test
 */
describe('Test buttons', function(t) {
    const
        panel   = bryntum.query('panel'),
        gantt   = bryntum.query('gantt'),
        buttons = panel.tbar.widgetMap;

    !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy();

    t.it('Check toolbar buttons', (t) => {

        t.willFireNTimes(gantt, 'presetchange', 3);
        t.willFireNTimes(gantt, 'timeaxischange', 5);

        const
            checkToolTip = (t, button, text, x, y, width, height) => [
                { moveMouseTo : button.element },
                { waitForSelector : `.b-tooltip:contains(${text})`, desc : 'Correct tooltip shown' },
                (next) => {
                    const bounds = document.querySelector('.b-tooltip').getBoundingClientRect();
                    t.isApprox(bounds.left, x, 3, 'Correct tooltip x');
                    t.isApprox(bounds.top, y, 3, 'Correct tooltip y');
                    t.isApprox(bounds.width, width, 3, 'Correct tooltip width');
                    t.isApprox(bounds.height, height, 3, 'Correct tooltip height');
                    next();
                }
            ];

        t.chain(
            checkToolTip(t, buttons.addTaskButton, 'Create new task', 0, 43, 127, 47),

            checkToolTip(t, buttons.editTaskButton, 'Edit selected task', 87, 43, 135, 47),

            { click : buttons.addTaskButton.element },

            { waitForSelector : 'input:focus' },

            // Create task with name foo
            { type : 'foo[ENTER]' },

            // Open task editor
            { click : buttons.editTaskButton.element },

            // rename task to bar
            { type : '[BACKSPACE][BACKSPACE][BACKSPACE]bar', target : '[name=\'name\']' },

            { click : ':textEquals(Save)' },

            (next) => {
                t.selectorNotExists('.b-grid-cell:textEquals(foo)');
                t.selectorExists('.b-grid-cell:textEquals(bar)');
                next();
            },

            { click : buttons.collapseAllButton.element },

            (next) => {
                t.is(gantt.taskStore.find(task => !task.isLeaf && task.parent === gantt.taskStore.rootNode && task.isExpanded(gantt.taskStore)), null, 'No expanded nodes found');
                next();
            },

            { click : buttons.expandAllButton.element },

            (next) => {
                t.is(gantt.taskStore.find(task => !task.isLeaf && task.parent === gantt.taskStore.rootNode && !task.isExpanded(gantt.taskStore)), null, 'No collapsed nodes found');
                next();
            },

            // These should trigger 1 timeaxischange each
            { click : buttons.zoomInButton.element },

            { click : buttons.zoomOutButton.element },

            { click : buttons.zoomToFitButton.element },

            { click : buttons.previousButton.element },

            { click : buttons.nextButton.element }

        ); // eo chain
    }); // eo it('Check toolbar buttons')

    t.it('Should support turning features on and off', (t) => {
        t.chain(
            { click : buttons.featuresButton.element },

            // dependencies
            { click : '.b-menu-text:textEquals(Draw dependencies)' },
            { waitForSelectorNotFound : '.b-sch-dependency' },
            { click : '.b-menu-text:textEquals(Draw dependencies)' },
            { waitForSelector : '.b-sch-dependency' },
            // eof dependencies

            // labels
            { click : '.b-menu-text:textEquals(Task labels)' },
            { waitForSelectorNotFound : '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label' },
            { click : '.b-menu-text:textEquals(Task labels)' },
            { waitForSelector : '.b-gantt-task-wrap .b-sch-label' },
            // eo labels

            // project lines
            { click : '.b-menu-text:textEquals(Project lines)' },
            (next) => {
                t.selectorNotExists('.b-gantt-project-line:textEquals(Project start)');
                next();
            },
            { click : '.b-menu-text:textEquals(Project lines)' },
            (next) => {
                t.selectorExists('.b-gantt-project-line:textEquals(Project start)');
                next();
            },
            // eo project lines

            // non-working time
            { click : '.b-menu-text:textEquals(Highlight non-working time)' },
            (next) => {
                t.selectorNotExists('.b-sch-nonworkingtime');
                next();
            },
            { click : '.b-menu-text:textEquals(Highlight non-working time)' },
            (next) => {
                t.selectorExists('.b-sch-nonworkingtime');
                next();
            },
            // eo non-working time

            // schedule collapsing
            { click : '.b-menu-text:textEquals(Hide schedule)' },
            (next) => {
                t.ok(gantt.subGrids.normal.collapsed, 'Schedule collapsed');
                next();
            },
            { click : '.b-menu-text:textEquals(Hide schedule)' },

            () => {
                t.notOk(gantt.subGrids.normal.isCollapsed, 'Schedule expanded');
            }
            // eo schedule collapsing

        ); // eo chain

    }); // eo it('should support turning features on and off')

    t.it('Gantt should fill the whole width of container', t => {
        let
            gantt = document.querySelector('.b-panel-content'),
            containerWidth = getComputedStyle(gantt).width,
            ganttWidth = getComputedStyle(document.querySelector('.b-gantt')).width
        ;

        t.is(ganttWidth, containerWidth, 'Gantt fills the container width');

    }); // eo t.it('Gantt should fill the whole width of container')

}); // eo describe Test buttons

// eof
