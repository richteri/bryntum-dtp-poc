import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';
import SchedulerDependencies from '../../Scheduler/feature/Dependencies.js';
import DependencyStore from '../data/DependencyStore.js';
import TemplateHelper from '../../Core/helper/TemplateHelper.js';
import TaskModel from '../model/TaskModel.js';
import { DependencyType } from '../../Engine/scheduling/Types.js';

/**
 * @module Gantt/feature/Dependencies
 */

const fromBoxSide = [
        'left',
        'left',
        'right',
        'right'
    ],
    toBoxSide = [
        'left',
        'right',
        'left',
        'right'
    ];

// noinspection JSClosureCompilerSyntax
/**
 * Feature that draws dependencies between tasks. Uses a dependency {@link Gantt.model.ProjectModel#property-dependencyStore store}
 * to determine which dependencies to draw.
 *
 * This feature is **enabled** by default
 *
 * <div class="external-example" data-file="guides/gettingstarted/basic.js"></div>
 * @extends Scheduler/feature/Dependencies
 * @typings Scheduler/feature/Dependencies -> Scheduler/feature/SchedulerDependencies
 * @demo Gantt/basic
 */
export default class Dependencies extends SchedulerDependencies {

    //region Config

    static get $name() {
        return 'Dependencies';
    }

    static get defaultConfig() {
        return {
            terminalSides                     : ['left', 'right'],
            storeClass                        : DependencyStore,
            highlightDependenciesOnEventHover : true
        };
    }

    //endregion

    //region Init

    construct(gantt, config = {}) {
        const me = this;

        // Scheduler might be using gantts feature, when on same page
        if (gantt.isGantt) {
            me.gantt = gantt;
        }

        if (Object.prototype.hasOwnProperty.call(config, 'pathFinderConfig')) {
            if (!Object.prototype.hasOwnProperty.call(config.pathFinderConfig, 'otherHorizontalMargin')) {
                config.pathFinderConfig.otherHorizontalMargin = 0;
            }

            if (!Object.prototype.hasOwnProperty.call(config.pathFinderConfig, 'otherVerticalMargin')) {
                config.pathFinderConfig.otherVerticalMargin = 0;
            }
        }
        else {
            config.pathFinderConfig = {
                otherHorizontalMargin : 0,
                otherVerticalMargin   : 0
            };
        }

        super.construct(gantt, config);
    }

    //endregion

    //region Determining dependencies to draw

    // With multi-assign each dependency might be drawn several times
    getIteratableDependencyAssignments(dependency) {
        return [null]; // Gantt doesn't use assignments to designated what raw task occupies
    }

    // Neither task can be hidden for a dependency to be considered visible
    isDependencyVisible(dependency, assignmentData = null) {
        const { client } = this;

        const from = dependency.sourceTask,
            to = dependency.targetTask;

        // ignore dependency with bad data, the `Object(from) !== from` handles the case
        // when the from is an id of missing task
        // this might change in the future (from will be always either a Task model or undefined)
        // so only the `if (!from || !to) return;` will be needed
        if (!from || !to || Object(from) !== from || Object(to) !== to) return;

        // assignmentData only used in Scheduler with multi assignment, let it handle the call
        if (!(from instanceof TaskModel) || assignmentData) {
            return super.isDependencyVisible(dependency, assignmentData);
        }

        // placeHolder set if either end of the dependency does not exist in store
        return !from.placeHolder && client.store.isAvailable(from) &&
            !to.placeHolder && client.store.isAvailable(to);
    }

    // Get the bounding box for either the source or the target event
    getBox(dependency, source, assignmentData = null) {
        const taskRecord = this.getTimeSpanRecordFromDependency(dependency, source);

        if (!this.gantt) {
            // Scheduler using gantts feature (happens when using single bundle)
            if (taskRecord.isEvent || assignmentData) {
                return super.getBox(dependency, source, assignmentData);
            }

            // Scheduler with taskStore, might not have any resource assigned
            return taskRecord.assignments.length ? this.client.getResourceEventBox(taskRecord, taskRecord.assignments[0].resource, true) : null;
        }

        // TODO: change getTaskBox to use Rectangle
        return this.gantt.getTaskBox(taskRecord, true, true);
    }

