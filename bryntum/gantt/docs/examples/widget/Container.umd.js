(function () {
  var targetElement = document.querySelector('div[data-file="widget/Container.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>A Container with three widgets: a TextField, a NumberField and a button</p>'; //START
  // a container containing three widgets

  var container = new Container({
    appendTo: targetElement,
    items: [{
      type: 'text',
      id: 'name',
      label: 'Name',
      style: 'margin-right: .5em'
    }, {
      type: 'number',
      id: 'score',
      label: 'Score',
      style: 'margin-right: .5em'
    }, {
      type: 'button',
      text: 'Save',
      cls: 'b-raised',
      onClick: function onClick() {
        var name = container.getWidgetById('name').value,
            score = container.getWidgetById('score').value;

        if (score > 1000) {
          Toast.show('New highscore!');
        } else {
          Toast.show("Saving ".concat(name, "s score, which was ").concat(score));
        }
      }
    }]
  }); //END
})();