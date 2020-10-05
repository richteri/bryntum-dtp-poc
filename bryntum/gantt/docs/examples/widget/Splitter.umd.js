(function () {
  var targetElement = document.querySelector('div[data-file="widget/Splitter.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.style.display = 'flex'; //START

  new Widget({
    appendTo: targetElement,
    html: 'Spicy jalapeno bacon ipsum dolor amet venison beef alcatra spare ribs porchetta biltong. Fatback pork loin tri-tip tongue ground round. Pastrami capicola bresaola beef pancetta beef ribs porchetta kevin kielbasa pork prosciutto short ribs short loin tail. Shoulder beef strip steak bresaola, ham pastrami shankle picanha salami venison bacon kevin tail.',
    flex: 1,
    minWidth: '10em',
    style: 'padding: 1em; background: #F9F9FF'
  });
  new Splitter({
    appendTo: targetElement
  });
  new Widget({
    appendTo: targetElement,
    html: 'Spicy jalapeno bacon ipsum dolor amet short ribs cupim ribeye corned beef shank. Andouille boudin short ribs shank brisket tenderloin, kielbasa drumstick strip steak pork porchetta pig. Beef pastrami sirloin salami capicola, t-bone beef ribs doner. Beef strip steak burgdoggen ham hock, meatloaf tongue corned beef kevin. Drumstick boudin turkey hamburger ground round prosciutto.',
    flex: 1,
    minWidth: '10em',
    style: 'padding: 1em; background: #F9F9FF'
  }); //END
})();