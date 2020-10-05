<h1 class="title-with-image"><img src="resources/images/vue.png" alt="Bryntum Gantt supports Vue"/>Using Bryntum Gantt with Vue</h1>

The Gantt chart itself is framework agnostic, but it ships with demos to simplify using it with popular frameworks such as Vue. The purpose of this guide is to give you a basic introduction on how to use Bryntum Gantt with Vue.

The Vue demos have been created using <a href="https://cli.vuejs.org" target="_blank">Vue CLI</a> by running:
```bash
vue create -n example name
# or
vue ui
```

If you did not use Vue CLI to create your project, please see *Custom Configurations* section of this guide.

The examples, located in `examples/vue/javascript` folder, can be run either locally in the development mode or they can be built for production. The demos are ready for direct viewing (in production mode) here: <a href="../examples/#Integration" target="_blank">Vue Integration Examples</a>.

If you want to run an example locally in the development mode go to its directory and run:

    npm install
    npm run serve

and then navigate to <a href="http://localhost:8080" target="_blank">http://localhost:8080</a>. If you modify the example code while running it locally it is automatically re-built and updated in the browser allowing you to see your changes immediately.

You can also build the examples, or your own application, for production by running:

    npm install
    npm run build

The built production version is then located in `dist` directory that can be deployed to your production server.

For more information on Vue, please visit <a href="https://vuejs.org" target="_blank">vuejs.org</a>.

## Integrating Gantt with Vue
Although the Gantt is a very complex and sophisticated component, it is very easy to use. All the Gantt needs is:

1. a configuration object
2. an element to render to

### Gantt configuration
The best practice is to keep Gantt configuration in a separate file from which it is imported and passed to the Gantt constructor. The code would then look similar to the following:

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
```html
<template>
    <div></div>
</template>
<script>
    import { Gantt } from 'bryntum-gantt';
    import ganttConfig from './ganttConfig';

    export default {
        name : 'gantt-view',

        data() {
            return {
                ganttInstance : null
            }
        }

        mounted() {
            const gantt = this.gantt = new Gantt(ganttConfig);
            gantt.render(this.$el);
        }

        beforeDestroy () {
            if(this.ganttInstance) {
                this.ganttInstance.destroy();
            }
        }
    }
</script>
```
### Updating properties at runtime
The reference to the Gantt instance `ganttInstance` is saved as the component property so it is made available for the Vue application. When anything in the application changes, that needs to be propagated to the Gantt chart, you can use this property to call methods or assign the new values to properties of the Gantt chart.

### Listening to Gantt events
The last missing piece is listening and reacting to events fired by the Gantt chart. For example, listening to selection change as the user clicks on tasks.

You can install listeners on Gantt by:

* passing `listeners` config option
* calling `on` or `addListener` method

Listeners config could look similar to this:

```js
    listeners : {
        selectionchange : (event) {
            console.log(event);
        }
    }
```

The same effect can be achieved by calling `on` method on Gantt instance:

```js
ganttInstance.on('selectionchange', (event) => {
    console.log(event);
})
```
## Custom Configurations
<a href="https://cli.vuejs.org/" target="_blank">Vue CLI</a> is the default tooling for creating, developing and managing Vue applications so it has been chosen for our examples. It also provides an abstraction level between the application and Webpack and easy configurability of the project through `vue.config.js` file.

While this approach would be best in majority of cases, you can still have a custom Webpack configuration that is not managed by Vue CLI. Although it is not feasible for us to support all possible custom configurations we have some guidelines to make the Bryntum Gantt integration easier and smoother.

If you face any issues, executing one or more of the following steps should resolve the problem.

### Copy Vue wrappers to the project tree
We use Vue wrappers from the `bryntum-vue-shared` package in our examples and it works. However, for non-CLI projects it may be necessary to copy wrappers' files (`BryntumGantt.vue`, `FullscreenButton.vue`, etc.) to your project tree to ensure that they are transpiled together with other project files.

The wrappers are located in `examples/vue/javascript/_shared/src` folder. Copy the files from there to your project.

### Use UMD version of Bryntum Gantt build
In some case it may be needed to use this version for the custom build process to succeed. For that, uncomment the line with `umd` version and comment the other one in all Vue wrappers you use (`BryntumGantt.vue`, `FullscreenButton.vue`, etc.)
```
    // import { Gantt } from 'bryntum-gantt';
    import { Gantt } from 'bryntum-gantt/gantt.umd';
```

### Add or edit `.eslintignore` file
It may also be necessary to ignore linter for some files. If you do not have `.eslintignore` in your project root create it (edit it otherwise) so that it has at least the following content:
```
BryntumGantt.vue
FullscreenButton.vue
gantt.module.js
gantt.umd.js
```
## Troubleshooting

### Building

In case you face any issues with building or running our examples please try running the following commands in the example or the project directory:
```bash
rm -rf package-lock.json node_modules
npm install
npm run build
```

If you use Vue CLI, you can also try adding the following to your `vue.config.js`:
```
module.exports = {
...
    transpileDependencies: [
        'bryntum-gantt'
    ],
...
    chainWebpack: (config) => {
        config.resolve.symlinks(false);
    }
};
```


## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on Vue see the <a href="https://vuejs.org/" target="_blank">Vue.js site</a>
* If you have any questions related to the integration or Gantt itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>

