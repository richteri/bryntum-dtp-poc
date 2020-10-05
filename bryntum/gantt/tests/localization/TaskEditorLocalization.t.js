import TaskEditor from '../../lib/Gantt/widget/TaskEditor.js';
import LocaleManager from '../../lib/Core/localization/LocaleManager.js';

StartTest(t => {

    //All locales are preloaded via alsoPreload in tests/index.js
    function applyLocale(t, name) {
        t.diag(`Applying locale ${name}`);
        return LocaleManager.locale = window.bryntum.locales[name];
    }

    let editor, gantt;

    t.beforeEach((t, next) => {
        editor && !editor.isDestroyed && editor.destroy();

        gantt && !gantt.isDestroyed && gantt.destroy();

        // Wait for locales to load
        t.waitFor(() => window.bryntum.locales, next);
    });

    t.it('Should localize TaskEditor', t => {
        editor = new TaskEditor({
            appendTo : document.body
        });

        Object.keys(window.bryntum.locales).forEach(name => {
            t.describe(`${name} locale is ok`, t => {
                const locale = applyLocale(t, name);

                const tabs = document.querySelectorAll('.b-gantt-taskeditor .b-tabpanel-tab');

                t.contentLike(tabs[0], locale.GeneralTab.General, 'General tab localization is ok');
                t.contentLike(tabs[1], locale.DependencyTab.Successors, 'Successors tab localization is ok');
                t.contentLike(tabs[2], locale.DependencyTab.Predecessors, 'Predecessors tab localization is ok');
                t.contentLike(tabs[3], locale.ResourcesTab.Resources, 'Resources tab localization is ok');
                t.contentLike(tabs[4], locale.AdvancedTab.Advanced, 'Advanced tab localization is ok');
                t.contentLike(tabs[5], locale.NotesTab.Notes, 'Notes tab localization is ok');

                t.is(document.querySelector('.b-gantt-taskeditor .b-header-title').textContent, locale.TaskEditorBase.Information, 'Information currentLocale is ok');
                t.is(editor.widgetMap.saveButton.element.textContent, locale.TaskEditorBase.Save, 'Save button currentLocale is ok');
                t.is(editor.widgetMap.cancelButton.element.textContent, locale.TaskEditorBase.Cancel, 'Cancel button currentLocale is ok');
            });
        });
    });

    t.it('Should update task editor date pickers weekStartDay on switching locales', t => {
        gantt = t.getGantt({
            features : {
                taskTooltip : false
            }
        });

        t.chain(
            { waitForRowsVisible : gantt },
            async() => {
                const locale = applyLocale(t, 'En');
                t.is(locale.DateHelper.weekStartDay, 0, 'English week starts from Sunday');
            },
            { doubleClick : '[data-task-id="11"]' },
            { click : '.b-pickerfield[data-ref="startDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
                desc            : 'Start date: Week starts with correct day'
            },
            { type : '[ESC]' },
            { click : '.b-pickerfield[data-ref="endDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="0"]',
                desc            : 'End date: Week starts with correct day'
            },
            { type : '[ESC]' },
            async() => {
                const locale = applyLocale(t, 'Ru');
                t.is(locale.DateHelper.weekStartDay, 1, 'Russian week starts from Monday');
            },
            { click : '.b-pickerfield[data-ref="startDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
                desc            : 'Start date: Week starts with correct day'
            },
            { type : '[ESC]' },
            { click : '.b-pickerfield[data-ref="endDateField"] .b-icon-calendar' },
            {
                waitForSelector : '.b-calendar-day-header[data-column-index="0"][data-cell-day="1"]',
                desc            : 'End date: Week starts with correct day'
            }
        );
    });

    // TODO: enable this back when https://app.assembla.com/spaces/bryntum/tickets/8034 is fixed
    /*
    t.it('Should localize TaskEditor width', t => {
        Object.keys(window.bryntum.locales).forEach(name => {
            t.describe(`${name} locale is ok`, t => {
                const locale = applyLocale(t, name);
                let eventEditorWidth = locale.TaskEditorBase.editorWidth;

                if (/em/.test(eventEditorWidth)) {
                    let size = parseInt(eventEditorWidth),
                        fontSize = parseInt(window.getComputedStyle(editor.element).fontSize),
                        expectedWidth = size * fontSize;
                    t.is(editor.width, expectedWidth, 'Width is properly localized');
                }
            });
        });
    });
    */
});
