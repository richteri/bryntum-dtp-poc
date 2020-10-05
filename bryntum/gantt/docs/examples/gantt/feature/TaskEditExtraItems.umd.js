(function () {
  var targetElement = document.querySelector('div[data-file="gantt/feature/TaskEditExtraItems.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = ''; //START
  // Project contains all the data and is responsible for correct scheduling

  var project = new bryntum.gantt.ProjectModel({
    startDate: new Date(2017, 0, 1),
    tasksData: [{
      id: 1,
      name: 'Write docs',
      expanded: true,
      children: [{
        id: 2,
        name: 'Proof-read docs',
        startDate: '2017-01-02',
        endDate: '2017-01-05',
        effort: 0
      }, {
        id: 3,
        name: 'Release docs',
        startDate: '2017-01-09',
        endDate: '2017-01-10',
        effort: 0
      }]
    }],
    dependenciesData: [{
      fromTask: 2,
      toTask: 3
    }]
  }); // Panel holding toolbar and Gantt

  var panel = new bryntum.gantt.Gantt({
    appendTo: targetElement,
    flex: '1 0 100%',
    project: project,
    // Gantt needs project to get schedule data from
    startDate: new Date(2016, 11, 31),
    endDate: new Date(2017, 0, 11),
    height: 250,
    features: {
      taskEdit: {
        editorConfig: {
          // Make task editor higher
          height: '35em',
          extraItems: {
            // add two widgets to general tab
            generaltab: [{
              html: '',
              flex: '1 0 100%'
            }, {
              type: 'text',
              readOnly: true,
              editable: false,
              label: 'My field',
              name: 'milestone',
              flex: '1 0 50%'
            }, {
              type: 'button',
              text: 'Button',
              flex: '1 0 50%'
            }]
          }
        }
      }
    },
    columns: [{
      type: 'name',
      field: 'name',
      text: 'Name'
    }]
  }); //END
})();