StartTest('Test buttons tooltips', t => {

    t.it('Wait for docs live demo to load', t => {
        t.chain(
            { setWindowSize : [1280, 1024] },

            { waitFor : () => bryntum.query('panel') && bryntum.query('panel').tbar }
        );
    });

    t.it('Check toolbar buttons tooltips', t => {
        t.chain(
            Object.values(bryntum.query('panel').tbar.widgetMap).map(button => {
                if (button.$name === 'Button' && button.tooltip) {
                    return [
                        { moveMouseTo : button.element },
                        {
                            waitForSelector : `.b-tooltip:contains(${button.tooltip.html})`,
                            desc            : 'Correct tooltip shown'
                        }
                    ];
                }
            })
        );
    });

});
