var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { field, calculate } from "../../../../ChronoGraph/replica/Entity.js";
export const CanCriticalPath = (base) => {
    class CanCriticalPath extends base {
        *calculateCriticalPaths() {
            const paths = [], pathsToProcess = [], events = yield this.$.childEvents;
            const eventsToProcess = [...events];
            const projectEndDate = yield this.$.endDate;
            let event;
            while ((event = eventsToProcess.shift())) {
                const childEvents = yield event.$.childEvents, eventIsCritical = yield event.$.critical;
                if (event.endDate - projectEndDate === 0 && eventIsCritical) {
                    pathsToProcess.push([{ event }]);
                }
                eventsToProcess.push(...childEvents);
            }
            let path;
            while ((path = pathsToProcess.shift())) {
                let taskIndex = path.length - 1, node;
                while ((node = path[taskIndex])) {
                    const criticalPredecessorNodes = [];
                    for (const dependency of (yield node.event.$.incomingDeps)) {
                        const event = yield dependency.$.fromEvent, eventIsCritical = event && (yield event.$.critical);
                        if (eventIsCritical) {
                            criticalPredecessorNodes.push({ event, dependency });
                        }
                    }
                    if (criticalPredecessorNodes.length) {
                        const pathCopy = path.slice();
                        path.push(criticalPredecessorNodes[0]);
                        for (let i = 1; i < criticalPredecessorNodes.length; i++) {
                            pathsToProcess.push(pathCopy.concat(criticalPredecessorNodes[i]));
                        }
                        taskIndex++;
                    }
                    else {
                        taskIndex = -1;
                    }
                }
                paths.push(path.reverse());
            }
            return paths;
        }
    }
    __decorate([
        field()
    ], CanCriticalPath.prototype, "criticalPaths", void 0);
    __decorate([
        calculate('criticalPaths')
    ], CanCriticalPath.prototype, "calculateCriticalPaths", null);
    return CanCriticalPath;
};
//# sourceMappingURL=CanCriticalPath.js.map