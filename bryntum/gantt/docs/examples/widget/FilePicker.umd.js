(function () {
  var targetElement = document.querySelector('div[data-file="widget/FilePicker.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  new FilePicker({
    appendTo: targetElement,
    fileFieldConfig: {
      multiple: true,
      accept: 'image/*'
    },
    buttonConfig: {
      text: 'Pick multiple images',
      cls: 'b-blue b-raised'
    }
  });
  new FilePicker({
    appendTo: targetElement,
    buttonConfig: {
      text: 'Pick single file on any type',
      cls: 'b-green b-raised'
    },
    style: 'margin-top: 2em;'
  }); //END
})();