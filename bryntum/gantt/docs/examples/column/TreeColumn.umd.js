(function () {
  var targetElement = document.querySelector('div[data-file="column/TreeColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // grid with TreeColumn

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      tree: true
    },
    store: {
      tree: true,
      data: [{
        id: 1,
        name: 'ABBA',
        iconCls: 'b-icon b-fa-users',
        children: [{
          id: 11,
          name: 'Anni-Frid',
          iconCls: 'b-icon b-fa-user'
        }, {
          id: 12,
          name: 'Bjorn',
          iconCls: 'b-icon b-fa-user'
        }, {
          id: 13,
          name: 'Benny',
          iconCls: 'b-icon b-fa-user'
        }, {
          id: 14,
          name: 'Agnetha',
          iconCls: 'b-icon b-fa-user'
        }]
      }, {
        id: 2,
        name: 'Roxette',
        iconCls: 'b-icon b-fa-users',
        children: [{
          id: 21,
          name: 'Per',
          iconCls: 'b-icon b-fa-user'
        }, {
          id: 22,
          name: 'Marie',
          iconCls: 'b-icon b-fa-user'
        }]
      }]
    },
    columns: [{
      type: 'tree',
      field: 'name',
      text: 'Name',
      flex: 1
    }]
  }); //END
})();