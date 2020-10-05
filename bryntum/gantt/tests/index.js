const
    Project   = new Siesta.Project.Browser(),
    isRelease = Project.getQueryParam('release'),
    isTC      = location.href.indexOf('IS_TEAMCITY') > -1;

let isTrial = true;
/* <remove-on-trial> */
isTrial = /trial/.test(document.location.href);
/* </remove-on-trial> */

// run netcore tests only in chrome because we are testing backend really
let netcore = false;
if (bowser.chrome) {
    const
        params = new URLSearchParams(document.location.search);

    if (params.has('netcore') && params.get('netcore') !== 'false') {
        netcore = true;
    }
}

Project.configure({
    title                   : 'Bryntum Gantt Test Suite',
    isReadyTimeout          : 20000, // longer for memory profiling which slows things down
    testClass               : BryntumGanttTest,
    disableCaching          : false,
    autoCheckGlobals        : false,
    keepResults             : false,
    failOnResourceLoadError : true,
    runCore                 : 'sequential',
    forceDOMVisible         : bowser.safari,
    turboMode               : true,
    recorderConfig          : {
        recordOffsets    : false,
        ignoreCssClasses : [
            'b-sch-event-hover',
            'b-hover',
            'b-dirty',
            'b-focused',
            'b-contains-focus'
        ],
        shouldIgnoreDomElementId : function(id) {
            return /^b-/.test(id);
        }
    }
});

