# 2.1.9 - 2020-08-26

## FEATURES/ENHANCEMENTS

* No Gantt specific changes, but Grid and Scheduler changes are included

# 2.1.8 - 2020-08-11

## BUG FIXES

* Fixed #1214 - Gantt error on applyState
* Fixed #1244 - Initial export options are shown incorrectly in the export dialog
* Fixed #1284 - Exception when trying to open context menu on row border

# 2.1.7 - 2020-07-24

## FEATURES/ENHANCEMENTS

* Added new exporter: MultiPageVertical. It fits content horizontally and then generates vertical pages to fit
 vertical content. (Fixed #1092)

## BUG FIXES

* Fixed #910 - Crash when exporting to PDF if schedule area has no width
* Fixed #933 - Exported PDF corrupt after adding task
* Fixed #953 - Load mask appearing on top of export progress
* Fixed #969 - Multi page export of more than 100 tasks fails
* Fixed #970 - Export feature yields corrupted PDF when chart is scrolled down
* Fixed #972 - Export feature does not export dependencies unless visible first
* Fixed #973 - Export feature does not respect left grid section width
* Fixed #988 - Deleted tasks appear after reapplying filters
* Fixed #1172 - Wrapper should not relay store events to the instance
* Fixed #1180 - Exported grid should end with the last row

# 2.1.6 - 2020-07-10

## FEATURES/ENHANCEMENTS

* Added Docker image of the PDF Export Server. See server README for details. (Fixed #905)

## API CHANGES

* [DEPRECATED] To avoid risk of confusing the Gantt instance with the calculation engine, `ganttEngine` has been deprecated in favor of `ganttInstance` for all framework wrappers (Angular, React, Vue). Fixed #776

## BUG FIXES

* Fixed #858 - Sync tries to remove assignment added on a previous cancelled task edit
* Fixed #968 - Task editing is broken after saving new resource
* Fixed #984 - Indenting a lot of tasks causes incorrect indentation
* Fixed #1056 - enableCellContextMenu: false doesn't disable context menu in Gantt
* Fixed #1131 - Task editing is broken after canceling new resource
* Fixed #1139 - `Duration` column error Tooltip not show up when `finalizeCellEditor` returns false

# 2.1.5 - 2020-06-09

## FEATURES/ENHANCEMENTS

* Updated Font Awesome Free to v5.13.0

## BUG FIXES

* Fixed #801 - Document wrapperCls param in taskRenderer
* Fixed #815 - Gantt %-done bar should be semi-transparent
* Fixed #827 - nonWorkingTime feature stops working with large resources
* Fixed #838 - Unexpected lag between tasks with dependencies and assignment
* Fixed #852 - Project lines appear even if feature is disabled
* Fixed #859 - Crash when dragging task and mouse moves over timeline element
* Fixed #860 - Crash if dragging task with dependency to a filtered out task
* Fixed #862 - Crash if opening Gantt demo in Iran timezone

# 2.1.4 - 2020-05-19

## BUG FIXES

* Fixed #772 - undefined query parameter in CrudManager URLs
* Fixed #783 - Crash if schedule grid is collapsed with progressline enabled

# 2.1.3 - 2020-05-14

## BUG FIXES

* Fixed #257 - Task not rendered correctly after drag drop
* Fixed #268 - Wrong sync request on dependency creation
* Fixed #527 - Gantt sends wrong server request when adding a resource
* Fixed #553 - Loadmask not hidden after load fails
* Fixed #558 - Crash when mouseout happens on a task terminal of a task being removed
* Fixed #559 - Crash if zooming with schedule collapsed
* Fixed #566 - Constraint type: "MUST START ON" not working
* Fixed #577 - Moving task that is partially outside the view fails with an exception
* Fixed #580 - Child calendars does not include intervals from parent
* Fixed #649 - autoSync not triggered when deleting task in TaskEditor
* Fixed #671 - Gantt localization of New task/milestone is broken
* Fixed #675 - Task context menu localization is broken
* Fixed #733 - Changing start date of manual task does not move successors
* Fixed #740 - Should be possible to pass task instance to from/to fields when create a new dependency
* Fixed #744 - Drag drop / resize using touch shows empty tooltip
* Fixed #748 - Effort is updated for effort driven task

# 2.1.2 - 2020-04-17

## FEATURES / ENHANCEMENTS

* The gantt.module.js bundle is now lightly transpiled to ECMAScript 2015 using Babel to work with more browsers out of the box
* The PDF Export feature scrolls through the dataset in a more efficient manner. Fixed #578

## BUG FIXES

* Fixed #123 - Successors and predecessors stores in TaskEditor should not be filtered when task nodes are collapsed
* Fixed #367 - No 'change' event fired after indent operation
* Fixed #464 - Dependencies are not refreshed after filtering with schedule region collapsed
* Fixed #490 - Project can't be loaded with console error Cannot read property 'startDate' of undefined
* Fixed #495 - Ctrl/Cmd Drag a task fails with exception
* Fixed #506 - Adding a milestone for a task fails if the task is ahead the project start date
* Fixed #508 - Wrong rollup rendering on changing zoom level
* Fixed #543 - Having TaskEdit feature disabled breaks TaskContextMenu
* Fixed #544 - Task indicators shown even if they are not part of the time axis

# 2.1.1 - 2020-03-27

## FEATURES / ENHANCEMENTS

* Added new demo showing integration with .NET backend (Fixed #300)
* Added new demo showing integration with .NET Core backend (Fixed #300)
* New .NET integration guide added to the docs

## API CHANGES

* GanttDateColumn no longer shows its step triggers by default. Enable the triggers by setting the `step` value available on the DateColumn class.

## BUG FIXES

* Fixed #399 - Task incorrectly rendered after duration change
* Fixed #409 - Crash when clicking next time arrow in event editor if end date is cleared
* Fixed #418 - Resource assignment column not refreshed after resource update
* Fixed #424 - New resource record throws exception when serializing if propagate wasn't called
* Fixed #426 - Gantt throws when trying to load invalid empty calendar id
* Fixed #429 - Crash if project is loaded with task editor open
* Fixed #430 - Gantt selection not updated after project reload
* Fixed #436 - Crash when exporting to PDF in Angular demo
* Fixed #438 - Rollups are not rendered for collapsed parent node
* Fixed #442 - Default resource images not loaded
* Fixed #444 - Phantom parent id is not included to changeset package and children are
* Fixed #445 - React: Scheduler crashes when features object passed as prop
* Fixed #446 - TaskEditor does not detach from project on consecutive edits
* Fixed #447 - Should round percentDone value for tasks in task editor
* Fixed #449 - Issues when using filter field in assignment editor
* Fixed #450 - Date column too narrow to fit its cell editor
* Fixed #451 - collapseAll does not update selection
* Fixed #457 - Docker container with gantt ASP.NET Core demo cannot connect to MySQL container
* Fixed #458 - Crash when clicking leaf row in undo grid
* Fixed #463 - Filter not applied when deleting character

# 2.1.0 - 2020-03-11

## FEATURES / ENHANCEMENTS

* Indicators for constraint date, early and late dates and more can be added per task row using the new Indicators
  feature. See the new `indicators` demo.
* Deadline support was added in form of a field on `TaskModel` and a `DeadlineDateColumn` to display and edit it.
  Compatible with the new Indicators feature (Fixed #235)
* Resource Assignment column can now show avatars for resources. See new `showAvatars` config used in the updated advanced demo (Fixed #381).
* AssignmentGrid's selection model can now be customised like any regular Grid (Fixed #370)
* Font Awesome 5 Pro was replaced with Font Awesome 5 Free as the default icon font (MIT / SIL OFL license)

## API CHANGES

* [DEPRECATED] The `tplData` param to `taskRenderer` was renamed to `renderData` to better reflect its purpose. The old
  name has been deprecated and will be removed in version 4

## BUG FIXES

* Fixed #255 - Tasks disappear after adding tasks with schedule region collapsed
* Fixed #330 - Id collision happens when you add or move records after filters are cleared
* Fixed #338 - Crash when mouse over splitter during dependency creation
* Fixed #352 - Crash when clicking Units cell of newly added assignment row in task editor
* Fixed #353 - Crash upon load if using Iran Standard Time time zone
* Fixed #366 - writeAllFields is not honored in ProjectModel
* Fixed #391 - Crash when clicking outside assignment editor with cell editing active

# 2.0.4 - 2020-02-24

## API CHANGES

* [DEPRECATED] PercentDoneCircleColumn, use PercentDoneColumn instead with `showCircle` config enabled

## BUG FIXES

* Fixed #159 - Context menu differs in schedule vs grid
* Fixed #215 - PDF export feature doesn't work on zoomed page
* Fixed #286 - Parent node expanded after reorder
* Fixed #296 - Missing title for "New column" in Gantt demos
* Fixed #297 - Note column not updated after set to empty value
* Fixed #317 - Outdent should maintain task parent index
* Fixed #326 - "Graph cycle detected" exception when reordering node
* Fixed #331 - Crash when trying to scroll a task into view if gantt panel is collapsed

# 2.0.3 - 2020-02-13

## FEATURES / ENHANCEMENTS

* ProgressBar feature now has an `allowResize` config to enable or disable resizing (Fixed #242)
* Added a new Rollup column allowing control of which tasks should roll up (Fixed #259)
* Added a new Rollup field to the Advanced tab (Fixed #259)

## BUG FIXES

* Fixed #040 - Focusing a task partially outside of timeaxis extends timeaxis
* Fixed #067 - Wrong typedef of ProjectModel in gantt.umd.d.ts
* Fixed #139 - Dependencies not painted after converting task to milestone
* Fixed #154 - Cannot type into duration field of new task
* Fixed #244 - Dependency drawn after being deleted
* Fixed #256 - Progress line not redrawn after an invalid drop
* Fixed #262 - Resizing to small width which doesn't update data gets UI out of sync
* Fixed #240 - Crash when editing assignment twice
* Fixed #272 - TaskEdit allows to assign same resource to a Task multiple times
* Fixed #274 - Crash after adding subtask
* Fixed #283 - Gantt Baselines example tooltips not localized

# 2.0.2 - 2020-01-30

## FEATURES / ENHANCEMENTS

* PDF export server was refactored. Removed websocket support until it is implemented on a client side.
  Added logging. Added configuration file (see `app.config.js`) which can be overriden by CLI options.
  Multipage export performance was increased substantially (see `max-workers` config in server readme).
  (Fixed #112)

## BUG FIXES

* Fixed #95  - Task end date moves to the previous day when business calendar is used
* Fixed #155 - Task editor displaced upon show
* Fixed #237 - Project lines not shown after project load

# 2.0.1 - 2020-01-17

## FEATURES / ENHANCEMENTS

* Added new Angular examples: Rollups and Time ranges
* PDF Export feature uses first task's name or *Gantt* as the default file name (Fixed #117)

## BUG FIXES

* Fixed #53  - Cell editing is broken when a column uses a field that is missing in the model
* Fixed #94  - Non-symmetric left/right margin for labels
* Fixed #103 - Wrong date format in timeline labels
* Fixed #115 - Project Start field highlighted as invalid while page is loading
* Fixed #118 - Constraint / Start date columns should not include hour info by default
* Fixed #126 - Scheduling engine docs missing
* Fixed #132 - Not possible to open task editor for new task while it's open
* Fixed #134 - 'b-' CSS class seen in task editor element
* Fixed #140 - Crash if calling scrollTaskIntoView on an unscheduled task
* Fixed #142 - Crash when adding a task below an unscheduled task
* Fixed #149 - Timeline widget only shows tasks in expanded parent nodes
* Fixed #160 - Task label not vertically centered
* Fixed #161 - Drag creating dates on an unscheduled task does not set duration
* Fixed #162 - Gantt is not restored properly after export
* Fixed #165 - Name field turns red/invalid upon save
* Fixed #166 - Cannot save unscheduled task with ENTER key
* Fixed #172 - Should not be possible to create dependency between already linked tasks

# 2.0.0 - 2019-12-19

## FEATURES / ENHANCEMENTS

* Gantt has a new rendering pipeline, built upon a method of syncing changes to DOM developed for the vertical mode in
  Scheduler. This change allows us to remove about 1000 lines of code in this release, making maintenance and future
  development easier.
* Added support for exporting the Gantt chart to PDF and PNG. It is showcased in several examples, pdf-export for
  Angular, React and Vue frameworks, as well as in examples/export. The feature requires a special export server,
  which you can find in the examples/_shared/server folder. You will find more instructions in the README.md file in
  each new demo. (Fixed A#6268)

## API CHANGES

* [BREAKING] (for those who build from sources): "Common" package was renamed to "Core", so all our basic classes
  should be imported from `lib/Core/`
* [BREAKING] Gantt `nonWorkingTime` feature class replaced with `SchedulerPro/feature/ProNonWorkingTime` which uses
  project's calendar to obtain non-working time.
* Gantt `nonWorkingTime` feature is now enabled by default.

## BUG FIXES

# 1.2.2 - 2019-11-21

## BUG FIXES

* Fixed #13 - Dragging progress bar handle causes task move

# 1.2.1 - 2019-11-15

## BUG FIXES
* `exporttoexcel` demo broken with bundles

# 1.2.0 - 2019-11-06

## FEATURES / ENHANCEMENTS

* Added support for rollups feature (Fixed A#4774)
* Added a thinner version of Gantt called `GanttBase`. It is a Gantt without default features, allowing smaller custom
  builds using for example WebPack. See the new `custom-build` demo for a possible setup (Fixed A#7883)
* Experimental: The React wrapper has been updated to support using React components (JSX) in cell renderers and as cell
  editors. Please check out the updated React demos to see how it works (Fixed A#7334, Fixed A#9043)
* Added Export to Excel demo (Fixed A#9133)
* Added a new 'Aggregated column demo' that shows how to add a custom column summing values (Fixed A#9211)
* Support for disabling features at runtime has been improved, all features except Tree can now be disabled at any time
* Widgets may now adopt a preexisting DOM node to use as their encapsulating `element`. This reduces DOM footprint when
  widgets are being placed inside existing applications, or when used inside UI frameworks which provide a DOM node. See
  the `adopt` config option (Fixed A#9414)
* The task context menu has been augmented to add indent and outdent. (Fixed A#4779).

## BUG FIXES

* Fixed A#8976 - Prevent task editor from closing if there is an invalid field
* Fixed A#9146 - "No rows to display" shown while loading data
* Fixed A#9161 - Locked grid scroll is reset upon task bar click
* Fixed A#9243 - Date columns change format after zooming
* Fixed A#9253 - Recreating Gantt when a tab in taskeditor is disabled leads to exception
* Fixed A#9416 - Adding a resource in the TaskEditor, then clicking Save throws an error.
* Fixed A#9304 - Tasks duplicated on drag.
* Fixed A#9240 - Duration misrendered when editing.
* Fixed A#9242 - Sync is called on TaskEdit dialog cancel when autosync is true.

# 1.1.5 - 2019-09-09

## FEATURES / ENHANCEMENTS

* Added a new `showCircle` config to PercentDoneColumn that renders a circular progress bar of the percentDone field value (Fixed A#9162).

## BUG FIXES

* Fixed A#8548 - DOCS: `propagate` missing in Project docs
* Fixed A#8763 - Crash after editing predecessors
* Fixed A#8967 - PHP demo: error when removing tasks with children
* Fixed A#9092 - TaskStore id collision
* Fixed A#9148 - Crash after resizing task progress bar in Timeline demo
* Fixed A#9163 - STYLING: Milestone displaced

# 1.1.4 - 2019-08-28

## FEATURES / ENHANCEMENTS

* Added Tooltips demo that shows how to customize the task tooltip (Fixed A#9109)

## API CHANGES

* The `TaskEdit#getEditor()` function was made public, can be used to retrieve the TaskEditor instance.

## BUG FIXES

* Fixed A#8560 - Adding task below last task creates empty row
* Fixed A#8618 - STYLING: Dark theme nonworking time headers look bad
* Fixed A#8619 - STYLING: Dark theme check column unchecked checkboxes are invisible
* Fixed A#8690 - STYLING: Selected task innerEl rendition needs to be more of a contrast so that the current, possibly
multiple selection can be seen at a glance.
* Fixed A#8844 - PHP demo: dragging and tooltip are broken after a newly created task is saved
* Fixed A#9008 - Progress bar resizable in readOnly mode
* Fixed A#9073 - vue drag-from-grid demo cannot be built with yarn
* Fixed A#9084 - Task row disappears on Drag'n'Drop
* Fixed A#9087 - Resource Avatar images reloaded upon every change to Task model
* Fixed A#9093 - Phantom dependencies are rendered after clearing task store
* Fixed A#9097 - STYLING: Toolbar fields misaligned in advanced demo
* Fixed A#9108 - 'beforeTaskEdit' only fired once if listener returns false

# 1.1.3 - 2019-08-19

## FEATURES / ENHANCEMENTS

* Added React Basic Gantt demo with TypeScript (Fixed A#8977)
* Added support for importing MS Project MPP files (see 'msprojectimport' demo). Requires JAVA and PHP on the backend. See README in the example dir for details (Fixed A#8987)

## BUG FIXES

* Fixes A#8336 - Switching locale in advanced demo takes ~2 seconds
* Fixed A#8653 - Unexpected task scheduling after undo operation
* Fixed A#8712 - PHP demo: after creating a new task and saving it, when try to interact with the task demo fails with exceptions
* Fixed A#8715 - PHP demo: after creating a new task and saving it selection is broken
* Fixed A#8716 - Dependency line for a deleted dependency is redrawn after it's "to" side is appended to its "from" side.
* Fixed A#8884 - Critical paths demo is broken online
* Fixed A#8885 - tabsConfig is not taken into account by TaskEditor
* Fixed A#8966 - PHP demo: task sort order is not stored
* Fixed A#8988 - React demo in trial distribution refers to scheduler folder which may not exist
* Fixed A#8995 - Progress bar in some tasks cannot be resized after some point
* Fixed A#9006 - Pan feature doesn't work in Gantt
* Fixed A#9027 - ColumnLines feature doesn't work in Gantt

# 1.1.2 - 2019-07-05

## BUG FIXES

* Fixed A#8804 - Error / warnings in console of web components demo
* Fixed A#8805 - Animations not working
* Fixed A#8811 - Crash when using context menu in web components demo
* Fixed A#8839 - Save/Delete/Cancel button order in TaskEditor should match order in EventEditor

# 1.1.1 - 2019-06-27

## FEATURES / ENHANCEMENTS

* Added Integration Guide for Vue (Fixed A#8686)
* Added Integration Guide for Angular (Fixed A#8686)
* Added Integration Guide for React (Fixed A#8686)
* Added new config option `tabsConfig` for `taskEdit` feature (Fixed A#8765)

## BUG FIXES

* Fixed A#8754 - Sluggish drag drop experience in advanced demo
* Fixed A#8778 - Baselines disappear if scrolling down and back up
* Fixed A#8785 - Passing listeners to editor widget in TaskEditor removes internal listeners

# 1.1.0 - 2019-06-20

## FEATURES / ENHANCEMENTS

* There is now a `Baselines` feature which shows baselines for tasks. A task's data block may now contain
a `baselines` property which is an array containing baseline data blocks which must contain at least
`startDate` and `endDate`. See the new example for details. (Fixed A#6286)
* New `CriticalPaths` feature which visualizes the project critical paths. Check how it works in the new `criticalpaths` demo. (Fixed A#6269)
* New `ProgressLine` feature - a vertical graph that provides the highest level view of schedule progress. Check how it works in the new `progressline` demo. (Fixed A#8643)
* New `EarlyStartDate`, `EarlyEndDate`, `LateStartDate`, `LateEndDate` and `TotalSlack` columns. Check how they works in the new `criticalpaths` demo. (Fixed A#6285).

## API CHANGES

## BUG FIXES

* Fixed A#8539 - Some task editor fields turns red moments before editor is closed after clicking save
* Fixed A#8602 - TaskEditor should invalidate an end date < start date
* Fixed A#8603 - STYLING: Milestones lack hover color
* Fixed A#8604 - Clicking task element does not select the row
* Fixed A#8632 - Task end date/duration is not properly editing after cancel
* Fixed A#8665 - Task interaction events are not documented
* Fixed A#8707 - Resizing column expands collapsed section

# 1.0.2 - 2019-06-03

## FEATURES / ENHANCEMENTS

* New integration demo with Ext JS Modern toolkit (Fixed A#8447)
* New webcomponents demo (Fixed A#8495)
* TaskEdit feature now fires an event before show to prevent editing or to show a custom editor (Fixed A#8510)
* TaskEdit feature now optionally shows a delete button
* Gantt repaints dependencies asynchronously when dependency or task is changed. Use `dependenciesDrawn` event to know when dependency lines are actually painted. `draw`, `drawDependency` and  `drawForEvent` are still synchronous.

## API CHANGES

* [DEPRECATED] TaskEditor's `extraWidgets` config was deprecated and will be removed in a future version. Please use
`extraItems` instead.

## BUG FIXES

* Fixed A#7925 - Dependency line should only be drawn once on dependency change
* Fixed A#8517 - Angular demo tasks animate into view
* Fixed A#8518 - React + Vue demos broken rendering
* Fixed A#8520 - Labels demo timeaxis incorrectly configured
* Fixed A#8529 - Pan feature reacts when dragging task bar
* Fixed A#8516 - Customizing resourceassignment picker demo issues
* Fixed A#8532 - Adding task above/below of a milestone creates a task with wrong dates
* Fixed A#8533 - Cannot destroy ButtonGroup
* Fixed A#8556 - Add Task button throws in extjs modern demo
* Fixed A#8586 - Add new column header not localized properly

# 1.0.1 - 2019-05-24

## FEATURES / ENHANCEMENTS

* Delimiter used in Successors and Predecessors columns is now configurable, defaulting to ; (Fixed A#8292)
* New `timeranges` demo showing how to add custom date indicator lines as well as date ranges to the Gantt chart (Fixed A#8320)
* Demos now have a built in code editor that allows you to play around with their code (Chrome only) and CSS (Fixed A#7210)
* *BREAKING.* Context menu Features are configured in a slightly different way in this version. If you have used
the `extraItems` or `processItems` options to change the contents of the shown menu, this code must be
updated. Instead of using `extraItems`, use `items`.

  The `items` config is an *`Object`* rather than an array. The property values are your new submenu configs, and the property name is the menu item name. In this way, you may add new items easily, but also, you may override the configuration of the default menu items that we provide.

  The default menu items now all have documented names (see the `defaultItems` config of the Feature), so you may apply config objects which override default config. To remove a provided default completely, specify the config value as `false`.

  This means that the various `showXxxxxxxInContextMenu` configs in the Gantt are now ineffective. Simply
use for example, `items : { addTaskAbove : false }` to remove a provided item by name.

  `processItems` now recieves its `items` parameter as an `Object`, so finding predefined named menu items to mutate is easier. Adding your own entails adding a new named config object. Use the `weight` config to affect the menu item order. Provided items are `weight : 0`. Weight values may be negative to cause your new items  (Fixed A#8287)

## BUG FIXES

* Fixed A#7561 - Should be able to use Grid & Scheduler & Gantt bundles on the same page
* Fixed A#8075 - TimeRanges store not populated if incoming CrudManager dataset contains data
* Fixed A#8210 - Terminals not visible when hovering task after creating dependency
* Fixed A#8261 - ProjectLines not painted after propagation complete
* Fixed A#8264 - Reordering a task into a parent task doesn't recalculate the parent
* Fixed A#8275 - Framework integrations missing value in start date field
* Fixed A#8276 - Crash if invoking task editor for unscheduled task
* Fixed A#8279 - Gantt PHP demo requestPromise.abort is not a function in AjaxTransport.js
* Fixed A#8293 - Gantt advanced demo. Graph cycle detected
* Fixed A#8295 - Gantt umd bundle doesn't work in angular
* Fixed A#8296 - Typings for gantt.umd bundles are incomplete
* Fixed A#8325 - Some translations are missing (NL)
* Fixed A#8334 - Clicking on a blank space selects a task and scrolls it into view
* Fixed A#8341 - Task elements are missing after adding new tasks
* Fixed A#8342 - Collapsing all records fails in advanced demo
* Fixed A#8357 - TaskEditor needs to provide a simple way of adding extra fields to each tab
* Fixed A#8381 - loadMask not shown if Project is using autoLoad true
* Fixed A#8384 - Crash in React demo when clicking Edit button
* Fixed A#8390 - Undoing project start date change doesn't update project start line
* Fixed A#8391 - Progress bar element overflows task bar on hover if task is narrow
* Fixed A#8394 - CrudManager reacts incorrectly and tries to save empty changeset
* Fixed A#8397 - Inserting two tasks at once breaks normal view
* Fixed A#8404 - addTaskBelow fails on 2nd call
* Fixed A#8457 - Rendering broken after adding subtask to parent
* Fixed A#8462 - Error throw in undoredo example when second transaction is canceled
* Fixed A#8475 - STYLING: Misalignment of resource assignment filter field
* Fixed A#8494 - Exception thrown when adding task via context menu
* Fixed A#8496 - Crash in Gantt docs when viewing ResourceTimeRanges

# 1.0.0 - 2019-04-26

* Today we are super excited to share with you the 1.0 GA of our new Bryntum Gantt product. It is a powerful and high performance Gantt chart component for any web application. It is built
from the ground up with pure JavaScript and TypeScript, and integrates easily with React, Angular, Vue or any other JS framework you are already using.

For a full introduction, please see our blog post for more details about this release. In our docs page you will find extensive API documentation including a getting started guide.

* Blog post: https://www.bryntum.com/blog/announcing-bryntum-gantt-1-0
