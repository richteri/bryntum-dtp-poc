import { Effect } from "../chrono/Effect.js";
import { PropagationResult } from "../chrono/Graph.js";
import { Entity as EntityData } from "../schema/Entity.js";
import { Field } from "../schema/Field.js";
import { lazyBuild, uppercaseFirst } from "../util/Helper.js";
import { MinimalEntityAtom } from "./Atom.js";
import { isReplica } from "./Replica.js";
const isEntityMarker = Symbol('isEntity');
export const Entity = (base) => {
    class Entity extends base {
        [isEntityMarker]() { }
        get $entity() {
            return createEntityOnPrototype(this.constructor.prototype);
        }
        get $() {
            const atomsCollection = {};
            this.$entity.forEachField((field, name) => {
                atomsCollection[name] = this.createFieldAtom(field);
            });
            return lazyBuild(this, '$', atomsCollection);
        }
        get $$() {
            return lazyBuild(this, '$$', MinimalEntityAtom.new({
                entity: this.$entity,
                self: this,
                equality: () => false,
                calculation: this.calculateSelf,
                calculationContext: this
            }));
        }
        *calculateSelf() {
            return this;
        }
        createFieldAtom(field) {
            const name = field.name;
            const calculationFunction = this.$calculations && this[this.$calculations[name]];
            return field.atomCls.new({
                id: `${this.$$.id}/${name}`,
                field: field,
                self: this,
                calculationContext: calculationFunction ? this : undefined,
                calculation: calculationFunction
            });
        }
        getGraph() {
            return this.$$.graph;
        }
        forEachFieldAtom(func) {
            const fields = this.$;
            for (let name in fields) {
                func.call(this, fields[name], name);
            }
        }
        enterGraph(graph) {
            this.forEachFieldAtom(field => graph.addNode(field));
            graph.addNode(this.$$);
        }
        leaveGraph() {
            const graph = this.$$.graph;
            if (graph) {
                this.forEachFieldAtom(field => graph.removeNode(field));
                graph.removeNode(this.$$);
            }
        }
        isPropagating() {
            return this.getGraph().isPropagating;
        }
        suspendPropagate() {
            const graph = this.getGraph();
            graph && graph.suspendPropagate();
        }
        async resumePropagate(trigger) {
            const graph = this.getGraph();
            return graph && graph.resumePropagate(trigger) || Promise.resolve(PropagationResult.Completed);
        }
        async propagate(onEffect, dryRun = false) {
            const graph = this.getGraph();
            return graph && graph.propagate(onEffect, dryRun) || Promise.resolve(PropagationResult.Completed);
        }
        async waitForPropagateCompleted() {
            return this.getGraph().waitForPropagateCompleted();
        }
        async tryPropagateWithNodes(onEffect, nodes, hatchFn) {
            return this.getGraph().tryPropagateWithNodes(onEffect, nodes, hatchFn);
        }
        async tryPropagateWithEntities(onEffect, entities, hatchFn) {
            const graph = this.getGraph();
            let result;
            if (isReplica(graph)) {
                result = graph.tryPropagateWithEntities(onEffect, entities, hatchFn);
            }
            else {
                throw new Error("Entity is not part of replica");
            }
            return result;
        }
        markAsNeedRecalculation(atom) {
            const graph = this.getGraph();
            graph && graph.markAsNeedRecalculation(atom);
        }
        markStable(atom) {
            const graph = this.getGraph();
            graph && graph.markStable(atom);
        }
        static getField(name) {
            return this.getEntity().getField(name);
        }
        static getEntity() {
            return ensureEntityOnPrototype(this.prototype);
        }
        run(methodName, ...args) {
            const iterator = this[methodName](...args);
            let iteratorValue;
            let nextArgs;
            do {
                iteratorValue = iterator.next(nextArgs);
                const value = iteratorValue.value;
                if (value instanceof Effect)
                    throw new Error("Helper methods can not yield effects during computation");
                if (iteratorValue.done)
                    return value;
                const atom = value;
                if (this.getGraph().isAtomNeedRecalculation(atom))
                    throw new Error("Can not use stale atom for calculations");
                nextArgs = atom.get();
            } while (true);
        }
    }
    return Entity;
};
export const createEntityOnPrototype = (proto) => {
    let parent = Object.getPrototypeOf(proto);
    return lazyBuild(proto, '$entity', EntityData.new({ parentEntity: parent.hasOwnProperty(isEntityMarker) ? null : parent.$entity }));
};
export const ensureEntityOnPrototype = (proto) => {
    let entity = proto.$entity;
    if (!proto.hasOwnProperty('$entity'))
        entity = createEntityOnPrototype(proto);
    return entity;
};
export const generic_field = (fieldConfig, fieldCls = Field) => {
    return function (target, propertyKey) {
        let entity = ensureEntityOnPrototype(target);
        const field = entity.addField(fieldCls.new(Object.assign(fieldConfig || {}, {
            name: propertyKey
        })));
        if (field.createAccessors) {
            const putterFnName = `put${uppercaseFirst(propertyKey)}`;
            let setter = putterFnName in target
                ?
                    function (value) {
                        return this[putterFnName](value);
                    }
                :
                    function (value) {
                        return this.$[propertyKey].put(value);
                    };
            Object.defineProperty(target, propertyKey, {
                get: function () {
                    return this.$[propertyKey].get();
                },
                set: setter
            });
            const getterFnName = `get${uppercaseFirst(propertyKey)}`;
            const setterFnName = `set${uppercaseFirst(propertyKey)}`;
            if (!(getterFnName in target)) {
                target[getterFnName] = function (...args) {
                    return this.$[propertyKey].get(...args);
                };
            }
            if (!(setterFnName in target)) {
                target[setterFnName] = function (...args) {
                    return this.$[propertyKey].set(...args);
                };
            }
        }
    };
};
export const field = generic_field;
export const calculate = function (fieldName) {
    return function (target, propertyKey, _) {
        let calculations = target.$calculations;
        if (!calculations)
            calculations = target.$calculations = {};
        calculations[fieldName] = propertyKey;
    };
};
//# sourceMappingURL=Entity.js.map