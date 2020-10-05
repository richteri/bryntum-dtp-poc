import { Gantt, ProjectModel, WidgetHelper, DateHelper } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

function reconfigureGantt({ source }) {
    gantt.blockRefresh = true;
    gantt.features.labels.setConfig(source.featureSpec);
    gantt.rowHeight = source.rowHeight;
    gantt.barMargin = source.barMargin;
    gantt.blockRefresh = false;
    gantt.refresh(true);
}

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const
    topLabel = {
        field  : 'name',
        editor : {
            type : 'textfield'
        }
    },
    bottomLabel  = {
        field    : 'startDate',
        renderer : function({ taskRecord }) {
            return DateHelper.format(taskRecord.startDate, 'DD-MMM-Y');
        }
    },
    leftLabel    = {
        renderer : function({ taskRecord }) {
            return 'Id: ' + taskRecord.id;
        }
    },
    rightLabel   = {
        renderer : function({ taskRecord }) {
            return taskRecord.duration + ' ' + DateHelper.getLocalizedNameOfUnit(taskRecord.durationUnit, taskRecord.duration !== 1);
        }
    },
    [buttons] = WidgetHelper.append([
        {
            type  : 'buttonGroup',
            items : [
                {
                    text        : 'Top + Bottom',
                    toggleGroup : 'labels',
                    listeners   : {
                        toggle : reconfigureGantt
                    },
                    rowHeight   : 70,
                    barMargin   : 5,
                    cls         : 'b-orange b-raised',
                    ref         : 'top',
                    pressed     : true,
                    featureSpec : {
                        top    : topLabel,
                        bottom : bottomLabel,
                        left   : null,
                        right  : null
                    }
                }, {
                    text        : 'Left + Right',
                    toggleGroup : 'labels',
                    listeners   : {
                        toggle : reconfigureGantt
                    },
                    rowHeight   : 45,
                    barMargin   : 10,
                    cls         : 'b-orange b-raised',
                    featureSpec : {
                        top    : null,
                        bottom : null,
                        left   : leftLabel,
                        right  : rightLabel
                    }
                }, {
                    text        : 'All',
                    toggleGroup : 'labels',
                    listeners   : {
                        toggle : reconfigureGantt
                    },
                    rowHeight   : 70,
                    barMargin   : 5,
                    cls         : 'b-orange b-raised',
                    featureSpec : {
                        top    : topLabel,
                        bottom : bottomLabel,
                        left   : leftLabel,
                        right  : rightLabel
                    }
                }
            ]
        }

    ], { insertFirst : document.getElementById('tools') || document.body }),

    gantt        = new Gantt({
        adopt : 'container',

        startDate : '2019-01-08',
        endDate   : '2019-04-01',

        project,

        columns : [
            { type : 'name', field : 'name', text : 'Name', width : 250 }
        ],

        viewPreset : 'weekAndDayLetter',

        rowHeight : buttons.widgetMap.top.rowHeight,
        barMargin : buttons.widgetMap.top.barMargin,

        features : {
            labels : buttons.widgetMap.top.featureSpec
        }
    });

project.load();
