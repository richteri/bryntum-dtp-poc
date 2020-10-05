import '../../lib/Gantt/column/AddNewColumn.js';
import '../../lib/Gantt/column/CalendarColumn.js';
import '../../lib/Gantt/column/ConstraintDateColumn.js';
import '../../lib/Gantt/column/ConstraintTypeColumn.js';
import '../../lib/Gantt/column/DeadlineDateColumn.js';
import '../../lib/Gantt/column/DurationColumn.js';
import '../../lib/Gantt/column/EarlyStartDateColumn.js';
import '../../lib/Gantt/column/EarlyEndDateColumn.js';
import '../../lib/Gantt/column/EndDateColumn.js';
import '../../lib/Gantt/column/EffortColumn.js';
import '../../lib/Gantt/column/EventModeColumn.js';
import '../../lib/Gantt/column/LateStartDateColumn.js';
import '../../lib/Gantt/column/LateEndDateColumn.js';
import '../../lib/Gantt/column/ManuallyScheduledColumn.js';
import '../../lib/Gantt/column/MilestoneColumn.js';
import '../../lib/Gantt/column/NameColumn.js';
import '../../lib/Gantt/column/NoteColumn.js';
import '../../lib/Gantt/column/PercentDoneColumn.js';
import '../../lib/Gantt/column/PredecessorColumn.js';
import '../../lib/Gantt/column/ResourceAssignmentColumn.js';
import '../../lib/Gantt/column/RollupColumn.js';
import '../../lib/Gantt/column/SchedulingModeColumn.js';
import '../../lib/Gantt/column/SequenceColumn.js';
import '../../lib/Gantt/column/ShowInTimelineColumn.js';
import '../../lib/Gantt/column/StartDateColumn.js';
import '../../lib/Gantt/column/SuccessorColumn.js';
import '../../lib/Gantt/column/TotalSlackColumn.js';
import '../../lib/Gantt/column/WBSColumn.js';
import LocaleManager from '../../lib/Core/localization/LocaleManager.js';

StartTest(t => {

    //All locales are preloaded via alsoPreload in tests/index.js
    function applyLocale(t, name) {
        t.diag(`Applying locale ${name}`);
        return LocaleManager.locale = window.bryntum.locales[name];
    }

    t.beforeEach((t, next) => {
        // Wait for locales to load
        t.waitFor(() => window.bryntum.locales, next);
    });

    t.it('Should localize AddNewColumn dynamically', t => {
        const gantt = t.getGantt({
            appendTo : document.body,
            columns  : [
                { type : 'addnew' }
            ]
        });

        const addNewColumn = gantt.columns.getAt(1);

        Object.keys(window.bryntum.locales).forEach(name => {
            t.describe(`${name} locale is ok`, t => {
                const
                    locale      = applyLocale(t, name),
                    columnCombo = addNewColumn.columnCombo;
                t.is(columnCombo.placeholder, locale.AddNewColumn['New Column'], 'combobox placeholder is translated');

                t.chain(
                    { waitForRowsVisible : gantt },

                    { click : columnCombo.input },

                    () => {
                        t.isDeeply(
                            columnCombo.picker.store.records.map(r => ({ id : r.id, text : r.text })),
                            [
                                { id : 'percentdone',           text : locale.PercentDoneColumn['% Done'] },
                                { id : 'resourceassignment',    text : locale.ResourceAssignmentColumn['Assigned Resources'] },
                                { id : 'calendar',              text : locale.CalendarColumn.Calendar },
                                { id : 'constraintdate',        text : locale.ConstraintDateColumn['Constraint Date'] },
                                { id : 'constrainttype',        text : locale.ConstraintTypeColumn['Constraint Type'] },
                                { id : 'deadlinedate',          text : locale.DeadlineDateColumn.Deadline },
                                { id : 'duration',              text : locale.DurationColumn.Duration },
                                { id : 'earlyenddate',          text : locale.EarlyEndDateColumn['Early End'] },
                                { id : 'earlystartdate',        text : locale.EarlyStartDateColumn['Early Start'] },
                                { id : 'effort',                text : locale.EffortColumn.Effort },
                                { id : 'eventmode',             text : locale.EventModeColumn['Event mode'] },
                                { id : 'enddate',               text : locale.EndDateColumn.Finish },
                                { id : 'lateenddate',           text : locale.LateEndDateColumn['Late End'] },
                                { id : 'latestartdate',         text : locale.LateStartDateColumn['Late Start'] },
                                { id : 'manuallyscheduled',     text : locale.ManuallyScheduledColumn['Manually scheduled'] },
                                { id : 'milestone',             text : locale.MilestoneColumn.Milestone },
                                { id : 'note',                  text : locale.NoteColumn.Note },
                                { id : 'predecessor',           text : locale.PredecessorColumn.Predecessors },
                                { id : 'rollup',                text : locale.RollupColumn.Rollup },
                                { id : 'schedulingmodecolumn',  text : locale.SchedulingModeColumn['Scheduling Mode'] },
                                { id : 'sequence',              text : locale.SequenceColumn.Sequence },
                                { id : 'showintimeline',        text : locale.ShowInTimelineColumn['Show in timeline'] },
                                { id : 'startdate',             text : locale.StartDateColumn.Start },
                                { id : 'successor',             text : locale.SuccessorColumn.Successors },
                                { id : 'totalslack',            text : locale.TotalSlackColumn['Total Slack'] },
                                { id : 'wbs',                   text : locale.WBSColumn.WBS }
                            ].sort((a, b) => a.text < b.text ? -1 : 1),
                            'Combobox has all the columns translated and sorted');
                    }
                );
            });
        });
    });
});
