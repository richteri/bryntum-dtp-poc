(function () {
  var targetElement = document.querySelector('div[data-file="widget/TabPanel.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START

  new TabPanel({
    appendTo: targetElement,
    items: [{
      title: 'One',
      style: 'padding:2em',
      items: [{
        type: 'text',
        label: 'First name',
        style: 'margin:2em 1em'
      }, {
        type: 'text',
        label: 'Last name',
        style: 'margin:2em 1em'
      }]
    }, {
      title: 'Two',
      items: [{
        type: 'widget',
        html: 'Second'
      }]
    }, {
      title: 'Three',
      items: [{
        type: 'widget',
        html: 'Last'
      }]
    }]
  }); //END
})();