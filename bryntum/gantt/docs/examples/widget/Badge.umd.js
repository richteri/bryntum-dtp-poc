(function () {
  var targetElement = document.querySelector('div[data-file="widget/Badge.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // button with badge, click to increase

  new Button({
    appendTo: targetElement,
    cls: 'b-raised',
    text: 'Click to increase',
    badge: '1',
    style: 'margin-right: 2em',
    onClick: function onClick(_ref) {
      var button = _ref.source;
      return button.badge++;
    }
  });
  new TextField({
    appendTo: targetElement,
    badge: '4',
    label: 'Text length',
    value: 'Text',
    onInput: function onInput(_ref2) {
      var field = _ref2.source;
      return field.badge = field.value.length || '';
    }
  }); //END
})();