(function () {
  var targetElement = document.querySelector('div[data-file="column/ActionColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // tree with ActionColumn

  var tree = new TreeGrid({
    appendTo: targetElement,
    autoHeight: true,
    columns: [{
      type: 'tree',
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      type: 'number',
      field: 'born',
      text: 'Born',
      flex: 1
    }, {
      type: 'number',
      field: 'salary',
      text: 'Salary'
    }, {
      type: 'action',
      actions: [{
        cls: 'b-fa b-fa-minus',
        tooltip: 'Decrease salary',
        visible: function visible(_ref) {
          var record = _ref.record;
          return !Boolean(record.children && record.children.length);
        },
        onClick: function onClick(_ref2) {
          var record = _ref2.record;

          if (record.salary > 1000) {
            record.salary = record.salary - 1000;
          }
        }
      }, {
        cls: 'b-fa b-fa-plus',
        tooltip: 'Increase salary',
        visible: function visible(_ref3) {
          var record = _ref3.record;
          return !Boolean(record.children && record.children.length);
        },
        onClick: function onClick(_ref4) {
          var record = _ref4.record;
          return record.salary = record.salary + 1000;
        }
      }]
    }],
    data: [{
      id: 1,
      name: 'ABBA',
      iconCls: 'b-icon b-fa-users',
      born: null,
      salary: null,
      expanded: true,
      children: [{
        id: 11,
        name: 'Anni-Frid',
        born: 1945,
        salary: 50000,
        iconCls: 'b-icon b-fa-user'
      }, {
        id: 12,
        name: 'Bjorn',
        born: 1945,
        salary: 140000,
        iconCls: 'b-icon b-fa-user'
      }, {
        id: 13,
        name: 'Benny',
        born: 1946,
        salary: 400000,
        iconCls: 'b-icon b-fa-user'
      }, {
        id: 14,
        name: 'Agnetha',
        born: 1950,
        salary: 40000,
        iconCls: 'b-icon b-fa-user'
      }]
    }, {
      id: 2,
      name: 'Roxette',
      iconCls: 'b-icon b-fa-users',
      born: null,
      salary: null,
      children: [{
        id: 21,
        name: 'Per',
        born: 1959,
        salary: 88000,
        iconCls: 'b-icon b-fa-user'
      }, {
        id: 22,
        name: 'Marie',
        born: 1958,
        salary: 70000,
        iconCls: 'b-icon b-fa-user'
      }]
    }]
  }); //END
})();