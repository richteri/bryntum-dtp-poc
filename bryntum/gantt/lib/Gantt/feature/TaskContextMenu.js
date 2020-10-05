import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import TimeSpanRecordContextMenuBase from '../../Scheduler/feature/base/TimeSpanRecordContextMenuBase.js';

/**
 * @module Gantt/feature/TaskContextMenu
 */

/**
 * Displays a context menu for tasks. Items are populated by other features and/or application code. Configure it with `false` to disable it completely.
 *
 * To add extra items for all events:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskContextMenu : {
 *             // Extra items for all events
 *             items : {
 *                 flagTask : {
 *                     text : 'Extra',
 *                     icon : 'b-fa b-fa-fw b-fa-flag',
 *                     onItem({taskRecord}) {
 *                         taskRecord.flagged = true;
 *                     }
 *                 }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * Manipulate existing items for all tasks or specific tasks:
 *
 * ```javascript
 * const gantt = new Gantt({
 *     features : {
 *         taskContextMenu : {
 *             // We would like to remove some of the provided options in the add menu
 *             items : {
 *                 add : {
 *                     menu : {
 *                         items : {
 *                             addTaskAbove : false,
 *                             addTaskBelow : false,
 *                             milestone    : false
 *                         }
 *                     }
 *                 }
 *             },
 *             // Process items before menu is shown
 *             processItems({taskRecord, items}) {
 *                  // Push an extra item for conferences
 *                  if (taskRecord.type === 'conference') {
 *                      items.showSessions = {
 *                          text : 'Show sessions',
 *                          ontItem({taskRecord}) {
 *                              // ...
 *                          }
 *                      };
 *                  }
 *
 *                  // Do not show menu for secret events
 *                  if (taskRecord.type === 'secret') {
 *                      return false;
 *                  }
 *             }
 *         }
 *     }
 * });
 * ```
 *
 * This feature is **enabled** by default
 *
 * @extends Scheduler/feature/base/TimeSpanRecordContextMenuBase
 * @demo Gantt/taskcontextmenu
 * @externalexample gantt/taskcontextmenu.js
 */
export default class TaskContextMenu extends TimeSpanRecordContextMenuBase {
    //region Config

    static get $name() {
        return 'TaskContextMenu';
    }

    static get defaultConfig() {
        return {
            /**
             * This is a preconfigured set of {@link Core.widget.Container#config-namedItems} used to create the default
             * context menu.
             *
             * The provided defaultItems setting is
             *
             *```javascript
             *    {
             *        add        : true,
             *        deleteTask : true
             *    }
             *```
             *
             * The `namedItems` provided by this feature are listed below. These are the property
             * names which you may configure in the feature's {@link Scheduler.feature.base.TimeSpanRecordContextMenuBase#config-items} config:
             *
             * - `add` A submenu option containing a `menu` config which contains the following `namedItems`
             *     * `addTaskAbove` Inserts a sibling task above the context task.
             *     * `addTaskBelow` Inserts a sibling task below the context task.
             *     * `milestone` Inserts a sibling milestone below the context task.
             *     * `subtask` Appends a child task to the context task.
             *     * `successor` Adds a sibling task linked by a dependence below the context task.
             *     * `predecessor` Adds a sibling task linked by a dependence above the context task.
             *  - `deleteTask` Deletes the context task.
             *  - `indent` Indents the context task by adding it as a child of its previous sibling.
             *  - `outdent` Outdents the context task by adding it as the final sibling of its parent.
             *  - `convertToMilestone` Converts the context task to a zero duration milestone.
             *
             * See the feature config in the above example for details.
             * @config {Object}
             */
            defaultItems : {
                add        : true,
                indent     : true,
                outdent    : true,
                deleteTask : true
            }
        };
    }
    //endregion

    construct(client, config) {
        // Do not return extra context menu items
        client.showRemoveRowInContextMenu = false;

        if (client.features.contextMenu) {
            client.features.contextMenu.disableCellContextMenu = true;
        }

        super.construct(client, config);
    }

    //region Events

    /**
     * Fired from gantt before the context menu is shown for a task. Allows manipulation of the items
     * to show in the same way as in `processItems`. Returning false from a listener prevents the menu from
     * being shown.
     * @event taskContextMenuBeforeShow
     * @preventable
     * @param {Gantt.view.Gantt} source
     * @param {Object[]} items Menu item configs
     * @param {Gantt.model.TaskModel} taskRecord Event record for which the menu was triggered
     * @param {HTMLElement} taskElement
     */

    /**
     * Fired from gantt when an item is selected in the context menu.
     * @event taskContextMenuItem
     * @param {Gantt.view.Gantt} source
     * @param {Core.widget.MenuItem} item
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {HTMLElement} taskElement
     */

    /**
     * Fired from gantt after showing the context menu for an event
     * @event taskContextMenuShow
     * @preventable
     * @param {Gantt.view.Gantt} source
     * @param {Core.widget.Menu} menu The menu
     * @param {Gantt.model.TaskModel} taskRecord Event record for which the menu was triggered
     * @param {HTMLElement} taskElement
     */

    //endregion

    /**
     * Returns Task record associated with current element (row/cell/task element)
     * @param {HTMLElement} element
     * @returns {Gantt.model.TaskModel}
     * @private
     */
    resolveRecord(element) {
        // We may be asked to resolve from a task bar element
        // or a regular grid inner element. Both must lead
        // to the Task.
        return this.client.resolveTaskRecord(element) || this.client.getRecordFromElement(element);
    }

