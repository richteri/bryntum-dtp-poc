import AbstractCrudManagerMixin from '../../../Scheduler/crud/AbstractCrudManagerMixin.js';
import JsonEncoder from '../../../Scheduler/crud/encoder/JsonEncoder.js';
import AjaxTransport from '../../../Scheduler/crud/transport/AjaxTransport.js';
import {EffectResolutionResult, GraphCycleDetectedEffect} from '../../../ChronoGraph/chrono/Effect.js';

/**
 * @module SchedulerPro/data/mixin/ProCrudManager
 */

// the order of the @mixes tags is important below, as the "AbstractCrudManagerMixin"
// contains the abstract methods, which are then overwritten by the concrete
// implementation in the AjaxTransport and JsonEncoder

/**
 * This is a mixin, provding Crud manager functionality, specialized for the Scheduler Pro project.
 *
 * @mixin
 * @mixes Scheduler/crud/AbstractCrudManagerMixin
 * @mixes Scheduler/crud/transport/AjaxTransport
 * @mixes Scheduler/crud/encoder/JsonEncoder
 */
export default Base => class ProCrudManager extends JsonEncoder(AjaxTransport(AbstractCrudManagerMixin(Base))) {

    construct(...args) {
        const me = this;

        super.construct(...args);

        // add the Engine specific stores to the crud manager
        me.addPrioritizedStore(me.calendarManagerStore);
        me.addPrioritizedStore(me.assignmentStore);
        me.addPrioritizedStore(me.dependencyStore);
        me.addPrioritizedStore(me.resourceStore);
        me.addPrioritizedStore(me.eventStore);
        me.addPrioritizedStore(me.timeRangeStore);
    }

    async applyResponse(requestType, response, options) {

        await super.applyResponse(requestType, response, options);

        // if there is the project data provided
        response && response.project && Object.assign(this, response.project);

        // the initial propagation should always use "Resume" for conflicts, except the cycle conflict
        await this.propagate((conflict) => {
            if (conflict instanceof GraphCycleDetectedEffect) {
                const cycleEntityIds = Array.from(new Set(conflict.cycle.map(node => node.self.id)));

                const error = new Error('Graph cycle: ' + cycleEntityIds);
                error.conflict  = conflict;
                throw error;
            }
            else {
                return EffectResolutionResult.Resume;
            }
        });

        // TODO:
        this.clearCrudStoresChanges();
    }

    clearCrudStoresChanges() {
        // TODO: Change when https://app.assembla.com/spaces/bryntum/tickets/8975 is fixed
        // this.crudStores.forEach(store => store.store.clearChanges());
        this.crudStores.forEach(store => {
            const me = store.store;

            me.remove(me.added.values, true);
            me.modified.forEach(r => r.clearChanges(false));

            me.added.clear();
            me.modified.clear();
            me.removed.clear();
        });
    }

    applyProjectResponse(projectResponse) {
        this.loadProjectFields(projectResponse);
    }
};
