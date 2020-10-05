import { MinimalGraph } from "../graph/Graph.js";
import { cycleInfo, OnCycleAction, WalkForwardContext } from "../graph/Walkable.js";
import { CancelPropagationEffect, Effect, EffectResolutionResult, GraphCycleDetectedEffect, PromiseEffect, RestartPropagationEffect } from "./Effect.js";
import { preWalk } from "../util/Helper.js";
export var PropagationResult;
(function (PropagationResult) {
    PropagationResult[PropagationResult["Canceled"] = 0] = "Canceled";
    PropagationResult[PropagationResult["Completed"] = 1] = "Completed";
    PropagationResult[PropagationResult["Passed"] = 2] = "Passed";
})(PropagationResult || (PropagationResult = {}));
export const ChronoGraph = (base) => class ChronoGraph extends base {
    constructor() {
        super(...arguments);
        this.nodesMap = new Map();
        this.needRecalculationAtoms = new Set();
        this.stableAtoms = new Set();
        this.isPropagating = false;
        this.propagateCompletedListeners = [];
        this.propagateSuspended = 0;
    }
    isAtomNeedRecalculation(atom) {
        return this.needRecalculationAtoms.has(atom);
    }
    markAsNeedRecalculation(atom) {
        this.needRecalculationAtoms.add(atom);
    }
    markProcessed(atom) {
        this.needRecalculationAtoms.delete(atom);
    }
    markStable(atom) {
        this.stableAtoms.add(atom);
    }
    isAtomStable(atom) {
        return this.stableAtoms.has(atom);
    }
    commit() {
        this.needRecalculationAtoms.forEach(atom => atom.clearUserInput());
        this.needRecalculationAtoms.clear();
        this.changedAtoms.forEach(atom => atom.commitValue());
        this.stableAtoms.forEach(atom => atom.commitEdges());
        this.stableAtoms.clear();
    }
    reject() {
        this.rejectPartialProgress();
        this.needRecalculationAtoms.forEach(atom => atom.clearUserInput());
        this.needRecalculationAtoms.clear();
    }
    rejectPartialProgress() {
        this.touchedAtoms.forEach((_, atom) => atom.reject());
        this.stableAtoms.clear();
    }
    addNode(node) {
        const res = super.addNode(node);
        this.nodesMap.set(node.id, node);
        this.markAsNeedRecalculation(node);
        node.onEnterGraph(this);
        return res;
    }
    removeNode(node) {
        node.outgoing.forEach((toNode) => this.markAsNeedRecalculation(toNode));
        const res = super.removeNode(node);
        this.nodesMap.delete(node.id);
        this.needRecalculationAtoms.delete(node);
        this.stableAtoms.delete(node);
        node.onLeaveGraph(this);
        return res;
    }
    startAtomCalculation(sourceAtom) {
        const iterator = sourceAtom.calculate(sourceAtom.proposedValue);
        let iteratorValue = iterator.next();
        const value = iteratorValue.value;
        if (value instanceof Effect) {
            return { effect: value, continuation: { iterator: iterator } };
        }
        else if (iteratorValue.done) {
            return { value };
        }
        else {
            return { continuation: { atom: value, iterator: iterator } };
        }
    }
    continueAtomCalculation(sourceAtom, continuation, maybeDirtyAtoms) {
        const me = this, iterator = continuation.iterator;
        let incomingAtom = continuation.atom;
        do {
            let iteratorValue;
            if (incomingAtom) {
                sourceAtom.observedDuringCalculation.push(incomingAtom);
                if (maybeDirtyAtoms.has(incomingAtom) && !this.isAtomStable(incomingAtom)) {
                    let cycle;
                    me.walkDepth(WalkForwardContext.new({
                        forEachNext: function (atom, func) {
                            if (atom === me) {
                                me.needRecalculationAtoms.forEach(func);
                            }
                            else {
                                atom.observedDuringCalculation.forEach(func);
                            }
                        },
                        onCycle: (node, stack) => {
                            cycle = cycleInfo(stack);
                            return OnCycleAction.Cancel;
                        }
                    }));
                    iteratorValue = { value: GraphCycleDetectedEffect.new({ cycle }), done: true };
                }
                else {
                    iteratorValue = iterator.next(incomingAtom.hasNextStableValue() ? incomingAtom.getNextStableValue() : incomingAtom.getConsistentValue());
                }
            }
            else {
                iteratorValue = iterator.next();
            }
            const value = iteratorValue.value;
            if (value instanceof Effect) {
                return { effect: value, continuation: { iterator: iterator } };
            }
            if (iteratorValue.done) {
                return { value };
            }
            incomingAtom = value;
        } while (!maybeDirtyAtoms.has(incomingAtom) || this.isAtomStable(incomingAtom));
        return { continuation: { iterator, atom: incomingAtom } };
    }
    *propagateSingle() {
        const toCalculate = [];
        const maybeDirty = new Set();
        const me = this;
        let cycle = null;
        this.walkDepth(WalkForwardContext.new({
            forEachNext: function (atom, func) {
                if (atom === me) {
                    me.needRecalculationAtoms.forEach(func);
                }
                else {
                    WalkForwardContext.prototype.forEachNext.call(this, atom, func);
                }
            },
            onNode: (atom) => {
            },
            onCycle: (node, stack) => {
                cycle = cycleInfo(stack);
                return OnCycleAction.Cancel;
            },
            onTopologicalNode: (atom) => {
                if (atom === this)
                    return;
                maybeDirty.add(atom);
                toCalculate.push(atom);
            }
        }));
        if (cycle) {
            return GraphCycleDetectedEffect.new({ cycle });
        }
        let depth;
        const conts = this.touchedAtoms = new Map();
        const visitedAt = new Map();
        const changedAtoms = this.changedAtoms = [];
        while (depth = toCalculate.length) {
            const sourceAtom = toCalculate[depth - 1];
            if (this.isAtomStable(sourceAtom) || !maybeDirty.has(sourceAtom)) {
                toCalculate.pop();
                continue;
            }
            const visitedAtDepth = visitedAt.get(sourceAtom);
            let calcRes;
            if (visitedAtDepth != null) {
                const cont = conts.get(sourceAtom);
                calcRes = this.continueAtomCalculation(sourceAtom, cont, maybeDirty);
            }
            else {
                visitedAt.set(sourceAtom, depth);
                calcRes = this.startAtomCalculation(sourceAtom);
            }
            if (calcRes.effect) {
                yield calcRes.effect;
            }
            if (calcRes.continuation) {
                conts.set(sourceAtom, calcRes.continuation);
                const atom = calcRes.continuation.atom;
                if (atom) {
                    sourceAtom.observedDuringCalculation.push(atom);
                    toCalculate.push(atom);
                }
            }
            else {
                conts.set(sourceAtom, null);
                const consistentValue = calcRes.value;
                if (!sourceAtom.equality(consistentValue, sourceAtom.getConsistentValue())) {
                    changedAtoms.push(sourceAtom);
                    sourceAtom.nextStableValue = consistentValue;
                }
                this.markStable(sourceAtom);
                toCalculate.pop();
            }
        }
        return { success: true };
    }
    async onEffect(effect) {
        if (effect instanceof PromiseEffect) {
            await effect.promise;
            return EffectResolutionResult.Resume;
        }
        if (effect instanceof CancelPropagationEffect) {
            return EffectResolutionResult.Cancel;
        }
        if (effect instanceof RestartPropagationEffect) {
            return EffectResolutionResult.Restart;
        }
        if (effect instanceof GraphCycleDetectedEffect) {
            throw new Error('Graph cycle detected');
        }
        return EffectResolutionResult.Resume;
    }
    waitForPropagateCompleted() {
        if (!this.isPropagating)
            return Promise.resolve(null);
        return new Promise(resolve => {
            this.propagateCompletedListeners.push(resolve);
        });
    }
    suspendPropagate() {
        this.propagateSuspended++;
    }
    async resumePropagate(trigger) {
        if (this.propagateSuspended) {
            if (--this.propagateSuspended) {
                return this.resumePromise;
            }
            else if (this.resumePromise && trigger !== false) {
                return this.propagate();
            }
        }
        return Promise.resolve(PropagationResult.Completed);
    }
    async propagate(onEffect, dryRun = false) {
        const me = this;
        if (me.propagateSuspended) {
            if (!me.resumePromise) {
                me.resumePromise = new Promise((resolve, reject) => {
                    me.resumeResolved = resolve;
                    me.resumeRejected = reject;
                });
            }
            return me.resumePromise;
        }
        else {
            if (me.resumePromise) {
                const resolve = me.resumeResolved, reject = me.resumeRejected;
                me.resumePromise = me.resumeResolved = me.resumeRejected = null;
                return me.propagateUnsuspended(onEffect, dryRun).then(value => {
                    resolve(value);
                    return value;
                }, value => {
                    reject(value);
                    return value;
                });
            }
            else {
                return me.propagateUnsuspended(onEffect, dryRun);
            }
        }
    }
    async propagateUnsuspended(onEffect, dryRun = false) {
        if (this.isPropagating)
            throw new Error("Can not nest calls to `propagate`, use `waitForPropagateCompleted`");
        let needToRestart, result;
        this.isPropagating = true;
        do {
            needToRestart = false;
            const propagationIterator = this.propagateSingle();
            let iteratorValue;
            do {
                iteratorValue = propagationIterator.next();
                const value = iteratorValue.value;
                if (value instanceof Effect) {
                    let resolutionResult;
                    if (onEffect) {
                        resolutionResult = await onEffect(value);
                    }
                    else {
                        resolutionResult = await this.onEffect(value);
                    }
                    if (resolutionResult === EffectResolutionResult.Cancel) {
                        if (typeof dryRun === 'function') {
                            dryRun();
                        }
                        this.reject();
                        this.isPropagating = false;
                        await this.propagationCompletedHook();
                        this.onPropagationCompleted(PropagationResult.Canceled);
                        return PropagationResult.Canceled;
                    }
                    else if (resolutionResult === EffectResolutionResult.Restart) {
                        this.rejectPartialProgress();
                        needToRestart = true;
                        break;
                    }
                }
            } while (!iteratorValue.done);
        } while (needToRestart);
        if (dryRun) {
            if (typeof dryRun === 'function') {
                dryRun();
            }
            this.reject();
            this.isPropagating = false;
            await this.propagationCompletedHook();
            this.onPropagationCompleted(PropagationResult.Completed);
            result = PropagationResult.Passed;
        }
        else {
            this.commit();
            this.isPropagating = false;
            await this.propagationCompletedHook();
            this.onPropagationCompleted(PropagationResult.Completed);
            result = PropagationResult.Completed;
        }
        return result;
    }
    async tryPropagateWithNodes(onEffect, nodes, hatchFn) {
        if (nodes && nodes.length) {
            nodes = nodes.filter(n => n.graph !== this);
            if (nodes.length) {
                this.addNodes(nodes);
            }
        }
        const result = await this.propagate(onEffect, hatchFn || true);
        if (nodes && nodes.length) {
            nodes && this.removeNodes(nodes);
        }
        return result;
    }
    async propagationCompletedHook() {
    }
    onPropagationCompleted(result) {
        this.propagateCompletedListeners.forEach(listener => listener(result));
        this.propagateCompletedListeners = [];
    }
    commitAllEdges() {
        this.nodes.forEach(atom => atom.commitEdges());
    }
    toDotOnCycleException() {
        this.commitAllEdges();
        return this.toDot();
    }
    toDotAtomName(atom) {
        let [idGroup, idField] = String(atom.id).split('/');
        if (atom.self) {
            const entity = atom.self;
            if (entity.name) {
                idGroup = entity.name;
            }
        }
        return `${idGroup}/${idField || 'self'}`;
    }
    toDotAtomValue(atom) {
        let value;
        if (atom.newRefs && atom.oldRefs) {
            const collection = atom.get();
            value = `Set(${collection && collection.size || 0})`;
        }
        else {
            value = atom.get();
        }
        if (value instanceof Date) {
            value = [value.getFullYear(), '.', value.getMonth() + 1, '.', value.getDate(), ' ', value.getHours() + ':' + value.getMinutes()].join('');
        }
        else if (Array.isArray(value)) {
            value = `Array(${value.length})`;
        }
        return value;
    }
    toDotAtomColor(atom) {
        return (!this.isAtomNeedRecalculation(atom) || this.isAtomStable(atom)) ? 'darkgreen' : 'red';
    }
    toDotObtainCycle() {
        let cycle = {};
        this.walkDepth(WalkForwardContext.new({
            onCycle: (_node, stack) => {
                const ci = cycleInfo(stack);
                cycle = ci.reduce(([cycle, prevNode], curNode) => {
                    if (prevNode) {
                        cycle[prevNode.id] = curNode.id;
                    }
                    return [cycle, curNode];
                }, [cycle, null])[0];
                return OnCycleAction.Cancel;
            }
        }));
        return cycle;
    }
    toDot() {
        let dot = [
            'digraph ChronoGraph {',
            'splines=spline'
        ];
        const arrAtoms = Array.from(this.nodesMap.entries());
        const namedAtomsByGroup = arrAtoms.reduce((map, [atomId, atom]) => {
            let [group, label] = String(atomId).split('/');
            const { id, name } = atom.self || {}, { field } = atom;
            group = name || id || group;
            label = field && field.name || label;
            if (!map.has(group)) {
                map.set(group, new Set([[label || '', atom]]));
            }
            else {
                map.get(group).add([label, atom]);
            }
            return map;
        }, new Map());
        dot = Array.from(namedAtomsByGroup.entries()).reduce((dot, [group, namedAtoms], index) => {
            dot.push(`subgraph cluster_${index} {`);
            dot.push(`label="${group}"`);
            dot = Array.from(namedAtoms.values()).reduce((dot, [name, atom]) => {
                let value = this.toDotAtomValue(atom);
                let color = this.toDotAtomColor(atom);
                dot.push(`"${atom.id}" [label="${name}=${value}\", fontcolor="${color}"]`);
                return dot;
            }, dot);
            dot.push('}');
            return dot;
        }, dot);
        let cycle = this.toDotObtainCycle();
        dot = arrAtoms.reduce((dot, [fromId, fromAtom]) => {
            const outgoingEdges = fromAtom.outgoing;
            Array.from(outgoingEdges).reduce((dot, toAtom) => {
                const edgeLabel = '';
                let color = (!this.isAtomNeedRecalculation(fromAtom) || this.isAtomStable(fromAtom)) ? 'darkgreen' : 'red';
                let penwidth = (cycle[fromId] == toAtom.id) ? 5 : 1;
                dot.push(`"${fromId}" -> "${toAtom.id}" [label="${edgeLabel}", color="${color}", penwidth=${penwidth}]`);
                return dot;
            }, dot);
            return dot;
        }, dot);
        dot.push('}');
        return dot.join('\n');
    }
    toDotAtomIncoming(atom) {
        let dot = [
            'digraph ChronoGraph {',
            'splines=spline'
        ];
        let subGraph = new Set();
        preWalk(atom, (subGraphAtom) => Array.from(subGraphAtom.incoming), (subGraphAtom) => subGraph.add(subGraphAtom));
        dot = Array.from(subGraph).reduce((dot, incomingAtom) => {
            const name = this.toDotAtomName(incomingAtom), value = this.toDotAtomValue(incomingAtom);
            let color, penwidth;
            if (incomingAtom == atom) {
                color = 'orange';
                penwidth = 5;
            }
            else {
                color = this.toDotAtomColor(incomingAtom);
                penwidth = 1;
            }
            dot.push(`"${incomingAtom.id}" [label="${name}=${value}\", fontcolor="${color}", penwidth=${penwidth}]`);
            return dot;
        }, dot);
        const cycle = this.toDotObtainCycle();
        dot = Array.from(subGraph).reduce((dot, subGraphAtom) => Array.from(subGraphAtom.incoming).reduce((dot, incomingAtom) => {
            const fromId = incomingAtom.id;
            const toId = subGraphAtom.id;
            const color = this.toDotAtomColor(incomingAtom);
            const penwidth = (cycle[fromId] == toId) ? 5 : 1;
            dot.push(`"${fromId}" -> "${toId}" [label="", color="${color}", penwidth=${penwidth}]`);
            return dot;
        }, dot), dot);
        dot.push('}');
        return dot.join('\n');
    }
};
export class MinimalChronoGraph extends ChronoGraph(MinimalGraph) {
}
//# sourceMappingURL=Graph.js.map