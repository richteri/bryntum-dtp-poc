import Base from '../../../Core/Base.js';

/**
 * @module Scheduler/data/api/ProAssignmentAPI
 */

/**
 * Pro assignment model data API mixin
 *
 * The mixin should be mixed alongside with other API mixins, because it might rely on them.
 *
 * @mixin
 */
export default Target => class ProAssignmentAPI extends (Target || Base) {
    // NOTE: Add pro api override methods here

    addAssignment({ event, resource, assignmentStore, assignmentConfig }) {
        const result = {
            assignment : assignmentStore.add(Object.assign({}, assignmentConfig, {
                event    : event,
                resource : resource
            }))[0]
        };

        result.propagationPromise = assignmentStore.getProject().propagate();

        return result;
    }

    removeAssignments(records, removeUnassignedEvent) {
        const removedEvents = new Set();

        records.forEach(assignment => {
            const eventRecord = assignment.event;

            // When removing the last assignment, also remove the event
            if (eventRecord && !eventRecord.placeHolder && removeUnassignedEvent) {
                const remainingAssignments = eventRecord.assignments;

                // Assignments will be only update after project propagate, we cannot wait for propagation on every iteration.
                // If passed records array contains all the event record assignments, we know we can remove event
                if (remainingAssignments.every(assignment => records.includes(assignment))) {
                    if (!removedEvents.has(eventRecord.id)) {
                        eventRecord.remove();
                        removedEvents.add(eventRecord.id);
                    }
                }
                else {
                    assignment.remove();
                }
            }
        });

        return this.project.propagate();
    }
};
