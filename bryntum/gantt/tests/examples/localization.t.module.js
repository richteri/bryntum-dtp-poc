StartTest(t => {
    t.it('Check German locale', t => {
        t.chain(
            // assume default language is German
            {
                waitForSelector : '[data-column="name"] .b-grid-header-text:textEquals(Vorgangsname)',
                desc            : 'Column is written in German'
            },

            { moveCursorTo : '[data-task-id="11"] .b-gantt-task' },

            {
                waitForSelector : '.b-gantt-task-tooltip :textEquals(Beginnt:)',
                desc            : 'Tooltip is written in German'
            },

            { dblClick : '[data-task-id="11"] .b-gantt-task' },

            {
                waitForSelector : '.b-taskeditor :textEquals(Abgeschlossen in Prozent)',
                desc            : 'Editor is written in German'
            },

            { click : '.b-taskeditor .b-popup-close' },

            { click : '.b-button[data-ref=infoButton]' },

            { click : '.b-combo[data-ref=localeCombo] input' },

            // Switch to English locale
            { click : '.b-list :textEquals(English)' },

            {
                waitForSelector : '[data-column="name"] .b-grid-header-text:textEquals(Name)',
                desc            : 'Column is written in English'
            },

            { moveCursorTo : '[data-task-id="11"] .b-gantt-task', offset : ['99%', '50%'] },

            {
                waitForSelector : '.b-gantt-task-tooltip :textEquals(Start:)',
                desc            : 'Tooltip is written in English'
            },

            { dblClick : '[data-task-id="11"] .b-gantt-task' },

            {
                waitForSelector : '.b-taskeditor :textEquals(% complete)',
                desc            : 'Editor is written in English'
            }
        );
    });

    t.it('Check all locales', t => {
        t.chain(
            ['English', 'Nederlands', 'Svenska', 'Русский', 'Deutsch'].map(locale => [
                { diag : `Checking locale ${locale}` },
                { click : '[data-ref=infoButton]' },
                { click : '[data-ref=localeCombo]' },
                { click : `.b-list-item:contains(${locale})` }
            ])
        );
    });

});
