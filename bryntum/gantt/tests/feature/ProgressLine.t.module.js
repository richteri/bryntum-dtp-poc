import { ProjectModel } from '../../build/gantt.module.js';

StartTest(t => {
    let gantt, lineFeature;

    const statusDate = new Date(2019, 1, 4);

    // In some tests we do live updates of the view and try to use common assertion methods which rely on data.
    // Since data is not always updated we use this dates cache to let test know of the desired data state.
    // e.g. when we drag task over status date and do not release mouse button
    let dateOverrides;

    t.beforeEach(function() {
        gantt && gantt.destroy();

        dateOverrides = {};
    });

    function id(id) {
        return gantt.taskStore.getById(id);
    }

    function processLineBox(el) {
        const currentLineBox = t.getSVGBox(el),
            result         = {
                y1 : currentLineBox.top,
                y2 : currentLineBox.bottom
            },
            currentAttrs   = {
                x1 : parseInt(el.getAttribute('x1'), 10),
                y1 : parseInt(el.getAttribute('y1'), 10),
                x2 : parseInt(el.getAttribute('x2'), 10),
                y2 : parseInt(el.getAttribute('y2'), 10)
            };

        if (currentAttrs.x2 < currentAttrs.x1) {
            result.x1 = currentLineBox.right;
            result.x2 = currentLineBox.left;
        }
        else {
            result.x1 = currentLineBox.left;
            result.x2 = currentLineBox.right;
        }

        return result;
    }

    function assertLine(t, box1, box2) {
        const result = Object.keys(box1).every(key => {
            return Math.abs(Math.round(box1[key]) - Math.round(box2[key])) <= 1;
        });

        if (result) {
            t.ok('Line segment is ok');
        }
        else {
            t.isDeeply(box1, box2);
        }
    }

    function assertTaskLines(t, task) {
        t.diag('Asserting lines for task ' + task.name);

        const scrollLeft  = gantt.scrollLeft,
            rowEl       = gantt.getRowFor(task).elements.normal,
            rowBox      = rowEl.getBoundingClientRect(),
            maxX        = rowEl.querySelector('.b-sch-timeaxis-cell').getBoundingClientRect().right,
            statusDateX = gantt.getCoordinateFromDate(lineFeature.statusDate),
            statusLineX = (statusDateX === -1 ? gantt.timeAxisViewModel.totalSize : statusDateX) - scrollLeft + gantt.subGrids.normal.element.getBoundingClientRect().left,
            lines       = document.querySelectorAll(`.b-gantt-progress-line[data-task-id="${task.id}"]`);

        // if the task should be rendered as a vertical Status line
        if (lineFeature.isStatusLineTask(task, dateOverrides[task.id])) {
            const
                element       = gantt.getElementFromTaskRecord(task),
                progressBarEl = element.querySelector('.b-gantt-task-percent'),
                barBox        = progressBarEl.getBoundingClientRect(),
                linePoint     = {
                    x : Math.min(barBox.right, maxX),
                    y : barBox.top + barBox.height / 2
                },
                lineBox1      = processLineBox(lines[0]),
                lineBox2      = processLineBox(lines[1]),
                expectedBox1  = {
                    x1 : statusLineX,
                    y1 : rowBox.top,
                    x2 : linePoint.x,
                    y2 : linePoint.y
                },
                expectedBox2  = {
                    x1 : linePoint.x,
                    y1 : linePoint.y,
                    x2 : statusLineX,
                    y2 : rowBox.bottom
                };

            assertLine(t, lineBox1, expectedBox1);
            assertLine(t, lineBox2, expectedBox2);

            t.is(lines.length, 2, 'Correct amount of lines for task');
        }
        else {
            // x2 - status date x, y2 - row bottom
            assertLine(t, processLineBox(lines[0]), {
                x1 : statusLineX,
                y1 : rowBox.top,
                x2 : statusLineX,
                y2 : rowBox.bottom
            });
            t.is(lines.length, 1, 'Correct amount of lines for task');
        }
    }

    function assertLines(t) {
        t.subTest('Asserting all the lines', t => {
            let tasks = gantt.taskStore.getRange(),
                lines = document.querySelectorAll('.b-gantt-progress-line'),
                count = 0;

            tasks.forEach(task => {
                if (gantt.getRowFor(task)) {
                    assertTaskLines(t, task);
                    count += lineFeature.isStatusLineTask(task, dateOverrides[task.id]) ? 2 : 1;
                }
            });

            t.is(count, lines.length, 'All lines are checked');
        });
    }

    async function setup(config) {
        config = config || {};

        gantt = t.getGantt(Object.assign({
            appendTo : document.body,
            features : {
                progressLine : { statusDate }
            },
            startDate : '2019-01-12',
            endDate   : '2019-03-24',
            project   : new ProjectModel({
                transport : {
                    load : {
                        url : '../examples/_datasets/launch-saas.json'
                    }
                }
            }),
            taskRenderer : ({ taskRecord, tplData }) => {
                tplData.cls.add(`id${taskRecord.id}`);
            }
        }, config));

        lineFeature = gantt.features.progressLine;

        await gantt.project.load();
    }

    t.it('Should draw project line', async t => {
        await setup();

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line' },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.collapse(id(2));
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.expand(id(2));
            },
            next => {
                assertLines(t);
            }
        );
    });

    t.it('Tasks are reachable under progress line', async t => {
        await setup();

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line', desc : 'Progress line found' },
            next => {
                assertLines(t);
                next();
            },
            {
                drag       : '.id12 .b-gantt-task-percent',
                fromOffset : ['100%', '50%'],
                by         : [25, 0],
                desc       : 'Drag task by the progress line'
            },
            function() {
                t.is(id(12).startDate, new Date(2019, 0, 15), 'Task dragged correctly');
            }
        );
    });

    t.it('Progress line should react on task store events', async t => {
        await setup();

        let task = id(21),
            linesCount;

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line', desc : 'Progress line found' },
            next => {
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setPercentDone(50);
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setPercentDone(0);
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setStartDate(new Date(2019, 0, 24));
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setEndDate(new Date(2019, 0, 30));
            },
            next => {
                assertLines(t);

                linesCount = document.querySelectorAll('.b-gantt-progress-line').length;
                t.waitForEvent(gantt, 'progressLineDrawn', next);
                // make sure the event still ends on the same date, by increasing the incoming dependency lag
                // this in turn ensures that only directly related progress lines will change
                id(22).duration = 0;
                Array.from(id(22).incomingDeps)[0].setLag(1);
            },
            next => {
                t.is(document.querySelectorAll('.b-gantt-progress-line').length, linesCount - 1, 'One line is removed');
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                task.setPercentDone(100);
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);

                id(2).appendChild([
                    {
                        id          : 26,
                        startDate   : '2019-06-17',
                        duration    : 5,
                        percentDone : 40
                    },
                    {
                        id          : 27,
                        startDate   : '2019-06-18',
                        duration    : 0,
                        percentDone : 0
                    },
                    {
                        id          : 28,
                        startDate   : '2019-06-17',
                        duration    : 5,
                        percentDone : 40
                    }
                ]);
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.taskStore.remove(id(26));
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progressLineDrawn', next);
                gantt.taskStore.remove([id(27), id(28)]);
            },

            next => {
                assertLines(t);
            }
        );
    });

    t.it('Progress line should react to view changes', async t => {
        await setup({
            height : 300
        });

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line', desc : 'Progress line found' },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progresslinedrawn', next);
                gantt.shiftPrevious();
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollEnd', next);
                gantt.zoomOut();
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollEnd', next);
                gantt.setViewPreset('weekAndDayLetter', new Date(2019, 0, 13), new Date(2019, 0, 27));
            },
            next => {
                assertLines(t);

                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollend', next);
                gantt.zoomOut();
            },
            next => {
                assertLines(t);

                t.waitFor(function() {
                    return gantt.scrollTop === 100;
                }, function() {
                    t.waitForEvent(gantt, 'progresslinedrawn', next);
                    id(12).setStartDate(new Date(2019, 0, 17));

                });

                gantt.scrollTop = 100;
            },
            () => {
                assertLines(t);
            }
        );
    });

    t.it('Should draw line correctly on vertical scroll', async t => {
        await setup();

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line' },
            { waitFor : 1000 },
            next => {
                assertLines(t);

                t.waitForEvent(gantt, 'progresslinedrawn', next);
                gantt.scrollTop = 800;
            },

            next => {
                assertLines(t);
            }
        );
    });

    t.it('Progress line is updated on drag', async t => {
        await setup({
            features : {
                progressLine : { statusDate },
                taskTooltip  : false
            }
        });

        let lineEl;

        function assertLineIsTop() {
            const box = t.getSVGBox(lineEl);

            t.is(document.elementFromPoint(Math.round(box.left), Math.round(box.top)), lineEl, 'Line is on top');
        }

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line' },
            // TODO: Remvove when FF release version 68 with fixed canelAnimationFrame
            { waitFor : 100 },
            next => {
                lineEl = document.querySelectorAll('.b-gantt-progress-line[data-task-id="11"]')[1];
                lineEl.style.pointerEvents = 'all';

                assertLineIsTop();

                next();
            },
            { moveMouseTo : '.b-gantt-task.id11', offset : [10, '50%'] },
            next => {
                assertLineIsTop();
                next();
            },
            { click : '.b-gantt-task.id11', offset : [10, '50%'] },
            next => {
                assertLineIsTop();
                next();
            },
            { drag : '.b-gantt-task.id11', offset : [20, '50%'], by : [100, 0], dragOnly : true },
            next => {
                assertLines(t);
                next();
            },
            { mouseUp : null },
            { drag : '.b-gantt-task.id15', by : [gantt.tickSize * 7, 0], dragOnly : true },
            next => {
                dateOverrides[15] = new Date(2019, 1, 4);
                assertLines(t);
                next();
            },
            { moveMouseBy : [gantt.tickSize, 0] },
            next => {
                dateOverrides[15] = new Date(2019, 1, 5);
                assertLines(t);
                next();
            },
            { mouseUp : null }
        );
    });

    t.it('Progress line works properly on a large time axis', async t => {
        await setup();

        t.chain(
            { waitForPropagate : gantt },
            next => {
                t.waitForEvent(gantt.subGrids.normal.scrollable, 'scrollend', next);
                gantt.viewPreset = 'weekAndDay';
            },
            async() => {
                t.diag('Scroll task 11 to view');

                await gantt.scrollTaskIntoView(id(11));
            },

            // Rendering in response to scroll is async
            { waitForAnimationFrame : null },

            next => {
                assertLines(t);
                next();
            },

            next => {
                t.diag('Scroll task 4015 to view');

                t.waitForEvent(gantt, 'progresslinedrawn', next);
                gantt.scrollTaskIntoView(id(4015));
            },

            // Rendering in response to scroll is async
            { waitForAnimationFrame : null },

            () => {
                assertLines(t);
            }
        );
    });

    t.it('Progress line could be changed', async t => {
        await setup();

        const date = new Date(2019, 1, 6);

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line' },
            next => {
                t.waitForEvent(gantt, 'progresslinedrawn', next);
                lineFeature.statusDate = date;
            },
            next => {
                t.is(lineFeature.statusDate, date, 'Status date changed');
                assertLines(t);
            }
        );
    });

    t.it('Should support disabling', async t => {
        await setup();

        gantt.features.progressLine.disabled = true;

        t.selectorNotExists('.b-gantt-progress-line', 'No progress line');

        gantt.features.progressLine.disabled = false;

        t.chain(
            { waitForSelector : '.b-gantt-progress-line', desc : 'Progress line found' }
        );
    });

    t.it('Should redraw progress line after cancelled drag drop', async t => {
        await setup();

        t.chain(
            { waitForPropagate : gantt },
            { waitForSelector : '.b-gantt-progress-line', desc : 'Progress line found' },
            {
                drag     : '.id11.b-gantt-task',
                by       : [100, 0],
                dragOnly : true
            },
            { type : '[ESC]' },

            function() {
                assertLines(t);
            }
        );
    });

    t.it('Should not crash if schedule subgrid is collapsed', async t => {
        console.log = () => {};

        gantt = t.getGantt({
            features : {
                progressLine : true
            },
            subGridConfigs : {
                locked : {
                    flex : 1
                },
                normal : {
                    collapsed : true
                }
            }
        });

        t.chain(
            { waitForPropagate : gantt },

            async() => t.pass('no crash'),
            async() => gantt.subGrids.normal.expand(),

            { waitForSelector : '.b-gantt-progress-line' }
        );
    });
});
