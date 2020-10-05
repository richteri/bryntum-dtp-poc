# Vue Task editor customization demo

## Bryntum Shared Library
This example uses BryntumScheduler wrapper that makes use of the Bryntum Scheduler easy.
 
Library package is located in `examples/vue/javascript/_shared` folder. 

This library doesn't require building.    

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run start
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Troubleshooting

- In the case of compile error (`npm run build` or `npm start` fails) try to delete `node_modules` folder and `package-lock.json` file in example's folder and then build example or run development server as suggested above.

- If you couldn't compile vue demo under WSL in Windows with error like
 
```
These dependencies were not found: ...
```
 
then try to use this code for `vue.config.js` file. 

```js
module.exports = {
    publicPath: '',
    css: {
        sourceMap: true
    },
    transpileDependencies: [
        'bryntum-scheduler'
    ],
    chainWebpack: (config) => {
        config.resolve.symlinks(false);
    }
};
```
