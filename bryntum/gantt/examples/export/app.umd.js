var _bryntum$gantt = bryntum.gantt,
    Gantt = _bryntum$gantt.Gantt,
    ProjectModel = _bryntum$gantt.ProjectModel,
    WidgetHelper = _bryntum$gantt.WidgetHelper,
    DateHelper = _bryntum$gantt.DateHelper;
/* eslint-disable no-unused-vars */
//<debug>
// disable certain debugging code to make record generation faster

window.bryntum.DISABLE_DEBUG = true; //</debug>

var project = new ProjectModel({
  autoLoad: true,
  transport: {
    load: {
      url: '../_datasets/launch-saas.json'
    }
  }
});
WidgetHelper.append([{
  ref: 'exportButton',
  type: 'button',
  color: 'b-orange b-raised',
  icon: 'b-fa b-fa-file-export',
  text: 'Export',
  onClick: function onClick() {
    gantt.features.pdfExport.showExportDialog();
  }
}], {
  insertFirst: document.getElementById('tools') || document.body,
  cls: 'b-bright'
});

var headerTpl = function headerTpl(_ref) {
  var currentPage = _ref.currentPage,
      totalPages = _ref.totalPages;
  return "\n    <div class=\"demo-export-header\">\n        <img src=\"resources/logo.png\"/>\n        <dl>\n            <dt>Date: ".concat(DateHelper.format(new Date(), 'll LT'), "</dt>\n            <dd>").concat(totalPages ? "Page: ".concat(currentPage + 1, "/").concat(totalPages) : '', "</dd>\n        </dl>\n    </div>");
};

var footerTpl = function footerTpl() {
  return '<div class="demo-export-footer"><h3>© 2020 Bryntum AB</h3></div>';
};

var gantt = new Gantt({
  // We don't need to export demo header
  appendTo: 'container',
  emptyText: '',
  project: project,
  columns: [{
    type: 'name',
    field: 'name',
    text: 'Name',
    width: 200
  }, {
    type: 'startdate',
    text: 'Start date'
  }, {
    type: 'duration',
    text: 'Duration'
  }],
  columnLines: false,
  features: {
    pdfExport: {
      exportServer: 'http://localhost:8080/',
      translateURLsToAbsolute: 'http://localhost:8080/resources/',
      headerTpl: headerTpl,
      footerTpl: footerTpl
    }
  }
});