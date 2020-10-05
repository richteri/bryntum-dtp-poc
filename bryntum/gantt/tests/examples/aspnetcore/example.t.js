StartTest(async t => {
    await t.waitForSelector('.b-gantt-task');
    
    const
        gantt = window.gantt,
        { IdHelper } = window.bryntum;
    
    gantt.enableEventAnimations = false;
    
    t.it('Should add/update/remove new tasks/resource/assignments', async t => {
        try {
            const project = gantt.project;
            
            await project.waitForPropagateCompleted();
    
            // region Add
            t.diag('Add');
            
            const
                newResourceName     = IdHelper.generateId('resource'),
                updatedResourceName = IdHelper.generateId('resource'),
                parent              = gantt.taskStore.rootNode.appendChild({
                    Name     : 'New parent',
                    expanded : true,
                    children : [
                        {
                            Name     : 'Child 1',
                            Duration : 5,
                            leaf     : true
                        }
                    ]
                }),
                child               = parent.children[0],
                [resource]          = gantt.resourceStore.add({ Name : newResourceName }),
                [assignment]        = gantt.assignmentStore.add({ TaskId : child.id, ResourceId : resource.id });
            
            await project.propagate();
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeplySubset(
                        [
                            {
                                $PhantomId : parent.id,
                                Name       : 'New parent',
                                StartDate  : new Date('2012-09-03 08:00'),
                                EndDate    : new Date('2012-09-07 17:00'),
                                Duration   : 5
                            },
                            {
                                $PhantomId       : child.id,
                                $PhantomParentId : parent.id,
                                Name             : 'Child 1',
                                StartDate        : new Date('2012-09-03 08:00'),
                                EndDate          : new Date('2012-09-07 17:00'),
                                Duration         : 5
                            }
                        ],
                        pack.tasks.added,
                        'Tasks add request is ok'
                    );
    
                    t.isDeeply(
                        pack.resources.added,
                        [{ $PhantomId : resource.id, Name : newResourceName, CalendarId : 1 }],
                        'Resource sync pack is ok'
                    );
                    
                    t.isDeeply(
                        pack.assignments.added,
                        [{ $PhantomId : assignment.id, TaskId : child.id, ResourceId : resource.id, Units : 100 }],
                        'Assignment sync pack is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    const
                        parentId     = response.tasks.rows[0].Id,
                        childId      = response.tasks.rows[1].Id,
                        resourceId   = response.resources.rows[0].Id,
                        assignmentId = response.assignments.rows[0].Id,
                        ids          = [parentId, childId, resourceId, assignmentId];
                    
                    if (ids.some(id => id === 0)) {
                        t.fail(ids, 'Ids are valid');
                    }
                    
                    t.isDeeply(
                        response.tasks.rows,
                        [
                            {
                                Id         : parentId,
                                $PhantomId : parent.id
                            },
                            {
                                Id         : childId,
                                $PhantomId : child.id
                            }
                        ],
                        'Parent/child added'
                    );
    
                    t.isDeeply(
                        response.resources.rows,
                        [{ Id : resourceId, $PhantomId : resource.id }],
                        'Resource added'
                    );
                    
                    t.isDeeply(
                        response.assignments.rows,
                        [{ Id : assignmentId, $PhantomId : assignment.id, TaskId : childId, ResourceId : resourceId }],
                        'Assignment added'
                    );
                },
                once : true
            });
            
            await project.sync();
            
            t.is(resource.tasks.length, 1, '1 task assigned');
            t.is(resource.tasks[0], child, 'Correct task is assigned');
            
            const resources = project.taskStore.getResourcesForEvent(child);
            t.is(resources.length, 1, '1 resource is assigned');
            t.is(resources[0], resource, 'Correct resource is assigned');
            
            // endregion
            
            // region Update
            t.diag('Update');
            
            resource.name = updatedResourceName;
            assignment.units = 50;
            await child.setConstraint('startnoearlierthan', new Date(2012, 8, 5));
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeplySubset(
                        {
                            StartDate : new Date(2012, 8, 5, 8),
                            EndDate   : new Date(2012, 8, 11, 17)
                        },
                        pack.tasks.updated.find(r => r.Id === parent.id),
                        'Parent update request is ok'
                    );
                    
                    t.isDeeplySubset(
                        {
                            StartDate      : new Date(2012, 8, 5, 8),
                            EndDate        : new Date(2012, 8, 11, 17),
                            ConstraintDate : new Date(2012, 8, 5),
                            ConstraintType : 'startnoearlierthan'
                        },
                        pack.tasks.updated.find(r => r.Id === child.id),
                        'Child update request is ok'
                    );
                    
                    t.isDeeply(
                        pack.resources.updated,
                        [{ Id : resource.id, Name : updatedResourceName }],
                        'Resource update request is ok'
                    );
                    
                    t.isDeeply(
                        pack.assignments.updated,
                        [{ Id : assignment.id, Units : 50 }],
                        'Assignment update request is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    t.isDeeply(
                        response.tasks.rows.sort((a, b) => a.Id - b.Id),
                        [{ Id : parent.id }, { Id : child.id }],
                        'Parent/child updated ok'
                    );
                    
                    t.isDeeply(
                        response.resources.rows,
                        [{ Id : resource.id }],
                        'Resource updated ok'
                    );
                    
                    t.isDeeply(
                        response.assignments.rows,
                        [{ Id : assignment.id }],
                        'Assignment updated ok'
                    );
                },
                once : true
            });
            
            await project.sync();
            
            t.is(parent.startDate, new Date(2012, 8, 5, 8), 'Parent start date is ok');
            t.is(parent.endDate, new Date(2012, 8, 11, 17), 'Parent end date is ok');
            
            t.is(child.startDate, new Date(2012, 8, 5, 8), 'Child start date is ok');
            t.is(child.endDate, new Date(2012, 8, 11, 17), 'Child end date is ok');
            
            t.is(resource.name, updatedResourceName, 'Resource name is ok');
            
            t.is(assignment.units, 50, 'Units are updated');
            // endregion
    
            // region Remove
            t.diag('Remove');
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeply(
                        pack.tasks.removed.sort((a, b) => a.Id - b.Id),
                        [{ Id : parent.id }, { Id : child.id }],
                        'Tasks remove request is ok'
                    );
                    
                    t.isDeeply(
                        pack.resources.removed,
                        [{ Id : resource.id }],
                        'Resource remove request is ok'
                    );
                    
                    t.isDeeply(
                        pack.assignments.removed,
                        [{ Id : assignment.id }],
                        'Assignment remove request is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    t.isDeeply(
                        response.tasks.removed.sort((a, b) => a.Id - b.Id),
                        [{ Id : parent.id }, { Id : child.id }],
                        'Tasks are removed'
                    );
                    
                    t.isDeeply(
                        response.resources.removed,
                        [{ Id : resource.id }],
                        'Resource is removed'
                    );
                    
                    t.isDeeply(
                        response.assignments.removed,
                        [{ Id : assignment.id }],
                        'Assignment is removed'
                    );
                },
                once : true
            });
            
            gantt.assignmentStore.remove(assignment);
            gantt.resourceStore.remove(resource);
            gantt.taskStore.remove(parent);
            
            await project.sync();
            
            t.notOk(gantt.resourceStore.find(r => r.name === updatedResourceName), 'Resource is not in the store');
            
            // endregion
        }
        catch (e) {
            t.fail(e.stack);
        }
    });
    
    t.it('Should add/update/remove new tasks/resource/assignments', async t => {
        try {
            const project = gantt.project;
            
            await project.waitForPropagateCompleted();
    
            // region Add
            t.diag('Add');
            
            const
                parent1Name = IdHelper.generateId('record'),
                parent2Name = IdHelper.generateId('record'),
                child11Name = IdHelper.generateId('record'),
                child21Name = IdHelper.generateId('record');
            
            let parent1 = gantt.taskStore.rootNode.appendChild({
                    Name     : parent1Name,
                    expanded : true,
                    children : [
                        {
                            Name     : child11Name,
                            Duration : 5,
                            leaf     : true
                        }
                    ]
                }),
                [child11]  = parent1.children;
            
            await project.propagate();
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeplySubset(
                        [
                            {
                                $PhantomId : parent1.id,
                                Name       : parent1Name
                            },
                            {
                                $PhantomId       : child11.id,
                                $PhantomParentId : parent1.id,
                                Name             : child11Name
                            }
                        ],
                        pack.tasks.added,
                        'Tasks add request is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    const
                        parentId = response.tasks.rows[0].Id,
                        childId  = response.tasks.rows[1].Id,
                        ids      = [parentId, childId];
                    
                    if (ids.some(id => id === 0)) {
                        t.fail(ids, 'Ids are valid');
                    }
                    
                    t.isDeeplySubset(
                        [
                            {
                                $PhantomId : parent1.id
                            },
                            {
                                $PhantomId : child11.id
                            }
                        ],
                        response.tasks.rows,
                        'Parent/child added'
                    );
                },
                once : true
            });
            
            await project.sync();
            
            // endregion
            
            // region Add new, update existing
            t.diag('Add new, update existing');
            
            let parent2 = gantt.taskStore.rootNode.appendChild({
                    name     : parent2Name,
                    children : [
                        {
                            name     : child21Name,
                            duration : 1
                        }
                    ]
                }),
                [child21] = parent2.children;
            
            parent2.appendChild(child11);
            parent1.appendChild(child21);
            
            await project.propagate();
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeplySubset(
                        {
                            $PhantomParentId : parent2.id
                        },
                        pack.tasks.updated.find(r => r.Id === child11.id),
                        'Parent update request is ok'
                    );
                    
                    t.isDeeplySubset(
                        {
                            parentId         : parent1.id,
                            $PhantomId       : child21.id,
                            $PhantomParentId : undefined
                        },
                        pack.tasks.added.find(r => r.$PhantomId === child21.id),
                        'Task add request is ok'
                    );
                },
                once : true
            });
            
            await project.sync();
            
            // endregion
    
            // region Reload project
            t.diag('Reload');
            
            await project.load();
            
            parent1 = gantt.taskStore.findRecord('name', parent1Name);
            parent2 = gantt.taskStore.findRecord('name', parent2Name);
            child11 = gantt.taskStore.findRecord('name', child11Name);
            child21 = gantt.taskStore.findRecord('name', child21Name);
            
            t.is(child11.parent.id, parent2.id, 'Parent 2 has Child 1-1');
            t.is(child21.parent.id, parent1.id, 'Parent 1 has Child 2-1');
            
            gantt.taskStore.remove([parent1, parent2]);
            
            await gantt.project.sync();
            
            // endregion
        }
        catch (e) {
            t.fail(e.stack);
        }
    });
    
    t.it('Should add/update/remove new tasks/dependencies', async t => {
        try {
            const project = gantt.project;
            
            await project.waitForPropagateCompleted();
    
            // region Add
            t.diag('Add');
            
            const
                parent              = gantt.taskStore.rootNode.appendChild({
                    Name     : 'New parent',
                    expanded : true,
                    children : [
                        {
                            Name     : 'Child 1',
                            Duration : 5,
                            leaf     : true
                        },
                        {
                            Name     : 'Child 2',
                            Duration : 3,
                            leaf     : true
                        }
                    ]
                }),
                [child1, child2]    = parent.children,
                [dependency]        = gantt.dependencyStore.add({ From : child1.id, To : child2.id, Lag : 1 });
            
            await project.propagate();
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeply(
                        pack.dependencies.added,
                        [{
                            $PhantomId : dependency.id,
                            From       : child1.id,
                            To         : child2.id,
                            Lag        : 1,
                            LagUnit    : 'day',
                            Cls        : '',
                            Type       : 2
                        }],
                        'Dependency sync pack is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    const
                        child1Id     = response.tasks.rows[1].Id,
                        child2Id     = response.tasks.rows[2].Id,
                        dependencyId = response.dependencies.rows[0].Id,
                        ids          = [child1Id, child2Id, dependencyId];
                    
                    if (ids.some(id => id === 0)) {
                        t.fail(ids, 'Ids are valid');
                    }
    
                    t.isDeeply(
                        response.dependencies.rows,
                        [{ Id : dependencyId, $PhantomId : dependency.id, From : child1Id, To : child2Id }],
                        'Dependency added'
                    );
                },
                once : true
            });
            
            await project.sync();
            
            t.is(dependency.fromEvent, child1, 'Source task is ok');
            t.is(dependency.toEvent, child2, 'Target task is ok');
            
            // endregion
            
            // region Update
            t.diag('Update');
            
            await dependency.setLag(2);
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeplySubset(
                        {
                            EndDate : new Date(2012, 8, 14, 17)
                        },
                        pack.tasks.updated.find(r => r.Id === parent.id),
                        'Parent update request is ok'
                    );
                    
                    t.isDeeplySubset(
                        {
                            EndDate : new Date(2012, 8, 14, 17)
                        },
                        pack.tasks.updated.find(r => r.Id === child2.id),
                        'Child update request is ok'
                    );
                    
                    t.isDeeply(
                        pack.dependencies.updated,
                        [{ Id : dependency.id, Lag : 2 }],
                        'Dependency update request is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    t.isDeeply(
                        response.tasks.rows.sort((a, b) => a.Id - b.Id),
                        [{ Id : parent.id }, { Id : child2.id }],
                        'Parent/child updated ok'
                    );
                    
                    t.isDeeply(
                        response.dependencies.rows,
                        [{ Id : dependency.id }],
                        'Dependency updated ok'
                    );
                },
                once : true
            });
            
            await project.sync();
            
            t.is(parent.endDate, new Date(2012, 8, 14, 17), 'Parent end date is ok');
            
            t.is(child2.endDate, new Date(2012, 8, 14, 17), 'Child end date is ok');
            
            t.is(dependency.lag, 2, 'Lag is updated');
            // endregion
    
            // region Remove
            t.diag('Remove');
            
            gantt.crudManager.on({
                beforeSync({ pack }) {
                    t.isDeeply(
                        pack.tasks.removed.sort((a, b) => a.Id - b.Id),
                        [{ Id : parent.id }, { Id : child1.id }, { Id : child2.id }],
                        'Tasks remove request is ok'
                    );
                    
                    t.isDeeply(
                        pack.dependencies.removed,
                        [{ Id : dependency.id }],
                        'Dependency remove request is ok'
                    );
                },
                beforeSyncApply({ response }) {
                    t.isDeeply(
                        response.tasks.removed.sort((a, b) => a.Id - b.Id),
                        [{ Id : parent.id }, { Id : child1.id }, { Id : child2.id }],
                        'Tasks are removed'
                    );
                    
                    t.isDeeply(
                        response.dependencies.removed,
                        [{ Id : dependency.id }],
                        'Dependency is removed'
                    );
                },
                once : true
            });
            
            gantt.taskStore.remove(parent);
            
            await project.sync();
            
            // endregion
        }
        catch (e) {
            t.fail(e.stack);
        }
    });
    
    t.it('Should load non-working time', async t => {
        try {
            const project = gantt.project;
    
            await project.waitForPropagateCompleted();
            
            t.notOk(gantt.project.calendar.isDayHoliday(new Date(2012, 9, 20)), 'Day override is loaded properly');
            t.ok(gantt.project.calendar.isDayHoliday(new Date(2012, 9, 21)), 'Weekend is non-working');
        }
        catch (e) {
            t.fail(e.stack);
        }
    });
});
