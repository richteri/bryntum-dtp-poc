var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Model from "../../../Core/data/Model.js";
import StateTrackingManager from "../../../Core/data/stm/StateTrackingManager.js";
import Events from "../../../Core/mixin/Events.js";
import { GraphCycleDetectedEffect, EffectResolutionResult } from "../../../ChronoGraph/chrono/Effect.js";
import { PropagationResult } from "../../../ChronoGraph/chrono/Graph.js";
import { Entity } from "../../../ChronoGraph/replica/Entity.js";
import { MinimalReplica } from "../../../ChronoGraph/replica/Replica.js";
import { Schema } from "../../../ChronoGraph/schema/Schema.js";
import { MinimalCalendarManagerStore } from "../../calendar/CalendarManagerStoreMixin.js";
import { MinimalCalendar } from "../../calendar/CalendarMixin.js";
import { model_field } from "../../chrono/ModelFieldAtom.js";
import { EngineReplica } from "../../chrono/Replica.js";
import { DependenciesCalendar, ProjectType } from "../../scheduling/Types.js";
import { PartOfProjectGenericMixin } from "../PartOfProjectGenericMixin.js";
import { MinimalAssignmentStore } from "../store/AssignmentStoreMixin.js";
import { MinimalDependencyStore } from "../store/DependencyStoreMixin.js";
import { MinimalEventStore } from "../store/EventStoreMixin.js";
import { MinimalResourceStore } from "../store/ResourceStoreMixin.js";
import { MinimalAssignment } from "./AssignmentMixin.js";
import { MinimalDependency } from "./DependencyMixin.js";
import { GanttEvent } from "./event/GanttEvent.js";
import { ConstrainedEvent } from "./event/ConstrainedEvent.js";
import { EventMixin } from "./event/EventMixin.js";
import { HasAssignments } from "./event/HasAssignments.js";
import { HasChildren } from "./event/HasChildren.js";
import { HasEffort } from "./event/HasEffort.js";
import { HasCalendarMixin } from "./HasCalendarMixin.js";
import { ChronoModelMixin } from "./mixin/ChronoModelMixin.js";
import { PartOfProjectMixin } from "./mixin/PartOfProjectMixin.js";
import { MinimalResource } from "./ResourceMixin.js";
export const ProjectMixin = (base) => {
    class ProjectMixin extends base {
        construct(config = {}) {
            this.replica = EngineReplica(MinimalReplica).new({ project: this, schema: Schema.new() });
            if (!config.hasOwnProperty('expanded')) {
                config.expanded = true;
            }
            const hasInlineStore = Boolean(config.calendarManagerStore || config.eventStore || config.dependencyStore || config.resourceStore || config.assignmentStore);
            super.construct(config);
            if (!this.eventModelClass)
                this.eventModelClass = this.getDefaultEventModelClass();
            if (!this.eventStoreClass)
                this.eventStoreClass = this.getDefaultEventStoreClass();
            if (!this.dependencyModelClass)
                this.dependencyModelClass = this.getDefaultDependencyModelClass();
            if (!this.dependencyStoreClass)
                this.dependencyStoreClass = this.getDefaultDependencyStoreClass();
            if (!this.resourceModelClass)
                this.resourceModelClass = this.getDefaultResourceModelClass();
            if (!this.resourceStoreClass)
                this.resourceStoreClass = this.getDefaultResourceStoreClass();
            if (!this.assignmentModelClass)
                this.assignmentModelClass = this.getDefaultAssignmentModelClass();
            if (!this.assignmentStoreClass)
                this.assignmentStoreClass = this.getDefaultAssignmentStoreClass();
            if (!this.calendarModelClass)
                this.calendarModelClass = this.getDefaultCalendarModelClass();
            if (!this.calendarManagerStoreClass)
                this.calendarManagerStoreClass = this.getDefaultCalendarManagerStoreClass();
            this.replica.addEntity(this);
            this.stm = new StateTrackingManager({ disabled: true });
            this.stm.on({
                restoringStop: async () => {
                    this.stm.disable();
                    await this.propagate();
                    this.stm.enable();
                    this.trigger('stateRestoringDone');
                }
            });
            if (this.calendarManagerStore) {
                this.setCalendarManagerStore(this.calendarManagerStore);
            }
            else
                this.calendarManagerStore = new this.calendarManagerStoreClass({
                    modelClass: this.calendarModelClass,
                    project: this,
                    stm: this.stm
                });
            this.defaultCalendar = new this.calendarManagerStore.modelClass({
                hoursPerDay: 24,
                daysPerWeek: 7,
                daysPerMonth: 30,
                unspecifiedTimeIsWorking: this.unspecifiedTimeIsWorking
            });
            this.defaultCalendar.project = this;
            if (this.eventStore) {
                this.setEventStore(this.eventStore);
            }
            else
                this.eventStore = new this.eventStoreClass({
                    modelClass: this.eventModelClass,
                    tree: true,
                    project: this,
                    stm: this.stm
                });
            if (this.dependencyStore) {
                this.setDependencyStore(this.dependencyStore);
            }
            else
                this.dependencyStore = new this.dependencyStoreClass({
                    modelClass: this.dependencyModelClass,
                    project: this,
                    stm: this.stm
                });
            if (this.resourceStore) {
                this.setResourceStore(this.resourceStore);
            }
            else
                this.resourceStore = new this.resourceStoreClass({
                    modelClass: this.resourceModelClass,
                    project: this,
                    stm: this.stm
                });
            if (this.assignmentStore) {
                this.setAssignmentStore(this.assignmentStore);
            }
            else
                this.assignmentStore = new this.assignmentStoreClass({
                    modelClass: this.assignmentModelClass,
                    project: this,
                    stm: this.stm
                });
            const hasInlineData = Boolean(this.calendarsData || this.eventsData || this.dependenciesData || this.resourcesData || this.assignmentsData);
            if (hasInlineData) {
                this.loadInlineData({
                    calendarsData: this.calendarsData,
                    eventsData: this.eventsData,
                    dependenciesData: this.dependenciesData,
                    resourcesData: this.resourcesData,
                    assignmentsData: this.assignmentsData
                });
                delete this.calendarsData;
                delete this.eventsData;
                delete this.dependenciesData;
                delete this.resourcesData;
                delete this.assignmentsData;
            }
            if (hasInlineStore && !hasInlineData)
                this.propagate();
        }
        getType() {
            return ProjectType.Unknown;
        }
        getDefaultEventModelClass() {
            return GanttEvent;
        }
        getDefaultEventStoreClass() {
            return MinimalEventStore;
        }
        getDefaultDependencyModelClass() {
            return MinimalDependency;
        }
        getDefaultDependencyStoreClass() {
            return MinimalDependencyStore;
        }
        getDefaultResourceModelClass() {
            return MinimalResource;
        }
        getDefaultResourceStoreClass() {
            return MinimalResourceStore;
        }
        getDefaultAssignmentModelClass() {
            return MinimalAssignment;
        }
        getDefaultAssignmentStoreClass() {
            return MinimalAssignmentStore;
        }
        getDefaultCalendarModelClass() {
            return MinimalCalendar;
        }
        getDefaultCalendarManagerStoreClass() {
            return MinimalCalendarManagerStore;
        }
        loadInlineData(data) {
            if (data.calendarsData) {
                this.calendarManagerStore.data = data.calendarsData;
            }
            if (data.eventsData) {
                this.eventStore.data = data.eventsData;
            }
            if (data.dependenciesData) {
                this.dependencyStore.data = data.dependenciesData;
            }
            if (data.resourcesData) {
                this.resourceStore.data = data.resourcesData;
            }
            if (data.assignmentsData) {
                this.assignmentStore.data = data.assignmentsData;
            }
            return this.propagate();
        }
        getGraph() {
            return this.replica;
        }
        getStm() {
            return this.stm;
        }
        calculateProject() {
            return this;
        }
        *calculateCalendar(proposedValue) {
            let result = yield* super.calculateCalendar(proposedValue);
            if (!result) {
                result = this.defaultCalendar;
                yield result.$$;
            }
            return result;
        }
        joinStoreRecords(store) {
            const fn = (record) => {
                record.setProject(this);
                record.joinProject();
            };
            if (store.rootNode) {
                store.rootNode.traverse(fn);
            }
            else {
                store.forEach(fn);
            }
        }
        setEventStore(store) {
            if (this.eventStore && this.stm.hasStore(this.eventStore)) {
                this.stm.removeStore(this.eventStore);
            }
            this.eventStore = store;
            if (store) {
                store.setProject(this);
                this.stm.addStore(store);
                if (store.rootNode !== this) {
                    this.appendChild(store.rootNode.children || []);
                    store.rootNode = this;
                }
                this.joinStoreRecords(store);
            }
        }
        setDependencyStore(store) {
            if (this.dependencyStore && this.stm.hasStore(this.dependencyStore)) {
                this.stm.removeStore(this.dependencyStore);
            }
            this.dependencyStore = store;
            if (store) {
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
        }
        setResourceStore(store) {
            if (this.resourceStore && this.stm.hasStore(this.resourceStore)) {
                this.stm.removeStore(this.resourceStore);
            }
            this.resourceStore = store;
            if (store) {
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
        }
        setAssignmentStore(store) {
            if (this.assignmentStore && this.stm.hasStore(this.assignmentStore)) {
                this.stm.removeStore(this.assignmentStore);
            }
            this.assignmentStore = store;
            if (store) {
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
        }
        setCalendarManagerStore(store) {
            if (this.calendarManagerStore && this.stm.hasStore(this.calendarManagerStore)) {
                this.stm.removeStore(this.calendarManagerStore);
            }
            this.calendarManagerStore = store;
            if (store) {
                store.setProject(this);
                this.stm.addStore(store);
                this.joinStoreRecords(store);
            }
        }
        async tryPropagateWithChanges(changerFn, onEffect) {
            const stm = this.stm;
            let stmInitiallyDisabled, stmInitiallyAutoRecord;
            const captureStm = () => {
                stmInitiallyDisabled = stm.disabled;
                stmInitiallyAutoRecord = stm.autoRecord;
                if (stmInitiallyDisabled) {
                    stm.enable();
                }
                else {
                    if (stmInitiallyAutoRecord) {
                        stm.autoRecord = false;
                    }
                    if (stm.isRecording) {
                        stm.stopTransaction();
                    }
                }
            };
            const commitStmTransaction = () => {
                stm.stopTransaction();
                if (stmInitiallyDisabled) {
                    stm.resetQueue();
                }
            };
            const rejectStmTransaction = () => {
                if (stm.transaction.length) {
                    stm.forEachStore(s => s.beginBatch());
                    stm.rejectTransaction();
                    stm.forEachStore(s => s.endBatch());
                }
                else {
                    stm.stopTransaction();
                }
            };
            const freeStm = () => {
                stm.disabled = stmInitiallyDisabled;
                stm.autoRecord = stmInitiallyAutoRecord;
            };
            captureStm();
            stm.startTransaction();
            this.suspendPropagate();
            changerFn();
            this.resumePropagate(false);
            const result = await this.propagate(onEffect || ((effect) => {
                let result;
                if (effect instanceof GraphCycleDetectedEffect) {
                    result = EffectResolutionResult.Cancel;
                }
                return result;
            }));
            if (result === PropagationResult.Canceled) {
                rejectStmTransaction();
            }
            else {
                commitStmTransaction();
            }
            freeStm();
            return result;
        }
    }
    __decorate([
        model_field({ type: 'boolean', defaultValue: true })
    ], ProjectMixin.prototype, "unspecifiedTimeIsWorking", void 0);
    __decorate([
        model_field({ type: 'string', defaultValue: DependenciesCalendar.ToEvent })
    ], ProjectMixin.prototype, "dependenciesCalendar", void 0);
    __decorate([
        model_field({ type: 'boolean', defaultValue: true })
    ], ProjectMixin.prototype, "autoCalculatePercentDoneForParentTasks", void 0);
    return ProjectMixin;
};
export const BuildMinimalProject = (base = Model) => ProjectMixin(HasEffort(HasAssignments(HasChildren(ConstrainedEvent(EventMixin(HasCalendarMixin(PartOfProjectMixin(PartOfProjectGenericMixin(ChronoModelMixin(Entity(Events(base))))))))))));
//# sourceMappingURL=ProjectMixin.js.map