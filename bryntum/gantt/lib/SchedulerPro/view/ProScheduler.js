import BryntumWidgetAdapterRegister from '../../Core/adapter/widget/util/BryntumWidgetAdapterRegister.js';
import DomHelper from '../../Core/helper/DomHelper.js';
import VersionHelper from '../../Core/helper/VersionHelper.js';
import Scheduler from '../../Scheduler/view/Scheduler.js';
import CrudManagerView from '../../Scheduler/crud/mixin/CrudManagerView.js';
import ProSchedulerStores from './mixin/ProSchedulerStores.js';
import ProProjectModel from '../model/ProProjectModel.js';
import ProDataAPI from '../data/api/ProDataAPI.js';
import ProTaskModel from '../model/ProTaskModel.js';

import '../feature/ProDependencies.js';
import '../feature/ProEventDrag.js';
import '../feature/ProEventDragCreate.js';
import '../feature/ProNonWorkingTime.js';
import '../feature/ProTaskEdit.js';

import '../localization/En.js';

/**
 * @module SchedulerPro/view/ProScheduler
 */

// TODO: Project configuration and data level interaction in this class might be extracted into SchedulerPro/view/mixin/ProjectConsumer.js
//       which later can be re-used in Gantt/view/Gantt as well
/**
 * ProScheduler is the scheduler with SchedulingEngine support.
 *
 * @mixes SchedulerPro/view/mixin/ProSchedulerStores
 * @extends Scheduler/view/Scheduler
 */
export default class ProScheduler extends ProDataAPI(ProSchedulerStores(CrudManagerView(Scheduler))) {

    static get $name() {
        return 'ProScheduler';
    }

    static get type() {
        return 'schedulerpro';
    }

    static get defaultConfig() {
        return {
            /**
             * The project instance, containing the data, that this chart is going to be visualizing.
             *
             * @config {SchedulerPro.model.ProProjectModel} project
             * @property {SchedulerPro.model.ProProjectModel} project
             */
            project : null,

            /**
             * **This config is not used in the Pro Scheduler view**
             * @private
             * @config {Scheduler.crud.AbstractCrudManagerMixin} crudManagerClass
             */

            /**
             * **This config is not used in the Pro Scheduler view. Please use {@link #config-project} config instead**
             * @private
             * @config {Object|Scheduler.crud.AbstractCrudManagerMixin} crudManager
             */

            /**
             * Decimal precision used for displaying durations, used by tooltips and DurationColumn.
             * Specify `false` to use raw value
             * @config {Number|Boolean}
             * @default
             */
            durationDisplayPrecision : 1,

            // data for the stores, in the topological order
            calendars    : null,
            resources    : null,
            tasks        : null,
            dependencies : null,
            assignments  : null,

            features : {
                dependencies : true,
                eventEdit    : true
            }
        };
    }

    construct(config) {
        const
            me = this,
            hasInlineStores = Boolean(config.calendars || config.taskStore || config.dependencyStore || config.resourceStore || config.assignmentStore),
            hasInlineData = Boolean(config.calendars || config.tasks || config.dependencies || config.resources || config.assignments);

        let project = config.project;

        if (project && (hasInlineStores || hasInlineData)) {
            throw new Error('Providing both project and inline data is not supported');
        }

        // gather all data in the ProjectModel instance
        if (!project) {
            project = config.project = new ProProjectModel({
                calendarsData    : config.calendars,
                eventsData       : config.tasks,
                dependenciesData : config.dependencies,
                resourcesData    : config.resources,
                assignmentsData  : config.assignments,

                resourceStore   : config.resourceStore,
                eventStore      : config.taskStore,
                assignmentStore : config.assignmentStore,
                dependencyStore : config.dependencyStore,
                timeRangeStore  : config.timeRangeStore
            });

            delete config.resourceStore;
            delete config.taskStore;
            delete config.assignmentStore;
            delete config.dependencyStore;
            delete config.timeRangeStore;

            delete config.calendars;
            delete config.resources;
            delete config.tasks;
            delete config.assignments;
            delete config.dependencies;
        }
        // EOF data gathering

        // project itself represents a crud manager instance
        config.crudManager = project;

        project.on({
            refresh : me.onProjectRefresh,
            load    : me.onProjectLoad,
            thisObj : me
        });

        super.construct(config);
    }

    onProjectRefresh() {
        this.refreshRows();
        // storing feature into variable allows to save quite a few time on big projects
        const dependencyFeature = this.features.dependencies;
        // Add all dependencies to the cache, required dependencies will be drawn in next animation frame and will be
        // properly updated on view scroll
        // TODO: This should move into the feature
        if (dependencyFeature) {
            this.dependencies.forEach(dep => dependencyFeature.addToGridCache(dep));
        }
    }

    // On project load, show project start date unless implementer chose a specific start date of the timeline
    onProjectLoad() {
        const me = this;

        if (!('startDate' in me.initialConfig) && me.project.startDate) {
            me.startDate = me.project.startDate;
        }
    }

    // region DataAPI

    getProjectForDataAPI() {
        return this.project;
    }

    // endregion

    // region EventNavigation

    /**
     *
     * @param {Scheduler.model.AssignmentModel[]|Scheduler.model.EventModel[]} records
     * @returns {Promise}
     * @private
     */
    async removeRecords(records) {
        const me = this;

        if (!me.readOnly && records.length) {
            if (records[0] instanceof ProTaskModel) {
                await me.dataApi.removeEvents(records);
            }
            else {
                const resources = records.map(r => r.resource);

                await me.dataApi.removeAssignments(records, me.removeUnassignedEvent);

                resources.forEach(r => me.repaintEventsForResource(r));
            }
        }
    }

    // endregion

    //region Appearance

    // Overrides grid to take project loading into account
    toggleEmptyText() {
        if (this.bodyContainer) {
            DomHelper.toggleClasses(this.bodyContainer, 'b-grid-empty', !(this.rowManager.rowCount || this.project.isCrudManagerLoading));
        }
    }

    //endregion

}

BryntumWidgetAdapterRegister.register(ProScheduler.type, ProScheduler);

VersionHelper.setVersion(ProScheduler.type, VersionHelper.getVersion('scheduler'));
