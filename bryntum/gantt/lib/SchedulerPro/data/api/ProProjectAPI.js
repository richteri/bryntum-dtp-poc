import Base from '../../../Core/Base.js';

/**
 * @module SchedulerPro/data/api/ProProjectAPI
 */

/**
 * Propagation batch API mixin.
 *
 * The mixin contains methods allowing to reduce call to {@link SchedulerPro/model/ProProjectModel#function-propagate propagate()} method, which is
 * not cheap operation performance wise.
 *
 * @mixin
 */
export default Target => class ProProjectAPI extends (Target || Base) {

    get project() {
        const
            me   = this,
            host = me.host;

        if (!me._project) {
            me._project = host.getProjectForDataAPI && host.getProjectForDataAPI(me) ||
                          host.getProject && host.getProject(me);
        }

        //<debug>
        console.assert(
            me._project,
            'Can\'t obtain project from a host object, please implement getProjectForDataAPI() method'
        );
        //</debug>

        return me._project;
    }

    propagate() {
        return this.project.propagate();
    }

    beginPropagationBatch() {
        this.project.suspendPropagate();
    }

    endPropagationBatch(trigger = true) {
        return this.project.resumePropagate(trigger);
    }
};
