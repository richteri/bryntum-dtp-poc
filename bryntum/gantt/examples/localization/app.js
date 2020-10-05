// Importing custom locales
import './locales/custom.locale.De.js';
import './locales/custom.locale.En.js';
import './locales/custom.locale.Nl.js';
import './locales/custom.locale.Ru.js';
import './locales/custom.locale.SvSE.js';

import '../_shared/shared.js'; // not required, our example styling etc.
import Gantt from '../../lib/Gantt/view/Gantt.js';
import '../../lib/Gantt/column/StartDateColumn.js';
import '../../lib/Gantt/column/EndDateColumn.js';
import '../../lib/Gantt/column/DurationColumn.js';
import '../../lib/Gantt/column/SequenceColumn.js';
import '../../lib/Gantt/column/WBSColumn.js';
import '../../lib/Gantt/column/NoteColumn.js';
import '../../lib/Gantt/feature/TaskContextMenu.js';

import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';

import LocaleManager from '../../lib/Core/localization/LocaleManager.js';
import Localizable from '../../lib/Core/localization/Localizable.js';

// Enable missing localization Error throwing here to show how it can be used in end-user apps
// All non-localized strings which are in `L{foo}` format will throw runtime error
LocaleManager.throwOnMissingLocale = true;

const project = new ProjectModel({
    transport : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

/**
 * Updates localizable properties after locale change
 */
function updateLocalization() {
    const title = Localizable().L('L{App.Localization demo}');
    document.querySelector('#title').innerHTML = title;
    document.title = title;
}

// Add listener to update contents when locale changes
LocaleManager.on('locale', updateLocalization);

new Gantt({
    adopt : 'container',

    project,

    columns : [
        { type : 'wbs' },
        { type : 'name', field : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'enddate' },
        { type : 'duration' }
    ]
});

project.load();

updateLocalization();
