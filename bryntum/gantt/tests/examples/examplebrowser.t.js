StartTest(t => {
    let document;
    t.setWindowSize(1024, 768);

    t.beforeEach((t, next) => {
        document = t.global.document;
        t.waitForSelector('.example', next);
    });

    t.it('Should initially scroll section into view if provided in hash', t => {
        t.chain(
            { waitForSelector : '.b-gantt-task' },
            { waitForElementTop : '#example-localization' },
            // Force a reload to prove initial scrolling works reliably
            { waitForPageLoad : null, trigger : () => t.global.location.reload() },
            { waitForElementTop : '#example-localization' },
            () => t.pass('scrolled document to correct place')
        );
    });

    t.it('Rendering', t => {
        t.chain(
            next => {
                const
                    example = document.querySelector('a#example-basic');
                example.scrollIntoView();

                t.isGreater(document.querySelectorAll('.example').length, 5, 'A bunch of examples displayed');
                t.isGreater(document.querySelectorAll('h2').length, 3, 'A bunch of headers displayed');

                const
                    link  = example.href,
                    valid = link.match('basic$') || link.match('basic/bundle.htm$');

                t.ok(valid, 'First link looks correct');

                const
                    browserEl = document.getElementById('browser');

                t.ok(browserEl.scrollHeight > browserEl.clientHeight, 'Browser element is scrollable');

                next();
            },

            { moveCursorTo : '#example-basic .tooltip' },
            { waitForSelector : '.b-tooltip:contains(Basic demo)', desc : 'Example tip shown' }
        );
    });

    t.it('Changing theme', t => {
        t.chain(
            // Theme defaults to material, by using ?theme=material on url
            { waitFor : () => document.querySelector('#example-basic img').src.toLowerCase().match('thumb.material.png$') },
            // First item should not be a default theme since popup won't be hidden
            ['Dark', 'Default', 'Light', 'Material', 'Stockholm'].map(theme => [
                next => {
                    document.documentElement.scrollTop = document.body.scrollTop = 0; // For IE 11
                    next();
                },

                { click : '[data-ref=infoButton]' },
                { click : '[data-ref=themeCombo]' },
                { click : `.b-list-item:contains(${theme})`, desc : `Switching to ${theme} theme` },
                { click : 'header' },

                { waitForSelector : `img[src*=${theme.toLowerCase()}]` },

                next => {
                    const
                        thumb = document.querySelector('#example-basic img');
                    t.like(
                        thumb.src.toLowerCase(),
                        // eslint-disable-next-line no-useless-escape
                        `basic\/meta\/thumb.${theme.toLowerCase()}.png`,
                        'Correct thumb src for basic demo'
                    );
                    next();
                }
            ])
        );
    });

    t.it('Check thumbnail sizes', t => {
        const
            steps = [];
        document.querySelectorAll('.example').forEach(example => {
            steps.push({
                waitFor : () => {
                    const
                        img  = document.querySelector(`#${example.id} img`),
                        rect = img.getBoundingClientRect();
                    return t.samePx(rect.width, t.bowser.msie ? 256 : 275, 10) && t.samePx(rect.height, t.bowser.msie ? 192 : 206, 10);
                },
                desc : `Correct image size for: "${example.id}"`
            });
        });
        t.chain(steps);
    });

    t.it('Check tooltips for examples not available offline', t => {
        t.chain(
            { scrollIntoView : 'a#example-angular-advanced' },
            { waitForSelector : ' #example-angular-advanced i.b-fa-cog', desc : 'Correct info icon used' },
            { moveCursorTo : '#example-angular-advanced .tooltip' },
            { waitForSelector : '.b-tooltip-content:contains(This demo needs to be built before it can be viewed)', desc : 'Tooltip shown' },
            { moveCursorTo : 'label.title', desc : 'Hiding tooltip to avoid aborting requests' },
            { waitForSelectorNotFound : '.b-tooltip', desc : 'Tooltip hidden' }
        );
    });

});
