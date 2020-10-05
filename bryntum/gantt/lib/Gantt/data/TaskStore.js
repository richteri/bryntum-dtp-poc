import ProTaskStore from '../../SchedulerPro/data/TaskStore.js';
import TaskModel from '../model/TaskModel.js';
import ProjectModel from '../model/ProjectModel.js';

const padWbs = wbs => wbs.replace(/(\d+)/g, index => +index + 100000);

/**
 * @module Gantt/data/TaskStore
 */

/**
 * A class representing the tree of tasks in the Gantt project. An individual task is represented as an instance of the
 * {@link Gantt.model.TaskModel} class. The store expects the data loaded to be hierarchical. Each parent node should
 * contain its children in a property called 'children'.
 *
 * @extends SchedulerPro/data/TaskStore
 * @typings SchedulerPro/data/TaskStore -> SchedulerPro/data/ProTaskStore
 */
export default class TaskStore extends ProTaskStore {
    static get defaultConfig() {
        return {
            modelClass : TaskModel
        };
    }

    /**
     * For each task in this TaskStore, sets the data in the passed baseline index to the current state of the task.
     * @param {Number} index The index in the baselines list of the baseline to update.
     */
    setBaseline(index) {
        const data = this.storage.values;

        this.forEach(task => task.setBaseline(index));
        this.trigger('refresh', {
            action  : 'batch',
            records : data,
            data
        });
    }

    /**
     * Increase the indentation level of one or more tasks in the tree
     * @param {Gantt.model.TaskModel|Gantt.model.TaskModel[]} nodes The nodes to indent.
     * @return {Promise} A promise which yields the result of the operation
     * @fires indent
     * @fires change
     */
    async indent(nodes) {
        const
            me                     = this,
            { taskStore, project } = me;

        let result = false;

        nodes = Array.isArray(nodes) ? nodes.slice() : [nodes];

        // 1. Filter out project nodes and nodes whose beforeIndent event was vetoed.
        nodes = nodes.filter(task => !(task instanceof ProjectModel) && project.trigger('beforeIndent', {
            task
        }) !== false);

        // 2. Filtering out all nodes which parents are also to be indented as well as the ones having no previous
        //    sibling since such nodes can’t be indented
        nodes = nodes.filter(node => {
            let result;

            result = Boolean(node.previousSibling);

            while (result && !node.isRoot) {
                result = !nodes.includes(node.parent);
                node   = node.parent;
            }

            return result;
        });

        if (nodes.length) {
            // 3. Sorting nodes into tree walk order
            nodes.sort((lhs, rhs) => {
                // First pad WBS to ensure 1.10 is greater than 1.2
                const
                    lhsWbs = padWbs(lhs.wbsCode),
                    rhsWbs = padWbs(rhs.wbsCode);

                return lhsWbs < rhsWbs ? -1 : lhsWbs > rhsWbs ? 1 : 0;
            });

            // No events should go to the UI until we have finished the operation successfully
            taskStore.beginBatch();

            // Ask the project to try the indent operation
            result = await project.tryPropagateWithChanges(() => {
                for (const node of nodes) {
                    const newParent = node.previousSibling;
                    newParent.appendChild(node);
                    me.toggleCollapse(newParent, false);
                }
            });

            // Now show the successful result
            taskStore.endBatch();

            if (result) {
                /**
                 * Fired after tasks in the tree are indented
                 * @event indent
                 * @param {Gantt.data.TaskStore} source The task store
                 * @param {Gantt.model.TaskModel[]} records Tasks that got indent
                 */
                me.trigger('indent', { records : nodes });
                me.trigger('change', {
                    action  : 'indent',
                    records : nodes
                });
            }
        }

        return result;
    }

    /**
     * Decrease the indentation level of one or more tasks in the tree
     * @param {Gantt.model.TaskModel|Gantt.model.TaskModel[]} nodes The nodes to outdent.
     * @return {Promise} A promise which yields the result of the operation
     * @fires outdent
     * @fires change
     */
    async outdent(nodes) {
        const
            me = this,
            { taskStore, project } = me;

        let result = false;

        nodes = Array.isArray(nodes) ? nodes.slice() : [nodes];

        // 1. Filter out project nodes and nodes whose beforeOutdent event was vetoed.
        nodes = nodes.filter(task => !(task instanceof ProjectModel) && project.trigger('beforeOutdent', {
            task
        }) !== false);

        // 2. Filtering out all nodes which parents are also to be outdented as well as the ones having no previous sibling
        //    since such nodes can’t be indented
        nodes = nodes.filter(node => {
            let result;

            result = node.parent && !node.parent.isRoot;

            while (result && !node.isRoot) {
                result = !nodes.includes(node.parent);
                node = node.parent;
            }

            return result;
        });

        if (nodes.length) {
            // 3. Sorting nodes into reverse tree walk order
            nodes.sort((lhs, rhs) => {
                // First pad WBS to ensure 1.10 is greater than 1.2
                const
                    lhsWbs = padWbs(lhs.wbsCode),
                    rhsWbs = padWbs(rhs.wbsCode);

                return lhsWbs < rhsWbs ? 1 : lhsWbs > rhsWbs ? -1 : 0;
            });

            // No events should go to the UI until we have finished the operation successfully
            taskStore.beginBatch();

            result = await project.tryPropagateWithChanges(() => {
                for (const node of nodes) {
                    const newChildren = node.parent.children.slice(node.parent.children.indexOf(node) + 1);

                    node.parent.parent.insertChild(node, node.parent.nextSibling);

                    node.appendChild(newChildren);
                    me.toggleCollapse(node, false);
                }
            });

            taskStore.endBatch();

            if (result) {
                /**
                 * Fired after tasks in the tree are outdented
                 * @event outdent
                 * @param {Gantt.data.TaskStore} source The task store
                 * @param {Gantt.model.TaskModel[]} records Tasks that got outdent
                 */
                me.trigger('outdent', { records : nodes });
                me.trigger('change', {
                    action  : 'outdent',
                    records : nodes
                });
            }
        }

        return result;
    }
}
