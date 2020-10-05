import { ProjectModel, PredecessorsTab, LocaleManager, Localizable, DependencyField, DependencyTypePicker } from '../../build/gantt.module.js';

StartTest(t => {

    let project;

    //All locales are preloaded via alsoPreload in tests/index.js
    function applyLocale(t, name) {
        t.diag(`Applying locale ${name}`);
        return LocaleManager.locale = window.bryntum.locales[name];
    }

    t.beforeEach(async(t, next) => {
        project = new ProjectModel({
            eventsData : (() => {
                return [...new Array(5).keys()].map(index => {
                    return {
                        id        : index + 1,
                        name      : index + 1,
                        startDate : '2017-01-16',
                        duration  : 1
                    };
                });
            })(),
            dependenciesData : [
                { fromEvent : 1, toEvent : 5, type : 0 },
                { fromEvent : 2, toEvent : 5, type : 1 },
                { fromEvent : 3, toEvent : 5, type : 2 },
                { fromEvent : 4, toEvent : 5, type : 3 }
            ]
        });

        await project.waitForPropagateCompleted();

        // Wait for locales to load
        t.waitFor(() => window.bryntum.locales, next);
    });

    t.it('Should localize dependency type in PredecessorsTab', async(t) => {
        await project.propagate();

        const
            depGrid = new PredecessorsTab({
                appendTo : document.body
            });

        depGrid.height = 300;

        depGrid.loadEvent(project.eventStore.getById(5));

        Object.keys(window.bryntum.locales).forEach(name => {
            applyLocale(t, name);
            const
                dependencyTypes = Localizable().L('L{SchedulerProCommon.dependencyTypesLong}');
            Array.from(document.querySelectorAll('.b-grid-row [data-column="type"]')).forEach((el, index) => {
                t.contentLike(el, dependencyTypes[index], `Dependency type ${index} is localized properly in ${name}`);
            });
        });

        depGrid.destroy();

        t.livesOk(() => applyLocale(t, 'En'), 'Listener is removed properly');
    });

    t.it('Should localize dependency type in DependencyField', async(t) => {
        await project.propagate();

        const field = new DependencyField({
            appendTo  : document.body,
            otherSide : 'from',
            ourSide   : 'to'
        });

        field.value = project.dependencyStore.getRange();

        Object.keys(window.bryntum.locales).forEach(name => {
            applyLocale(t, name);
            const
                depNames = Localizable().L('L{GanttCommon.dependencyTypes}');
            t.is(field.input.value, `1${depNames[0]};2${depNames[1]};3;4${depNames[3]}`, 'Dependency type is ok');
        });

        field.destroy();

        t.livesOk(() => applyLocale(t, 'En'), 'Listeners destroyed correctly');
    });

    t.it('Should localize dependency type in DependencyTypePicker', async(t) => {
        await project.propagate();

        const picker = new DependencyTypePicker({
            appendTo : document.body
        });

        Object.keys(window.bryntum.locales).forEach(name => {
            applyLocale(t, name);
            const
                dependencyTypes = Localizable().L('L{SchedulerProCommon.dependencyTypesLong}');
            picker.showPicker();
            dependencyTypes.forEach((item, index) => {
                t.contentLike(`.b-list .b-list-item[data-index=${index}]`, item, `Dependency type ${item} is localized`);
            });
        });

        picker.destroy();

        t.livesOk(() => applyLocale(t, 'En'), 'Listener is removed properly');
    });
});
