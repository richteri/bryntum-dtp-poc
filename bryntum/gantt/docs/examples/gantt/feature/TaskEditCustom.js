(function () {

const targetElement = document.querySelector('div[data-file="gantt/feature/TaskEditCustom.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>This example shows a custom Task Editor configuration. The built-in "Notes" tab is hidden, a custom "Files" tab is added, the "General" tab is renamed to "Common" and "Custom" field is appended to it. Double-click on a task bar to start editing:</p>';

//START
// Project contains all the data and is responsible for correct scheduling
const project = new bryntum.gantt.ProjectModel({
    startDate  : new Date(2017, 0, 1),

    tasksData : [
        {
            id : 1,
            name : 'Write docs',
            expanded : true,
            custom : 'Parent custom field value',
            children : [
                // 'custom' field is auto exposed to Task model, then its name is used in TaskEditor to get/set values
                { id : 2, name : 'Proof-read docs', startDate : '2017-01-02', endDate : '2017-01-05', custom : 'Proof-read custom value' },
                { id : 3, name : 'Release docs', startDate : '2017-01-09', endDate : '2017-01-10', custom : 'Release custom value' }
            ]
        }
    ],

    dependenciesData : [
        { fromTask : 2, toTask : 3 }
    ]
});

// Custom FilesTab class (the last item of tabsConfig)
class FilesTab extends Grid {

    static get type() {
        return 'filestab';
    }

    static get defaultConfig() {
        return {
            title    : 'Files',
            defaults : {
                labelWidth : 200
            },
            columns : [{
                text     : 'Files attached to task',
                field    : 'name',
                type     : 'template',
                template : data => `<i class="b-fa b-fa-fw b-fa-${data.record.data.icon}"></i>${data.record.data.name}`
            }]
        };
    } // eo getter defaultConfig

    loadEvent(eventRecord) {
        let files = [];

        // prepare dummy files data
        switch(eventRecord.data.id) {
            case 1:
                files = [
                    {name : 'Image1.png', icon : 'image'},
                    {name : 'Chart2.pdf', icon : 'chart-pie'},
                    {name : 'Spreadsheet3.pdf', icon : 'file-excel'},
                    {name : 'Document4.pdf', icon : 'file-word'},
                    {name : 'Report5.pdf', icon : 'user-chart'}
                ];
                break;
            case 2:
                files = [
                    {name : 'Chart11.pdf', icon : 'chart-pie'},
                    {name : 'Spreadsheet13.pdf', icon : 'file-excel'},
                    {name : 'Document14.pdf', icon : 'file-word'}
                ];
                break;
            case 3:
                files = [
                    {name : 'Image21.png', icon : 'image'},
                    {name : 'Spreadsheet23.pdf', icon : 'file-excel'},
                    {name : 'Document24.pdf', icon : 'file-word'},
                    {name : 'Report25.pdf', icon : 'user-chart'}
                ]
                break;
        } // eo switch

        this.store.data = files;
    } // eo function loadEvent
} // eo class FilesTab

// register 'filestab' type
BryntumWidgetAdapterRegister.register(FilesTab.type, FilesTab);

// Panel holding toolbar and Gantt
const panel = new bryntum.gantt.Gantt({
    appendTo  : targetElement,
    flex      : '1 0 100%',
    project   : project, // Gantt needs project to get schedule data from
    startDate : new Date(2016, 11, 31),
    endDate   : new Date(2017, 0, 11),
    height    : 250,
    columns   : [
        { type : 'name', field : 'name', text : 'Name' }
    ],
    features  : {
        taskEdit : {
            editorConfig : {
                height : '35em',
                extraItems : {
                    generaltab : [
                        {
                            type : 'textfield',
                            label : 'My Custom Field',
                            name : 'custom' // name of the field matches data field name, so value is loaded/saved automatically
                        }
                    ]
                }
            },
            tabsConfig : {
                // change title of General tab
                generaltab : {
                  title : 'Common'
                },

                // remove Notes tab
                notestab : false,

                // add custom Files tab
                filestab : { type : 'filestab' },
            }
        } // eo taskEdit
    } // eo features
});
//END
})();

// eof
