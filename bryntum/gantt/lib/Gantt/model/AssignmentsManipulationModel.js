import Model from '../../Core/data/Model.js';

/**
 * @module Gantt/model/AssignmentsManipulationModel
 */

/**
 * A special model class for resource assignments manipulation.
 * Used by {@link Gantt/data/AssignmentsManipulationStore Assignments manipulation store}.
 *
 * This model is not intended to be serialized and/or synchronized with the server somehow.
 *
 * @extends Gantt/model/AssignmentModel
 * @internal
 */
export default class AssignmentsManipulationModel extends Model {

    static get fields() {
        return [{
            name : 'assignment', type : 'object'
        }, {
            name : 'resource', type : 'object'
        }, {
            name : 'event', type : 'object'
        }, {
            name         : 'units',
            type         : 'number',
            defaultValue : 0
        }];
    }

    get name() {
        // Might be a group row (there is no resource)
        return this.resource ? this.resource.name : '';
    }

    get assigned() {
        return this.event && this.firstStore.projectEvent === this.event;
    }

    set assigned(value) {
        const me = this;

        if (value) {
            if (!me.assigned) {
                me.set({
                    event : me.firstStore.projectEvent,
                    units : me.units || 100
                });
            }
        }
        else {
            me.set({
                event : null,
                units : 0
            });
        }
    }
}
