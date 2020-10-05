(function () {
  var targetElement = document.querySelector('div[data-file="widget/List.js"] .external-target'); //START

  new List({
    width: 200,
    appendTo: targetElement,
    itemTpl: function itemTpl(item) {
      return "<i>".concat(item.text, "</i>");
    },
    items: [{
      id: 1,
      text: 'Add'
    }, {
      id: 2,
      text: 'Remove'
    }],
    onItem: function onItem(_ref) {
      var record = _ref.record;
      WidgetHelper.toast('You clicked ' + record.text);
    }
  }); //END
})();