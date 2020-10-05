import { base } from '../../Core/helper/MixinHelper.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import EventDrag from '../../Scheduler/feature/EventDrag.js';
import ProDataAPI from '../data/api/ProDataAPI.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module SchedulerPro/feature/ProEventDrag
 */

/**
 * Event drag feature adopted to work with ProScheduler
 *
 * @extends Scheduler/feature/EventDrag
 */
export default class ProEventDrag extends base(EventDrag).mixes(
    ProDataAPI
) {
    getProjectForDataAPI() {
        return this.eventStore.getProject();
    }

    updateRecordsMultipleAssignmentMode(fromScheduler, toScheduler, context, copyKeyPressed) {
        // NOTE:
        // Event might be dragged to a new proposed date, designated by the `startDate` argument, but it might be set back to it's original time
        // position after propagate, i.e. it will not fire `update` event with new start date set accordingly to `startDate` argument since after
        // propagation the proposed value will be rejected and reset to the last consistent one. Nevertheless the event div is already translated/moved
        // to a new position, but since there will be no `update` event fired it will stay there thus showing outdated position.
        // The case is covered in dependency_draw_1.t.js test.

        const
            me                   = this,
            draggedAssignments   = context.draggedRecords,
            consistentStartDates = draggedAssignments.map(a => {
                return me.dataApi.getAssignmentEvent({ assignment : a, eventStore : me.eventStore }).startDate;
            });

        this.dataApi.beginPropagationBatch();

        super.updateRecordsMultipleAssignmentMode(fromScheduler, toScheduler, context, copyKeyPressed);

        context.valid = true;
// TODO: Why not await?
        return this.dataApi.endPropagationBatch().then(result => {
            // If start date has not changed then there will be no `update` event and thus event elements will show outdated position
            // translated by drag operation, we have to forcefully put those elements back and redraw the dependency arrows to depict correct positions
            draggedAssignments.forEach((a, i) => {
                const
                    eventDragged        = me.dataApi.getAssignmentEvent({ assignment : a, eventStore : me.eventStore }),
                    consistentStartDate = consistentStartDates[i];

                if (consistentStartDate - eventDragged.startDate === 0) {
                    // Event position
                    const eventElement = me.client.getElementFromAssignmentRecord(a);

                    if (eventElement) {
                        DomHelper.setTranslateX(eventElement.parentElement, me.client.getCoordinateFromDate(consistentStartDate));
                        // Dependency lines
                        const depFeature = me.client.features.dependencies;
                        if (depFeature) {
                            depFeature.updateDependenciesForTimeSpan(a, eventElement);
                        }
                    }
                }

            });

            return result;
        });
    }
}

GridFeatureManager.registerFeature(ProEventDrag, true, 'ProScheduler', 'EventDrag');
