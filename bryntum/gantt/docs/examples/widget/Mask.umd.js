(function () {
  var targetElement = document.querySelector('div[data-file="widget/Mask.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  new Button({
    appendTo: targetElement,
    cls: 'b-raised',
    text: 'Show mask',
    onClick: function onClick() {
      Mask.mask({
        text: 'Masked (2 seconds)',
        mode: 'dark-blur'
      });
      setTimeout(function () {
        return Mask.unmask();
      }, 2000);
    }
  }); //END
})();