(function () {
const targetElement = document.querySelector('div[data-file="widget/Checkbox.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.style.cssText = 'display : flex; flex-direction: column';

//START
// checkbox with default look
new Checkbox({
    appendTo : targetElement,
    text     : 'Default',
    style    : { marginBottom : '.5em' }
});

// blue checkbox
new Checkbox({
    appendTo : targetElement,
    color    : 'b-blue',
    text     : 'Blue',
    style    : { marginBottom : '.5em' }
});

// orange checkbox, checked
new Checkbox({
    appendTo : targetElement,
    color    : 'b-orange',
    checked  : true,
    text     : 'Orange (checked)',
    style    : { marginBottom : '.5em' }
});

// orange checkbox, checked
new Checkbox({
    appendTo : targetElement,
    disabled : true,
    text     : 'Disabled'
});
//END
})();