function getItems(mode) {

    const
        examples = [
            {
                pageUrl : '../examples/advanced',
                url     : 'examples/advanced.t.js'
            },
            {
                pageUrl : '../examples/aggregation-column',
                url     : 'examples/aggregation-column.t.js'
            },
            'basic',
            'bigdataset',
            {
                url        : 'esmodule',
                includeFor : 'module'
            },
            'export',
            {
                pageUrl    : '../examples/exporttoexcel',
                url        : 'examples/exporttoexcel.t.js',
                skipMonkey : true
            },
            {
                pageUrl     : '../examples/extjsmodern',
                url         : 'examples/extjsmodern.t.js',
                keepPageUrl : true
            },
            'labels',
            {
                pageUrl : '../examples/localization?develop&reset',
                url     : 'examples/localization.t.js'
            },
            {
                pageUrl : '../examples/baselines?develop&reset',
                url     : 'examples/baselines.t.js'
            },
            {
                pageUrl    : 'php', // url gets changed on earlySetup stage
                url        : 'examples/php.t.js?' + mode,
                // will make a new database and config file for the test
                earlySetup : {
                    url      : '../examples/php/php/setup.php?createDatabase=random',
                    callback : function(response, testDesc, test, callback) {
                        response.text().then(function(text) {
                            // extract the config file name to be used in the test
                            const
                                match      = text.match(/CONFIG FILE=(.+)$/),
                                configFile = match && match[1] || 'FAILURE';

                            if (!match) {
                                test.fail('Random database creation failed', `Response from "setup.php?createDatabase=random" is: ${text}`);
                            }

                            testDesc.configFile = configFile;
                            // update pageUrl used -> append config file name as param
                            test.scopeProvider.sourceURL = '../examples/php?config=' + configFile;
                            // pass generated database config file name to tear down url
                            testDesc.tearDown.url += '?config=' + configFile;

                            callback();
                        });
                    }
                },
                tearDown : {
                    url      : '../examples/php/php/drop.php',
                    callback : function(response, testDesc, test, callback) {
                        callback();
                    }
                },
                // only run backend test in chrome
                skip : !bowser.chrome
            },
            {
                url        : 'requirejs',
                includeFor : 'es6'
            },
            'responsive',
            {
                pageUrl     : '../examples/scripttag',
                keepPageUrl : true
            },
            'taskcontextmenu',
            {
                pageUrl : '../examples/taskeditor',
                url     : 'examples/taskeditor.t.js'
            },
            'theme',
            'timeranges',
            'tooltips',
            {
                pageUrl : '../examples/resourceassignment',
                url     : 'examples/resourceassignment.t.js'
            },
            {
                pageUrl    : '../examples/webcomponents',
                url        : 'examples/webcomponents.t.js',
                includeFor : isTrial ? 'module' : 'es6'
            }
        ];

    // Frameworks (angular, ionic, react, vue, etc.)

    const
        frameworks = [];

    if (isTrial) {
        // The following frameworks demos require building before test. We build demos for trial
        frameworks.push(
            {
                pageUrl       : '../examples/angular/advanced',
                url           : 'examples/angular/angular-advanced.t.js',
                viewportWidth : 2000,
                keepPageUrl   : true
            },
            {
                pageUrl     : '../examples/angular/pdf-export',
                url         : 'examples/angular/angular-pdf-export.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/angular/taskeditor',
                url         : 'examples/angular/angular-taskeditor.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/angular/rollups',
                url         : 'examples/angular/angular-rollups.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/angular/timeranges',
                url         : 'examples/angular/angular-timeranges.t.js',
                keepPageUrl : true
            },
            'angular/pdf-export',
            {
                pageUrl : '../examples/custom-build',
                skip    : !bowser.chrome
            },
            {
                pageUrl     : '../examples/react/javascript/advanced',
                url         : 'examples/react/react-advanced.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/react/javascript/basic',
                url         : 'examples/react/react-basic.t.js',
                keepPageUrl : true
            },
            'react/javascript/pdf-export',
            {
                pageUrl     : '../examples/react/javascript/rollups',
                url         : 'examples/react/react-rollups.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/react/javascript/taskeditor',
                url         : 'examples/react/react-taskeditor.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/react/javascript/timeranges',
                url         : 'examples/react/react-timeranges.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/react/typescript/basic',
                url         : 'examples/react/react-basic-typescript.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/vue/javascript/advanced',
                url         : 'examples/vue/vue-advanced.t.js',
                keepPageUrl : true
            },
            'vue/javascript/pdf-export',
            {
                pageUrl     : '../examples/vue/javascript/rollups',
                url         : 'examples/vue/vue-rollups.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/vue/javascript/taskeditor',
                url         : 'examples/vue/vue-taskeditor.t.js',
                keepPageUrl : true
            },
            {
                pageUrl     : '../examples/vue/javascript/timeranges',
                url         : 'examples/vue/vue-timeranges.t.js',
                keepPageUrl : true
            }
        );
    }

    // This setting requires requests to be proxied. Usual setup would be like:
    // app running on http://localhost:8080
    // tests running on http://localhost/bryntum-suite/gantt/tests
    // CORS would block requests to different origin, so they has to be proxied.
    // Web server should be adjusted to map http://localhost/gantt-netcore to http://localhost:8080/
    if (netcore) {
        frameworks.push(
            {
                pageUrl     : '/gantt-netcore/index.html',
                url         : 'examples/aspnetcore/example.t.js',
                keepPageUrl : true
            }
        );
    }

    const
        items = [
            {
                group   : 'Docs',
                pageUrl : {
                    umd     : '../docs/index.umd.html?reset',
                    default : '../docs/?reset'
                },
                keepPageUrl             : true,
                subTestTimeout          : 120000,
                timeout                 : 120000,
                // the grid docs are not built, and 'docs/resources/docs.css' is thus missing
                failOnResourceLoadError : false,
                items                   : bowser.msie ? [] : [
                    {
                        url                    : 'docs/open-all-links.t.js',
                        disableNoTimeoutsCheck : true
                    },
                    {
                        url                    : 'docs/verify-links-in-guides.t.js',
                        viewportHeight         : 500,
                        subTestTimeout         : 120000,
                        timeout                : 120000,
                        disableNoTimeoutsCheck : true
                    },
                    /*  */
                ]
            },
            {
                group : 'Gantt',
                items : [
                    {
                        group : 'Columns',
                        items : [
                            'column/AddNewColumn.t.js',
                            'column/CalendarColumn.t.js',
                            'column/ConstraintColumns.t.js',
                            'column/DependencyColumn.t.js',
                            'column/DurationColumn.t.js',
                            'column/EffortColumn.t.js',
                            'column/EventModeColumn.t.js',
                            'column/ManuallyScheduledColumn.t.js',
                            'column/MilestoneColumn.t.js',
                            'column/NameColumn.t.js',
                            'column/NoteColumn.t.js',
                            'column/PercentDoneColumn.t.js',
                            {
                                url                     : 'column/ResourceAssignmentColumn.t.js',
                                failOnResourceLoadError : false
                            },
                            'column/RollupColumn.t.js',
                            'column/SchedulingModeColumn.t.js',
                            'column/SequenceColumn.t.js',
                            'column/TaskDateColumns.t.js'
                        ]
                    },
                    {
                        group : 'Data components',
                        items : [
                            'data_components/project_creation.t.js',
                            'data_components/Tasks.t.js',
                            // these 2 are postponed, since we first implement the new dependency validation code
                            // and then see whats next
                            // 'data_components/042_dependency_store.t.js',
                            // 'data_components/042_dependency_store2.t.js',
                            'data_components/AssignmentManipulationStore.t.js',
                            'data_components/CalendarIntervalModel.t.js',
                            'data_components/persisting.t.js',
                            'data_components/UndoRedo.t.js'
                        ]
                    },
                    {
                        group : 'Dependencies',
                        items : [
                            'dependencies/DependencyStore.t.js',
                            'dependencies/dependency_rendering.t.js',
                            'dependencies/dependency_rendering_2.t.js'
                        ]
                    },
                    {
                        group : 'CRUD manager',
                        items : [
                            {
                                url                    : 'crud_manager/01_add_stores.t.js',
                                failOnPromiseRejection : false
                            },
                            'crud_manager/02_phantom_parent.t.js',
                            {
                                url                    : 'crud_manager/20_empty_dataset.t.js',
                                failOnPromiseRejection : false
                            },
                            // run the test in chrome only ..no need to test backend in all browsers
                            { // eslint-disable-line no-undef
                                url        : 'crud_manager/11_backend.t.js',
                                loadUrl    : '../examples/php/php/load.php',
                                syncUrl    : '../examples/php/php/sync.php',
                                resetUrl   : '../examples/php/php/reset.php',
                                // will make a new database and config file for the test
                                earlySetup : {
                                    url      : '../examples/php/php/setup.php?createDatabase=random',
                                    callback : function(response, testDesc, test, callback) {
                                        response.text().then(function(text) {
                                            // extract the config file name to be used in the test
                                            const
                                                match      = text.match(/CONFIG FILE=(.+)$/),
                                                configFile = match && match[1] || 'FAILURE';

                                            if (!match) {
                                                test.fail('Random database creation failed', `Response from "setup.php?createDatabase=random" is: ${text}`);
                                            }

                                            testDesc.configFile = configFile;

                                            callback();
                                        });
                                    }
                                },
                                defaultTimeout : 180000,
                                skip           : !bowser.chrome || isRelease
                            },
                            'crud_manager/12_mask.t.js',
                            'crud_manager/21_mapping.t.js'
                        ]
                    },
                    {
                        group : 'Localization',
                        items : [
                            {
                                alsoPreload : {
                                    default : [{
                                        type         : 'js',
                                        isEcmaModule : true,
                                        content      : [
                                            'import "../examples/_shared/locales/examples.locale.En.js";',
                                            'import "../examples/_shared/locales/examples.locale.Nl.js";',
                                            'import "../examples/_shared/locales/examples.locale.Ru.js";',
                                            'import "../examples/_shared/locales/examples.locale.SvSE.js";'
                                        ].join('')
                                    }
                                    ]
                                },
                                ignoreList : {
                                    Common : [
                                        'PresetManager.secondAndMinute'
                                    ]
                                },
                                universalList : {
                                    Nl : [
                                        'Filter.filter',
                                        'ExportDialog.columns',
                                        'CodeEditor.Code editor',
                                        'CodeEditor.Download code',
                                        'DependencyEdit.Type',
                                        'EventEdit.Resource',
                                        'EventEdit.Start',
                                        'DependencyTab.ID',
                                        'DependencyTab.Type',
                                        'EventModeColumn.Auto',
                                        'WBSColumn.WBS',
                                        'Indicators.Start'
                                    ],
                                    SvSE : [
                                        'Filter.filter',
                                        'EventEdit.Start',
                                        'SchedulerProCommon.SS',
                                        'TaskEditorBase.Information',
                                        'SchedulerGeneralTab.Start',
                                        'GeneralTab.Start',
                                        'DependencyTab.ID',
                                        'SchedulingModePicker.Normal',
                                        'DeadlineDateColumn.Deadline',
                                        'StartDateColumn.Start',
                                        'GanttCommon.dependencyTypes.0',
                                        'Indicators.Start',
                                        'Indicators.deadlineDate'
                                    ],
                                    De : [
                                        'Filter.filter',
                                        'ExportDialog.export'
                                    ]
                                },
                                url        : '../../Core/tests/localization/MissingLocalization.t.js?examples-all',
                                includeFor : 'es6',
                                skip       : !bowser.chrome
                            },
                            {
                                alsoPreload : {
                                    default : [{
                                        type         : 'js',
                                        isEcmaModule : true,
                                        content      : [
                                            'import "../examples/localization/locales/custom.locale.En.js";',
                                            'import "../examples/localization/locales/custom.locale.Nl.js";',
                                            'import "../examples/localization/locales/custom.locale.Ru.js";',
                                            'import "../examples/localization/locales/custom.locale.SvSE.js";',
                                            'import "../examples/localization/locales/custom.locale.De.js";'
                                        ].join('')
                                    }
                                    ]
                                },
                                ignoreList : {
                                    Common : [
                                        'PresetManager.secondAndMinute'
                                    ],
                                    De : [
                                        'Column',
                                        'Shared'
                                    ]
                                },
                                universalList : {
                                    Common : [
                                        'Column.WBS',
                                        'WBSColumn.WBS'
                                    ],
                                    Nl : [
                                        'CodeEditor.Code editor',
                                        'CodeEditor.Download code',
                                        'DependencyEdit.Type',
                                        'DependencyTab.ID',
                                        'DependencyTab.Type',
                                        'EventEdit.Resource',
                                        'EventEdit.Start',
                                        'EventModeColumn.Auto',
                                        'ExportDialog.columns',
                                        'Filter.filter',
                                        'Indicators.Start'
                                    ],
                                    SvSE : [
                                        'Column.Start',
                                        'DeadlineDateColumn.Deadline',
                                        'DependencyTab.ID',
                                        'EventEdit.Start',
                                        'Filter.filter',
                                        'GanttCommon.dependencyTypes.0',
                                        'GeneralTab.Start',
                                        'Indicators.deadlineDate',
                                        'Indicators.Start',
                                        'SchedulerGeneralTab.Start',
                                        'SchedulerProCommon.SS',
                                        'SchedulingModePicker.Normal',
                                        'StartDateColumn.Start',
                                        'TaskEditorBase.Information'
                                    ],
                                    De : [
                                        'Filter.filter',
                                        'ExportDialog.export',
                                        'EventEdit.Name',
                                        'EventEdit.Start',
                                        'SchedulerGeneralTab.Name',
                                        'SchedulerGeneralTab.Start',
                                        'GeneralTab.Name',
                                        'GeneralTab.Start',
                                        'AdvancedTab.Rollup',
                                        'DependencyTab.ID',
                                        'DependencyTab.Name',
                                        'SchedulingModePicker.Normal',
                                        'EventModeColumn.Auto',
                                        'RollupColumn.Rollup',
                                        'Indicators.Start'
                                    ]
                                },
                                url          : '../../Core/tests/localization/MissingLocalization.t.js?examples-localization',
                                includeFor   : 'es6',
                                skipES6Check : true,
                                skip         : !bowser.chrome
                            },
                            {
                                alsoPreload : preloadLocalization,
                                url         : 'localization/DependencyTypeLocalization.t.js',
                                usesConsole : true
                            },
                            {
                                alsoPreload : preloadLocalization,
                                url         : 'localization/TaskEditorLocalization.t.js'
                            },
                            {
                                alsoPreload : preloadLocalization,
                                url         : 'localization/AddNewColumnLocalization.t.js'
                            },
                            {
                                alsoPreload : preloadLocalization,
                                url         : 'localization/ProjectLinesLocalization.t.js'
                            }
                        ]
                    },

                    /*  */
                    {
                        group : 'Features',
                        items : [
                            'feature/Baselines.t.js',
                            {
                                group       : 'Export',
                                alsoPreload : [
                                    {
                                        type    : 'css',
                                        // Without this we cannot get 50px high header container. And we need it
                                        content : 'body { font-family: Arial, Helvetica, sans-serif;  font-size: 14px; }'
                                    }
                                ],
                                items : [
                                    'feature/export/Export.t.js',
                                    'feature/export/MultiPage.t.js',
                                    {
                                        url            : 'feature/export/MultiPageVertical.t.js',
                                        defaultTimeout : 180000 // Edge cannot export fast enough
                                    },
                                    {
                                        url  : 'feature/export/MultiPageZoomed.t.js',
                                        skip : !bowser.chrome
                                    },
                                    'feature/export/RowsOptions.t.js',
                                    'feature/export/ScheduleRange.t.js',
                                    'feature/export/SinglePage.t.js'
                                ]
                            },
                            {
                                url         : 'feature/CellEdit.t.js',
                                usesConsole : true
                            },
                            'feature/ColumnLines.t.js',
                            'feature/CriticalPaths.t.js',
                            'feature/Dependencies.t.js',
                            'feature/DependencyEdit.t.js',
                            'feature/Filter.t.js',
                            'feature/Indicators.t.js',
                            'feature/NonWorkingTime.t.js',
                            'feature/Pan.t.js',
                            'feature/PercentBar.t.js',
                            'feature/ProjectLines.t.js',
                            'feature/ProgressLine.t.js',
                            'feature/Rollups.t.js',
                            'feature/RowReorder.t.js',
                            'feature/TaskContextMenu.t.js',
                            'feature/TaskDrag.t.js',
                            'feature/TaskDragCreate.t.js',
                            'feature/TaskEdit.t.js',
                            'feature/TaskEditAssignments.t.js',
                            'feature/TaskEditDependency.t.js',
                            'feature/TaskEditConfiguration.t.js',
                            'feature/TaskEditSTM.t.js',
                            'feature/TaskReorderSTM.t.js',
                            {
                                url         : 'feature/TaskResize.t.js',
                                alsoPreload : [preloadTouchMock]
                            },
                            'feature/TaskTooltip.t.js',
                            'feature/TimeRanges.t.js'
                        ]
                    },
                    {
                        group       : 'Grid + Scheduler',
                        preload     : [],
                        alsoPreload : [
                            '../build/gantt.default.css'
                        ],
                        items : [
                            {
                                url         : 'grid+scheduler/grid-and-scheduler-umd-online.t.js',
                                pageUrl     : 'grid+scheduler/grid-and-scheduler-umd-online.html',
                                includeFor  : 'umd',
                                keepPageUrl : true,
                                usesConsole : true
                            },
                            {
                                url        : 'grid+scheduler/grid-and-scheduler-module-online.t.js',
                                includeFor : 'module'
                            }
                        ].concat(!isTC ? [
                            {
                                url         : 'grid+scheduler/grid-and-scheduler-umd.t.js',
                                pageUrl     : 'grid+scheduler/grid-and-scheduler-umd.html',
                                includeFor  : 'umd',
                                keepPageUrl : true
                            },
                            {
                                url        : 'grid+scheduler/grid-and-scheduler-module.t.js',
                                includeFor : 'module'
                            }
                        ] : [])
                    },
                    {
                        group : 'Model',
                        items : [
                            'model/AssignmentModel.t.js',
                            'model/DependencyModel.t.js',
                            'model/TaskModel.t.js'
                        ]
                    },
                    {
                        group : 'Widgets',
                        items : [
                            'widget/AssignmentGrid.t.js',
                            'widget/AssignmentField.t.js',
                            'widget/TaskEditor.t.js',
                            'widget/Timeline.t.js'
                        ]
                    },
                    {
                        group : 'view',
                        items : [
                            {
                                group : 'Export',
                                items : [
                                    'view/export/ExportDialog.t.js'
                                ]
                            },
                            {
                                group : 'Mixin',
                                items : [
                                    'view/mixin/GanttState.t.js'
                                ]
                            },
                            {
                                url        : 'view/GanttBase.t.js',
                                includeFor : 'es6',
                                // To prevent default preloads, which will include Gantt.js
                                preload    : [
                                    '../build/gantt.default.css'
                                ]
                            },
                            {
                                url         : 'view/gantt.t.js',
                                alsoPreload : [
                                    'view/data.js'
                                ]
                            },
                            'view/TaskHover.t.js',
                            'view/TaskSelection.t.js',
                            {
                                url  : 'view/TimeViewRangePageZoom.t.js',
                                skip : !bowser.chrome
                            },
                            'view/TaskRendering.t.js',
                            'view/Zooming.t.js',
                            {
                                url                    : 'view/TaskIndent.t.js',
                                failOnPromiseRejection : false
                            },
                            'view/TaskIndent2.t.js',
                            'view/TaskIndentDirty.t.js'
                        ]
                    },
                    {
                        group : 'Util',
                        items : [
                            'util/TableExporter.t.js',
                            'util/ResourceAssignmentParser.t.js'
                        ]
                    }
                ]
            },
            {
                group              : 'Trial examples',
                skip               : !isTrial,
                enablePageRedirect : true,
                includeFor         : 'module',
                usesConsole        : true,
                items              : [
                    {
                        pageUrl    : '../examples/basic?develop',
                        url        : 'examples/trial-expired-example.t.js?basic',
                        includeFor : 'umd,module'
                    },
                    {
                        pageUrl    : '../examples/advanced?develop',
                        url        : 'examples/trial-expired-example.t.js?advanced',
                        includeFor : 'umd,module'
                    },
                    {
                        pageUrl : '../examples/esmodule?develop',
                        url     : 'examples/trial-expired-example.t.js?esmodule'
                    },
                    {
                        pageUrl : '../examples/requirejs?develop',
                        url     : 'examples/trial-expired-example.t.js?requirejs'
                    },
                    {
                        pageUrl : '../examples/webcomponents?develop',
                        url     : 'examples/trial-expired-example.t.js?webcomponents'
                    }
                ]
            },
            {
                group       : 'Examples',
                usesConsole : isTrial,
                items       : examples.filter(function(example) {
                    // Filter out examples used for monkey tests only
                    return example && example.pageUrl != null && example.url != null;
                })
            },
            {
                group : 'Examples browser',
                items : [
                    {
                        pageUrl            : '../examples/?theme=material#Intermediate',
                        url                : 'examples/examplebrowser.t.js',
                        enablePageRedirect : true
                    },
                    {
                        pageUrl : '../examples/?online#Angular',
                        url     : 'examples/examplebrowseronline.t.js'
                    }
                ]
            },
            {
                group       : 'Monkey Tests for Examples',
                usesConsole : isTrial,
                items       : BryntumTestHelper.prepareMonkeyTests(examples, undefined, mode)
            },
            {
                group      : 'Frameworks examples build',
                includeFor : 'umd',
                skip       : !(isTrial && bowser.chrome),
                items      : [
                    'examples/frameworks-build.t.js'
                ]
            },
            {
                group       : 'Frameworks',
                usesConsole : isTrial,
                includeFor  : 'umd',
                config      : { skipSanityChecks : true },
                items       : frameworks.filter(function(framework) {
                    // Filter out frameworks used for monkey tests only
                    return framework.pageUrl != null && framework.url != null;
                })
            },
            {
                group          : 'Monkey tests for Frameworks',
                includeFor     : 'umd',
                usesConsole    : true,
                config         : { skipSanityChecks : true },
                subTestTimeout : 120000,
                timeout        : 120000,
                items          : BryntumTestHelper.prepareMonkeyTests(frameworks)
            }
        ];

    return BryntumTestHelper.prepareItems(items, mode, isTrial);
}