    // Get source or target events resource
    getRowRecordFromDependency(dependency, source) {
        if (!this.gantt) {
            // Scheduler with taskStore, we want the resource
            const taskRecord = this.getTimeSpanRecordFromDependency(dependency, source);
            // Scheduler using gantts feature (happens when using single bundle)
            if (taskRecord.isEvent) {
                return super.getRowRecordFromDependency(dependency, source);
            }
            // Might not have one assigned
            return taskRecord.assignments.length ? taskRecord.assignments[0].resource : null;
        }

        return this.getTimeSpanRecordFromDependency(dependency, source);
    }

    //endregion

    //region Draw & render

    drawLine(canvas, dependency, points, assignmentData = null, cache = true) {
        const
            line       = super.drawLine(canvas, dependency, points, assignmentData, cache),
            { client } = this,
            to         = dependency.toEvent;

        // If target event is outside of the view add special CSS class to hide marker (arrow)
        if (
            (!to.milestone && (to.endDate <= client.startDate || client.endDate <= to.startDate)) ||
            (to.milestone && (to.endDate < client.startDate || client.endDate < to.startDate))
        ) {
            line.classList.add('b-sch-dependency-ends-outside');
        }
    }

    prepareLineDef(dependency, dependencyDrawData, assignmentData = null) {
        const
            me      = this,
            source    = me.getTimeSpanRecordFromDependency(dependency, true),
            target    = me.getTimeSpanRecordFromDependency(dependency, false),
            type      = dependency.type,
            arrowMargin = this.pathFinder.startArrowMargin;

        let startSide = dependency.fromSide,
            endSide   = dependency.toSide;

        // Fallback to view trait if dependency start side is not given
        if (!startSide) {
            switch (true) {
                case type === DependencyType.StartToEnd:
                    startSide = me.getConnectorStartSide(source);
                    break;

                case type === DependencyType.StartToStart:
                    startSide = me.getConnectorStartSide(source);
                    break;

                case type === DependencyType.EndToStart:
                    startSide = me.getConnectorEndSide(source);
                    break;

                case type === DependencyType.EndToEnd:
                    startSide = me.getConnectorEndSide(source);
                    break;

                default:
                    throw new Error('Invalid dependency type: ' + type);
            }
        }

        // Fallback to view trait if dependency end side is not given
        if (!endSide) {
            switch (true) {
                case type === DependencyType.StartToEnd:
                    endSide = me.getConnectorEndSide(target);
                    break;

                case type === DependencyType.StartToStart:
                    endSide = me.getConnectorStartSide(target);
                    break;

                case type === DependencyType.EndToStart:
                    endSide = me.getConnectorStartSide(target);
                    break;

                case type === DependencyType.EndToEnd:
                    endSide = me.getConnectorEndSide(target);
                    break;

                default:
                    throw new Error('Invalid dependency type: ' + type);
            }
        }

        const { startRectangle, endRectangle } = dependencyDrawData;

        if (
            type === DependencyType.EndToStart &&
            // Target box is below source box
            startRectangle.bottom < endRectangle.y &&
            // If source box end before target box start - draw line to the top edge
            // Round coordinates to make behavior more consistent on zoomed page
            (Math.round(startRectangle.right) - Math.round(endRectangle.x) <= 0)
        ) {
            // arrow to left part of top
            endSide = 'top';

            // The default entry point for top is the center, but for Gantt Tasks,
            // we join to startArrowMargin inwards from top/left.
            // Milestones always have the top entry point left in the center.
            if (!dependency.targetTask.milestone) {
                endRectangle.right = endRectangle.x + arrowMargin * 2;
            }
        }

        // append boxes that extend to row boundaries to make sure line is contained there
        // Always concider arrow margin for `otherBoxes`, otherwise, when gap between source and target is less than
        // arrowMargin * 2 (start arrow + end arrow margin), we will have line breaking not on the row boundary
        const
            sourceRowBox = me.client.getRecordCoords(source, true),
            targetRowBox = me.client.getRecordCoords(target, true),
            // Add vertical box for each task. They are supposed to push line to row boundary
            otherBoxes = [
                {
                    start  : startRectangle.x,
                    end    : startRectangle.right,
                    top    : sourceRowBox.y,
                    bottom : sourceRowBox.y + sourceRowBox.height
                },
                {
                    start  : endRectangle.x,
                    end    : endRectangle.right,
                    top    : targetRowBox.y,
                    bottom : targetRowBox.y + targetRowBox.height
                }
            ];

        // Reversing start/end endpoints generate more Gantt-friendly arrows
        return {
            endBox : {
                start  : startRectangle.x,
                end    : startRectangle.right,
                top    : startRectangle.y,
                bottom : startRectangle.bottom
            },

            startBox : {
                start  : endRectangle.x,
                end    : endRectangle.right,
                top    : endRectangle.y,
                bottom : endRectangle.bottom
            },
            endSide       : startSide,
            startSide     : endSide,
            boxesReversed : true,
            otherBoxes
        };
    }

