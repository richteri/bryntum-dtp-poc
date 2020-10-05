(function () {
    const targetElement = document.querySelector('div[data-file="widget/FileField.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

//START
new FileField({
    appendTo : targetElement,
    width    : 300,
    multiple : true,
    accept   : 'image/*',
    label    : 'Pick multiple images',
    style    : 'display: block'
});

new FileField({
    appendTo  : targetElement,
    width     : 300,
    label     : 'Pick single file on any type',
    style     : 'display: block; margin-top: 2em;'
});

//END
})();
