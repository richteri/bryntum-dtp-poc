<h1 class="title-with-image"><img src="resources/images/angular.png" alt="Bryntum Gantt supports Angular"/>Using Bryntum Gantt with Angular</h1>

The Gantt chart itself is framework agnostic, but it ships with demos and wrappers to simplify using it with popular frameworks
such as Angular. The purpose of this guide is to give you a basic introduction on how to use Gantt with Angular.

The Gantt ships with two demos: Advanced demo and Task Editor demo. The demos show two different ways of integration of Gantt with Angular. Advanced demo does not use any wrapper but integrates Gantt directly and Task Editor demo uses the Gantt wrapper located in `_shared` directory in the package referenced as `bryntum-angular-shared`.

The demos have been created with `ng new example-name` so they can be run locally in development mode by invoking
```
npm install
npm start
```
and then navigating to <a href="http://localhost:4200" target="_blank">http://localhost:4200</a>. If you modify the example code while running it locally it is automatically re-built and updated in the browser allowing you to see your changes immediately.

You can also build the production version of an example, or your application, with
```
npm install
npm run build
```

The built version is then located in the `dist` sub-folder which contains compiled files that can be deployed to your production server.

You can view all the Angular demos in the <a href="../examples/#Integration" target="_blank">example browser</a>

The Task Editor demo contains a wrapper for Gantt that turns it into an Angular component. The wrapper is at this point a basic implementation, but feel free to extend it to cover your needs.

## Integrating Gantt with Angular directly (without a wrapper)
Although the Gantt is a very complex and sophisticated component, it is very easy to use. All the Gantt needs is:

1. a configuration object
2. an element to render to

### Gantt configuration
The best practice is to keep Gantt configuration in a separate file from which it is imported and passed to the Gantt constructor. The code would then look similar to the following:

```jsx
import { Gantt } from 'bryntum-gantt';
import ganttConfig from './ganttConfig';

ganttConfig.appendTo = 'container';

const gantt = new Gantt(ganttConfig);
```

where `ganttConfig.js` would contain configuration similar to the following:
```jsx
export default {
    startDate : '2019-06-20 08:00:00',
    project : new ProjectModel({
        transport       : {
            load : {
                url : '...'
            }
        }
    }),

    columns : [...]

    // other config options
}
```
To find out more about all the available configuration options of the Bryntum Gantt, please consult the <a href="#api">API docs</a>.

Note: `bryntum-gantt` is a locally installed package that contains Bryntum Gantt and all its other supporting widgets. See `package.json` of any example to understand how it is configured:
```json
"dependencies": {
    "bryntum-gantt": "file:../../../../build"
    ... other dependencies
}

```

It was installed by issuing command:

```bash
npm install --save ../../../../build
```
where the last argument is path to `build` directory of Gantt tree.

### Rendering to an element
The Bryntum Gantt needs an existing HTML element to render into. It can be declared as `appendTo`, `insertBefore` or `insertFirst` property with values being either an HTMLElement instance or a string which is the id of an element. The Gantt renders itself as the part of its instantiation if any of the above properties is specified in the config passed into constructor.

In the above example we assign `ganttConfig.appendTo = 'container'`, which is the id of the containing element, for example `<div id="container"></div>`.

If we do not want to render Gantt during instantiation you can omit the above properties and render the component manually at the appropriate time by passing the container to the `render` method. It would look like this:

```jsx
import Gantt from 'bryntum-gantt';
import ganttConfig from './ganttConfig'

// some other code...

const gantt = new Gantt(ganttConfig);

// some other code...

gantt.render('container');

```

The most common scenario is to render Gantt in the `ngOnInit` method. At this time we already have a valid element into which we can render the Gantt component. A very simple example of an Angular component doing this would be following:

