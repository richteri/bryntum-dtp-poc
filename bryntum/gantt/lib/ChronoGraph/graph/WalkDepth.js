import { Base } from "../class/Mixin.js";
export var OnCycleAction;
(function (OnCycleAction) {
    OnCycleAction["Cancel"] = "Cancel";
    OnCycleAction["Resume"] = "Resume";
})(OnCycleAction || (OnCycleAction = {}));
export const WalkSource = Symbol('WalkSource');
export const NOT_VISITED = -1;
export const VISITED_TOPOLOGICALLY = -2;
export class WalkContext extends Base {
    constructor() {
        super(...arguments);
        this.visited = new Map();
        this.toVisit = [];
        this.currentEpoch = 0;
    }
    startFrom(sourceNodes) {
        this.continueFrom(sourceNodes);
    }
    continueFrom(sourceNodes) {
        this.toVisit.push.apply(this.toVisit, sourceNodes.map(node => { return { node: node, from: WalkSource, label: undefined }; }));
        this.walkDepth();
    }
    onNode(node, walkStep) {
    }
    onTopologicalNode(node) {
    }
    onCycle(node, stack) {
        return OnCycleAction.Cancel;
    }
    forEachNext(node, func) {
        throw new Error("Abstract method called");
    }
    collectNext(node, toVisit, visitInfo) {
        throw new Error("Abstract method called");
    }
    getVisitedInfo(node) {
        return this.visited.get(node);
    }
    setVisitedInfo(node, visitedAt, info) {
        if (!info) {
            info = { visitedAt, visitEpoch: this.currentEpoch };
            this.visited.set(node, info);
        }
        else {
            info.visitedAt = visitedAt;
            info.visitEpoch = this.currentEpoch;
        }
        return info;
    }
    walkDepth() {
        const visited = this.visited;
        const toVisit = this.toVisit;
        let depth;
        while (depth = toVisit.length) {
            const node = toVisit[depth - 1].node;
            const visitedInfo = this.getVisitedInfo(node);
            if (visitedInfo && visitedInfo.visitedAt === VISITED_TOPOLOGICALLY && visitedInfo.visitEpoch === this.currentEpoch) {
                toVisit.pop();
                continue;
            }
            if (visitedInfo && visitedInfo.visitEpoch === this.currentEpoch && visitedInfo.visitedAt !== NOT_VISITED) {
                if (visitedInfo.visitedAt < depth) {
                    if (this.onCycle(node, toVisit) !== OnCycleAction.Resume)
                        break;
                }
                else {
                    visitedInfo.visitedAt = VISITED_TOPOLOGICALLY;
                    this.onTopologicalNode(node);
                }
                toVisit.pop();
            }
            else {
                if (this.onNode(node, toVisit[depth - 1]) === false)
                    break;
                const visitedInfo2 = this.setVisitedInfo(node, depth, visitedInfo);
                const lengthBefore = toVisit.length;
                this.collectNext(node, toVisit, visitedInfo2);
                if (toVisit.length === lengthBefore) {
                    visitedInfo2.visitedAt = VISITED_TOPOLOGICALLY;
                    this.onTopologicalNode(node);
                    toVisit.pop();
                }
            }
        }
    }
}
export function cycleInfo(stack) {
    const length = stack.length;
    if (length === 0)
        return [];
    const cycleSource = stack[length - 1].node;
    const cycle = [cycleSource];
    let current = length - 1;
    let cursor = current;
    while (current >= 0 && stack[current].from !== cycleSource) {
        while (current >= 0 && stack[current].from === stack[cursor].from)
            current--;
        if (current >= 0) {
            cycle.push(stack[current].node);
            cursor = current;
        }
    }
    if (current < 0)
        return [];
    cycle.push(cycleSource);
    return cycle.reverse();
}
//# sourceMappingURL=WalkDepth.js.map