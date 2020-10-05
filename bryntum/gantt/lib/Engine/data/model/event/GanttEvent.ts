import { AnyConstructor } from "../../../../ChronoGraph/class/Mixin.js"
import { Entity } from "../../../../ChronoGraph/replica/Entity.js"
import Model from "../../../../Core/data/Model.js"
import { PartOfProjectGenericMixin } from "../../PartOfProjectGenericMixin.js"
import { HasCalendarMixin } from "../HasCalendarMixin.js"
import { ChronoModelMixin } from "../mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "../mixin/PartOfProjectMixin.js"
import { ConstrainedEvent } from "./ConstrainedEvent.js"
import { ConstrainedLateEvent } from "./ConstrainedLateEvent.js"
import { EventMixin } from "./EventMixin.js"
import { HasAssignments } from "./HasAssignments.js"
import { HasChildren } from "./HasChildren.js"
import { HasDateConstraint } from "./HasDateConstraint.js"
import { HasDependencies } from "./HasDependencies.js"
import { HasEffort } from "./HasEffort.js"
import { HasPercentDone } from "./HasPercentDone.js"
import { HasSchedulingMode } from "./HasSchedulingMode.js"
import { FixedDurationMixin } from "./scheduling_modes/FixedDurationMixin.js"
import { FixedEffortMixin } from "./scheduling_modes/FixedEffortMixin.js"
import { FixedUnitsMixin } from "./scheduling_modes/FixedUnitsMixin.js"

/**
 * Function to build an event class for the Bryntum Gantt
 */
export const BuildGanttEvent = (base : typeof Model = Model)
    : AnyConstructor<HasPercentDone & HasDateConstraint & FixedEffortMixin & HasDependencies> =>
        (HasDateConstraint as any)(
        FixedUnitsMixin(
        FixedEffortMixin(
        FixedDurationMixin(
        (HasSchedulingMode as any)(
        (HasEffort as any)(
        (HasAssignments as any)(
        HasPercentDone(
        HasDependencies(
        ConstrainedLateEvent(
        HasChildren(
        ConstrainedEvent(
        EventMixin(
        HasCalendarMixin(
        PartOfProjectMixin(
        PartOfProjectGenericMixin(
        ChronoModelMixin(
        Entity(
            base
        ))))))))))))))))))

/**
 * The default class for event, used in Bryntum Gantt.
 *
 * It is configured from the following mixins, providing the maximum scheduling functionality:
 *
 * * [[HasDateConstraint]]
 * * [[FixedUnits]]
 * * [[FixedEffort]]
 * * [[FixedDuration]]
 * * [[HasAssignments]]
 * * [[HasChildren]]
 * * [[ConstrainedEvent]]
 * * [[EventMixin]]
 * * [[HasCalendarMixin]]
 */
export class GanttEvent extends BuildGanttEvent(Model) {}
