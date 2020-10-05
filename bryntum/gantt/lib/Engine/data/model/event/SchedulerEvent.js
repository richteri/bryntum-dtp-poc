import Model from "../../../../Core/data/Model.js";
import { Entity } from "../../../../ChronoGraph/replica/Entity.js";
import { PartOfProjectGenericMixin } from "../../PartOfProjectGenericMixin.js";
import { HasCalendarMixin } from "../HasCalendarMixin.js";
import { ChronoModelMixin } from "../mixin/ChronoModelMixin.js";
import { PartOfProjectMixin } from "../mixin/PartOfProjectMixin.js";
import { ConstrainedEvent } from "./ConstrainedEvent.js";
import { EventMixin } from "./EventMixin.js";
import { HasAssignments } from "./HasAssignments.js";
import { HasChildren } from "./HasChildren.js";
import { HasDependencies } from "./HasDependencies.js";
import { ProjectUnconstrainedEvent } from "./ProjectUnconstrainedEvent.js";
export const BuildSchedulerEvent = (base = Model) => ProjectUnconstrainedEvent(HasAssignments(HasChildren(HasDependencies(ConstrainedEvent(EventMixin(HasCalendarMixin(PartOfProjectMixin(PartOfProjectGenericMixin(ChronoModelMixin(Entity(base)))))))))));
export class SchedulerEvent extends BuildSchedulerEvent(Model) {
}
//# sourceMappingURL=SchedulerEvent.js.map