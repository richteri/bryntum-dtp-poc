var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    LocaleManager = _bryntum$gantt.LocaleManager,
    Localizable = _bryntum$gantt.Localizable; // Importing custom locales
// Enable missing localization Error throwing here to show how it can be used in end-user apps
// All non-localized strings which are in `L{foo}` format will throw runtime error

LocaleManager.throwOnMissingLocale = true;
var project = new ProjectModel({
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
/**
 * Updates localizable properties after locale change
 */

function updateLocalization() {
  var title = Localizable().L('L{App.Localization demo}');
  document.querySelector('#title').innerHTML = title;
  document.title = title;
} // Add listener to update contents when locale changes


LocaleManager.on('locale', updateLocalization);
new Gantt({
  adopt: 'container',
  project: project,
  columns: [{
    type: 'wbs'
  }, {
    type: 'name',
    field: 'name',
    width: 250
  }, {
    type: 'startdate'
  }, {
    type: 'enddate'
  }, {
    type: 'duration'
  }]
});
project.load();
updateLocalization();