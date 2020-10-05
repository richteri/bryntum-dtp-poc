# Getting started with Bryntum Gantt

## Overview

The Bryntum Gantt consists of two parts. The first part is the project data, which consists of tasks, dependencies,
resources, assignments and calendars. The second part is the visualization, the User Interface for the project data.

### Project data

The project data is managed by the scheduling engine, which is based on our open-source project [Chronograph](https://github.com/bryntum/chronograph).

The scheduling engine is self-contained, designed to be compatible with a server-side Node.js environment and is implemented as a separate project
using TypeScript. The documentation for this part of the codebase is available [here](./engine/)

You do not need to use the scheduling engine directly, unless you want to customize the scheduling rules with your business logic.

### Visualization and UI

The visualization and user interface part of the Gantt is based on [Bryntum Grid](https://www.bryntum.com/products/grid/),
and is written in plain JavaScript. You can create a different visualization for any part of the project data if needed.

Most features and options for the grid can be used in the Gantt too. In a normal setup, you use frozen grid columns to the left and let the
Gantt occupy the rest of the available space with a horizontal scrollbar to scroll the timeline.

### Folder structure

The project has the following folders:

| Folder          | Contents                                                                                                                               |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `/build`        | Distribution folder, contains JS bundles, CSS themes, locales and fonts. More info below.                                              |
| `/docs`         | Documentation, open it in a browser (needs to be on a web server) to view guides & API docs.                                           |
| `/examples`     | Demos, open it in a browser (needs to be on a web server)                                                                              |
| `/lib`          | Source code, can be included in your ES6+ project using `import`.                                                                      |
| `/resources`    | SCSS files to build our themes or your own custom theme.                                                                               |
| `/tests`        | Our complete test suite, including [Siesta Lite](https://www.bryntum.com/products/siesta/) to allow you to run them in a browser.      |


## Including in your app

The first step to start with the Gantt is to include it in your web app. You need to include the CSS theme from one of the available
bundle files and JavaScript classes. The latter can be done in different ways, choose the most appropriate for your development environment.

### Using bundles
The bundles are located in `/build`. Bundle files are:

| File                        | Contents                                                            |
|-----------------------------|---------------------------------------------------------------------|
| `package.json`              | Importable npm package                                              |
| `gantt.module.js`           | ES module bundle for usage with modern browsers or in build process |
| `gantt.umd.js`              | Transpiled (babel -> ES5) bundle in UMD-format                      |
| `gantt.d.ts`                | ES module bundle Typings for TypeScripts                            |
| `gantt.umd.ts`              | Transpiled UMD-format bundle Typings for TypeScripts                |

All bundles are also available in minified versions, those files end in .min.js.

Example inclusion of UMD bundle:
```html
<script type="text/javascript" src="build/gantt.umd.js"></script>
```

### Using themes
The themes are located in `/build`. Theme files are:

| File                        | Contents                                                            |
|-----------------------------|---------------------------------------------------------------------|
| `gantt.dark.css`            | Light theme                                                         |
| `gantt.default.css`         | Default theme                                                       |
| `gantt.light.css`           | Light theme                                                         |
| `gantt.material.css`        | Material theme                                                      |
| `gantt.stockholm.css`       | Stockholm theme                                                     |

All themes are also available in minified versions, those files end in .min.css.

Example inclusion of Light theme:
```html
<link rel="stylesheet" href="build/gantt.light.css" id="bryntum-theme">
```

### Importing EcmaScript modules from sources

This is the most efficient way from a code size perspective, as your bundle will only include the JS modules actually used by the Gantt codebase.
Please note that this is not possible with the trial version, sources are only included in the fully licensed version.

In your application code, just import the classes you need from their source file. All source files are located under `lib/`
and they all offer a default export. Please note that if you want to support older browsers you may need to transpile and
bundle your code since ES modules are only supported in modern browsers.

```javascript
import Gantt from '../lib/Gantt/view/Gantt.js';
import ProjectModel from '../lib/Gantt/model/ProjectModel.js';

const gantt = new Gantt({
    project : new ProjectModel({ ... }),
    ...
})
```

Almost all included demos use this technique, see for example the <a href="../examples/basic" target="_blank">Basic example</a>.


### Importing EcmaScript module bundle

In your application code, import the classes you need from the EcmaScript module bundle located at `build/gantt.module.js`

```javascript
import {Gantt, ProjectModel} from '../build/gantt.module.js';

const gantt = new Gantt({
    project : new ProjectModel({ ... }),
    ...
})
```

For a complete example using this technique, please see the <a href="../examples/esmodule" target="_blank">ES module example</a>.


### Loading using `<script>` tag

To include Bryntum Gantt on your page using a plain old script tag, just include a `<script>` tag pointing to the UMD bundle file
located in `build/gantt.umd.js`:

```html
<script type="text/javascript" src="path-to-gantt/build/gantt.umd.js"></script>
```

From your scripts you can access Gantt classes in the global `bryntum` namespace:
```javascript
const project = new bryntum.gantt.ProjectModel();
const gantt = new bryntum.gantt.Gantt({ project, ... });
```
For a complete example, please check out the <a href="../examples/scripttag" target="_blank">script tag example</a>.


### Loading using RequireJS

For RequireJS, use the UMD bundle from the `build/gantt.umd.js`. First, define where the module can be found:

```javascript
requirejs.config({
    paths: {
        'gantt': 'path-to-gantt/build/gantt.umd'
    }
});
```

And then require it and use it:
```javascript
requirejs([ 'gantt' ], (bryntum) => {
    const project = new bryntum.ProjectModel({ ... });

    const gantt = new bryntum.Gantt({ project });
});
```

For a complete example, please check out the <a href="../examples/requirejs" target="_blank">requirejs example</a>.


## Creating a project

Once you have the classes imported in one of the ways listed above, you can proceed to the next step - creating a project instance
for your Gantt. The project is a central place for all Gantt data, such as tasks and dependencies.

Under the hood, the project is an instance of the [ProjectModel](#Gantt/model/ProjectModel) class and it is subclass of
the [Model](#Core/data/Model).

Please familiarize yourself with the API of the [Model](#Core/data/Model) class, as it is the base class for all Gantt entities.

When creating a project instance, you can also specify configuration options for the project itself.
For example, the project's start date (all tasks will be scheduled to start no earlier than that date).

Lets create a simple project with a few tasks and dependencies between them (assuming the UMD bundle):

```javascript
const project = new bryntum.gantt.ProjectModel({
    startDate  : '2017-01-01',

    eventsData : [
        {
            id : 1,
            name : 'Write docs',
            expanded : true,
            children : [
                { id : 2, name : 'Proof-read docs', startDate : '2017-01-02', endDate : '2017-01-09' },
                { id : 3, name : 'Release docs', startDate : '2017-01-09', endDate : '2017-01-10' }
            ]
        }
    ],

    dependenciesData : [
        { fromEvent : 2, toEvent : 3 }
    ]
});
```

## Visualizing

Now, that the data is in place, simply pass it to the [Gantt](#Gantt/view/Gantt) instance, to visualize it:

```javascript
const gantt = new bryntum.gantt.Gantt({
    project     : project,

    startDate   : new Date(2017, 0, 1),
    endDate     : new Date(2017, 0, 10),

    columns     : [
        { type : 'name', field : 'name', text : 'Name' },
    ],

    renderTo    : document.body
});
```

Note, that the `startDate` and `endDate` configs passed to the Gantt instance denotes the currently visible timespan, and are not related to the project start/end dates.

Now when you open the page with your app in the browser you should see:

<div class="external-example" data-file="guides/gettingstarted/basic.js"></div>

Now you should be familiar with the general concepts of the Bryntum Gantt. Please continue reading one of the following sections for more detailed information
on the specific topic.

## Updating the project data

Please refer to the [Project data](#guides/project_data.md) guide for additional information about how changes
to the project data (like updating the start date of a task) should be performed.


## Specifying columns

Bryntum Gantt is based on the Bryntum Grid and inherits all functionality related to columns from it. Please refer to
[this guide](#guides/grid/columns.md) for general purpose information about how to define columns for your Gantt chart.

The Gantt chart includes a lot of Gantt specific column types, here are a few common ones:

* [StartDateColumn](#Gantt/column/StartDateColumn) - renders the start date of the task
* [EndDateColumn](#Gantt/column/EndDateColumn) - renders the end date of the task
* [CalendarColumn](#Gantt/column/CalendarColumn) - renders the calendar of the task
* For additional Gantt columns - please refer to the classes in the `Gantt.column.*` namespace.

There is also a special [AddNewColumn](#Gantt/column/AddNewColumn) column, which allows the user to manually add any column to the Gantt chart.

All columns contains editors, which allow the user to edit the information displayed.

## Enabling features

Please refer to the [Enabling extra features](#guides/features.md) guide to learn how to enhance your Gantt chart with
additional functionality (such as displaying labels for the tasks).

## Rendering and styling

In the [Rendering and styling](#guides/customization/rendering_and_styling.md) guide you will learn how to customize rendering of your Gantt chart.


## Calendars system

The [Calendars](#guides/calendars.md) guide contains information about how the working time of your tasks/resources can be specified.