// Preloads for tests. Usage example: alsoPreload : [preloadName]
const
    preloadFont      = {
        // want size to be as equal as possible on different platforms
        type    : 'css',
        content : 'body { font-family: Arial, Helvetica, sans-serif;  font-size: 14px; }'
    },
    preloadLocalization = {
        umd : [
            '../build/locales/gantt.locale.En.js',
            '../build/locales/gantt.locale.Nl.js',
            '../build/locales/gantt.locale.Ru.js',
            '../build/locales/gantt.locale.SvSE.js',
            '../examples/localization/locales/custom.locale.De.umd.js'
        ],
        default : [{
            type         : 'js',
            isEcmaModule : true,
            content      : [
                'import En from "../lib/Gantt/localization/En.js";',
                'import Nl from "../lib/Gantt/localization/Nl.js";',
                'import Ru from "../lib/Gantt/localization/Ru.js";',
                'import SvSE from "../lib/Gantt/localization/SvSE.js";',
                'import "../examples/localization/locales/custom.locale.De.js";',
                'window.bryntum.locales = { En, Nl, Ru, SvSE, De: window.bryntum.locales.De };'
            ].join('')
        }]
    },
    preloadTouchMock = {
        // Force our core code to detect touch device
        type    : 'js',
        content : 'if (window.Touch) { window.ontouchstart = function(){}; }'
    },
    preloadTurbo     = {
        // To allow classes to have different config values in test execution
        type    : 'js',
        content : 'window.__applyTestConfigs = ' + String(Project.turboMode) + ';'
    },
    preloadCss       = '../build/gantt.default.css',
    preloads         = [
        preloadCss,
        preloadFont,
        preloadTurbo
    ],
    groups           = [];

