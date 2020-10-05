import { Gantt, ProjectModel, WidgetHelper, Timeline } from '../../build/gantt.module.js';
import shared from '../_shared/shared.module.js';
/* eslint-disable no-unused-vars */

const setTimelineHeight = ({ source }) => {
    timeline.element.style.height = '';

    ['large', 'medium', 'small'].forEach((cls) => timeline.element.classList.remove(cls));
    timeline.element.classList.add(source.text.toLowerCase());
};

WidgetHelper.append([
    {
        type  : 'buttonGroup',
        cls   : 'b-raised',
        items : [
            {
                text        : 'Small',
                toggleGroup : 'size',
                color       : 'b-blue b-raised',
                listeners   : {
                    toggle : setTimelineHeight
                }
            }, {
                text        : 'Medium',
                toggleGroup : 'size',
                color       : 'b-blue b-raised',
                pressed     : true,
                listeners   : {
                    toggle : setTimelineHeight
                }
            }, {
                text        : 'Large',
                toggleGroup : 'size',
                color       : 'b-blue b-raised',
                listeners   : {
                    toggle : setTimelineHeight
                }
            }
        ]
    }

], { insertFirst : document.getElementById('tools') || document.body });

const gantt = new Gantt({
    project : new ProjectModel({
        autoLoad  : true,
        transport : {
            load : {
                url : '../_datasets/launch-saas.json'
            }
        }
    }),

    columns : [
        { type : 'name', width : 250 },
        { type : 'showintimeline', width : 150 }
    ]
});

const timeline = new Timeline({
    appendTo : 'container',
    project  : gantt.project
});

gantt.render('container');
