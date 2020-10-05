(function () {
  var targetElement = document.querySelector('div[data-file="widget/ButtonGroup.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = "\n<p>A ButtonGroup containing some buttons</p>\n"; //START

  new ButtonGroup({
    appendTo: targetElement,
    cls: 'b-raised',
    items: [{
      icon: 'b-fa b-fa-cow',
      cls: 'b-raised'
    }, {
      icon: 'b-fa b-fa-deer',
      cls: 'b-raised'
    }, {
      icon: 'b-fa b-fa-crow',
      cls: 'b-raised'
    }, {
      icon: 'b-fa b-fa-hippo',
      cls: 'b-raised'
    }, {
      icon: 'b-fa b-fa-narwhal',
      cls: 'b-raised'
    }, {
      icon: 'b-fa b-fa-monkey',
      cls: 'b-raised'
    }]
  }); //END
})();