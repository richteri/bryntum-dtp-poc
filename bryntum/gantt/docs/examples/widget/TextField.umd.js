(function () {
  var targetElement = document.querySelector('div[data-file="widget/TextField.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  new TextField({
    appendTo: targetElement,
    width: 200,
    label: 'Enter text',
    style: 'margin-right: .5em'
  });
  new TextField({
    appendTo: targetElement,
    clearable: true,
    width: 200,
    label: 'Clearable',
    value: 'Hello',
    style: 'margin-right: .5em'
  });
  new TextField({
    appendTo: targetElement,
    width: 200,
    label: 'With custom icon',
    icon: 'b-fa b-fa-plug',
    style: 'margin-right: .5em'
  }); //END
})();