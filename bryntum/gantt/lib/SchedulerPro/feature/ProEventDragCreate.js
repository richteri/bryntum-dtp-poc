import { base } from '../../Core/helper/MixinHelper.js';
import EventDragCreate from '../../Scheduler/feature/EventDragCreate.js';
import SchedulerFeatureDataLayer from '../../Scheduler/feature/mixin/SchedulerFeatureDataLayer.js';
import ProDataApi from '../data/api/ProDataAPI.js';
import GridFeatureManager from '../../Grid/feature/GridFeatureManager.js';

/**
 * @module SchedulerPro/feature/ProEventDragCreate
 */

/**
 * Event drag-create feature for Pro Scheduler
 *
 * @extends Scheduler/feature/EventDragCreate
 */
export default class ProEventDragCreate extends base(EventDragCreate).mixes(
    SchedulerFeatureDataLayer,
    ProDataApi
) {
    static get featureClass() {
        return 'b-eventdragcreate';
    }

    async finalizeDragCreate(context) {
        const
            me        = this,
            creatorFn = () => {
                me.eventStore.modelClass.exposeProperties();

                const
                    defaultDurationUnit   = me.eventStore.modelClass.getFieldDefinition('durationUnit').defaultValue,
                    { event, assignment } = me.dataApi.addEventToResourceWithoutPropagation({
                        event : {
                            startDate : context.startDate,
                            duration  : context.rowRecord.getCalendar().calculateDuration(context.startDate, context.endDate, defaultDurationUnit)
                        },
                        resource        : context.rowRecord,
                        eventStore      : me.eventStore,
                        assignmentStore : me.assignmentStore
                    });

                me.scheduler.trigger('dragCreateEnd', {
                    newEventRecord      : event,
                    newAssignmentRecord : assignment,
                    resourceRecord      : context.rowRecord,
                    event               : context.event,
                    proxyElement        : me.proxy
                });

                return event;
            };

        if (me.client.hasFeature('eventEdit')) {
            me.client.features.eventEdit.editEvent(creatorFn, context.rowRecord);
        }
        else {
            creatorFn();
            await me.dataApi.propagate();
        }
    }

    getProjectForDataAPI() {
        return this.eventStore.getProject();
    }

    // TODO: extract with into commmon ProSchedulerDataLayer mixin
    //       also refactor ProDependencies feature to use it
    obtainResourceStore(scheduler, config) {
        return scheduler.project.getResourceStore();
    }

    obtainDependencyStore(scheduler, config) {
        return scheduler.project.getDependencyStore();
    }

    obtainAssignmentStore(scheduler, config) {
        return scheduler.project.getAssignmentStore();
    }

    obtainEventStore(scheduler, config) {
        return scheduler.project.getEventStore();
    }
}

GridFeatureManager.registerFeature(ProEventDragCreate, true, 'ProScheduler', 'EventDragCreate');
