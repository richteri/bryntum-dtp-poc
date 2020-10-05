(function () {
  var outerElement = document.querySelector('div[data-file="grid/Responsive.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!outerElement) return;
  outerElement.innerHTML = "\n<p>Drag the dashed line to the right of the grid to resize it and see GridResponsive in action. Current level: <span id=\"responsive-level\"></span></p>\n<div id=\"responsive-container\" style=\"position: relative\"></div>";
  var targetElement = outerElement.querySelector('#responsive-container'); //START
  // grid with cell editing

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    data: DataGenerator.generateData(5),
    responsiveLevels: {
      small: {
        // Width is required
        levelWidth: 400,
        // Other configs are optional, see GridState for available options
        rowHeight: 30
      },
      medium: {
        levelWidth: 600,
        rowHeight: 40
      },
      large: {
        levelWidth: '*',
        // everything above 300
        rowHeight: 45
      }
    },
    columns: [{
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      field: 'team',
      text: 'Team',
      flex: 1
    }, {
      field: 'score',
      text: 'Score',
      responsiveLevels: {
        '*': {
          flex: 1,
          hidden: false
        },
        'medium': {
          flex: .5,
          hidden: false
        },
        'small': {
          hidden: true
        }
      }
    }, {
      field: 'rank',
      text: 'Rank',
      flex: 1,
      responsiveLevels: {
        '*': {
          flex: 1,
          hidden: false
        },
        'medium': {
          flex: .5,
          hidden: false
        },
        'small': {
          hidden: true
        }
      }
    }]
  }); //END

  DomHelper.append(targetElement, {
    tag: 'div',
    className: 'handle',
    style: {
      position: 'absolute',
      zIndex: 1000,
      width: '10px',
      border: '5px dashed #eee',
      top: 0,
      bottom: 0,
      right: 0,
      cursor: 'ew-resize'
    }
  });
  new ResizeHelper({
    targetSelector: '#responsive-container',
    handleSelector: '#responsive-container .handle'
  });

  function updateCurrentLevel() {
    var el = document.getElementById('responsive-level');

    if (el) {
      el.innerHTML = "<b>".concat(grid.responsiveLevel, "</b>");
    }
  }

  updateCurrentLevel();
  grid.on({
    responsive: function responsive() {
      return updateCurrentLevel();
    }
  });
})();