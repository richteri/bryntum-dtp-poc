# PDF Export demo

This example shows the configuration of Bryntum Gantt with PDF export feature in Vue.

## Bryntum Shared Library
This example uses BryntumGantt wrapper that makes use of the Bryntum Gantt easy.
 
Library package is located in `examples/vue/_shared` folder. 

This library doesn't require building.    

## Project setup
```
npm install
```

## Start PDF export server

This demo requires server to create PDF/PNG files. To setup the server please refer to 
`examples/_shared/server/README.md`.

### Quick setup

Usually it is enough to run
```
examples/vue/javascript/pdf-export$ cd ../../../_shared/server/
examples/_shared/server$ npm install
examples/_shared/server$ node ./src/server.js -h 8080
```

### Loading resources

To export gantt to the PDF we collect HTML/styles on the client and send it 
to the server, which launches headless puppeteer, open page and puts HTML directly
to the page. 
 
Vue development server has pretty strict CORS policy out of the box, neither
puppeteer allows to disable web security in headless mode. Thus in order
to make export server to work with vue dev server, we added config `clientURL` which
will first navigate puppeteer to the page and then will try to load content
provided by the client.

#### Dev mode
In dev mode all styles are loaded inside `<style>` tags and app itself is
hosted on `localhost:8080` (but that one is taken by export server, so
vue would normally switch to `localhost:8081). It means that we need
to point all `url()` to correct URL, e.g.
``` 
font : url('fonts/myfont.eot') -> font : url('http://localhost:3000/fonts/myfont.eot')
```

Below config does just that
```
// Main.js
pdfExportFeature    = {{
    exportServer            : 'http://localhost:8080',
    translateURLsToAbsolute : 'http://localhost:3000',
    clientURL               : 'http://localhost:3000',
    keepPathName            : false // ignores window location, uses translateURLsToAbsolute value
}}
```

Export server wouldn't require more configs:
```
node ./src/server.js -h 8080
```

#### Prod mode
In production mode there could be a combination of `<style>` and `<link>` tags, which means we need to also process `<link>`
hrefs. Also there is no default server run, so config would depend on your environment. 

First, use this config:
```
// Main.ts
pdfExportFeature    = {{
    exportServer            : 'http://localhost:8080',
    translateURLsToAbsolute : 'http://localhost:8080/resources/',
    keepPathName            : false // ignores window location, uses translateURLsToAbsolute value
}}
```

Then run this:

```
// build for production
examples/vue/javascript/pdf-export$ npm run build

// serve the app using `serve` npm package
examples/vue/javascript/pdf-export$ serve -l 8081 build

// start the export server
examples/vue/javascript/pdf-export$ cd ../../../_shared/server
examples/_shared/server$ node ./src/server.js -h 8080 -r ../../vue/javascript/pdf-export/dist
```

Serve doesn't disable CORS by default, which is required to load styles on our origin-less page. So we
rely on export server to provide resources. Last command makesit to host resources on the
address `http://localhost:8080/resources` and disables CORS by default.


### Compiles and hot-reloads for development
```
npm run serve
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
