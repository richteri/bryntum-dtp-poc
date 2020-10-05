import Model from "../../../Core/data/Model.js";
import { DateInterval } from "../../scheduling/DateInterval.js";
import { MAX_DATE, MIN_DATE } from "../../util/Constants.js";
import { ConstrainedLateEvent } from "./event/ConstrainedLateEvent.js";
import { BuildMinimalProject } from "./ProjectMixin.js";
import { GanttEvent } from "./event/GanttEvent.js";
import { CanCriticalPath } from "./event/CanCriticalPath.js";
import { Direction, ProjectType } from "../../scheduling/Types.js";
export const GanttProjectMixin = (base) => {
    class GanttProjectMixin extends base {
        getType() {
            return ProjectType.Gantt;
        }
        getDefaultEventModelClass() {
            return GanttEvent;
        }
        *calculateStartDate() {
            const direction = yield this.$.direction;
            if (direction === Direction.Forward) {
                let result = this.$.startDate.proposedValue;
                return result || this.$.startDate.getConsistentValue() || (yield* this.unsafeCalculateInitialMinChildrenStartDateDeep());
            }
            else if (direction === Direction.Backward) {
                return yield* this.calculateMinChildrenStartDate();
            }
        }
        *calculateEndDate() {
            const direction = yield this.$.direction;
            if (direction === Direction.Forward) {
                return yield* this.calculateMaxChildrenEndDate();
            }
            else if (direction === Direction.Backward) {
                let result = this.$.endDate.proposedValue;
                return result || this.$.endDate.getConsistentValue() || (yield* this.unsafeCalculateInitialMaxChildrenEndDateDeep());
            }
        }
        *calculateEarlyStartDateConstraintIntervals() {
            const intervals = yield* super.calculateEarlyStartDateConstraintIntervals();
            const direction = yield this.$.direction;
            if (direction === Direction.Forward) {
                const startDate = yield this.$.startDate;
                startDate && intervals.push(DateInterval.new({ startDate }));
            }
            else if (direction === Direction.Backward) {
                const startDate = yield this.$.lateStartDate;
                startDate && intervals.push(DateInterval.new({ startDate }));
            }
            return intervals;
        }
        *calculateLateEndDateConstraintIntervals() {
            const intervals = yield* super.calculateLateEndDateConstraintIntervals();
            const direction = yield this.$.direction;
            if (direction === Direction.Forward) {
                const endDate = yield this.$.earlyEndDate;
                endDate && intervals.push(DateInterval.new({ endDate }));
            }
            else if (direction === Direction.Backward) {
                const endDate = yield this.$.endDate;
                endDate && intervals.push(DateInterval.new({ endDate }));
            }
            return intervals;
        }
        *unsafeCalculateInitialMinChildrenStartDateDeep() {
            const childEvents = yield this.$.childEvents;
            if (!childEvents.size)
                return this.startDate;
            let result = MAX_DATE, child;
            const toProcess = [...childEvents];
            while ((child = toProcess.shift())) {
                const childDate = child.startDate;
                if (childDate && childDate < result)
                    result = childDate;
                toProcess.push(...yield child.$.childEvents);
            }
            return (result.getTime() !== MIN_DATE.getTime() && result.getTime() !== MAX_DATE.getTime()) ? result : null;
        }
        *unsafeCalculateInitialMaxChildrenEndDateDeep() {
            const childEvents = yield this.$.childEvents;
            if (!childEvents.size)
                return this.endDate;
            let result = MIN_DATE, child;
            const toProcess = [...childEvents];
            while ((child = toProcess.shift())) {
                const childDate = child.endDate;
                if (childDate && childDate > result)
                    result = childDate;
                toProcess.push(...yield child.$.childEvents);
            }
            return (result.getTime() !== MIN_DATE.getTime() && result.getTime() !== MAX_DATE.getTime()) ? result : null;
        }
    }
    return GanttProjectMixin;
};
export const BuildMinimalGanttProject = (base = Model) => GanttProjectMixin(CanCriticalPath(ConstrainedLateEvent(BuildMinimalProject(base))));
export class MinimalGanttProject extends BuildMinimalGanttProject() {
    static get defaultConfig() {
        return {
            assignmentsData: null,
            calendarsData: null,
            dependenciesData: null,
            eventsData: null,
            resourcesData: null,
        };
    }
}
MinimalGanttProject.applyConfigs = true;
//# sourceMappingURL=GanttProjectMixin.js.map