```js
import { Component, OnInit, ElementRef } from '@angular/core';
import ganttConfig from './ganttConfig';
import { Gantt } from 'bryntum-gantt';

@Component({
  selector: 'gantt-view',
  template: '<div></div>'
});

export class PanelComponent implements OnInit {

    private elementRef : ElementRef;
    public ganttInstance : any;

    constructor(element : ElementRef) {
        this.elementRef = element;
    }

    ngOnInit() {
        const ganttInstance = new Gantt({
            ...ganttConfig,
            appendTo : this.elementRef.nativeElement,
        });

        this.ganttInstance = ganttInstance;
    }
}

```
The above component can be used anywhere in your Angular application as `<gantt-view />`


### Updating properties at runtime
If you need, you can implement the `ngOnChanges` method in the above component that is called by Angular when any of the properties of the component changes. You would then analyze the changes and you would pass them down to `ganttInstance` as required by calling its methods or assigning its properties.

### Listening to Gantt events
The last missing piece is listening and reacting to events fired by the Gantt chart. For example, listening to selection change as the user clicks on tasks.

You can install listeners on Gantt by:

* passing `listeners` config option
* calling `on` or `addListener` method

Listeners config could look similar to this:

```jsx
    listeners : {
        selectionchange : (event) {
            console.log(event);
        }
    }
```

The same effect can be achieved by calling `on` method on Gantt instance:

```jsx
ganttInstance.on('selectionchange', (event) => {
    console.log(event);
})
```

## Integrating Gantt with Angular using the wrapper
The provided wrapper is part of a package called `bryntum-angular-shared` that must be built before it can be used. For that, go into the `_shared` directory and run:

```bash
npm install
npm run build
```

Then you can use it in your application as follows:

```html
<bry-gantt
    #gantt
    [columns]      = "ganttConfig.columns"
    [project]      = "ganttConfig.project"
    // other properties
></bry-gantt>
```
The currently supported properties are:
* assignments
* autoHeight
* barMargin
* calendars
* cls
* columnLines
* columns
* crudManager
* dependencies
* data
* durationDisplayPrecision
* emptyText
* endDate
* eventColor
* eventStyle
* fillLastColumn
* ganttId
* height
* minWidth
* minHeight
* project
* readOnly
* ref
* resources
* responsiveLevels
* rowHeight
* scheduledEventName
* snap
* startDate
* store
* style
* taskRenderer
* tasks
* tooltip
* viewPreset
* width

Currently supported features are:

* cellEdit
* cellTooltip
* columnDragToolbar
* columnPicker
* columnReorder
* columnResize
* contextMenu
* filter
* filterBar
* group
* groupSummary
* headerContextMenu
* labels
* nonWorkingTime
* pan
* percentBar
* projectLines
* quickFind
* recurringTimeSpans
* regionResize
* resourceTimeRanges
* search
* sort
* stripe
* summary
* taskContextMenu
* taskDrag
* taskDragCreate
* taskEdit
* taskResize
* taskTooltip
* timeRanges

These are the commonly used config options and features. If you need a property or a feature that is not included feel free to add it to the provided wrapper.

### Listening to wrapper events
All Gantt events are routed through the Angular event emitter named `onGanttEvents`. You can install listeners to this emitter the usual way. You only need know which event was fired and handle the fired event accordingly.

## Troubleshooting

If you face troubles building or running our examples, such issues may be resolved by executing the following commands in the example or project directory:

```bash
rm -rf package-lock.json node_modules
npm install
npm run build
```

The error `Bundle included twice` usually means that somewhere you have imported both the normal and UMD versions of the Gantt package. Check inspect the code and import either UMD or normal version of the Gantt but not both. Don't forget to inspect the shared packages too.

When using Angular 9 lazy-loading with dynamic imports you may also get `Bundle included twice` runtime error, but with a different cause. The solution for this issue is be to change target from `ESNext` to `CommonJS` in the `compilerOptions` section of `tsconfig.json` file.

## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on Angular see the <a href="https://angular.io" target="_blank">Angular site</a>
* If you have any questions related to the integration or Gantt itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>
