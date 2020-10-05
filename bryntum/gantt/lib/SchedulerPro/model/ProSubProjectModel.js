import ProTaskModel from './ProTaskModel.js';

/**
 * @module SchedulerPro/model/ProSubProjectModel
 */

/**
* This class represents a single Sub-project in your Scheduler Pro project.
*
* By default, a Project has the following fields as seen below.
*
* # Project Fields
*
* - `Description` - the description of the project, this field maps to the task `Note` field
* - `AllowDependencies` - this field indicates if the project tasks allowed to have dependencies with tasks external to the project
*
* @extends SchedulerPro/model/ProTaskModel
*/
export default class ProSubProjectModel extends ProTaskModel {
    //region Config

    static get defaultConfig() {
        return {
            recognizedSchedulingModes : ['Normal'],
            convertEmptyParentToLeaf  : false
        };
    }

    //endregion

    //region Fields

    static get fields() {
        return [
            /**
             * The description of the project
             * @member {string} description
             * @field
             */
            { name : 'description', dataSource : 'note', type : 'string' },

            /**
             * Allow dependencies
             * @member {boolean} allowDependencies
             * @field
             */
            { name : 'allowDependencies', type : 'boolean', defaultValue : false, persist : false }
        ];
    }

    //endregion

    /**
     * Indicates that this is a project.
     * Can be used in heterogeneous stores to distinguish project records from task ones.
     * @property {boolean}
     */
    get isSubProject() {
        return true;
    }

    isEditable(fieldName) {
        // TODO: If users subclass they also have to subclass this fn if they want their custom fields to be editable.
        // TOD: Perhaps use explict exclude instead of include
        // some fields doesn't make sense to edit for a project
        switch (fieldName) {
            case 'name':
            case 'startDate':
            case 'readOnly':
            case 'duration':
            case 'durationUnit':
            case 'description':
            case 'allowDependencies':
                return super.isEditable(fieldName);
            // end date of the project is editable if it's manually scheduled (otherwise end date is auto-calculated)
            case 'endDate':
                return this.isManuallyScheduled && super.isEditable(fieldName);
            default :
                return false;
        }
    }

    /*
     * Sets if the given project is read only. All underlying tasks will be considered as read only as well.
     * @property {string} readOnly
     */

    /**
     * Do not allow to indent/outdent project nodes
     * @hide
     * @private
     */
    indent() {}

    /**
     * @hide
     * @private
     */
    outdent() {}
}