if (!bowser.msie) {
    /* <remove-on-trial> */
    groups.push({
        group   : 'Using ES 6 modules (lib)',
        preload : preloads.concat({
            type         : 'js',
            isEcmaModule : true,
            content      : [
                'import Gantt from "../lib/Gantt/view/Gantt.js";',
                'import ProjectModel from "../lib/Gantt/model/ProjectModel.js";',
                'import TaskStore from "../lib/Gantt/data/TaskStore.js";',
                'import ResourceStore from "../lib/Gantt/data/ResourceStore.js";',
                'import AssignmentStore from "../lib/Gantt/data/AssignmentStore.js";',
                'import DependencyStore from "../lib/Gantt/data/DependencyStore.js";',
                'import "../lib/Core/adapter/widget/BryntumWidgetAdapter.js";',
                'Object.assign(window, { Gantt, ProjectModel, TaskStore, ResourceStore, AssignmentStore, DependencyStore });'
            ].join('')
        }),
        isEcmaModule : true,
        collapsed    : true,
        items        : getItems('es6')
    });
    /* </remove-on-trial> */

    groups.push({
        group   : 'Using module bundle',
        preload : preloads.concat({
            type         : 'js',
            isEcmaModule : true,
            content      : [
                'import { Gantt, ProjectModel, TaskStore, ResourceStore, AssignmentStore, DependencyStore } from "../build/gantt.module.js";',
                'Object.assign(window, { Gantt, ProjectModel, TaskStore, ResourceStore, AssignmentStore, DependencyStore });'
            ].join('')
        }),
        isEcmaModule : true,
        collapsed    : true,
        items        : getItems('module')
    });
}

groups.push({
    group        : 'Using umd bundle',
    preload      : preloads.concat('../build/gantt.umd.min.js'),
    isEcmaModule : false,
    collapsed    : false,
    items        : getItems('umd')
});

Project.start(groups);