    // onEventChanged({ action, record }) {
    //     switch (action) {
    //         case 'update':
    //             // event updated, redraw its dependencies
    //             return this.drawForTask(record);
    //     }
    // }

    /**
     * Draws all dependencies for the specified task.
     */
    drawForTask(taskRecord) {
        this.drawForTimeSpan(taskRecord);
    }

    //endregion

    //region Tooltip

    /**
     * Generates html for the tooltip shown when hovering a dependency
     * @param {Object} tooltipConfig
     * @returns {string} Html to display in the tooltip
     * @private
     */
    getHoverTipHtml({ activeTarget }) {
        const
            me              = this,
            dependencyModel = me.getDependencyForElement(activeTarget);

        if (!dependencyModel) {
            return null;
        }

        const
            fromTask = dependencyModel.sourceTask,
            toTask   = dependencyModel.targetTask;

        return TemplateHelper.tpl`
             <table class="b-sch-dependency-tooltip">
                <tr>
                    <td>${me.L('L{Dependencies.from}')}: </td>
                    <td>${fromTask.name} ${fromTask.id}</td>
                    <td><div class="b-sch-box b-${fromBoxSide[dependencyModel.type]}"></div></td>
                </tr>
                <tr>
                    <td>${me.L('L{Dependencies.to}')}: </td>
                    <td>${toTask.name} ${toTask.id}</td>
                    <td><div class="b-sch-box b-${toBoxSide[dependencyModel.type]}"></div></td>
                </tr>
            </table>
        `;
    }

    //endregion

    //region Dependency creation

    /**
     * Create a new dependency from source terminal to target terminal
     * @internal
     */
    createDependency(data) {
        const
            me           = this,
            source       = data.source,
            target       = data.target,
            fromSide     = data.sourceTerminal.dataset.side,
            toSide       = data.targetTerminal.dataset.side,
            type         = (fromSide === 'left' ? 0 : 2) + (toSide === 'right' ? 1 : 0),
            addedRecords = me.store.add({
                fromEvent : source,
                toEvent   : target,
                type,
                fromSide,
                toSide
            });

        // No need to propagate if a beforeAdd store listener blocked the add
        if (addedRecords) {
            me.store.getProject().propagate();
        }
    }

    // endregion

    // Add critical path marker which has different color
    createMarkers() {
        super.createMarkers();

        // Since Edge and IE11 cannot reverse marker we use one in a
        // required orientation, which exists only in those two browsers
        const endMarker = (this.startMarker || this.endMarker).cloneNode(true);

        endMarker.setAttribute('id', 'arrowEndCritical');

        this.client.svgCanvas.appendChild(endMarker);
    }
}

GridFeatureManager.registerFeature(Dependencies, true, 'Gantt');
