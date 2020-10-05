import ProTaskModel from './ProTaskModel.js';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// The segmented tasks should be re-implemented, as a special parent tasks,
// with children

/**
 * @module SchedulerPro/model/ProTaskSegmentModel
 * @ignore
 */

/**
 * This class represents a segment of a split task in your Scheduler Pro project.
 * @extends SchedulerPro/model/ProTaskModel
 */
export default class ProTaskSegmentModel extends ProTaskModel {
    //region Config

    // static get defaultConfig() {
    //     return {
    //         /**
    //          * The task part of which this segment is.
    //          * @config {Gantt.model.TaskModel} task
    //          * @required
    //          */
    //         task : null,
    //
    //         taskNotifyingSuspended : 0,
    //         respectNeighbours      : 0,
    //
    //         autoCalculateCost : false
    //     };
    // }
    //
    // //endregion
    //
    // //region Fields
    //
    // static get fields() {
    //     return [
    //         { name : 'startOffset', type : 'int', defaultValue : null },
    //         { name : 'endOffset', type : 'int', defaultValue : null }
    //     ];
    // }
    //
    // //endregion
    //
    // //region Serialize & normalize
    //
    // serialize() {
    //     const data = {};
    //
    //     if (this.id) {
    //         data[this.getDataSource('id')] = this.id;
    //     }
    //     data[this.getDataSource('phantomId')]    = this.phantomId;
    //     data[this.getDataSource('startDate')]    = this.startDate;
    //     data[this.getDataSource('endDate')]      = this.endDate;
    //     data[this.getDataSource('duration')]     = this.duration;
    //     data[this.getDataSource('durationUnit')] = this.durationUnit;
    //     data[this.getDataSource('cls')]          = this.cls;
    //
    //     return data;
    // }
    //
    // normalize() {
    //     // fill missing standard task fields: end date based on duration or duration based on end date etc.
    //     super.normalize(...arguments);
    //
    //     const me        = this,
    //         startDate = me.startDate;
    //
    //     // fill offsets if needed
    //     if (typeof me.startOffset !== 'number' && startDate) {
    //         const task                = me.task,
    //             startOffset         = me.calculateDuration(task.startDate, startDate, 'ms'),
    //             endOffset           = startOffset + me.getDuration('ms'),
    //             cal                 = task.projectCalendar,
    //             durationInTaskUnits = cal.convertMSDurationToUnit(endOffset - startOffset, me.durationUnit);
    //
    //         me.data['startOffset'] = startOffset;
    //         me.data['endOffset']   = endOffset;
    //         me.data['duration']    = durationInTaskUnits;
    //     }
    // }
    //
    // //endregion
    //
    // //region Segments
    //
    // getPrevSegment() {
    //     const segments = this.task.segments;
    //     return segments[segments.indexOf(this) - 1];
    // }
    //
    // getNextSegment() {
    //     const segments = this.task.segments;
    //     return segments[segments.indexOf(this) + 1];
    // }
    //
    // //endregion
    //
    // //region Snapshot
    //
    // buildSnapshot() {
    //     return [this, Object.apply({}, this.data)];
    // }
    //
    // readSnapshot(snapshot) {
    //     if (snapshot) {
    //         Object.assign(this.data, snapshot[1]);
    //
    //         return this;
    //     }
    //
    //     return snapshot;
    // }
    //
    // //endregion
    //
    // enableRespectNeighbours() {
    //     this.respectNeighbours++;
    // }
    //
    // disableRespectNeighbours() {
    //     this.respectNeighbours--;
    // }
    //
    // suspendTaskNotifying() {
    //     this.taskNotifyingSuspended++;
    // }
    //
    // resumeTaskNotifying() {
    //     this.taskNotifyingSuspended--;
    // }
    //
    // //region Offset
    //
    // set startOffset(startOffset) {
    //     const cal                = this.task.projectCalendar,
    //         durationInTaskUnit = cal.convertMSDurationToUnit(this.endOffset - startOffset, this.durationUnit);
    //
    //     this.beginBatch();
    //
    //     this.set('startOffset', startOffset);
    //     this.set('duration', durationInTaskUnit);
    //
    //     this.endBatch();
    // }
    //
    // set endOffset(endOffset) {
    //     const cal                = this.task.projectCalendar,
    //         durationInTaskUnit = cal.convertMSDurationToUnit(endOffset - this.startOffset, this.durationUnit);
    //
    //     this.beginBatch();
    //
    //     this.set('endOffet', endOffset);
    //     this.set('duration', durationInTaskUnit);
    //
    //     this.endBatch();
    // }
    //
    // setStartEndOffset(startOffset, endOffset) {
    //     const cal                = this.task.projectCalendar,
    //         durationInTaskUnit = cal.convertMSDurationToUnit(endOffset - startOffset, this.durationUnit);
    //
    //     this.beginBatch();
    //
    //     this.set('startOffset', startOffset);
    //     this.set('endOffset', endOffset);
    //     this.set('duration', durationInTaskUnit);
    //
    //     this.endBatch();
    // }
    //
    // //endregion
    //
    // //region Mapped to task
    //
    // get calendar() {
    //     return this.task.calendar;
    // }
    //
    // get ownCalendar() {
    //     return this.task.ownCalendar;
    // }
    //
    // get projectCalendar() {
    //     return this.task.projectCalendar;
    // }
    //
    // get dependencyStore() {
    //     return this.task.dependencyStore;
    // }
    //
    // get resourceStore() {
    //     return this.task.resourceStore;
    // }
    //
    // get assignmentStore() {
    //     return this.task.assignmentStore;
    // }
    //
    // get taskStore() {
    //     return this.task.taskStore;
    // }
    //
    // forEachAvailabilityInterval(options) {
    //     // we query the task for available intervals
    //     // but force it to NOT take segmentation into account
    //     options.segments = options.segments || false;
    //
    //     return this.task.forEachAvailabilityInterval(options);
    // }
    //
    // propagateChanges(/*...*/) {
    //     // TODO: PORT (or maybe not this one)
    //     return this.callTask(arguments);
    // }
    //
    // rejectSegmentsProjection() {
    //     // TODO: PORT
    //     return this.callTask(arguments);
    // }
    //
    // commitSegmentsProjection() {
    //     // TODO: PORT
    //     return this.callTask(arguments);
    // }
    //
    // get assignments() {
    //     return this.task.assignments;
    // }
    //
    // getAssignmentFor() {
    //     // TODO: PORT
    //     return this.callTask(arguments);
    // }
    //
    // isAssignedTo() {
    //     return this.callTask(arguments);
    // }
    //
    // getResources() {
    //     // TODO: PORT
    //     return this.callTask(arguments);
    // }
    //
    // //endregion
    //
    // //region Overrides for Task
    //
    // // sub-segments are not supported
    // set segments(segments) {}
    //
    // get segments() {}
    //
    // getSchedulingMode() {
    //     // #1902 here we redirected this call to the task previously (using: this.callTask(arguments);)
    //     // yet it brings few questions when it comes to "EfforDriven" mode
    //     // where end date is calculated based on effort value ..and segment just doesn't have it normally
    //     return 'Normal';
    // }
    //
    // recalculateCost() {}
    //
    // set() {
    //     const task = this.task;
    //
    //     if (task && !this.__editCounter && !this.taskNotifyingSuspended) {
    //         // let master task know of editing being started
    //         task.onSegmentEditBegin(this);
    //     }
    //
    //     super.set(...arguments);
    //
    //     if (task && !this.__editCounter && !this.taskNotifyingSuspended) {
    //         // let master task know of editing being ended
    //         task.onSegmentEditEnd(this);
    //     }
    // }
    //
    // beginBatch() {
    //     const me   = this,
    //         task = me.task;
    //
    //     if (task && !me.__editCounter && !me.taskNotifyingSuspended) {
    //         // let master task know of editing being started
    //         task.onSegmentEditBegin(me);
    //     }
    //
    //     super.beginBatch(...arguments);
    // }
    //
    // endBatch() {
    //     const me       = this,
    //         modified = me.meta.modified,
    //         task     = me.task;
    //
    //     super.endBatch(...arguments);
    //
    //     if (task && !me.__editCounter && !me.taskNotifyingSuspended) {
    //         // if the timespan was affected by the change we let the master task know of it
    //         if ('startDate' in modified || 'endDate' in modified || 'startOffset' in modified || 'endOffset' in modified || 'duration' in modified) {
    //             task.onSegmentsChanged(me, modified);
    //         }
    //         task.onSegmentEditEnd(me);
    //     }
    // }

