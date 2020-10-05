import Model from "../../../../Core/data/Model.js"
import { AnyConstructor } from "../../../../ChronoGraph/class/Mixin.js"
import { Entity } from "../../../../ChronoGraph/replica/Entity.js"
import { PartOfProjectGenericMixin } from "../../PartOfProjectGenericMixin.js"
import { HasCalendarMixin } from "../HasCalendarMixin.js"
import { ChronoModelMixin } from "../mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "../mixin/PartOfProjectMixin.js"
import { ConstrainedEvent } from "./ConstrainedEvent.js"
import { EventMixin } from "./EventMixin.js"
import { HasAssignments } from "./HasAssignments.js"
import { HasChildren } from "./HasChildren.js"
import { HasDependencies } from "./HasDependencies.js"
import { ProjectUnconstrainedEvent } from "./ProjectUnconstrainedEvent.js";

/**
 * Function to build an event class for the Bryntum Scheduler Pro
 */
export const BuildSchedulerEvent = (base : typeof Model = Model)
    : AnyConstructor<HasDependencies & HasChildren & HasAssignments> =>
        (ProjectUnconstrainedEvent as any)(
        HasAssignments(
        HasChildren(
        HasDependencies(
        (ConstrainedEvent as any)(
        EventMixin(
        HasCalendarMixin(
        PartOfProjectMixin(
        PartOfProjectGenericMixin(
        ChronoModelMixin(
        Entity(
            base
        )))))))))))

/**
 * The default class for event, used in Bryntum Gantt.
 *
 * It is configured from the following mixins, providing the maximum scheduling functionality:
 *
 * * [[HasAssignments]]
 * * [[HasChildren]]
 * * [[HasDependencies]]
 * * [[ConstrainedEvent]]
 * * [[EventMixin]]
 * * [[HasCalendarMixin]]
 */
export class SchedulerEvent extends BuildSchedulerEvent(Model) {}
