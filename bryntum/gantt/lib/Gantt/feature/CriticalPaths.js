import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import Delayable from '../../Core/mixin/Delayable.js';
import InstancePlugin from '../../Core/mixin/InstancePlugin.js';

/**
 * @module Gantt/feature/CriticalPaths
 */

/**
 * This feature highlights the project _critical paths_.
 * Every task is important, but only some of them are critical.
 * The critical path is a chain of linked tasks that directly affects the project finish date.
 * If any task on the critical path is late, the whole project is late.
 *
 * This feature is loaded by default, but the visualization needs to be enabled:
 *
 * ```javascript
 * // let's visualize the project critical paths
 * gantt.features.criticalPaths.disabled = false;
 * ```
 * {@inlineexample gantt/feature/CriticalPaths.js}
 *
 * @extends Core/mixin/InstancePlugin
 * @demo Gantt/criticalpaths
 */
export default class CriticalPaths extends Delayable(InstancePlugin) {
    //region Config

    static get $name() {
        return 'CriticalPaths';
    }

    static get defaultConfig() {
        return {
            cls                   : 'b-gantt-critical-paths',
            criticalDependencyCls : 'b-critical',
            disabled              : true
        };
    }

    static get pluginConfig() {
        return {
            chain : ['onPaint']
        };
    }

    //endregion

    //region Init

    doDisable(disable) {
        if (disable) {
            this.unhighlightCriticalPaths();
        }
        else {
            this.highlightCriticalPaths();
        }

        super.doDisable(disable);
    }

    /**
     * Called when gantt is painted.
     * @private
     */
    onPaint() {
        const me = this;

        me.client.project.on({
            commit  : me.onProjectCommit,
            thisObj : me
        });
    }

    getDependenciesFeature() {
        // return dependencies feature only when it's ready
        return this.client.foregroundCanvas && this.client.features.dependencies;
    }

    highlightCriticalPaths() {
        const
            me           = this,
            client       = me.client,
            project      = client.project,
            dependencies = me.getDependenciesFeature();

        // the component has cls set means we had CPs rendered so need to clean them
        if (client.element.classList.contains(me.cls)) {
            me.unhighlightCriticalPaths();
        }

        // if we have dependencies rendered need to highlight those of them which take part in the CPs
        dependencies && project.criticalPaths && project.criticalPaths.forEach(path => {
            path.forEach(node => {
                node.dependency && dependencies.highlight(node.dependency, me.criticalDependencyCls);
            });
        });

        // add the feature base cls to enable stylesheets
        client.element.classList.add(me.cls);

        /**
         * Fired when critical paths get highlighted.
         *
         * See also: {@link #event-criticalPathsUnhighlighted}
         * @event criticalPathsHighlighted
         */
        client.trigger('criticalPathsHighlighted');
    }

    unhighlightCriticalPaths() {
        const
            me           = this,
            client       = me.client,
            project      = client.project,
            dependencies = me.getDependenciesFeature();

        // if we have dependencies rendered remove classes from them
        if (dependencies) {
            project.dependencyStore.forEach(dependency => dependencies.unhighlight(dependency, me.criticalDependencyCls));
        }

        // remove the feature base cls
        client.element.classList.remove(me.cls);

        /**
         * Fired when critical paths get hidden.
         *
         * See also: {@link #event-criticalPathsHighlighted}
         * @event criticalPathsUnhighlighted
         */
        client.trigger('criticalPathsUnhighlighted');
    }

    //endregion

    onProjectCommit({ records, changedAtoms }) {
        const { project } = this.client;

        // if the feature is enabled and the project criticalPaths field was updated
        if (!this.disabled && records.has(project) && changedAtoms.includes(project.$.criticalPaths)) {
            this.highlightCriticalPaths();
        }
    }
}

GridFeatureManager.registerFeature(CriticalPaths, true, 'Gantt');
