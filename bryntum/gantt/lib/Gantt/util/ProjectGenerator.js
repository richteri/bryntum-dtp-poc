import DateHelper from '../../Core/helper/DateHelper.js';
import RandomGenerator from '../../Core/helper/util/RandomGenerator.js';

/**
 * @module Gantt/util/ProjectGenerator
 */

const
    today               = new Date(),
    firstDateOfThisYear = new Date(today.getFullYear(), 0, 1),
    rnd                 = new RandomGenerator();

function getNum(id, token) {
    return parseInt('' + id + token);
}

/**
 * Generates sample project for Examples and Tests
 */

export default class ProjectGenerator {
    static generateAsync(requestedTaskCount, maxProjectSize, progressCallback = null, startDate = firstDateOfThisYear) {
        const config = {
            startDate,
            tasksData        : [],
            dependenciesData : []
        };

        const
            blockCount = Math.ceil(requestedTaskCount / 10),
            projectSize = Math.ceil(maxProjectSize / 10),
            generator = this.generateBlocks(blockCount, projectSize, config.startDate);

        let duration = 0,
            taskCount = 0,
            dependencyCount = 0;

        return new Promise(resolve => {
            function generate() {
                // 100 blocks at the time
                for (let i = 0; i < 100; i++) {
                    const res = generator.next();
                    if (!res.done) {
                        const block = res.value;

                        config.tasksData.push(...block.tasksData);
                        config.dependenciesData.push(...block.dependenciesData);

                        if (block.projectDuration) {
                            duration = Math.max(block.projectDuration, duration);
                        }

                        taskCount += block.taskCount;
                        dependencyCount += block.dependencyCount;
                    }
                    else {
                        progressCallback && progressCallback(taskCount, dependencyCount, true);

                        config.endDate = DateHelper.add(config.startDate, Math.max(duration, 30), 'days');

                        return resolve(config);
                    }
                }

                progressCallback && progressCallback(taskCount, dependencyCount, false);

                setTimeout(generate, 0);
            }

            generate();

        });
    }

    static * generateBlocks(count, projectSize, startDate) {
        let currentId = 1,
            dependencyId = 1,
            projectDuration = 0,
            blockDuration = 0;

        function rndDuration(addToTotal = true) {
            const value = rnd.nextRandom(5) + 2;

            if (addToTotal) {
                blockDuration += value;
            }

            return value;
        }

        // TODO : Dates/duration should be correct from start to avoid initial normalization of those?

        for (let i = 0; i < count; i++) {
            const
                blockStartId = currentId,
                block = {
                    tasksData : [
                        {
                            id       : currentId++,
                            name     : 'Parent ' + blockStartId,
                            startDate,
                            expanded : true,
                            children : [
                                {
                                    id       : currentId++,
                                    name     : 'Sub-parent ' + getNum(blockStartId, 1),
                                    startDate,
                                    expanded : true,
                                    children : [
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 11),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        },
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 12),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        },
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 13),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        },
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 14),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        }
                                    ]
                                },
                                {
                                    id       : currentId++,
                                    name     : 'Sub-parent ' + getNum(blockStartId, 2),
                                    startDate,
                                    //duration    : rndDuration(false),
                                    //percentDone : rnd.nextRandom(90) + 10,
                                    expanded : true,
                                    children : [
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 21),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        },
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 22),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        },
                                        {
                                            id          : currentId++,
                                            name        : 'Task ' + getNum(blockStartId, 23),
                                            startDate,
                                            duration    : rndDuration(),
                                            percentDone : rnd.nextRandom(100)
                                        }
                                    ]
                                }
                            ]
                        }
                    ],

                    dependenciesData : [
                        { id : dependencyId++, fromEvent : blockStartId + 2, toEvent : blockStartId + 3 },
                        { id : dependencyId++, fromEvent : blockStartId + 3, toEvent : blockStartId + 4 },
                        { id : dependencyId++, fromEvent : blockStartId + 4, toEvent : blockStartId + 5 },
                        { id : dependencyId++, fromEvent : blockStartId + 5, toEvent : blockStartId + 7 },
                        { id : dependencyId++, fromEvent : blockStartId + 7, toEvent : blockStartId + 8 },
                        { id : dependencyId++, fromEvent : blockStartId + 8, toEvent : blockStartId + 9 }
                    ],

                    taskCount       : 10,
                    dependencyCount : 5
                };

            projectDuration += blockDuration;
            blockDuration = 0;
            block.projectDuration = projectDuration;

            if (i % projectSize !== 0) {
                block.dependenciesData.push({
                    id        : dependencyId++,
                    fromEvent : blockStartId - 2,
                    toEvent   : blockStartId + 2
                });
                block.dependencyCount++;
            }
            else {
                projectDuration = 0;
            }

            currentId++;

            yield block;
        }
    }
}
