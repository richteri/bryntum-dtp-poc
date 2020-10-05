# PDF Export demo

This example shows the configuration of Bryntum Gantt with PDF export feature in React.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Bryntum Shared Library

This example uses BryntumGantt wrapper which is implemented in shared library.
 
Library package is located in `examples/react/_shared` folder. 

This library is automatically installed and built during `npm install` for the example by `preinstall` script in `package.json` so it not required do it separately.    

To install and build it manually go to library folder and run:

```
npm install
npm run build
```

## Start PDF export server

This demo requires server to create PDF/PNG files. To setup the server please refer to 
`examples/_shared/server/README.md`.

### Quick setup

Usually it is enough to run
```
examples/react/javascript/pdf-export$ cd ../../../_shared/server/
examples/_shared/server$ npm install
examples/_shared/server$ node ./src/server.js -h 8080
```

### Loading resources

To export gantt to the PDF we collect HTML/styles on the client and send it 
to the server, which launches headless puppeteer, open page and puts HTML directly
to the page. 
 
React development server has pretty strict CORS policy out of the box,
unless you have it ejected, you cannot configure response headers. Neither
puppeteer allows to disable web security in headless mode. Thus in order
to make export server to work with react dev server, we added config `clientURL` which
will first navigate puppeteer to the page and then will try to load content
provided by the client.


#### Dev mode
In dev mode all styles are loaded inside `<style>` tags and app itself is hosted on `localhost:3000`. It means that we need
to point all `url()` to correct URL, e.g.
``` 
font : url('/static/media/myfont.eot') -> font : url('http://localhost:3000/static/media/myfont.eot')
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
examples/react/javascript/pdf-export$ npm run build

// serve the app using `serve` npm package
examples/react/javascript/pdf-export$ serve -l 8081 build

// start the export server
examples/react/javascript/pdf-export$ cd ../../../_shared/server
examples/_shared/server$ node ./src/server.js -h 8080 -r ../../react/javascript/pdf-export/build
```

Serve doesn't disable CORS by default, which is required to load styles on our origin-less page. So we
rely on export server to provide resources. Last command makes it to host resources on the
address `http://localhost:8080/resources` and disables CORS by default.

## Start development server

To start development server run: 

```
npm install
npm start
``` 

This runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Build example

To build example run:

```
npm install
npm run build
```

This builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Troubleshooting

In the case of compile error (`npm run build` or `npm start` fails) try to delete `node_modules` folder and `package-lock.json` file in example's folder and then build example or run development server as suggested above.
