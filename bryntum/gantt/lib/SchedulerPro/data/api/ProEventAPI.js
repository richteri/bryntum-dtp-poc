import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/api/ProEventAPI
 */

/**
 * Pro event model data API mixin
 *
 * The mixin should be mixed alongside with other API mixins, because it might rely on them.
 *
 * @mixin
 */
export default Target => class ProEventAPI extends (Target || Base) {

    // NOTE: Add pro api override methods here
    async addEventToResource({ event, resource, eventStore, assignmentStore }) {
        const { assignment } = super.addEventToResource({ event, resource, eventStore, assignmentStore });

        const result = await this.propagate();

        return {
            event,
            assignment,
            result
        };
    }

    addEventToResourceWithoutPropagation(arg) {
        return super.addEventToResource(arg);
    }

    async removeEvents(records) {
        records.forEach(record => record.remove());

        await this.project.propagate();
    }
};
