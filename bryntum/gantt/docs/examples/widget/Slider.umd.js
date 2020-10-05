(function () {
  var targetElement = document.querySelector('div[data-file="widget/Slider.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  new Slider({
    appendTo: targetElement,
    width: 200,
    style: 'margin-bottom: 5px'
  });
  new Slider({
    appendTo: targetElement,
    text: 'Text + value',
    width: 200,
    style: 'margin-bottom: 5px'
  });
  new Slider({
    appendTo: targetElement,
    text: 'Text',
    showValue: false,
    width: 200,
    style: 'margin-bottom: 5px'
  });
  new Slider({
    appendTo: targetElement,
    text: 'Tooltip',
    showValue: false,
    showTooltip: true,
    width: 200,
    style: 'margin-bottom: 5px'
  }); //END
})();