    //endregion
}

//region Unported
/* eslint-disable */
// let unported = {

//     construct : function(cfg) {
//         cfg = cfg || {};

//         cfg.leaf = true;

//         if (!cfg.task) throw "'task' has to be specified";

//         this.task = cfg.task;

//         super.construct(arguments);

//         Ext.override(this, this.overridables);

//         if (this.getTask().normalized && this.getTaskStore(true) && !this.normalized) {
//             this.normalize();
//         }
//     },

//     updateOffsetsByDates : function() {
//         // we need task store to use its project calendar
//         if (!this.getTaskStore(true)) return;

//         // prevents nested updating of offsets
//         // and updating of offsets during start/end recalculation (based on offsets)
//         if (this.updatingOffsets || this.updatingDates) return;

//         // set flag saying that we are in the middle of updating offsets by dates
//         this.updatingOffsets = true;

//         const offset = this.calculateDuration(this.getTask().getStartDate(), this.getStartDate(), 'MILLI');

//         this.setStartEndOffset(offset, offset + this.getDuration('MILLI'));

//         this.updatingOffsets = false;
//     },

//     updateDatesByOffsets : function(options) {
//         options = options || {};

//         // prevents nested updating of dates
//         // and updating of dates during offsets updating
//         if (this.updatingDates || this.updatingOffsets) return;

