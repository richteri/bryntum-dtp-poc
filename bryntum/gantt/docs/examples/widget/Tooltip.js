(function () {
    const targetElement = document.querySelector('div[data-file="widget/Tooltip.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

//START
    new Button({
        appendTo : targetElement,
        text     : 'Hover me',
        tooltip  : 'Tooltip for widget'
    });

    new Button({
        appendTo : targetElement,
        text     : 'I\'m async',
        tooltip  : {
            listeners : {
                beforeShow : ({ source : tip }) => {
                    tip.html = false;
                    // AjaxHelper.get('someurl').then(response => tip.html = 'Done!');
                    setTimeout(() => {
                        tip.html = 'Done!';
                    }, 2000);
                }
            }
        }
    });
//END
})();
