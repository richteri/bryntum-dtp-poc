import AddNewColumn from './AddNewColumn.js';
import CalendarColumn from './CalendarColumn.js';
import ConstraintDateColumn from './ConstraintDateColumn.js';
import ConstraintTypeColumn from './ConstraintTypeColumn.js';
import DeadlineDateColumn from './DeadlineDateColumn.js';
import DurationColumn from './DurationColumn.js';
import EarlyEndDateColumn from './EarlyEndDateColumn.js';
import EarlyStartDateColumn from './EarlyStartDateColumn.js';
import EffortColumn from './EffortColumn.js';
import RollupColumn from './RollupColumn.js';
import ShowInTimelineColumn from './ShowInTimelineColumn.js';
// Not included since it is basically a different rendition of the ManuallyScheduledColumn
//import EventModeColumn from './EventModeColumn.js';
import EndDateColumn from './EndDateColumn.js';
import LateEndDateColumn from './LateEndDateColumn.js';
import LateStartDateColumn from './LateStartDateColumn.js';
import ManuallyScheduledColumn from './ManuallyScheduledColumn.js';
import MilestoneColumn from './MilestoneColumn.js';
import NameColumn from './NameColumn.js';
import NoteColumn from './NoteColumn.js';
import PercentDoneColumn from './PercentDoneColumn.js';
import PredecessorColumn from './PredecessorColumn.js';
import ResourceAssignmentColumn from './ResourceAssignmentColumn.js';
import SchedulingModeColumn from './SchedulingModeColumn.js';
import SequenceColumn from './SequenceColumn.js';
import StartDateColumn from './StartDateColumn.js';
import SuccessorColumn from './SuccessorColumn.js';
import TotalSlackColumn from './TotalSlackColumn.js';
import WBSColumn from './WBSColumn.js';

/**
 * @module Gantt/column/AllColumns
 *
 * Imports all currently developed Gantt columns and re-exports them in an object.
 * Should be used to import and register all Gantt columns.
 */
export default {
    AddNewColumn,
    CalendarColumn,
    ConstraintDateColumn,
    ConstraintTypeColumn,
    DeadlineDateColumn,
    DurationColumn,
    EarlyEndDateColumn,
    EarlyStartDateColumn,
    EffortColumn,
    EndDateColumn,
    //EventModeColumn,
    LateEndDateColumn,
    LateStartDateColumn,
    ManuallyScheduledColumn,
    MilestoneColumn,
    NameColumn,
    NoteColumn,
    PercentDoneColumn,
    PredecessorColumn,
    ResourceAssignmentColumn,
    RollupColumn,
    SchedulingModeColumn,
    SequenceColumn,
    ShowInTimelineColumn,
    StartDateColumn,
    SuccessorColumn,
    TotalSlackColumn,
    WBSColumn
};
