import { ChronoGraph } from "../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin } from "../../ChronoGraph/class/Mixin.js"
import { CalendarManagerStoreMixin } from "../calendar/CalendarManagerStoreMixin.js"
import { IProjectMixin } from "./model/ProjectMixin.js"
import { AssignmentStoreMixin } from "./store/AssignmentStoreMixin.js"
import { DependencyStoreMixin } from "./store/DependencyStoreMixin.js"
import { EventStoreMixin } from "./store/EventStoreMixin.js"
import { ResourceStoreMixin } from "./store/ResourceStoreMixin.js"
import { ModelId } from "./Types.js"
import { EventMixin } from "./model/event/EventMixin.js"
import { ResourceMixin } from "./model/ResourceMixin.js"
import { AssignmentMixin } from "./model/AssignmentMixin.js"
import { DependencyMixin } from "./model/DependencyMixin.js"
import { CalendarMixin } from "../calendar/CalendarMixin.js"


export const PartOfProjectGenericMixin = <T extends AnyConstructor<object>>(base : T)  => {

    class PartOfProjectGenericMixin extends base {

        /**
         * The [[ProjectMixin]] instance, this entity belongs to. Because of the issues with
         * the TypeScript compiler, this property has actual type of `IProjectMixin`,
         * which is mirroring the actual [[ProjectMixin]]. Only some properties are mirrored,
         * it is advised to always "cast" this property to the [[ProjectMixin]] type.
         */
        project             : IProjectMixin


        calculateProject () : IProjectMixin {
            throw new Error("Implement me")
        }


        /**
         * The method to set the [[ProjectMixin]] instance, this entity belongs to.
         */
        setProject (project : IProjectMixin) : any {
            return this.project = project
        }


        /**
         * The method to get the [[ProjectMixin]] instance, this entity belongs to.
         */
        getProject () : IProjectMixin {
            if (this.project) return this.project

            return this.setProject(this.calculateProject())
        }


        /**
         * The method to get the `ChronoGraph` instance, this entity belongs to.
         */
        getGraph () : ChronoGraph {
            const project       = this.getProject()

            return project && project.getGraph()
        }


        /**
         * Convenience method to get the instance of the event store in the [[ProjectMixin]] instance, this entity belongs to.
         */
        getEventStore () : EventStoreMixin {
            const project   = this.getProject()

            return project && project.eventStore
        }


        /**
         * Convenience method to get the instance of the dependency store in the [[ProjectMixin]] instance, this entity belongs to.
         */
        getDependencyStore () : DependencyStoreMixin {
            const project   = this.getProject()

            return project && project.dependencyStore
        }


        /**
         * Convenience method to get the instance of the assignment store in the [[ProjectMixin]] instance, this entity belongs to.
         */
        getAssignmentStore () : AssignmentStoreMixin {
            const project   = this.getProject()

            return project && project.assignmentStore
        }


        /**
         * Convenience method to get the instance of the resource store in the [[ProjectMixin]] instance, this entity belongs to.
         */
        getResourceStore () : ResourceStoreMixin {
            const project   = this.getProject()

            return project && project.resourceStore
        }


        /**
         * Convenience method to get the instance of the calendar manager store in the [[ProjectMixin]] instance, this entity belongs to.
         */
        getCalendarManagerStore () : CalendarManagerStoreMixin {
            const project   = this.getProject()

            return project && project.calendarManagerStore
        }
        // EOF Store getters

        // Entity getters

        getEventById (id : ModelId) : EventMixin {
            return this.getEventStore() && this.getEventStore().getById(id)
        }
 
 
        getDependencyById (id : ModelId) : DependencyMixin {
            return this.getDependencyStore() && this.getDependencyStore().getById(id)
        }
 
 
        getResourceById (id : ModelId) : ResourceMixin {
            return this.getResourceStore() && this.getResourceStore().getById(id)
        }
 
 
        getAssignmentById (id : ModelId) : AssignmentMixin {
            return this.getAssignmentStore() && this.getAssignmentStore().getById(id)
        }
 
 
        getCalendarById (id : ModelId) : CalendarMixin {
            return this.getCalendarManagerStore() && this.getCalendarManagerStore().getById(id)
        }

        // EOF Entity getters
    }

    return PartOfProjectGenericMixin
}

/**
 * This a base generic mixin for every class, that belongs to a project.
 *
 * It just provides getter/setter for the `project` property, along with some convenience methods
 * to access the project's stores.
 */
export interface PartOfProjectGenericMixin extends Mixin<typeof PartOfProjectGenericMixin> {}