//         const isForward       = options.isForward !== false;
//         let useAbsoluteOffset = options.useAbsoluteOffset !== false;
//         const startDate       = options.startDate,
//             endDate         = options.endDate;
//         let taskStore         = this.getTaskStore(true);

//         if (!taskStore) return;

//         // set flag saying that we are in the middle of updating dates by offsets
//         this.updatingDates = true;

//         let date, neighbour;

//         if (isForward) {
//             neighbour = this.getPrevSegment();

//             if (neighbour && !useAbsoluteOffset) {
//                 date = this.skipWorkingTime(neighbour.getEndDate(), this.getStartOffset() - neighbour.getEndOffset());
//             }
//             else {
//                 date = this.skipWorkingTime(startDate || this.getTask().getStartDate(), this.getStartOffset());
//             }
//         }
//         else {
//             neighbour = this.getNextSegment();

//             if (neighbour && !useAbsoluteOffset) {
//                 date = this.skipWorkingTime(neighbour.getStartDate(), neighbour.getStartOffset() - this.getEndOffset() + this.getDuration('MILLI'), false);
//             }
//             else {
//                 date = this.skipWorkingTime(endDate || this.getTask().getEndDate(), this.getDuration('MILLI'), false);
//             }
//         }

//         this.setStartDateWithoutPropagation(date, true, taskStore.skipWeekendsDuringDragDrop);

//         this.updatingDates = false;
//     },

//     setStartDate : function(date, keepDuration) {
//         // if we move the segment their neighbours constraints the movement range
//         if (keepDuration) {
//             this.enableRespectNeighbours();
//         }

//         this.callParent(arguments);

//         if (keepDuration) {
//             this.disableRespectNeighbours();
//         }
//     },

//     setStartDateWithoutPropagation : function() {
//         this.beginEdit();

//         this.callParent(arguments);
//         this.updateOffsetsByDates();

//         // if we have next segment(s) and we have to respect and not overlap them
//         if (!this.inShifting && this.respectNeighbours && this.getNextSegment()) {
//             // this.shiftNeighboursWithoutPropagation();
//             const neighbour = this.getNextSegment();
//             const shift     = this.getEndOffset() - neighbour.getStartOffset();

