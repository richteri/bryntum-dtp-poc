/* eslint-disable no-unused-vars */
import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Gantt/column/AllColumns.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';
import WidgetHelper from '../../lib/Core/helper/WidgetHelper.js';

import ProjectGenerator from '../../lib/Gantt/util/ProjectGenerator.js';

let gantt,
    project = window.project = new ProjectModel();

const [taskCountField, projectSizeField] = WidgetHelper.append([
    {
        type    : 'number',
        label   : 'Tasks',
        tooltip : 'Enter number of tasks to generate and press [ENTER]. Tasks are divided into blocks of ten',
        value   : 1000,
        min     : 10,
        max     : 10000,
        width   : 180,
        step    : 10,
        onChange({ userAction }) {
            gantt.generateDataset();
        }
    }, {
        type    : 'number',
        label   : 'Project size',
        tooltip : 'Enter number of tasks that should be connected into a "project" (multipliers of 10)',
        min     : 10,
        max     : 1000,
        value   : 50,
        width   : 180,
        step    : 10,
        onChange({ userAction }) {
            gantt.generateDataset();
        }
    }
], {
    insertFirst : document.getElementById('tools') || document.body,
    cls         : 'b-bright'
});

gantt = new Gantt({
    adopt : 'container',

    emptyText : '',

    project,

    columns : [
        { type : 'name', field : 'name', text : 'Name', width : 200 },
        { type : 'startdate', text : 'Start date' },
        { type : 'duration', text : 'Duration' }
    ],

    columnLines : false,

    async generateDataset() {
        taskCountField.disabled = projectSizeField.disabled = true;

        const
            mask   = this.mask('Generating project'),
            config = await ProjectGenerator.generateAsync(taskCountField.value, projectSizeField.value, (count) => {
                mask.text = `Generating tasks: ${count}/${taskCountField.value}`;
            });

        this.setTimeSpan(config.startDate, config.endDate);

        mask.text = 'Calculating schedule';

        // Required to allow browser to update DOM before calculation starts
        this.requestAnimationFrame(async() => {
            project.startDate = config.startDate;
            project.endDate = config.endDate;
            project.taskStore.data = config.tasksData;
            project.dependencyStore.data = config.dependenciesData;

            await project.propagate();

            this.unmask();
            taskCountField.disabled = projectSizeField.disabled = false;
        });
    }
});

gantt.generateDataset();
