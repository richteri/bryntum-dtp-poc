(function() {
const targetElement = document.querySelector('div[data-file="widget/Button.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = `
<p>A variety of buttons, first row has "b-raised" style and second row is flat</p>
<div id="first" class="buttoncontainer" style="margin-bottom: 1em"></div>
<div id="second" class="buttoncontainer"></div>
`;
const firstRow = targetElement.querySelector('#first'),
      secondRow = targetElement.querySelector('#second');
//START
// button with text & icon
new Button({
    appendTo : firstRow,
    cls      : 'b-raised',
    icon     : 'b-fa-plus',
    text     : 'With icon',
    color    : 'b-blue',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// button with only icon
new Button({
    appendTo : firstRow,
    icon     : 'b-fa-trash',
    cls      : 'b-raised',
    color    : 'b-red',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// button with only text
new Button({
    appendTo : firstRow,
    cls      : 'b-raised',
    text     : 'Only text',
    color    : 'b-green',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// raised disable
new Button({
    appendTo : firstRow,
    cls      : 'b-raised',
    icon     : 'b-fa-plus',
    text     : 'Disabled',
    disabled : true
});

// flat button with text & icon
new Button({
    appendTo : secondRow,
    icon     : 'b-fa-plus',
    text     : 'Flat icon',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// flat button with text only
new Button({
    appendTo : secondRow,
    text     : 'Flat text',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// flat button with icon only
new Button({
    appendTo : secondRow,
    icon     : 'b-fa-info',
    onClick  : () => WidgetHelper.toast('Button clicked')
});

// flat disabled
new Button({
    appendTo : secondRow,
    text     : 'Disabled',
    disabled : true
});
//END
})();
