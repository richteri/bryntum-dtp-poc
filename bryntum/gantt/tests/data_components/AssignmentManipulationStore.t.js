import AssignmentsManipulationStore from '../../lib/Gantt/data/AssignmentsManipulationStore.js';
import { MinimalGanttProject } from '../../lib/Engine/data/model/GanttProjectMixin.js';

StartTest((t) => {
    let assignmentsManipulationStore;

    t.beforeEach((t) => {
        if (assignmentsManipulationStore) {
            assignmentsManipulationStore.destroy();
            assignmentsManipulationStore = null;
        }
    });

    const getProject = () => {
        return new MinimalGanttProject(t.getProjectData());
    };

    t.it('Should fill itself up using provided task', async t => {
        const
            project         = getProject(),
            eventStore      = project.getEventStore(),
            resourceStore   = project.getResourceStore(),
            assignmentStore = project.getAssignmentStore();

        await project.propagate();

        const event = eventStore.getById(117);

        assignmentsManipulationStore = new AssignmentsManipulationStore({
            projectEvent : event
        });

        t.is(assignmentsManipulationStore.resourceStore, resourceStore, 'Assignment manipulation store obtained resource store via event');
        t.is(assignmentsManipulationStore.assignmentStore, assignmentStore, 'Assignment manipulation store obtained assignment store via event');
        t.is(assignmentsManipulationStore.count, resourceStore.count, 'All resources are available for assignment');

        const assignedResourcesCount = assignmentsManipulationStore.reduce(
            (count, assignment) => {
                return count + (assignment.event === event ? 1 : 0);
            },
            0
        );

        t.is(assignedResourcesCount, 2, `Event ${event.id} has ${assignedResourcesCount} resources assigned`);
    });
});
