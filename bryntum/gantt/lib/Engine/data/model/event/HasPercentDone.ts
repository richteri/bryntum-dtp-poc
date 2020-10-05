import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { calculate, field } from "../../../../ChronoGraph/replica/Entity.js"
import { model_field } from "../../../chrono/ModelFieldAtom.js"
import { Duration, TimeUnit } from "../../../scheduling/Types.js"
import { ProjectMixin } from "../ProjectMixin.js"
import { HasChildren } from "./HasChildren.js"


type PercentDoneSummaryData = {
    totalDuration               : Duration,
    completedDuration           : Duration,
    milestonesNum               : number,
    milestonesTotalPercentDone  : number
}

/* TODO
The percentdone logic calculation is a bit different from the Ext version, in regard of milestones
In Ext, the parent task with milestones only has 100% if all its child milestones have 100%, and 0% otherwise
In engine, the % for milestones is calculated just as average. There are other small nuances too.
Personally I think engine's behavior is more logical and we can change it to Ext version behavior
because we have all data.
*/
export const HasPercentDone = <T extends AnyConstructor<HasChildren>>(base : T) => {

    class HasPercentDone extends base {
        @model_field({ type: 'number', defaultValue: 0 })
        percentDone                 : number

        @field()
        percentDoneSummaryData      : PercentDoneSummaryData


        @calculate('percentDone')
        * calculatePercentDone (proposedValue : number) : ChronoIterator<number> {
            const childEvents : Set<HasPercentDone>     = yield this.$.childEvents
            const project                               = this.getProject() as ProjectMixin

            const autoCalculatePercentDoneForParentTasks = yield project.$.autoCalculatePercentDoneForParentTasks

            if (childEvents.size && autoCalculatePercentDoneForParentTasks) {
                const summaryData : PercentDoneSummaryData = yield this.$.percentDoneSummaryData

                if (summaryData.totalDuration > 0) {
                    return summaryData.completedDuration / summaryData.totalDuration
                }
                else if (summaryData.milestonesNum > 0) {
                    return summaryData.milestonesTotalPercentDone / summaryData.milestonesNum
                } else {
                    return null
                }
            }
            else {
                if (proposedValue !== undefined) return proposedValue

                return this.$.percentDone.value
            }
        }


        @calculate('percentDoneSummaryData')
        * calculatePercentDoneSummaryData () : ChronoIterator<PercentDoneSummaryData | Duration> {
            const childEvents : Set<HasPercentDone>     = yield this.$.childEvents

            if (childEvents.size) {
                let summary : PercentDoneSummaryData = {
                    totalDuration               : 0,
                    completedDuration           : 0,
                    milestonesNum               : 0,
                    milestonesTotalPercentDone  : 0
                }

                for (const childEvent of childEvents) {
                    const childCompletedDuration : PercentDoneSummaryData = yield childEvent.$.percentDoneSummaryData

                    if (childCompletedDuration) {
                        summary.totalDuration               += childCompletedDuration.totalDuration
                        summary.completedDuration           += childCompletedDuration.completedDuration
                        summary.milestonesNum               += childCompletedDuration.milestonesNum
                        summary.milestonesTotalPercentDone  += childCompletedDuration.milestonesTotalPercentDone
                    }
                }

                return summary
            }
            else {
                const duration : Duration = yield this.$.duration

                if (typeof duration == 'number') {

                    const durationInMs : Duration   = yield* this.$convertDuration(duration, yield this.$.durationUnit, TimeUnit.Millisecond)
                    const percentDone : number      = yield this.$.percentDone

                    return {
                        totalDuration               : durationInMs,
                        completedDuration           : durationInMs * percentDone,
                        milestonesNum               : durationInMs === 0 ? 1 : 0,
                        milestonesTotalPercentDone  : durationInMs === 0 ? percentDone : 0,
                    } as PercentDoneSummaryData

                // we can't calculate w/o duration
                } else {
                    return null;
                }
            }
        }
    }

    return HasPercentDone
}

/**
 * This is a mixin, providing the percent done calcualtion feature for the parent events.
 */
export interface HasPercentDone extends Mixin<typeof HasPercentDone> {}
