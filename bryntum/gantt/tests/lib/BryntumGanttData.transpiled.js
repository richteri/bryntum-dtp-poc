/* globals Role: true, Role */
Role('BryntumGanttData', {
  methods: {
    getProjectData: function getProjectData() {
      return {
        startDate: '2010-02-03T00:00:00',
        eventsData: this.getTaskStoreData(),
        dependenciesData: this.getDependencyStoreData(),
        resourcesData: this.getResourceStoreData(),
        assignmentsData: this.getAssignmentStoreData(),
        calendarsData: []
      };
    },
    getProject: function getProject(config) {
      return this.global.ProjectModel(config || this.getProjectData());
    },
    getTaskStoreData: function getTaskStoreData() {
      return [{
        'leaf': false,
        'expanded': true,
        'id': 114,
        'startDate': '2010-02-03T00:00:00',
        'percentDone': 0,
        'name': 'New task 3',
        'duration': 6,
        'durationUnit': 'd',
        'children': [{
          'leaf': true,
          'id': 117,
          'startDate': '2010-02-03T00:00:00',
          'percentDone': 0,
          'name': 'New task 1',
          'duration': 6,
          'durationUnit': 'd'
        }, {
          'leaf': true,
          'id': 118,
          'startDate': '2010-02-03T00:00:00',
          'percentDone': 0,
          'name': 'New task 2',
          'duration': 6,
          'durationUnit': 'd'
        }]
      }, {
        'leaf': true,
        'id': 115,
        'startDate': '2010-02-11T00:00:00',
        'percentDone': 0,
        'name': 'New task 4',
        'duration': 5,
        'durationUnit': 'd'
      }, {
        'leaf': true,
        'id': 116,
        'startDate': '2010-02-18T00:00:00',
        'percentDone': 0,
        'name': 'New task 5',
        'duration': 5,
        'durationUnit': 'd'
      }, {
        'children': [{
          'leaf': true,
          'id': 121,
          'startDate': '2010-02-03T00:00:00',
          'percentDone': 0,
          'name': 'New task 6',
          'duration': 6,
          'durationUnit': 'd'
        }],
        'leaf': false,
        'expanded': true,
        'id': 119,
        'startDate': '2010-02-03T00:00:00',
        'percentDone': 0,
        'name': 'New task 7',
        'duration': 6,
        'durationUnit': 'd'
      }, {
        'children': null,
        'leaf': true,
        'expanded': false,
        'id': 120,
        'startDate': '2010-02-11T00:00:00',
        'percentDone': 0,
        'name': 'New task 8',
        'duration': 7,
        'durationUnit': 'd'
      }];
    },
    getResourceStoreData: function getResourceStoreData() {
      return [{
        'id': 1,
        'name': 'Arcady'
      }, {
        'id': 2,
        'name': 'Don'
      }, {
        'id': 3,
        'name': 'Göran'
      }, {
        'id': 4,
        'name': 'Johan'
      }, {
        'id': 5,
        'name': 'Mats'
      }, {
        'id': 6,
        'name': 'Max'
      }, {
        'id': 7,
        'name': 'Maxim'
      }, {
        'id': 8,
        'name': 'Nick'
      }, {
        'id': 9,
        'name': 'Nige'
      }, {
        'id': 10,
        'name': 'Pavel'
      }, {
        'id': 11,
        'name': 'Sergey'
      }, {
        'id': 12,
        'name': 'Terence'
      }];
    },
    getAssignmentStoreData: function getAssignmentStoreData() {
      return [{
        'id': 1,
        'resource': 1,
        'event': 115,
        'units': 100
      }, {
        'id': 2,
        'resource': 2,
        'event': 116,
        'units': 100
      }, {
        'id': 3,
        'resource': 3,
        'event': 117,
        'units': 100
      }, {
        'id': 4,
        'resource': 4,
        'event': 118,
        'units': 100
      }, {
        'id': 5,
        'resource': 5,
        'event': 119,
        'units': 100
      }, {
        'id': 6,
        'resource': 6,
        'event': 120,
        'units': 100
      }, {
        'id': 7,
        'resource': 7,
        'event': 121,
        'units': 100
      }, {
        'id': 8,
        'resource': 8,
        'event': 115,
        'units': 10
      }, {
        'id': 9,
        'resource': 9,
        'event': 116,
        'units': 25
      }, {
        'id': 10,
        'resource': 10,
        'event': 117,
        'units': 50
      }, {
        'id': 11,
        'resource': 11,
        'event': 118,
        'units': 75
      }, {
        'id': 12,
        'resource': 12,
        'event': 119,
        'units': 90
      }];
    },
    getDependencyStoreData: function getDependencyStoreData() {
      return [{
        'fromEvent': 117,
        'toEvent': 115,
        'id': 30,
        'type': 2
      }, {
        'fromEvent': 118,
        'toEvent': 115,
        'id': 31,
        'type': 2
      }, {
        'fromEvent': 115,
        'toEvent': 116,
        'id': 32,
        'type': 2
      }, {
        'fromEvent': 121,
        'toEvent': 120,
        'id': 33,
        'type': 2
      }];
    },
    getTaskStore: function getTaskStore(config, doNotLoad) {
      if (doNotLoad) {
        throw new Error("Not ported, AjaxStore doesn't have appropriate functionality!");
      }

      config = config || {};
      var data = config.DATA || this.getTaskStoreData();
      return new this.global.TaskStore(Object.assign({
        data: data
      }, config));
    },
    getTeamResourceStore: function getTeamResourceStore(config) {
      return new this.global.ResourceStore(Object.assign({
        data: this.getResourceStoreData()
      }, config));
    },
    getTeamAssignmentStore: function getTeamAssignmentStore(config) {
      return new this.global.AssignmentStore(Object.assign({
        data: this.getAssignmentStoreData()
      }, config));
    },
    getDependencyStore: function getDependencyStore(config) {
      return new this.global.DependencyStore(Object.assign({
        data: this.getDependencyStoreData()
      }, config || {}));
    }
    /*
    getSubProjectData : function(noOfProjects) {
        var data = [];
         noOfProjects = noOfProjects || 1;
         for (var i = 0; i < noOfProjects; i++) {
            data.push(this.getProject('Project_' + i));
        }
         return data;
    },
     getSubProject : function(name, readOnly, allowDeps, manuallyScheduled) {
        let cfg;
         if (name && typeof name == 'object' && arguments.length === 1) {
            cfg = name;
             name = cfg.Name;
        }
         // TODO: While vanilla store doesn't support heterogeneous reading use this
        return new this.global.SubProjectModel({
            id                : name,
            cls               : name,
            startDate         : '2015-01-01',
            endDate           : '2015-02-15',
            name              : name,
            note              : name + ' description',
            allowDependencies : !!allowDeps,
            readOnly          : !!readOnly,
            manuallyScheduled : !!manuallyScheduled,
            taskType          : 'Gantt.model.ProjectModel',
            leaf              : false,
            expanded          : true,
            children          : [
                new this.global.TaskModel({
                    id        : name + '_task_1',
                    cls       : name + '_task_1',
                    startDate : '2015-01-01',
                    endDate   : '2015-01-15',
                    name      : 'Task1',
                    leaf      : true
                }),
                new this.global.TaskModel({
                    id        : name + '_task_2',
                    cls       : name + '_task_2',
                    startDate : '2015-01-01',
                    endDate   : '2015-01-15',
                    name      : 'Task2',
                    leaf      : true
                }),
                new this.global.TaskModel({
                    id   : name + '_task_3',
                    cls  : name + '_task_3',
                    name : 'Task3',
                    leaf : true
                })
            ]
        }, cfg);
    }
    */

  }
});