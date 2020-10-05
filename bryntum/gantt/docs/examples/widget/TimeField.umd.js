(function () {
  var targetElement = document.querySelector('div[data-file="widget/TimeField.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  new TimeField({
    label: 'Not editable',
    editable: false,
    style: 'margin-right: .5em',
    appendTo: targetElement
  });
  new TimeField({
    label: 'Editable',
    editable: true,
    appendTo: targetElement
  }); //END
})();