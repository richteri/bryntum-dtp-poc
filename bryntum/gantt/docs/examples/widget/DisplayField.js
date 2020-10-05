(function () {
    const targetElement = document.querySelector('div[data-file="widget/DisplayField.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

//START
new DisplayField({
    appendTo : targetElement,
    width    : 200,
    label    : 'Label text',
    value    : 'The display value'
});

//END
})();
