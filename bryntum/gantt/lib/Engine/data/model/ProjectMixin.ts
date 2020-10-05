import Model from "../../../Core/data/Model.js"
import StateTrackingManager from "../../../Core/data/stm/StateTrackingManager.js"
import Store from "../../../Core/data/Store.js"
import Events, { EventsMixin } from "../../../Core/mixin/Events.js"
import { ChronoAtom, ChronoIterator } from "../../../ChronoGraph/chrono/Atom.js"
import { EffectResolverFunction, GraphCycleDetectedEffect, EffectResolutionResult } from "../../../ChronoGraph/chrono/Effect.js"
import { ChronoGraph, PropagationResult } from "../../../ChronoGraph/chrono/Graph.js"
import { AnyConstructor, Mixin, MixinConstructor } from "../../../ChronoGraph/class/Mixin.js"
import { FieldAtomI } from "../../../ChronoGraph/replica/Atom.js"
import { Entity } from "../../../ChronoGraph/replica/Entity.js"
import { MinimalReplica } from "../../../ChronoGraph/replica/Replica.js"
import { Schema } from "../../../ChronoGraph/schema/Schema.js"
import { CalendarManagerStoreMixin, MinimalCalendarManagerStore } from "../../calendar/CalendarManagerStoreMixin.js"
import { CalendarMixin, MinimalCalendar } from "../../calendar/CalendarMixin.js"
import { model_field } from "../../chrono/ModelFieldAtom.js"
import { EngineReplica } from "../../chrono/Replica.js"
import { DependenciesCalendar, ProjectType } from "../../scheduling/Types.js"
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js"
import { AssignmentStoreMixin, MinimalAssignmentStore } from "../store/AssignmentStoreMixin.js"
import { DependencyStoreMixin, MinimalDependencyStore } from "../store/DependencyStoreMixin.js"
import { EventStoreMixin, MinimalEventStore } from "../store/EventStoreMixin.js"
import { MinimalResourceStore, ResourceStoreMixin } from "../store/ResourceStoreMixin.js"
import { AssignmentMixin, MinimalAssignment } from "./AssignmentMixin.js"
import { DependencyMixin, MinimalDependency } from "./DependencyMixin.js"
import { GanttEvent } from "./event/GanttEvent.js"
import { ConstrainedEvent, ConstraintInterval } from "./event/ConstrainedEvent.js"
import { EventMixin } from "./event/EventMixin.js"
import { HasAssignments } from "./event/HasAssignments.js"
import { HasChildren } from "./event/HasChildren.js"
import { HasEffort } from "./event/HasEffort.js"
import { HasCalendarMixin } from "./HasCalendarMixin.js"
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js"
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js"
import { MinimalResource, ResourceMixin } from "./ResourceMixin.js"


export interface IProjectMixin {
    eventStore                  : EventStoreMixin
    dependencyStore             : DependencyStoreMixin
    resourceStore               : ResourceStoreMixin
    assignmentStore             : AssignmentStoreMixin
    calendarManagerStore        : CalendarManagerStoreMixin
    defaultCalendar             : CalendarMixin
    getGraph ()                 : ChronoGraph
    calendar                    : CalendarMixin
    startDate                   : Date,
    endDate                     : Date,
    dependenciesCalendar        : DependenciesCalendar

    $                           : { [s in keyof this] : FieldAtomI }

    hasListener (event : string) : boolean
    trigger (event : string, options? : object) : boolean
    on (...args : any[]) : void

    suspendPropagate () : void
    resumePropagate (trigger? : boolean) : Promise<PropagationResult>

    propagate (onEffect? : EffectResolverFunction) : Promise<PropagationResult>
    tryPropagateWithNodes (onEffect? : EffectResolverFunction, nodes? : ChronoAtom[], hatchFn? : Function) : Promise<PropagationResult>
    tryPropagateWithEntities (onEffect? : EffectResolverFunction, entities? : Entity[], hatchFn? : Function) : Promise<PropagationResult>
    tryPropagateWithChanges (changerFn : Function, onEffect? : EffectResolverFunction) : Promise<PropagationResult>
    waitForPropagateCompleted () : Promise<PropagationResult | null>

