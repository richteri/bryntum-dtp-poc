<h1 class="title-with-image"><img src="resources/images/react.png" alt="Bryntum Gantt supports React"/>Using Bryntum Gantt with React</h1>

The Gantt chart itself is framework agnostic, but it ships with demos to simplify using it with popular frameworks such as React. The purpose of this guide is to give you a basic introduction on how to use the Bryntum Gantt with React.

There are React demos that have been created  using <a href="https://github.com/facebook/create-react-app" target="_blank">create-react-app</a> script which run either in development mode or can be built for production. They are located in `examples/react/javascript` folder. The demos are ready for direct viewing (in production mode) here: <a href="../examples/#Integration/React" target="_blank">React Integration Examples</a>.

If you want to run an example locally in development mode change to its directory and run:

    npm install
    npm start

and then navigate to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>. If you modify the example code while running it locally it is automatically re-built and updated in the browser allowing you to see your changes immediately.

You can also build the examples, or your own application, for production by running:

    npm install
    npm run build

The built production version is then located in `build` directory that can be deployed to your production server.

For more information on React, please visit <a href="https://reactjs.org/" target="_blank">reactjs.org</a>.

If you did not use create-react-app to create your project, please see the *Custom Configurations* section of this guide.

## Install Gantt npm package
The Gantt package contains all the Bryntum Gantt code together with supporting widgets and utilities in the form of a module that can be installed with `npm` package manager. The package is located in `build` folder of the unzipped Bryntum Gantt distribution. For example, if you unzipped to `/Users/developer/gantt-2.1.2`, then run this code to install it:

```
npm install --save /Users/developer/gantt-2.1.2/build

or

npm install --save c:\Users\developer\gantt-2.1.2\build # on Windows

```

You can also use relative path to the Gantt `build` folder.

The result is the entry for `bryntum-gantt` in your `package.json`, for example:
```json
"dependencies": {
    "bryntum-gantt": "file:../../../../build"
    ... other dependencies
}
```

## Integrating Gantt with React
Although the Gantt is a very complex and sophisticated component, it is very easy to use. All the Gantt needs is:

1. a configuration object
2. an element to render to


### Gantt configuration
The recommended practice is to keep Gantt configuration in a separate file from which it is imported and passed to the Gantt constructor. The code would then look similar to the following:

```jsx
import { Gantt } from 'bryntum-gantt';
import ganttConfig from './ganttConfig.js';

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

Note: `bryntum-gantt` is a locally installed package as described in section **Install Gantt npm package** above.


### Rendering to an element
The Bryntum Gantt needs an existing HTML element to render into. It can be declared as `appendTo`, `insertBefore` or `insertFirst` property with values being either an HTMLElement instance or a string which is  the id of an element. The Gantt renders itself as the part of its instantiation if any of the above properties is specified in the config passed into constructor.

In the above example we assign `ganttConfig.appendTo = 'container'`, which is the id of the containing element, for example `<div id="container"></div>`.

If we do not want to render Gantt during instantiation you can omit the above properties and render the component manually at the appropriate time by passing the container to the `render` method. It would look like this:

```jsx
import Gantt from 'bryntum-gantt';
import ganttConfig from './ganttConfig.js'

// some other code...

const gantt = new Gantt(ganttConfig);

// some other code...

gantt.render('container');

```

The most common scenario is to render Gantt in the `componentDidMount` method if you use classes in your application or in the `useEffect` initial call if you use React hooks.

### Rendering in React component
The example of using Gantt in a React component is the following:
```jsx
import React, { Component } from 'react';
import Gantt from 'bryntum-gantt';
import ganttConfig from './ganttConfig'

class myGantt extends Component {
    componentDidMount() {
        const gantt = new Gantt({
            ...ganttConfig,
            appendTo: this.el
        });
        this.ganttInstance = gantt;
    }

    componentWillUnmount() {
        this.ganttInstance.destroy();
    }

    render() {
        return ('<div ref={el => this.el = el}></div>')
    }
}

export default myGantt;
```
Here we let React to create element we return from `render` method keeping the reference to it and when the element will become available in `componentDidMount` lifecycle method we configure and create Bryntum Gantt itself.

Keeping its reference in the class property `ganttInstance` is important for it's proper destroy in `componentWillUnmount` or in other methods of this class or for outside layers wishing to access the Gantt.

### Rendering in React Hooks
If you are using React Hooks then Gantt could be integrated as follows:

```jsx
import React, { useEffect, useRef } from 'react';
import { Gantt } from 'gantt';
import ganttConfig from './ganttConfig';

