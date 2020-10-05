import Gantt from '../../lib/Gantt/view/Gantt.js';
import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';
import ProjectModel from '../../lib/Gantt/model/ProjectModel.js';

StartTest(t => {

    window.AjaxHelper = AjaxHelper;

    let gantt;

    t.beforeEach(() => {
        if (gantt) {
            gantt.project.destroy();
            gantt.destroy();
        }
    });

    t.mockUrl('loadurl', {
        delay        : 10,
        responseText : JSON.stringify({
            success   : true,
            resources : {
                rows : [
                    { id : 'a' }
                ]
            },
            assignments : {
                rows : [
                    { id : 'a1', resource : 'a', event : 1 }
                ]
            },
            tasks : {
                rows : [
                    { id : 1, startDate : '2018-02-01', endDate : '2018-03-01' }
                ]
            }
        })
    });

    t.mockUrl('syncurl', {
        delay        : 10,
        responseText : JSON.stringify({
            success   : true,
            resources : {
                rows : [
                    { id : 'a' }
                ]
            }
        })
    });

    t.it('loadMask is shown when loading is triggered on scheduler construction', t => {
        const
            async   = t.beginAsync(),
            project = new ProjectModel({
                autoLoad  : true,
                transport : {
                    sync : {
                        url : 'syncurl'
                    },
                    load : {
                        url : 'loadurl'
                    }
                }
            });

        gantt = new Gantt({
            appendTo  : document.body,
            startDate : new Date(2018, 0, 30),
            endDate   : new Date(2018, 2, 2),
            project
        });

        t.chain(
            { waitForSelector : '.b-mask-content:contains(Loading)', desc : 'loadMask showed up' },
            { waitForSelectorNotFound : '.b-mask-content:contains(Loading)', desc : 'loadMask disappeared' },
            () => t.endAsync(async)
        );
    });

    t.it('loadMask is shown when loading is triggered after scheduler construction', t => {
        const
            async   = t.beginAsync(),
            project = new ProjectModel({
                autoLoad  : false,
                transport : {
                    sync : {
                        url : 'syncurl'
                    },
                    load : {
                        url : 'loadurl'
                    }
                }
            });

        gantt = new Gantt({
            appendTo  : document.body,
            startDate : new Date(2018, 0, 30),
            endDate   : new Date(2018, 2, 2),
            project
        });

        project.load();

        t.chain(
            { waitForSelector : '.b-mask-content:contains(Loading)', desc : 'loadMask showed up' },
            { waitForSelectorNotFound : '.b-mask-content:contains(Loading)', desc : 'loadMask disappeared' },
            () => t.endAsync(async)
        );
    });

    t.it('syncMask is shown when loading is triggered after scheduler construction', t => {
        const
            async   = t.beginAsync(),
            project = new ProjectModel({
                autoLoad  : false,
                transport : {
                    sync : {
                        url : 'syncurl'
                    },
                    load : {
                        url : 'loadurl'
                    }
                }
            });

        gantt = new Gantt({
            appendTo  : document.body,
            startDate : new Date(2018, 0, 30),
            endDate   : new Date(2018, 2, 2),
            project
        });

        t.chain(
            () => project.load(),
            next => {
                gantt.resourceStore.first.setName('foo');
                gantt.crudManager.sync();
                next();
            },
            { waitForSelector : '.b-mask-content:contains(Saving)', desc : 'syncMask showed up' },
            { waitForSelectorNotFound : '.b-mask-content:contains(Saving)', desc : 'syncMask disappeared' },
            () => t.endAsync(async)
        );
    });

    t.it('Should hide "No records to display" when loading and show when loaded empty data', t => {

        t.mockUrl('loadurl', {
            delay        : 1000,
            responseText : JSON.stringify({
                success     : true,
                resources   : { rows : [] },
                assignments : { rows : [] },
                tasks       : { rows : [] }
            })
        });

        const
            async   = t.beginAsync(),
            project = new ProjectModel({
                autoLoad  : false,
                transport : {
                    sync : {
                        url : 'syncurl'
                    },
                    load : {
                        url : 'loadurl'
                    }
                }
            });

        gantt = new Gantt({
            appendTo  : document.body,
            startDate : new Date(2018, 0, 30),
            endDate   : new Date(2018, 2, 2),
            project
        });

        t.selectorExists('.b-grid-empty', 'Gantt has the b-grid-empty class before load');
        project.load();
        t.chain(
            { waitForSelector : '.b-mask-content:contains(Loading)', desc : 'loadMask showed up' },
            next => {
                t.selectorNotExists('.b-grid-empty', 'Gantt has no b-grid-empty class when loading');
                next();
            },
            { waitForSelectorNotFound : '.b-mask-content:contains(Loading)', desc : 'loadMask is hidden' },
            { waitForSelector : '.b-grid-empty', desc : 'Gantt has b-grid-empty after loaded empty rows' },
            () => t.endAsync(async)
        );
    });

});