    /**
     * Shows context menu for the provided task. If task is not rendered (outside of time span, or collapsed)
     * menu won't appear.
     * @param {Gantt.model.TaskModel} taskRecord
     * @param {Object} [options]
     * @param {HTMLElement} options.targetElement Element to align context menu to
     * @param {HTMLElement} options.eventElement Event element if target is an event, otherwise `null`
     * @param {Event} options.event Browser event. If provided menu will be aligned according to clientX/clientY coordinates.
     * If omitted, context menu will be centered to taskElement
     */
    showContextMenuFor(taskRecord, { targetElement, eventElement, event } = {}) {
        const { client } = this;

        if (!taskRecord) {
            return;
        }

        if (!targetElement) {
            targetElement = client.getElementFromTaskRecord(taskRecord);

            // If task record is not rendered, do nothing
            if (!targetElement) {
                return;
            }
        }

        // If it was a click
        if (event) {
            const cellData = client.getEventData(event);

            // If click occurs on row border there won't be cell data
            if (!cellData) {
                return;
            }

            const column = client.columns.getById(cellData.columnId);

            // If target is not a task and column has a flag to disable context menu
            if (!eventElement && column && !column.enableCellContextMenu) {
                return;
            }
        }

        this.showContextMenu({
            menuType    : 'task',
            taskElement : targetElement,
            targetElement,
            taskRecord,
            event
        });
    }

    beforeContextMenuShow(eventParams) {
        const
            { taskRecord, items, namedItems, selection } = eventParams,
            // Contextmenu on the selection offers multi actions on the selection.
            // Contextmenu on a non-selected record offers single actions on the context record.
            multiSelected = (eventParams.selectionIncludesContextTask = selection.includes(taskRecord)) && selection.length > 1;

        if (items.editTask) {
            items.editTask.hidden = multiSelected;
        }

        namedItems.add.hidden = multiSelected;
        namedItems.addTaskAbove.hidden = multiSelected;
        namedItems.addTaskBelow.hidden = multiSelected;
        namedItems.milestone.hidden = multiSelected;
        namedItems.subtask.hidden = multiSelected;
        namedItems.successor.hidden = multiSelected;
        namedItems.predecessor.hidden = multiSelected;
        namedItems.convertToMilestone.hidden = multiSelected;
        namedItems.predecessor.disabled = !taskRecord.previousSibling;
        namedItems.outdent.disabled = taskRecord.parent === this.client.taskStore.rootNode;
    }

    get namedItems() {
        const me = this,
            { client } = me;

        if (!me._namedItems) {
            const namedItems = me._namedItems = {
                addTaskAbove : {
                    text   : client.L('L{Gantt.Task above}'),
                    icon   : 'b-icon-up',
                    onItem : ({ taskRecord }) => {
                        client.addTaskAbove(taskRecord);
                    }
                },
                addTaskBelow : {
                    text   : client.L('L{Gantt.Task below}'),
                    icon   : 'b-icon-down',
                    onItem : ({ taskRecord }) => {
                        client.addTaskBelow(taskRecord);
                    }
                },
                milestone : {
                    text   : client.L('L{Gantt.Milestone}'),
                    icon   : 'b-fa-flag',
                    name   : 'milestone',
                    onItem : ({ taskRecord }) => {
                        client.addMilestonBelow(taskRecord);
                    }
                },
                subtask : {
                    text   : client.L('L{Gantt.Sub-task}'),
                    name   : 'subtask',
                    onItem : ({ taskRecord }) => {
                        client.addSubtask(taskRecord);
                    }
                },
                successor : {
                    text   : client.L('L{Gantt.Successor}'),
                    onItem : ({ taskRecord }) => {
                        client.addSuccessor(taskRecord);
                    }
                },
                predecessor : {
                    text   : client.L('L{Gantt.Predecessor}'),
                    name   : 'predecessor',
                    onItem : ({ taskRecord }) => {
                        client.addPredecessor(taskRecord);
                    }
                },
                deleteTask : {
                    text   : client.L('L{Gantt.Delete task}'),
                    icon   : 'b-icon-trash',
                    name   : 'deleteTask',
                    onItem : ({ selectionIncludesContextTask, selection, taskRecord }) => {
                        // Contextmenu on the selection offers multi actions on the selection.
                        // Contextmenu on a non-selected record offers single actions on the context record.
                        client.taskStore.remove(selectionIncludesContextTask ? selection : taskRecord);
                    }
                },
                convertToMilestone : {
                    text   : client.L('L{Gantt.Convert to milestone}'),
                    onItem : ({ taskRecord }) => {
                        taskRecord.convertToMilestone();
                    }
                },
                indent : {
                    text   : client.L('L{Gantt.Indent}'),
                    icon   : 'b-fa-indent',
                    onItem : ({ selectionIncludesContextTask, selection, taskRecord }) => {
                        // Contextmenu on the selection offers multi actions on the selection.
                        // Contextmenu on a non-selected record offers single actions on the context record.
                        client.indent(selectionIncludesContextTask ? selection : taskRecord);
                    }
                },
                outdent : {
                    text   : client.L('L{Gantt.Outdent}'),
                    icon   : 'b-fa-outdent',
                    onItem : ({ selectionIncludesContextTask, selection, taskRecord }) => {
                        // Contextmenu on the selection offers multi actions on the selection.
                        client.outdent(selectionIncludesContextTask ? selection : taskRecord);
                    }
                }
            };

            namedItems.add = {
                text : client.L('L{Gantt.Add}'),
                icon : 'b-icon-add',
                menu : {
                    items : {
                        addTaskAbove : true,
                        addTaskBelow : true,
                        milestone    : true,
                        subtask      : true,
                        successor    : true,
                        predecessor  : true
                    }
                }
            };
        }

        return me._namedItems;
    }
}

TaskContextMenu.featureClass = '';

GridFeatureManager.registerFeature(TaskContextMenu, true, 'Gantt');