cont myGantt = props => {

    const elementRef = useRef(),
          ganttRef = userRef();

    useEffect(() => {
        ganttRef.current = new Gantt({
            ...ganttConfig,
            appendTo: elementRef.current
        });
        return () => {
            if(ganttRef.current) {
                ganttRef.current.destroy();
            }
        };
    }, []);

    return (
        <div ref={elementRef}></div>
    )
}

export default myGantt;
```

`useEffect` above will run only once on the component initialization (due to empty array [] passed as the second argument) and we create and render Gantt there. The function returned is run on component destroy.

### Updating properties at runtime
At this point we have Gantt properly configured and rendered on the the screen so now it is time to pass to it changes that may occur as results of user actions, if you need it.

As with rendering there are two possible scenarios: React Class Component and React Functional Component using hooks.

For Component, we would use `shouldComponentUpdate` function that is called by React when a component property changes. In the function we would analyze what has changed and what action to take: either to ignore the change if it is not related to Gantt or to pass it to `ganttInstance` by calling its method or assigning a new value to its property.

Do not forget to return `false` from this method to prevent React from destroying and re-rendering our Gantt.

For Functional Component we would call `useEffect` again, now with a list of properties as the second argument. Function passed as the first argument would then run whenever any of the listed properties changes when we would propagate this change down to `ganttRef.current`.

### Listening to Gantt events
The last missing piece is listening and reacting to events fired by the Gantt chart. For example, listening to selection change as the user clicks on tasks.

You can install listeners on Gantt by

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
ganttRef.current.on('selectionchange', (event) => {
    console.log(event);
})
```

