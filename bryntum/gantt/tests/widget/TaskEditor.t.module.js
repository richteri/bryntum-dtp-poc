import { TaskEditor } from '../../build/gantt.module.js';

StartTest(t => {

    // https://app.assembla.com/spaces/bryntum/tickets/9253
    t.it('Should be possible create 2 editors with the same tab disabled', t => {
        t.livesOk(() => {
            new TaskEditor({
                tabsConfig : { notestab : false }
            });

            new TaskEditor({
                tabsConfig : { notestab : false }
            });
        });
    });

    t.it('Should not crash when clicking units cell during edit of new assignment', t => {
        const editor = new TaskEditor({
            autoShow : true
        });

        editor.loadEvent(t.getProject().firstChild);

        t.chain(
            { click : '.b-tabpanel-tab:textEquals(Resources)' },
            { click : '[data-ref=resourcestab-add]' },
            { click : '.b-grid-cell[data-column=units]' }
        );
    });

    t.it('Should round percentDone value in task editor', t => {
        const editor = new TaskEditor({
            autoShow : true
        });

        const parentRecord = t.getProject().firstChild;

        editor.loadEvent(parentRecord);

        t.is(editor.widgetMap.generaltab.widgetMap.percentDoneField.value, parentRecord.renderedPercentDone);
    });
});
