import { Base } from "../class/Mixin.js";
import { Walkable, WalkableBackward, WalkableForward } from "./Walkable.js";
export const WalkableForwardNode = (base) => class WalkableForwardNode extends base {
    constructor() {
        super(...arguments);
        this.outgoing = new Set();
    }
    hasEdgeTo(toNode) {
        return this.outgoing.has(toNode);
    }
    addEdgeTo(toNode) {
        this.outgoing.add(toNode);
    }
    removeEdgeTo(toNode) {
        this.outgoing.delete(toNode);
    }
    addEdgesTo(toNodes) {
        toNodes.forEach(toNode => this.addEdgeTo(toNode));
    }
    getOutgoing(context) {
        return Array.from(this.outgoing);
    }
    forEachOutgoing(context, func) {
        this.outgoing.forEach(func);
    }
};
export const WalkableBackwardNode = (base) => class WalkableBackwardNode extends base {
    constructor() {
        super(...arguments);
        this.incoming = new Set();
    }
    hasEdgeFrom(fromNode) {
        return this.incoming.has(fromNode);
    }
    addEdgeFrom(fromNode) {
        this.incoming.add(fromNode);
    }
    removeEdgeFrom(fromNode) {
        this.incoming.delete(fromNode);
    }
    addEdgesFrom(fromNodes) {
        fromNodes.forEach(fromNode => this.addEdgeFrom(fromNode));
    }
    getIncoming(context) {
        return Array.from(this.incoming);
    }
    forEachIncoming(context, func) {
        this.incoming.forEach(func);
    }
};
export const Node = (base) => class Node extends base {
    addEdgeTo(toNode) {
        super.addEdgeTo(toNode);
        toNode.incoming.add(this);
    }
    removeEdgeTo(toNode) {
        super.removeEdgeTo(toNode);
        toNode.incoming.delete(this);
    }
    addEdgeFrom(fromNode) {
        super.addEdgeFrom(fromNode);
        fromNode.outgoing.add(this);
    }
    removeEdgeFrom(fromNode) {
        super.removeEdgeFrom(fromNode);
        fromNode.outgoing.delete(this);
    }
};
export class MinimalNode extends Node(WalkableForwardNode(WalkableBackwardNode(WalkableForward(WalkableBackward(Walkable(Base)))))) {
}
//# sourceMappingURL=Node.js.map