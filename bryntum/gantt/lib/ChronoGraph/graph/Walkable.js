import { Base } from "../class/Mixin.js";
export var OnCycleAction;
(function (OnCycleAction) {
    OnCycleAction[OnCycleAction["Cancel"] = 0] = "Cancel";
    OnCycleAction[OnCycleAction["Resume"] = 1] = "Resume";
})(OnCycleAction || (OnCycleAction = {}));
export class WalkContext extends Base {
    onNode(node) {
    }
    onTopologicalNode(node) {
    }
    onCycle(node, stack) {
        return OnCycleAction.Cancel;
    }
}
export const Walkable = (base) => class Walkable extends base {
    walkDepth(context) {
        const visitedAt = new Map();
        const visitedTopologically = new Set();
        const toVisit = [{ node: this, from: this }];
        let depth;
        while (depth = toVisit.length) {
            const node = toVisit[depth - 1].node;
            if (visitedTopologically.has(node)) {
                toVisit.pop();
                continue;
            }
            const visitedAtDepth = visitedAt.get(node);
            if (visitedAtDepth != null) {
                if (visitedAtDepth < depth) {
                    if (context.onCycle(node, toVisit) !== OnCycleAction.Resume)
                        break;
                }
                else {
                    visitedTopologically.add(node);
                    context.onTopologicalNode(node);
                }
                toVisit.pop();
            }
            else {
                visitedAt.set(node, depth);
                context.onNode(node);
                const lengthBefore = toVisit.length;
                context.forEachNext(node, nextNode => toVisit.push({ node: nextNode, from: node }));
                if (toVisit.length === lengthBefore) {
                    visitedTopologically.add(node);
                    context.onTopologicalNode(node);
                    toVisit.pop();
                }
            }
        }
    }
};
export const cycleInfo = (stack) => {
    const cycleSource = stack[stack.length - 1].node;
    const cycle = [cycleSource];
    let pos = stack.length - 1;
    let anotherNodePos = stack.length - 1;
    do {
        for (; pos >= 0 && stack[pos].from === stack[anotherNodePos].from; pos--)
            ;
        if (pos >= 0) {
            cycle.push(stack[pos].node);
            anotherNodePos = pos;
            pos--;
        }
    } while (pos >= 0 && stack[pos].node !== cycleSource);
    cycle.push(cycleSource);
    return cycle.reverse();
};
export class WalkForwardContext extends WalkContext {
    forEachNext(node, func) {
        node.forEachOutgoing(this, func);
    }
}
export class WalkBackwardContext extends WalkContext {
    forEachNext(node, func) {
        node.forEachIncoming(this, func);
    }
}
export const WalkableForward = (base) => {
    class WalkableForward extends base {
        forEachOutgoing(context, func) {
            this.getOutgoing(context).forEach(func);
        }
    }
    return WalkableForward;
};
export const WalkableBackward = (base) => {
    class WalkableBackward extends base {
        forEachIncoming(context, func) {
            this.getIncoming(context).forEach(func);
        }
    }
    return WalkableBackward;
};
//# sourceMappingURL=Walkable.js.map