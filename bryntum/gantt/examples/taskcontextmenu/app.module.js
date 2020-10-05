import { Gantt, AjaxHelper, ProjectModel, DateHelper, WidgetHelper } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

const project = window.project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    adopt : 'container',

    features : {
        taskContextMenu : {
            // Add extra menu item available on all tasks
            items : {
                moveToNextDay : {
                    icon   : 'b-fa b-fa-calendar',
                    text   : 'Move to next day',
                    cls    : 'b-separator',
                    weight : 200,
                    onItem({ taskRecord }) {
                        taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, 1, 'day'));
                    }
                },
                milestoneAction : {
                    icon : 'b-fa b-fa-deer',
                    text : 'Milestone action',
                    onItem() {
                        WidgetHelper.toast('Performed milestone action');
                    }
                }
            },

            // Customize items per task
            processItems({ taskRecord, items }) {
                // Hide delete for parents
                items.deleteTask.hidden = taskRecord.isParent;

                // Hide if not a milestone
                items.milestoneAction.hidden = !taskRecord.isMilestone;
            }
        }
    },

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 250 }
    ],

    project
});

project.load();