### Best practices
There are many possible ways of creating and building React applications ranging from the recommended default way of using [Create React App](https://create-react-app.dev/) scripts through applications initially created with Create React App but ejected later, up to very custom setups using Webpack or another packager and manually created application.

We used Create React App to create all our React examples and it has proven to be the simples, most compatible and most reliable way of using Bryntum Gantt in a React application.

The broad steps are as follows:

0. Download the Bryntum Gantt, trial or full version depending on your license
1. Use `npx create-react-app bryntum-demo` to create a basic empty React application
2. Install `bryntum-gantt` package according to section **Install Gantt npm package** above
3. Copy `BryntumGantt.js` wrapper or build and install `bryntum-react-shared`
4. Import and use the `BryntumGantt` in the application
5. Import a Gantt CSS file, for example `gantt.stockholm.css` to achieve the proper gantt look

Our examples also use resources from `bryntum-react-shared`, for example `shared.scss`, fonts and images that are used to style demo's header, logo, etc. These are generally not needed in your application because you have different logo, colors, layout of header, etc.

We recommend to use the above procedure and create the application from scratch but if you take our demo as the basis, do not forget to clean it up from imports, resources, css files and rules that are not needed.

Also we do not recommend to copy the downloaded and unzipped Gantt to your project tree not only because it would bloat the size but mainly because it can fool the IDE to propose auto-imports from the wrong places. For example:
```
// if you installed bryntum-react-shared, you should never import from the source file
import FullscreenButton from './gantt-trial/examples/react/_shared/lib/FullscreenButton.js'

// but always from the package
import { FullscreenButton } from 'bryntum-react-shared';
```
If you decide to copy the files from Bryntum download to your project, always copy selectively only the source files you need, not the whole distribution.

Please consult Custom Configurations section below if your project has not been created with Create React App.

## Using React as cell renderer
Bryntum Gantt column already supports configuration option [renderer](#Grid/column/Column#config-renderer) which is a function that receives rich parameters used as inputs to compose the resulting returned html. Any kind of conditional complex logic can be used to prepare a visually rich cell content.

Yet, there can be a situation when you already have a React component that implements the desired cell visualizations and re-writing its functionality as the renderer function would only be superfluous work.

It is now possible to use JSX that can refer also to React components as a cell renderer. The support is implemented in the `BryntumGantt` wrapper therefore the wrapper must be used for the JSX renderers to work.

### Using simple inline JSX

Using inline JSX is as simple as the following:

```jsx
renderer: ({ value }) => <b>{value}</b>
```

If you also need to access other data fields, you can do it this way:

```jsx
renderer: (renderData) => <div><b>{renderData.value}</b>/{renderData.record.role}</div>
```

_**Note:** Mind please that the above functions return html-like markup without quotes. That makes the return value JSX and it is understood and processed as such. If you enclose the markup in quotes it will not work._

### Using a custom React component

It is similarly simple. Let's have the following simple component:

```jsx
import React, { Component } from 'react';

// Defines a simple button React component
export default class DemoButton extends Component {
    render() {
        return <button
            className="b-button b-green"
            onClick={this.props.onClick}
            style={{ width : '100%' }}
        >{this.props.text}</button>
    }
}
```
The button expects `text` and `onClick` as its properties. In the grid application we have to import `DemoButton` and then we can use this component as follows:

```jsx
import DemoButton from '../components/DemoButton';

/**
 * User clicked the "Edit" button
 */
handleEditClick = record => {
    this.refs.gantt.ganttInstance.editTask(record);
};

render = () => {
    return (
        <BryntumGantt
            // Gantt columns
            columns={[
                {
                    text     : 'Edit<div class="small-text">(React component)</div>',
                    width    : 120,
                    editor   : false,
                    align    : center,
                    // Using custom React component
                    renderer : ({ record }) => record.isLeaf ?
                        <DemoButton
                            text={'Edit'}
                            onClick={() => this.handleEditClick(record)
                        }/>
                        : null
                },
                // ... other columns
            ]}
            // ... other props
        />
    );
}

```
The column `renderer` function above is expected to return JSX, exactly same as in the case of simple inline JSX, but here it returns imported `DemoButton` component. The `renderer` also passes the mandatory props down to the component so that it can render itself in the correct row context.

## Using React as cell editor

It is also possible to use a React component as the cell editor that activates on the cell dbl-click by default. The React component acting as the editor has to implement the following methods:

* setValue
* getValue
* isValid
* focus

These methods are required by `BryntumGantt` React wrapper and an exception is thrown if any of them is missing.

The React component implementing the grid cell editor could look like this:

```jsx
import React, { Component, Fragment } from 'react';

// Defines a simple React cell editor that displays two buttons Yes|No, for editing boolean columns
export default class DemoEditor extends Component {
    state = {
        value : ''
    };

    // Should return the value to be applied when editing finishes
    getValue() {
        return this.state.value;
    }

    // Current cell value + context, set when editing starts. Use it to populate your editor
    setValue(value, cellEditorContext) {
        this.setState({ value });
    }

    // Invalid editors are not allowed to close (unless grid is so configured).
    // Implement this function to handle validation of your editor
    isValid() {
        // This simple editor is always valid
        return true;
    }

    // Called when editing starts, to set focus at the desired place in your editor
    focus() {
        if (this.state.value) {
            this.noButton.focus();
        }
        else {
            this.yesButton.focus();
        }
    }

    onYesClick() {
        this.setValue(true);
        this.noButton.focus();
    }

    onNoClick() {
        this.setValue(false);
        this.yesButton.focus();
    }

    render() {
        return <Fragment>
            <button
                className="yes-button"
                tabIndex={-1}
                ref={el => this.yesButton = el}
                style={{ background: this.state.value ? '#D5F5E3' : '#F2F3F4' }}
                onClick={this.onYesClick.bind(this)}
            >Yes</button>
            <button
                className="no-button"
                tabIndex={-1}
                ref={el => this.noButton = el}
                style={{ background: this.state.value ? '#F2F3F4' : '#F5B7B1' }}
                onClick={this.onNoClick.bind(this)}
            >No</button>
        </Fragment>;
    }
}
```

Having the component which implements the editor we can use it in our application as follows:

```jsx
import DemoEditor from '../components/DemoEditor';

render = () => {
    return (
        <BryntumGantt
            columns={[
                {
                    field    : 'draggable',
                    text     : 'Draggable<div class="small-text">(React editor)</div>',
                    align    : 'center',
                    width    : 120,
                    renderer : ({ value }) => value ? 'Yes' : 'No',
                    editor   : ref => <DemoEditor ref={ref}/>
                },
                // ... other columns
            ]}
            // ... other props
        />
    );

```
The `editor` function receives `ref` as the argument and that must be passed down to the React component that implements the cell editor. Although there is no apparent use of this property in the component code itself, it is mandatory because it is used by the `BryntumGantt` wrapper to keep the reference to the React editor component. You can also pass another props if you need but never forget `ref={ref}`.

JSX Cell renderers and editors are implemented as <a href="https://reactjs.org/docs/portals.html" target="_blank">React Portals</a> that allow rendering of React components outside of their parent trees, anywhere in the DOM. We use this feature to render the above DemoButtons in grid cells. The following screenshot shows these buttons in the React Dev Tools. You can click on it so see it in action.

<a href="../examples/react/javascript/basic" target="_blank">
<img src="resources/images/GanttJSX.png" alt="Example of Bryntum Gantt with JSX">
</a>

## React useState hook in functional components
The common React practice of preserving data between functional component's re-runs is to use `useState` hook this way:
```
import React, { useState } from 'react';

function App = props => {
    const [value, setValue] = useState('Initial value');

    // ...
    return ( /* component JSX /*)
}
```

State variable `value` can then be accessed within the scope of `App`. However, if a function defined in the scope of `App` is passed to Bryntum Gantt as a listener function or renderer, then the `value` within that function will be always `'Initial value'`. This is not a feature or bug of Bryntum Gantt but it is how React works.

The following simplified code demonstrates the problem:

```
import React, { useState } from 'react';

function App = props => {
    const [value, setValue] = useState('Initial value');

    const handler = () => {
        console.log(value) // will always output 'Initial value'
    }

    // ...
    return (
        <button onClick={()=>{
            setValue('Other value');
        }}>Click me</button>
        <BryntumGantt 
            listeners={{
                mouseOver:handler 
            }}
        />
    );
}
```
To solve this problem use `useContext` React hook instead of `useState`. It can be implemented as follows:
```
import React, { createContext, useContext } from 'react';

const context = createContext('Initial Global Value');

const App = props => {
    let globalValue = useContext(context);

    const handler = () => {
        console.log(globalValue);
    }

    // ...
    return (
        <button onClick={()=>{
            globalValue = 'Other Value';
        }}>Click me</button>
        <BryntumGantt 
            listeners={{
                mouseOver:handler 
            }}
        />
    );
}
```
This approach is only necessary if the listener or renderer functions passed to Bryntum Gantt need to access variables from the enclosing React functional component.

## Custom Configurations
<a href="https://create-react-app.dev/" target="_blank">Create React App</a> is an officially supported way to create single-page React applications. It offers a modern build setup with no configuration so it has been chosen for our examples.

While this approach is preferable in the majority of cases, you can still have a custom Webpack configuration that is not managed by Create React App scripts. Although it is not feasible for us to support all possible custom configurations we have some guidelines to make the Bryntum Gantt integration easier and smoother.

If you face any issues, performing one or more of the following steps should resolve the problem.

### Copy React wrappers to the project tree
We use React wrappers from the `bryntum-react-shared` package in our examples and it works. However, for some projects it may be necessary to copy wrappers' files (`BryntumGantt.js`, `BryntumWidget.js`, etc.) to your project tree to ensure that they are transpiled together with the other project files.

The wrappers are located in `examples/react/_shared/src/lib` folder. Copy the files from there to your project.

### Use UMD version of Bryntum Gantt build
In some cases it might be necessary to use this version for the custom build process to succeed even if you do not need IE11 compatibility. The reason is that your Webpack/Babel/ESLint configuration may not match the non-umd code.

For that, uncomment the line with `umd` version and comment the other one in all React wrappers you use (`BryntumGantt.js`, `BryntumWidget.js`, etc.)
```
// we import gantt.umd for IE11 compatibility only. If you don't use IE import:
// import { Gantt, ObjectHelper, Widget } from 'bryntum-gantt';
import { Gantt, ObjectHelper, Widget } from 'bryntum-gantt/gantt.umd';
```

### Add or edit `.eslintignore` file
It may also be necessary to ignore linter for some files. If you do not have `.eslintignore` in your project root create it (edit it otherwise) so that it has at least the following content:
```
BryntumGantt.js
BryntumWidget.js
FullscreenButton.js
gantt.module.js
gantt.umd.js
```

### Clear npm cache
Clearing the npm cache can sometimes resolve problems mainly with dependencies not found. To clear the cache run:
```
npm cache clear --force
```

## Troubleshooting

If you face any issues building or running examples or your application, such issues can be often resolved by the following commands run in the example or the project directory:

```bash
rm -rf package-lock.json node_modules
npm install
npm run build
```

If you see a failure like the one below, that is probably your linter doesn't accept our bundle. Please try to disable our bundle completely from checking by any linters. In case of "eslint" add `/* eslint-disable */` to the top of the bundle.

```
./src/build/gantt.module.js
  Line 9:   Unexpected use of 'self'                                               no-restricted-globals
  Line 9:   Unexpected use of 'self'                                               no-restricted-globals
  Line 10:   'jQuery' is not defined                                                no-undef
  Line 10:  Expected an assignment or function call and instead saw an expression  no-unused-expressions
  Line 34:    Expected an assignment or function call and instead saw an expression  no-unused-expressions
  Line 160:  'view' is not defined                                                  no-undef
  Line 160:  'centered' is not defined                                              no-undef
  Line 162:  Unexpected use of 'location'                                           no-restricted-globals
  Line 162:  Unexpected use of 'location'                                           no-restricted-globals
  Line 162:  Unexpected use of 'location'                                           no-restricted-globals
  Line 162:  'bryntum' is not defined                                               no-undef
  Line 162:  'dataLayer' is not defined
```

## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on React see the <a href="https://reactjs.org" target="_blank">React docs</a>
* For more information on Create React App scripts see <a href="https://facebook.github.io/create-react-app/" target="_blank">the documentation</a>
* If you have any questions related to the integration or Gantt itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>
