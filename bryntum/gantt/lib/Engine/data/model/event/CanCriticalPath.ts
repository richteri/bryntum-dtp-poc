import { AnyConstructor, Mixin } from "../../../../ChronoGraph/class/Mixin.js"
import { field, calculate } from "../../../../ChronoGraph/replica/Entity.js"
import { ChronoIterator } from "../../../../ChronoGraph/chrono/Atom.js"
import { ConstrainedLateEvent } from "./ConstrainedLateEvent.js"
import { HasDependencies } from "./HasDependencies.js"
import { HasChildren } from "./HasChildren.js"
import { DependencyMixin } from "../DependencyMixin.js"
import { ConstrainedEvent } from "./ConstrainedEvent.js"

/**
 * Critical path entry.
 */
export type CriticalPathNode = {
    /**
     * Critical event.
     */
    event       : HasDependencies,
    /**
     * Dependency leading to the next path entry.
     * Omitted for the last entry.
     */
    dependency? : DependencyMixin
}

/**
 * Project _critical path_.
 */
export type CriticalPath = CriticalPathNode[]


export const CanCriticalPath = <T extends AnyConstructor<HasChildren>>(base : T) => {

    class CanCriticalPath extends base {

        /**
         * The array of the _critical paths_.
         * Each critical path in turn is represented as an array of [[CriticalPathNode]] entries.
         */
        @field()
        criticalPaths             : CriticalPath[]

        @calculate('criticalPaths')
        * calculateCriticalPaths () : ChronoIterator<CriticalPath[]> {
            const paths : CriticalPath[]                      = [],
                pathsToProcess : CriticalPath[]               = [],
                events : Set<HasChildren & HasDependencies>   = yield this.$.childEvents

            const eventsToProcess = [...events]

            const projectEndDate = yield this.$.endDate

            // First collect events we'll start collecting paths from.
            // We need to start from critical events w/o incoming dependencies
            let event/* : HasChildren & HasDependencies & ConstrainedEvent*/

            while ((event = eventsToProcess.shift())) {
                const childEvents : Set<HasChildren & HasDependencies & ConstrainedLateEvent> = yield event.$.childEvents,
                    eventIsCritical : boolean = yield event.$.critical

                // register a new path finishing at the event
                if (event.endDate - projectEndDate === 0 && eventIsCritical) {
                    pathsToProcess.push([{ event }])
                }

                eventsToProcess.push(...childEvents)
            }

            let path : CriticalPath

            // fetch paths one by one and process
            while ((path = pathsToProcess.shift())) {
                let taskIndex : number = path.length - 1,
                    node : CriticalPathNode

                // get the path last event
                while ((node = path[taskIndex])) {

                    const criticalPredecessorNodes : CriticalPathNode[] = []

                    // collect critical successors
                    for (const dependency of (yield node.event.$.incomingDeps)) {
                        const event : HasDependencies & ConstrainedLateEvent = yield dependency.$.fromEvent,
                            eventIsCritical : boolean = event && (yield event.$.critical)

                        // if we found a critical successor
                        if (eventIsCritical) {
                            criticalPredecessorNodes.push({ event, dependency })
                        }
                    }

                    // if critical successor(s) found
                    if (criticalPredecessorNodes.length) {
                        // make a copy of the path leading part
                        const pathCopy = path.slice()

                        // append the found successor to the path
                        path.push(criticalPredecessorNodes[0])

                        // if we found more than one successor we start new path as: leading path + successor
                        for (let i = 1; i < criticalPredecessorNodes.length; i++) {
                            pathsToProcess.push(pathCopy.concat(criticalPredecessorNodes[i]))
                        }

                        // increment counter to process the successor we've appended to the path
                        taskIndex++
                    }
                    else {
                        // no successors -> stop the loop
                        taskIndex = -1
                    }
                }

                // we collected the path backwards so let's reverse it
                paths.push(path.reverse())
            }

            return paths
        }
    }

    return CanCriticalPath
}


/**
 * This is a mixin, adding critical path calculation to the event node
 *
 * Scheduling-wise it adds *criticalPaths* field to an entity mixing it
 */
export interface CanCriticalPath extends Mixin<typeof CanCriticalPath> {}