//             if (neighbour && shift > 0) {
//                 neighbour.suspendTaskNotifying();
//                 neighbour.enableRespectNeighbours();

//                 neighbour.shiftWithoutPropagation(shift);

//                 neighbour.resumeTaskNotifying();
//                 neighbour.disableRespectNeighbours();
//             }
//         }

//         this.endEdit();

//         return true;
//     },

//     /**
//      * Shifts the segment by provided number of milliseconds.
//      * If the segment has {@link #respectNeighbours} set to `true` this call will shift further segments as well.
//      * @param {Number} amountMS Number of milliseconds the segment shoud be mover by.
//      * @private
//      */
//     shiftWithoutPropagation : function(amountMS) {
//         const me = this;

//         if (!amountMS) return;

//         me.beginEdit();

//         me.inShifting = true;

//         me.setStartEndOffset(me.getStartOffset() + amountMS, me.getEndOffset() + amountMS);
//         me.updateDatesByOffsets();

//         let neighbour;

//         if (me.respectNeighbours && (neighbour = amountMS > 0 ? me.getNextSegment() : me.getPrevSegment())) {
//             neighbour.suspendTaskNotifying();
//             neighbour.enableRespectNeighbours();

//             neighbour.shiftWithoutPropagation(amountMS);

//             neighbour.resumeTaskNotifying();
//             neighbour.disableRespectNeighbours();
//         }

//         me.inShifting = false;

//         me.endEdit();

//         return true;
//     },

//     setEndDateWithoutPropagation : function() {
//         this.beginEdit();

//         this.callParent(arguments);
//         this.updateOffsetsByDates();

//         this.endEdit();

//         return true;
//     },

//     setStartEndDateWithoutPropagation : function() {
//         this.beginEdit();

//         this.callParent(arguments);
//         this.updateOffsetsByDates();

//         this.endEdit();

//         return true;
//     },

//     setDurationWithoutPropagation : function() {
//         this.beginEdit();

//         this.callParent(arguments);
//         this.updateOffsetsByDates();

//         this.endEdit();

//         return true;
//     }

//     // /**
//     //  * Gets the task to which the segment belongs.
//     //  * @return {Gantt.model.Task} The task.
//     //  */
//     // getTask : function () {
//     //     return this.task;
//     // }

//     /**
//          * @hide
//          * @field Name
//          */
//     /**
//          * @hide
//          * @field Note
//          */
//     /**
//          * @hide
//          * @field ActualEffort
//          */
//     /**
//          * @hide
//          * @field ActualCost
//          */
//     /**
//          * @hide
//          * @field BaselineEffort
//          */
//     /**
//          * @hide
//          * @field BaselineCost
//          */
//     /**
//          * @hide
//          * @field BaselineEndDate
//          */
//     /**
//          * @hide
//          * @field BaselinePercentDone
//          */
//     /**
//          * @hide
//          * @field BaselineStartDate
//          */
//     /**
//          * @hide
//          * @field CalendarId
//          */
//     /**
//          * @hide
//          * @field ConstraintDate
//          */
//     /**
//          * @hide
//          * @field ConstraintType
//          */
//     /**
//          * @hide
//          * @field Cost
//          */
//     /**
//          * @hide
//          * @field CostVariance
//          */
//     /**
//          * @hide
//          * @field DeadlineDate
//          */
//     /**
//          * @hide
//          * @field Effort
//          */
//     /**
//          * @hide
//          * @field EffortUnit
//          */
//     /**
//          * @hide
//          * @field EffortVariance
//          */
//     /**
//          * @hide
//          * @field ManuallyScheduled
//          */
//     /**
//          * @hide
//          * @field PercentDone
//          */
//     /**
//          * @hide
//          * @field ReadOnly
//          */
//     /**
//          * @hide
//          * @field Rollup
//          */
//     /**
//          * @hide
//          * @field SchedulingMode
//          */
//     /**
//          * @hide
//          * @field ShowInTimeline
//          */

