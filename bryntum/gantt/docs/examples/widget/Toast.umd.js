(function () {
  var targetElement = document.querySelector('div[data-file="widget/Toast.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // button that shows a toast with random text when clicked

  new Button({
    appendTo: targetElement,
    cls: 'b-raised',
    text: 'Show toast',
    onClick: function onClick() {
      var greetings = ['Hello', 'Hey', 'Hi', 'Greetings', 'Good day'];
      Toast.show(greetings[Math.floor(Math.random() * 5)]);
    }
  }); //END
})();