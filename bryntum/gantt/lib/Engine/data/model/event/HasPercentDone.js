var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js";
import { model_field } from "../../../chrono/ModelFieldAtom.js";
import { TimeUnit } from "../../../scheduling/Types.js";
export const HasPercentDone = (base) => {
    class HasPercentDone extends base {
        *calculatePercentDone(proposedValue) {
            const childEvents = yield this.$.childEvents;
            const project = this.getProject();
            const autoCalculatePercentDoneForParentTasks = yield project.$.autoCalculatePercentDoneForParentTasks;
            if (childEvents.size && autoCalculatePercentDoneForParentTasks) {
                const summaryData = yield this.$.percentDoneSummaryData;
                if (summaryData.totalDuration > 0) {
                    return summaryData.completedDuration / summaryData.totalDuration;
                }
                else if (summaryData.milestonesNum > 0) {
                    return summaryData.milestonesTotalPercentDone / summaryData.milestonesNum;
                }
                else {
                    return null;
                }
            }
            else {
                if (proposedValue !== undefined)
                    return proposedValue;
                return this.$.percentDone.value;
            }
        }
        *calculatePercentDoneSummaryData() {
            const childEvents = yield this.$.childEvents;
            if (childEvents.size) {
                let summary = {
                    totalDuration: 0,
                    completedDuration: 0,
                    milestonesNum: 0,
                    milestonesTotalPercentDone: 0
                };
                for (const childEvent of childEvents) {
                    const childCompletedDuration = yield childEvent.$.percentDoneSummaryData;
                    if (childCompletedDuration) {
                        summary.totalDuration += childCompletedDuration.totalDuration;
                        summary.completedDuration += childCompletedDuration.completedDuration;
                        summary.milestonesNum += childCompletedDuration.milestonesNum;
                        summary.milestonesTotalPercentDone += childCompletedDuration.milestonesTotalPercentDone;
                    }
                }
                return summary;
            }
            else {
                const duration = yield this.$.duration;
                if (typeof duration == 'number') {
                    const durationInMs = yield* this.$convertDuration(duration, yield this.$.durationUnit, TimeUnit.Millisecond);
                    const percentDone = yield this.$.percentDone;
                    return {
                        totalDuration: durationInMs,
                        completedDuration: durationInMs * percentDone,
                        milestonesNum: durationInMs === 0 ? 1 : 0,
                        milestonesTotalPercentDone: durationInMs === 0 ? percentDone : 0,
                    };
                }
                else {
                    return null;
                }
            }
        }
    }
    __decorate([
        model_field({ type: 'number', defaultValue: 0 })
    ], HasPercentDone.prototype, "percentDone", void 0);
    __decorate([
        field()
    ], HasPercentDone.prototype, "percentDoneSummaryData", void 0);
    __decorate([
        calculate('percentDone')
    ], HasPercentDone.prototype, "calculatePercentDone", null);
    __decorate([
        calculate('percentDoneSummaryData')
    ], HasPercentDone.prototype, "calculatePercentDoneSummaryData", null);
    return HasPercentDone;
};
//# sourceMappingURL=HasPercentDone.js.map