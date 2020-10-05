/* global ProjectModel */
StartTest(t => {

    let project, resourceStore, taskStore;

    t.beforeEach(t => {

        project = new ProjectModel({
            autoSync  : false,
            transport : {
                load : { method : 'GET', paramName : 'q', url : './crud_manager/data/20_empty_dataset.json' },
                sync : { method : 'POST', url : '.' }
            },
            listeners : {
                loadfail : () => t.fail('Loading failed'),
                syncfail : () => t.fail('Persisting failed')
            }
        });

        taskStore       = project.eventStore;
        resourceStore   = project.resourceStore;
    });

    // #8394 https://app.assembla.com/spaces/bryntum/tickets/8394-crudmanager-reacts-incorrectly-and-tries-to-save-empty-changeset/details#
    t.it('CRUD manager shouldn\'t sync an empty dataset', async t => {

        await project.load();

        const async = t.beginAsync();

        project.on({
            beforesync : ({ pack }) => {
                // NOTE: it used to be like that:
                // pack {
                //     ...
                //     resources : {
                //         updated : [{id : 1}]
                //     }
                //
                //     tasks : {
                //         updated : [{id : 1}]
                //     }
                //     ...
                // }
                t.notOk(Object.prototype.hasOwnProperty.call(pack, 'resources'), 'Crud manager doesn\'t sync unchanged resources');
                t.notOk(Object.prototype.hasOwnProperty.call(pack, 'tasks'), 'Crud manager doesn\'t sync unchanged tasks');

                t.endAsync(async);

                return false;
            },
            single : true
        });

        const task = taskStore.getById(1);
        const resource = resourceStore.getById(1);

        t.ok(task && resource, 'Got data');

        // enable project auto syncing
        project.autoSync = true;

        await task.assign(resource);
    });
});
