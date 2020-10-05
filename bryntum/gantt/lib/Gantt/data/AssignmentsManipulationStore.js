import Store from '../../Core/data/Store.js';
import { hasResourceMixin } from '../../Engine/data/model/ResourceMixin.js';
import { hasHasAssignments } from '../../Engine/data/model/event/HasAssignments.js';
import AssignmentsManipulationModel from '../model/AssignmentsManipulationModel.js';
import Parser from '../util/ResourceAssignmentParser.js';
import { PropagationResult } from '../../ChronoGraph/chrono/Graph.js';

const { compose } = Parser;

/**
 * @module Gantt/data/AssignmentsManipulationStore
 */

/**
 * Special store class for _single_ task/event assignments manipulation, used by {@link Gantt/widget/AssignmentGrid}
 *
 * Contains a collection of {@link Gantt/model/AssignmentsManipulationModel} records.
 *
 * @extends Core/data/Store
 * @internal
 */
export default class AssignmentsManipulationStore extends Store {
    //region Config
    static get defaultConfig() {
        return {
            modelClass : AssignmentsManipulationModel,
            storeId    : 'assignmentsmanipulation',
            storage    : {
                extraKeys : ['resource']
            },
            callOnFunctions : true,

            /**
             * Event model to manipulate assignments of, the event should be part of a project.
             *
             * @config {Gantt.model.TaskModel}
             */
            projectEvent : null,

            /**
             * Flag indicating whether assigned resources should be placed (floated) before unassinged ones.
             *
             * @config {boolean}
             * @private
             */
            floatAssignedResources : true,

            /**
             * Flag indicating whether assigned resources should be floated live
             *
             * @config {boolean}
             * @private
             */
            liveFloatAssignedResources : false
        };
    }

    afterConfigure() {
        const me = this;

        super.afterConfigure();

        me.addSorter({
            fn : me.defaultSort.bind(me)
        });
    }
    //endregion

    get projectEvent() {
        return this._projectEvent;
    }

    set projectEvent(projectEvent) {
        const me = this;

        // If the event is the same, but some underlying data has changed, we must still update
        if (projectEvent != me._projectEvent || (projectEvent && (projectEvent.generation !== me._projectEventGeneration))) {

            me._projectEvent = projectEvent;
            me._projectEventGeneration = projectEvent.generation;

            if (projectEvent) {
                //<debug>
                if (!hasHasAssignments(projectEvent)) {
                    throw new Error('Event should have HasAssignments mixin mixed in!');
                }
                // Being part of project event should have access to event store
                if (!projectEvent.getEventStore()) {
                    throw new Error('Event should be part of a event store');
                }

                if (!projectEvent.getResourceStore()) {
                    throw new Error('Event\'s event store should have reference to resource store!');
                }

                if (!projectEvent.getAssignmentStore()) {
                    throw new Error('Event\'s event store should have reference to assignment store!');
                }
                //</debug>

                me.fillFromMaster();

                const
                    { assignments }     = projectEvent,
                    originalAssignments = [];

                assignments.forEach(assignment => {
                    const assignmentsManipulationRecord = me.find(assignmentsManipulationRecord => assignmentsManipulationRecord.resource === assignment.resource);

                    if (assignmentsManipulationRecord) {
                        assignmentsManipulationRecord.set({
                            assignment,
                            event : projectEvent,
                            units : assignment.units || 0
                        });

                        originalAssignments.push(assignmentsManipulationRecord);
                    }
                });

                me.originalAssignmentManipulationRecords = originalAssignments;

                me.acceptChanges();
                me.sort();
            }
            else {
                me.removeAll();
            }
        }
    }

    get floatAssignedResources() {
        return this._floatAssignedResources;
    }

    set floatAssignedResources(value) {
        const me = this;

        if (value !== me.floatAssignedResources) {
            me._floatAssignedResources = value;
            me.sort();
        }
    }

    get assignmentStore() {
        return this.projectEvent && this.projectEvent.getAssignmentStore() || null;
    }