//     /**
//          * @hide
//          * @method setName
//          */
//     /**
//          * @hide
//          * @method getCost
//          */
//     /**
//          * @hide
//          * @method getDeadlineDate
//          */
//     /**
//          * @hide
//          * @method getName
//          */
//     /**
//          * @hide
//          * @cfg autoCalculateEffortForParentTask
//          */
//     /**
//          * @hide
//          * @cfg autoCalculatePercentDoneForParentTask
//          */
//     /**
//          * @hide
//          * @cfg baselineEndDateField
//          */
//     /**
//          * @hide
//          * @cfg baselinePercentDoneField
//          */
//     /**
//          * @hide
//          * @cfg baselineStartDateField
//          */
//     /**
//          * @hide
//          * @cfg calendar
//          */
//     /**
//          * @hide
//          * @cfg calendarIdField
//          */
//     /**
//          * @hide
//          * @cfg constraintDateField
//          */
//     /**
//          * @hide
//          * @cfg constraintTypeField
//          */
//     /**
//          * @hide
//          * @cfg convertEmptyParentToLeaf
//          */
//     /**
//          * @hide
//          * @cfg draggableField
//          */
//     /**
//          * @hide
//          * @cfg effortField
//          */
//     /**
//          * @hide
//          * @cfg effortUnitField
//          */
//     /**
//          * @hide
//          * @cfg manuallyScheduledField
//          */
//     /**
//          * @hide
//          * @cfg percentDoneField
//          */
//     /**
//          * @hide
//          * @cfg phantomParentIdField
//          */
//     /**
//          * @hide
//          * @cfg resizableField
//          */
//     /**
//          * @hide
//          * @cfg rollupField
//          */
//     /**
//          * @hide
//          * @cfg schedulingModeField
//          */
//     /**
//          * @hide
//          * @cfg taskStore
//          */
//     /**
//          * @hide
//          * @cfg dependencyStore
//          */
//     /**
//          * @hide
//          * @property assignments
//          */
//     /**
//          * @hide
//          * @property predecessors
//          */
//     /**
//          * @hide
//          * @property successors
//          */
//     /**
//          * @hide
//          * @method addMilestone
//          */
//     /**
//          * @hide
//          * @method addPredecessor
//          */
//     /**
//          * @hide
//          * @method addSubtask
//          */
//     /**
//          * @hide
//          * @method addSuccessor
//          */
//     /**
//          * @hide
//          * @method addTaskAbove
//          */
//     /**
//          * @hide
//          * @method addTaskBelow
//          */
//     /**
//          * @hide
//          * @method assign
//          */
//     /**
//          * @hide
//          * @method cascadeChanges
//          */
//     /**
//          * @hide
//          * @method cascadeChildren
//          */
//     /**
//          * @hide
//          * @method convertToMilestone
//          */
//     /**
//          * @hide
//          * @method convertToRegular
//          */
//     /**
//          * @hide
//          * @method forEachDate
//          */
//     /**
//          * @hide
//          * @method getAllDependencies
//          */
//     /**
//          * @hide
//          * @method getAssignmentFor
//          */
//     /**
//          * @hide
//          * @method getAssignmentStore
//          */
//     /**
//          * @hide
//          * @method getAssignments
//          */
//     /**
//          * @hide
//          * @method getBaselineEndDate
//          */
//     /**
//          * @hide
//          * @method getBaselinePercentDone
//          */
//     /**
//          * @hide
//          * @method getBaselineStartDate
//          */
//     /**
//          * @hide
//          * @method setBaselineEndDate
//          */
//     /**
//          * @hide
//          * @method setBaselinePercentDone
//          */
//     /**
//          * @hide
//          * @method setBaselineStartDate
//          */
//     /**
//          * @hide
//          * @method getCalendar
//          */
//     /**
//          * @hide
//          * @method getCalendarDuration
//          */
//     /**
//          * @hide
//          * @method getConstraintClass
//          */
//     /**
//          * @hide
//          * @method getDates
//          */
//     /**
//          * @hide
//          * @method getDependencyStore
//          */
//     /**
//          * @hide
//          * @method getDisplayEndDate
//          */
//     /**
//          * @hide
//          * @method getDisplayStartDate
//          */
//     /**
//          * @hide
//          * @method getEarlyEndDate
//          */
//     /**
//          * @hide
//          * @method getEarlyStartDate
//          */
//     /**
//          * @hide
//          * @method getEffort
//          */
//     /**
//          * @hide
//          * @method getEffortUnit
//          */
//     /**
//          * @hide
//          * @method getpredecessors
//          */
//     /**
//          * @hide
//          * @method setpredecessors
//          */
//     /**
//          * @hide
//          * @method getLateEndDate
//          */
//     /**
//          * @hide
//          * @method getLateStartDate
//          */
//     /**
//          * @hide
//          * @method getsuccessors
//          */
//     /**
//          * @hide
//          * @method setsuccessors
//          */
//     /**
//          * @hide
//          * @method getOwnCalendar
//          */
//     /**
//          * @hide
//          * @method getPercentDone
//          */
//     /**
//          * @hide
//          * @method getPredecessors
//          */
//     /**
//          * @hide
//          * @method getResourceStore
//          */
//     /**
//          * @hide
//          * @method getResources
//          */
//     /**
//          * @hide
//          * @method getSchedulingMode
//          */
//     /**
//          * @hide
//          * @method getSegment
//          */
//     /**
//          * @hide
//          * @method getSequenceNumber
//          */
//     /**
//          * @hide
//          * @method getSlack
//          */
//     /**
//          * @hide
//          * @method getSuccessors
//          */
//     /**
//          * @hide
//          * @method getTaskStore
//          */
//     /**
//          * @hide
//          * @method getTotalCount
//          */
//     /**
//          * @hide
//          * @method getWBSCode
//          */
//     /**
//          * @hide
//          * @method hasAssignments
//          */
//     /**
//          * @hide
//          * @method hasConstraint
//          */
//     /**
//          * @hide
//          * @method haspredecessors
//          */
//     /**
//          * @hide
//          * @method hassuccessors
//          */
//     /**
//          * @hide
//          * @method hasResources
//          */
//     /**
//          * @hide
//          * @method indent
//          */
//     /**
//          * @hide
//          * @method insertSubtask
//          */
//     /**
//          * @hide
//          * @method isAssignedTo
//          */
//     /**
//          * @hide
//          * @method isBaselineMilestone
//          */
//     /**
//          * @hide
//          * @method isConstraintSatisfied
//          */
//     /**
//          * @hide
//          * @method isManuallyScheduled
//          */
//     /**
//          * @hide
//          * @method isMilestone
//          */
//     /**
//          * @hide
//          * @method isPersistable
//          */
//     /**
//          * @hide
//          * @method isProjected
//          */
//     /**
//          * @hide
//          * @method isSegmented
//          */
//     /**
//          * @hide
//          * @method linkTo
//          */
//     /**
//          * @hide
//          * @method merge
//          */
//     /**
//          * @hide
//          * @method outdent
//          */
//     /**
//          * @hide
//          * @method setBaselinePercentDone
//          */
//     /**
//          * @hide
//          * @method setCalendar
//          */
//     /**
//          * @hide
//          * @method setConstraint
//          */
//     /**
//          * @hide
//          * @method setConstraintDate
//          */
//     /**
//          * @hide
//          * @method setConstraintType
//          */
//     /**
//          * @hide
//          * @method setEffort
//          */
//     /**
//          * @hide
//          * @method setEffortUnit
//          */
//     /**
//          * @hide
//          * @method setPercentDone
//          */
//     /**
//          * @hide
//          * @method setSchedulingMode
//          */
//     /**
//          * @hide
//          * @method setSegments
//          */
//     /**
//          * @hide
//          * @method setTaskStore
//          */
//     /**
//          * @hide
//          * @method shift
//          */
//     /**
//          * @hide
//          * @method split
//          */
//     /**
//          * @hide
//          * @method unAssign
//          */
//     /**
//          * @hide
//          * @method unlinkFrom
//          */
//     /**
//          * @hide
//          * @method isResizable
//          */
//     /**
//          * @hide
//          * @method isScheduled
//          */
//     /**
//          * @hide
//          * @method isStarted
//          */
//     /**
//          * @hide
//          * @method propagateChanges
//          */
//     /**
//          * @hide
//          * @method reassign
//          */
//     /**
//          * @hide
//          * @method removeSubtask
//          */
//     /**
//          * @hide
//          * @method setActualEffort
//          */
//     /**
//          * @hide
//          * @method setBaselineCost
//          */
//     /**
//          * @hide
//          * @method setBaselineEffort
//          */
//     /**
//          * @hide
//          * @method setCost
//          */
//     /**
//          * @hide
//          * @method setDeadlineDate
//          */
//     /**
//          * @hide
//          * @method setDraggable
//          */
//     /**
//          * @hide
//          * @method setEffortWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method setManuallyScheduled
//          */
//     /**
//          * @hide
//          * @method setManuallyScheduledWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method setPercentDoneWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method setResizable
//          */
//     /**
//          * @hide
//          * @method setRollup
//          */
//     /**
//          * @hide
//          * @method getRollup
//          */
//     /**
//          * @hide
//          * @method setSchedulingModeWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method setSegmentsWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method unassign
//          */
//     /**
//          * @hide
//          * @method adjustToCalendar
//          */
//     /**
//          * @hide
//          * @method convertToMilestoneWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method convertToRegularWithoutPropagation
//          */
//     /**
//          * @hide
//          * @method getActualCost
//          */
//     /**
//          * @hide
//          * @method getActualEffort
//          */
//     /**
//          * @hide
//          * @method getBaselineEffort
//          */
//     /**
//          * @hide
//          * @method getConstraintDate
//          */
//     /**
//          * @hide
//          * @method getConstraintType
//          */
//     /**
//          * @hide
//          * @method getEndSlack
//          */
//     /**
//          * @hide
//          * @method getFreeSlack
//          */
//     /**
//          * @hide
//          * @method getPreviousSiblingsTotalCount
//          */
//     /**
//          * @hide
//          * @method getProject
//          */
//     /**
//          * @hide
//          * @method getProjectCalendar
//          */
//     /**
//          * @hide
//          * @method getSegmentByDate
//          */
//     /**
//          * @hide
//          * @method getSegments
//          */
//     /**
//          * @hide
//          * @method getStartSlack
//          */
//     /**
//          * @hide
//          * @method getTotalSlack
//          */
//     /**
//          * @hide
//          * @method hasDependencies
//          */
//     /**
//          * @hide
//          * @method initProjectable
//          */
//     /**
//          * @hide
//          * @method isCompleted
//          */
//     /**
//          * @hide
//          * @method isCritical
//          */
//     /**
//          * @hide
//          * @method isDraggable
//          */
//     /**
//          * @hide
//          * @method isEditable
//          */
//     /**
//          * @hide
//          * @method isInProgress
//          */
//     /**
//          * @hide
//          * @method isReadOnly
//          */
//     /**
//          * @hide
//          * @cfg actualCostField
//          */
//     /**
//          * @hide
//          * @cfg actualEffortField
//          */
//     /**
//          * @hide
//          * @cfg autoCalculateCost
//          */
//     /**
//          * @hide
//          * @cfg autoCalculateCostForParentTask
//          */
//     /**
//          * @hide
//          * @cfg baselineCostField
//          */
//     /**
//          * @hide
//          * @cfg baselineEffortField
//          */
//     /**
//          * @hide
//          * @cfg clsField
//          */
//     /**
//          * @hide
//          * @cfg costField
//          */
//     /**
//          * @hide
//          * @cfg costVarianceField
//          */
//     /**
//          * @hide
//          * @cfg deadlineDateField
//          */
//     /**
//          * @hide
//          * @cfg effortVarianceField
//          */
//     /**
//          * @hide
//          * @cfg nameField
//          */
//     /**
//          * @hide
//          * @cfg noteField
//          */
//     /**
//          * @hide
//          * @cfg segmentsField
//          */
//     /**
//          * @hide
//          * @cfg showInTimelineField
//          */
// };

//endregion
