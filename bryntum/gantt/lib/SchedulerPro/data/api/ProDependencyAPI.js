import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/api/ProDependencyAPI
 */

/**
 * Pro dependency model data API mixin
 *
 * The mixin should be mixed alongside with other API mixins, because it might rely on them.
 *
 * The mixin should contain basic API overrides
 *
 * @mixin
 */
export default Target => class ProDependencyAPI extends (Target || Base) {

    isValidDependency({ sourceEvent, targetEvent, type, dependencyStore }) {
        return dependencyStore.isValidDependency({
            fromEvent : sourceEvent,
            toEvent   : targetEvent,
            type
        });
    }

    async createDependency({ sourceEvent, targetEvent, type, dependencyStore }) {

        const dependency = dependencyStore.add({
            fromEvent : sourceEvent,
            toEvent   : targetEvent,
            type
        })[0];

        const result = await this.propagate();

        return {
            result,
            dependency
        };
    }
};
