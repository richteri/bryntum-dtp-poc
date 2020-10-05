import { Base } from "../class/Mixin.js";
import { WalkableBackwardNode, WalkableForwardNode } from "./Node.js";
import { Walkable, WalkableBackward, WalkableForward } from "./Walkable.js";
export const Graph = (base) => class Graph extends base {
    constructor() {
        super(...arguments);
        this.nodes = new Set();
    }
    getNodes() {
        return this.nodes;
    }
    hasDirectNode(node) {
        return this.getNodes().has(node);
    }
    addNodes(nodes) {
        nodes.forEach(node => this.addNode(node));
    }
    addNode(node) {
        this.nodes.add(node);
        return node;
    }
    removeNodes(nodes) {
        nodes.forEach(node => this.removeNode(node));
    }
    removeNode(node) {
        if (!this.hasDirectNode(node))
            throw new Error(`This [${node}] does not exists in the graph`);
        node.outgoing.forEach(toNode => toNode.removeEdgeFrom(node));
        node.incoming.forEach(fromNode => fromNode.removeEdgeTo(node));
        this.nodes.delete(node);
    }
    getIncoming() {
        return Array.from(this.nodes);
    }
    getOutgoing() {
        return Array.from(this.nodes);
    }
    forEachIncoming(context, func) {
        this.nodes.forEach(func);
    }
    forEachOutgoing(context, func) {
        this.nodes.forEach(func);
    }
};
export class MinimalGraph extends Graph(WalkableForwardNode(WalkableBackwardNode(WalkableForward(WalkableBackward(Walkable(Base)))))) {
}
//# sourceMappingURL=Graph.js.map