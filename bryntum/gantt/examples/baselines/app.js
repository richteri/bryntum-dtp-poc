/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import DateHelper from '../../lib/Core/helper/DateHelper.js';
import Panel from '../../lib/Core/widget/Panel.js';
import Gantt from '../../lib/Gantt/view/Gantt.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import '../../lib/Grid/feature/Filter.js';
import '../../lib/Gantt/column/WBSColumn.js';
import '../../lib/Gantt/feature/Baselines.js';
import '../../lib/Gantt/feature/Labels.js';
import '../../lib/Gantt/feature/ProjectLines.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';
import '../../lib/Gantt/feature/TaskEdit.js';

function setBaseline(index) {
    gantt.taskStore.setBaseline(index);
}

function toggleBaselineVisible(index, visible) {
    gantt.element.classList[visible ? 'remove' : 'add'](`b-hide-baseline-${index}`);
}

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    project : project,

    columns : [
        { type : 'wbs' },
        { type : 'name' }
    ],

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    // Allow extra space for baseline(s)
    rowHeight : 60,

    features : {
        baselines : {
            template(data) {
                const me = this,
                    { baseline } = data,
                    { task } = baseline,
                    delayed = task.startDate > baseline.startDate,
                    overrun = task.durationMS > baseline.durationMS;

                let { decimalPrecision } = me;

                if (decimalPrecision == null) {
                    decimalPrecision = me.client.durationDisplayPrecision;
                }

                const multiplier = Math.pow(10, decimalPrecision),
                    displayDuration = Math.round(baseline.duration * multiplier) / multiplier;

                return `
                    <div class="b-gantt-task-title">${task.name} (${me.L('baseline')} ${baseline.parentIndex + 1})</div>
                    <table>
                    <tr><td>${me.L('Start')}:</td><td>${data.startClockHtml}</td></tr>
                    ${baseline.milestone ? '' :   `
                        <tr><td>${me.L('End')}:</td><td>${data.endClockHtml}</td></tr>
                        <tr><td>${me.L('Duration')}:</td><td class="b-right">${displayDuration + ' ' + DateHelper.getLocalizedNameOfUnit(baseline.durationUnit, baseline.duration !== 1)}</td></tr>
                    `}
                    </table>
                    ${delayed ? `
                        <h4 class="statusmessage b-baseline-delay"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>${me.L('Delayed start by')} ${DateHelper.formatDelta(task.startDate - baseline.startDate)}</h4>
                    ` : ''}
                    ${overrun ? `
                        <h4 class="statusmessage b-baseline-overrun"><i class="statusicon b-fa b-fa-exclamation-triangle"></i>${me.L('Overrun by')} ${DateHelper.formatDelta(task.durationMS - baseline.durationMS)}</h4>
                    ` : ''}
                    `;
            }
        },
        columnLines    : false,
        filter         : true,
        labels         : {
            left : {
                field  : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        }
    }
});

const panel = new Panel({
    adopt  : 'container',
    flex   : 1,
    layout : 'fit',
    items  : [
        gantt
    ],
    tbar : {
        items : [
            {
                cls       : 'b-blue',
                type      : 'button',
                text      : 'Set baseline',
                icon      : 'b-fa-bars',
                iconAlign : 'end',
                menu      : [{
                    text : 'Set baseline 1',
                    onItem() {
                        setBaseline(1);
                    }
                }, {
                    text : 'Set baseline 2',
                    onItem() {
                        setBaseline(2);
                    }
                }, {
                    text : 'Set baseline 3',
                    onItem() {
                        setBaseline(3);
                    }
                }]
            },
            {
                cls       : 'b-blue',
                type      : 'button',
                text      : 'Show baseline',
                icon      : 'b-fa-bars',
                iconAlign : 'end',
                menu      : [{
                    checked : true,
                    text    : 'Baseline 1',
                    onToggle({ checked }) {
                        toggleBaselineVisible(1, checked);
                    }
                }, {
                    checked : true,
                    text    : 'Baseline 2',
                    onToggle({ checked }) {
                        toggleBaselineVisible(2, checked);
                    }
                }, {
                    checked : true,
                    text    : 'Baseline 3',
                    onToggle({ checked }) {
                        toggleBaselineVisible(3, checked);
                    }
                }]
            },
            {
                cls        : 'b-blue',
                type       : 'checkbox',
                text       : 'Show baselines',
                checked    : true,
                toggleable : true,
                onAction({ checked }) {
                    gantt.features.baselines.disabled = !checked;
                }
            }
        ]
    }
});

project.load();
