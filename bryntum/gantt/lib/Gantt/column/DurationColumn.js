/**
 * @module Gantt/column/DurationColumn
 *
 * @deprecated since 2.0, use SchedulerPro/column/DurationColumn
 */
import SchedulerDurationColumn from '../../SchedulerPro/column/DurationColumn.js';

/**
 * A column showing the task {@link Scheduler/model/TimeSpan#property-fullDuration duration}.
 *
 * Default editor is a {@link Core.widget.DurationField DurationField}. It understands the time units,
 * so you can enter "4d" indicating 4 days duration, or "4h" indicating 4 hours, etc.
 *
 * @extends SchedulerPro/column/DurationColumn
 * @typings SchedulerPro/column/DurationColumn -> SchedulerPro/column/SchedulerDurationColumn
 */
export default class DurationColumn extends SchedulerDurationColumn {}