    getStm () : StateTrackingManager

    getType () : ProjectType

    $convertDuration : any
    convertDuration : any
}


export type ProjectDataPackage = {
    eventsData?             : any[]
    dependenciesData?       : any[]
    resourcesData?          : any[]
    assignmentsData?        : any[]
    calendarsData?          : any[]
}

export const ProjectMixin = <T extends AnyConstructor<HasCalendarMixin & HasAssignments & EventsMixin & Entity>>(base : T) => {

    class ProjectMixin extends base implements IProjectMixin {

        replica                   : EngineReplica

        // Note, that we specify the `EventMixin` as the type for events, assuming the minimal possible functionality
        // (like in scheduler). To extend the functionality need to override this property
        /**
         * The constructor for the "Event" entity of the project
         */
        eventModelClass           : AnyConstructor<EventMixin>

        /**
         * The constructor for the "Dependency" entity of the project
         */
        dependencyModelClass      : AnyConstructor<DependencyMixin>

        /**
         * The constructor for the "Resource" entity of the project
         */
        resourceModelClass        : AnyConstructor<ResourceMixin>

        /**
         * The constructor for the "Assignment" entity of the project
         */
        assignmentModelClass      : AnyConstructor<AssignmentMixin>

        /**
         * The constructor for the "Calendar" entity of the project
         */
        calendarModelClass        : AnyConstructor<CalendarMixin>

        /**
         * The constructor for the "Events" collection of the project
         */
        eventStoreClass           : AnyConstructor<EventStoreMixin>

        /**
         * The constructor for the "Dependencies" collection of the project
         */
        dependencyStoreClass      : AnyConstructor<DependencyStoreMixin>

        /**
         * The constructor for the "Resources" collection of the project
         */
        resourceStoreClass        : AnyConstructor<ResourceStoreMixin>

        /**
         * The constructor for the "Assignments" collection of the project
         */
        assignmentStoreClass      : AnyConstructor<AssignmentStoreMixin>

        /**
         * The constructor for the "Calendars" collection of the project
         */
        calendarManagerStoreClass : AnyConstructor<CalendarManagerStoreMixin>

        /**
         * State tracking manager instance the project relies on
         */
        stm                       : StateTrackingManager

        /**
         * The instance of the "Events" collection of the project
         */
        eventStore                : EventStoreMixin

        /**
         * The instance of the "Dependencies" collection of the project
         */
        dependencyStore           : DependencyStoreMixin

        /**
         * The instance of the "Resources" collection of the project
         */
        resourceStore             : ResourceStoreMixin

        /**
         * The instance of the "Assignments" collection of the project
         */
        assignmentStore           : AssignmentStoreMixin

        /**
         * The instance of the "Calendars" collection of the project
         */
        calendarManagerStore      : CalendarManagerStoreMixin

        eventsData                : any[]
        dependenciesData          : any[]
        resourcesData             : any[]
        assignmentsData           : any[]
        calendarsData             : any[]

        defaultCalendar           : MinimalCalendar

        @model_field({ type : 'boolean', defaultValue : true })
        unspecifiedTimeIsWorking  : boolean

        @model_field({ type : 'string', defaultValue : DependenciesCalendar.ToEvent })
        dependenciesCalendar      : DependenciesCalendar

        @model_field({ type : 'boolean', defaultValue : true })
        autoCalculatePercentDoneForParentTasks      : boolean

        construct (config : any = {}) {
            this.replica        = EngineReplica(MinimalReplica).new({ project : this, schema : Schema.new() })

            // Expand project by default to make getRange to work
            if (!config.hasOwnProperty('expanded')) {
                config.expanded = true
            }

            const hasInlineStore = Boolean(
                config.calendarManagerStore || config.eventStore || config.dependencyStore || config.resourceStore || config.assignmentStore
            )

            super.construct(config)

            if (!this.eventModelClass) this.eventModelClass = this.getDefaultEventModelClass()
            if (!this.eventStoreClass) this.eventStoreClass = this.getDefaultEventStoreClass()

            if (!this.dependencyModelClass) this.dependencyModelClass = this.getDefaultDependencyModelClass()
            if (!this.dependencyStoreClass) this.dependencyStoreClass = this.getDefaultDependencyStoreClass()

            if (!this.resourceModelClass) this.resourceModelClass = this.getDefaultResourceModelClass()
            if (!this.resourceStoreClass) this.resourceStoreClass = this.getDefaultResourceStoreClass()

            if (!this.assignmentModelClass) this.assignmentModelClass = this.getDefaultAssignmentModelClass()
            if (!this.assignmentStoreClass) this.assignmentStoreClass = this.getDefaultAssignmentStoreClass()

            if (!this.calendarModelClass) this.calendarModelClass = this.getDefaultCalendarModelClass()
            if (!this.calendarManagerStoreClass) this.calendarManagerStoreClass = this.getDefaultCalendarManagerStoreClass()


            this.replica.addEntity(this)

            this.stm = new StateTrackingManager({ disabled : true })

            this.stm.on({
                // Propagate on undo/redo
                restoringStop: async () => {
                    // Disable STM meanwhile to not pick it up as a new STM transaction
                    this.stm.disable()
                    await this.propagate()
                    this.stm.enable()
                    this.trigger('stateRestoringDone')
                }
            })

            if (this.calendarManagerStore) {
                this.setCalendarManagerStore(this.calendarManagerStore)
            } else
                this.calendarManagerStore = new this.calendarManagerStoreClass({

                    modelClass  : this.calendarModelClass,

                    project     : this,

                    stm         : this.stm
                })

            // not part of the CalendarManagerStore intentionally, not persisted
            this.defaultCalendar    = new this.calendarManagerStore.modelClass({
                hoursPerDay                 : 24,
                daysPerWeek                 : 7,
                daysPerMonth                : 30,

                unspecifiedTimeIsWorking    : this.unspecifiedTimeIsWorking
            })

            this.defaultCalendar.project = this

            if (this.eventStore) {
                // a valid use case for accessor?
                this.setEventStore(this.eventStore)
            } else
                this.eventStore      = new this.eventStoreClass({

                    modelClass  : this.eventModelClass,

                    tree        : true,

                    project     : this,

                    stm         : this.stm
                })

            if (this.dependencyStore) {
                this.setDependencyStore(this.dependencyStore)
            } else
                this.dependencyStore    = new this.dependencyStoreClass({

                    modelClass  : this.dependencyModelClass,

                    project     : this,

                    stm         : this.stm
                })

            if (this.resourceStore) {
                this.setResourceStore(this.resourceStore)
            } else
                this.resourceStore    = new this.resourceStoreClass({

                    modelClass  : this.resourceModelClass,

                    project     : this,

                    stm         : this.stm
                })

            if (this.assignmentStore) {
                this.setAssignmentStore(this.assignmentStore)
            } else
                this.assignmentStore    = new this.assignmentStoreClass({

                    modelClass  : this.assignmentModelClass,

                    project     : this,

                    stm         : this.stm
                })

            const hasInlineData = Boolean(this.calendarsData || this.eventsData || this.dependenciesData || this.resourcesData || this.assignmentsData)

            if (hasInlineData) {
                this.loadInlineData({
                    calendarsData       : this.calendarsData,
                    eventsData          : this.eventsData,
                    dependenciesData    : this.dependenciesData,
                    resourcesData       : this.resourcesData,
                    assignmentsData     : this.assignmentsData
                })

                delete this.calendarsData
                delete this.eventsData
                delete this.dependenciesData
                delete this.resourcesData
                delete this.assignmentsData
            }

            // TODO this should be the same propagate as in "loadInlineData"
            // or at least fire same side effects
            if (hasInlineStore && !hasInlineData) this.propagate()
        }

        getType () : ProjectType {
            return ProjectType.Unknown
        }

        getDefaultEventModelClass () : this['eventModelClass'] {
            return GanttEvent
        }


        getDefaultEventStoreClass () : this['eventStoreClass'] {
            return MinimalEventStore
        }


        getDefaultDependencyModelClass () : this['dependencyModelClass'] {
            return MinimalDependency
        }


        getDefaultDependencyStoreClass () : this['dependencyStoreClass'] {
            return MinimalDependencyStore
        }


        getDefaultResourceModelClass () : this['resourceModelClass'] {
            return MinimalResource
        }


        getDefaultResourceStoreClass () : this['resourceStoreClass'] {
            return MinimalResourceStore
        }


        getDefaultAssignmentModelClass () : this['assignmentModelClass'] {
            return MinimalAssignment
        }


        getDefaultAssignmentStoreClass () : this['assignmentStoreClass'] {
            return MinimalAssignmentStore
        }


        getDefaultCalendarModelClass () : this['calendarModelClass'] {
            return MinimalCalendar
        }


        getDefaultCalendarManagerStoreClass () : this['calendarManagerStoreClass'] {
            return MinimalCalendarManagerStore
        }


        loadInlineData (data : ProjectDataPackage) : Promise<PropagationResult> {
            if (data.calendarsData) {
                this.calendarManagerStore.data = data.calendarsData
            }
            if (data.eventsData) {
                this.eventStore.data   = data.eventsData
            }
            if (data.dependenciesData) {
                this.dependencyStore.data   = data.dependenciesData
            }
            if (data.resourcesData) {
                this.resourceStore.data     = data.resourcesData
            }
            if (data.assignmentsData) {
                this.assignmentStore.data   = data.assignmentsData
            }

            return this.propagate()
        }


        getGraph () : EngineReplica {
            return this.replica
        }


        getStm () : StateTrackingManager {
            return this.stm
        }


        calculateProject () : IProjectMixin {
            return this
        }


        * calculateCalendar (proposedValue? : CalendarMixin) : ChronoIterator<this[ 'calendar' ]> {
            let result = yield *super.calculateCalendar(proposedValue)

            // fallback to defaultCalendar
            if (!result) {
                result = this.defaultCalendar
                yield result.$$
            }

            return result
        }


        joinStoreRecords (store : Store) {
            const fn = (record : PartOfProjectMixin) => {
                record.setProject(this)
                record.joinProject()
            }

            if (store.rootNode) {
                store.rootNode.traverse(fn)
            } else {
                store.forEach(fn)
            }
        }


        setEventStore (store : EventStoreMixin) {
            //if (this.eventStore !== store) {

                if (this.eventStore && this.stm.hasStore(this.eventStore)) {
                    this.stm.removeStore(this.eventStore)
                }

                this.eventStore         = store

                if (store) {

                    store.setProject(this)
                    this.stm.addStore(store)

                    // we've been given an event store from the outside
                    // need to change its root node to be the project
                    if (store.rootNode !== this) {
                        this.appendChild(store.rootNode.children || [])

                        store.rootNode      = this
                    }

                    this.joinStoreRecords(store)
                }
            //}
        }


        setDependencyStore (store : DependencyStoreMixin) {
            //if (this.dependencyStore !== store) {

                if (this.dependencyStore && this.stm.hasStore(this.dependencyStore)) {
                    this.stm.removeStore(this.dependencyStore)
                }

                this.dependencyStore    = store

                if (store) {
                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }
            //}
        }


        setResourceStore (store : ResourceStoreMixin) {
            //if (this.resourceStore !== store) {

                if (this.resourceStore && this.stm.hasStore(this.resourceStore)) {
                    this.stm.removeStore(this.resourceStore)
                }

                this.resourceStore      = store

                if (store) {
                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }
            //}
        }


        setAssignmentStore (store : AssignmentStoreMixin) {
            //if (this.assignmentStore !== store) {

                if (this.assignmentStore && this.stm.hasStore(this.assignmentStore)) {
                    this.stm.removeStore(this.assignmentStore)
                }

                this.assignmentStore    = store

                if (store) {
                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }
            //}
        }


        setCalendarManagerStore (store : CalendarManagerStoreMixin) {
            //if (this.calendarManagerStore !== store) {

                if (this.calendarManagerStore && this.stm.hasStore(this.calendarManagerStore)) {
                    this.stm.removeStore(this.calendarManagerStore)
                }

                this.calendarManagerStore       = store

                if (store) {
                    store.setProject(this)
                    this.stm.addStore(store)
                    this.joinStoreRecords(store)
                }
            //}
        }

        async tryPropagateWithChanges (changerFn : Function, onEffect? : EffectResolverFunction) : Promise<PropagationResult> {
            const
                stm = this.stm

            let stmInitiallyDisabled : boolean,
                stmInitiallyAutoRecord : boolean

            const captureStm = () => {
                stmInitiallyDisabled = stm.disabled
                stmInitiallyAutoRecord = stm.autoRecord

                if (stmInitiallyDisabled) {
                    stm.enable()
                }
                else {
                    if (stmInitiallyAutoRecord) {
                        stm.autoRecord = false
                    }
                    if (stm.isRecording) {
                        stm.stopTransaction()
                    }
                }
            }

            const commitStmTransaction = () => {
                stm.stopTransaction()

                if (stmInitiallyDisabled) {
                    stm.resetQueue()
                }
            }

            const rejectStmTransaction = () => {
                if (stm.transaction.length) {

                    stm.forEachStore(s => s.beginBatch())

                    stm.rejectTransaction()

                    stm.forEachStore(s => s.endBatch())
                }
                else {
                    stm.stopTransaction()
                }
            }

            const freeStm = () => {
                stm.disabled = stmInitiallyDisabled
                stm.autoRecord = stmInitiallyAutoRecord
            }

            captureStm()

            stm.startTransaction()

            // In case anything in, or called by the changerFn attempts to propagate.
            // We must only propagate after the changes have been made.
            this.suspendPropagate()

            changerFn()

            // Resume propagation, but do *not* propagate if any propagate calls were attempted during suspension.
            this.resumePropagate(false)

            const result = await this.propagate(onEffect || ((effect) => {
                let result

                if (effect instanceof GraphCycleDetectedEffect) {
                    result = EffectResolutionResult.Cancel
                }

                return result
            }))

            if (result === PropagationResult.Canceled) {
                rejectStmTransaction()
            }
            else {
                commitStmTransaction()
            }

            freeStm()

            return result
        }
    }

    return ProjectMixin
}


/**
 * Project mixin type.
 *
 * Project serves as a central place for all data in the gantt chart, like events and dependencies collections.
 * It is a `Model` instance itself, so it can also contain any other project-wide configuration options.
 */
export interface ProjectMixin extends Mixin<typeof ProjectMixin> {}


/**
 * Function to build a minimal possible [[ProjectMixin]] class
 */
export const BuildMinimalProject = (base : typeof Model = Model) : MixinConstructor<typeof ProjectMixin> =>
    (ProjectMixin as any)(
    HasEffort(
    HasAssignments(
    HasChildren(
    // HasDependencies( // strictly speaking this mixin is not listed in the ProjectMixin requirements
    ConstrainedEvent(
    EventMixin(
    HasCalendarMixin(
    PartOfProjectMixin(
    PartOfProjectGenericMixin(
    ChronoModelMixin(
    Entity(
    Events(
        base
    ))))))))))))