    get resourceStore() {
        return this.projectEvent && this.projectEvent.getResourceStore() || null;
    }

    /**
     * Fills this store from master {@link Gantt/data/ResourceStore resource} store and {@link Gantt/data/AssignmentStore assignment} store.
     * @internal
     */
    fillFromMaster() {
        const
            me           = this,
            projectEvent = me.projectEvent;

        if (projectEvent) {
            me.data = me.resourceStore.map(resource => ({ resource }));
        }
    }

    /**
     * Saves changes back master {@link Gantt/data/AssignmentStore assignment store}.
     * @fires changesApplied
     * @internal
     */
    async applyChanges() {
        const
            me                                   = this,
            { projectEvent, assignmentStore }    = me,
            toAdd                                = [],
            assignmentManipulationRecords        = me.query(record => record.event && record.units, true),
            removedAssignmentManipulationRecords = me.originalAssignmentManipulationRecords.filter(a => !assignmentManipulationRecords.includes(a));

        let result;

        // Data in this store can be modified only
        if (assignmentManipulationRecords.length || removedAssignmentManipulationRecords.length) {
            // TODO: Remove threshold manipulation when there is a silent propagate()
            const
                replica = projectEvent.project.replica,
                oldThreshold = replica.projectRefreshThreshold;

            assignmentManipulationRecords.forEach(assignmentManipulationRecord => {
                const realAssignment = assignmentManipulationRecord.assignment;

                // Modified, units is the only field we allow modify
                if (realAssignment) {
                    realAssignment.$.units.put(assignmentManipulationRecord.units);
                }
                // New one
                else {
                    toAdd.push({
                        resource : assignmentManipulationRecord.resource,
                        event    : assignmentManipulationRecord.event,
                        units    : assignmentManipulationRecord.units
                    });
                }
            });

            // Clear modified collection
            me.commit();

            assignmentStore.remove(removedAssignmentManipulationRecords.map(mani => mani.assignment));
            assignmentStore.add(toAdd);

            replica.projectRefreshThreshold = 0;

            result = await projectEvent.propagate();

            replica.projectRefreshThreshold = oldThreshold;

            // Fake ending a batch
            assignmentStore.trigger('refresh', { action : 'dataset' });

            if (result === PropagationResult.Completed) {

                if (me.floatAssignedResources) {
                    me.sort();
                }

                /**
                 * Fires when all changes done to the models in this store are applied to {@link Gantt/data/AssignmentStore assignment store}
                 * @event changesApplied
                 */
                me.trigger('changesApplied');
            }
        }
        else {
            result = PropagationResult.Complete;
        }

        return result;
    }

    /**
     * Returns current assignment record for resource
     *
     * @param {Gantt.model.ResourceModel} resource Resource model to get assignment record for
     * @return {Gantt.model.AssignmentsManipulationModel}
     * @internal
     */
    getResourceAssignment(resource) {
        //<debug>
        if (!hasResourceMixin(resource)) {
            throw new Error('Invalid resource given!');
        }
        //</debug>
        return this.storage.getBy('resource', resource);
    }

    get activeAssignments() {
        const
            me           = this,
            projectEvent = me.projectEvent;

        return me.query(a => a.event === projectEvent);
    }

    toValueString() {
        const { activeAssignments } = this;

        return compose({
            rest        : '',
            assignments : activeAssignments
        });
    }

    defaultSort(lhs, rhs) {
        let result = 0;

        if (this.floatAssignedResources) {
            if (!rhs.event && lhs.event) {
                result = -1;
            }
            else if (!lhs.event && rhs.event) {
                result = 1;
            }
            else {
                result = lhs.name.localeCompare(rhs.name);
            }
        }
        else {
            result = lhs.name.localeCompare(rhs.name);
        }

        return result;
    }

    onUpdate({ changes }) {
        const me = this;

        if (!me.isConfiguring) {
            if (Object.hasOwnProperty.call(changes, 'event')) {
                if (me.floatAssignedResources && me.liveFloatAssignedResources) {
                    me.sort();
                }
            }
        }
    }
}
