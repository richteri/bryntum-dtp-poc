# PDF Export demo

This example shows the configuration of Bryntum Gantt with PDF export feature in Angular.

## Bryntum Shared Library
This example uses BryntumGantt wrapper that makes use of the Bryntum Gantt easy because it turns it into an Angular component. This wrapper, widgets and assets are implemented in shared library.
 
Library package is located in `examples/angular/_shared` folder. 

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
examples/angular/pdf-export$ cd ../../_shared/server/
examples/_shared/server$ npm install
examples/_shared/server$ node ./src/server.js -h 8080
```

### Loading resources

To export gantt to the PDF we collect HTML/styles on the client and send it to the server, which
launches headless puppeteer, open page and puts HTML directly to the page. It doesn't navigate for many
reasons, e.g. to avoid possible issues with login or routing. It means that if page refers to stylesheet or to resource via
`url()` inside the `<style>` tag, there would be no way for page to know where to load resource from.
For this reason we have to transform relative URLs to absolute ones.

Angular applications also may use routing, in which case resources are loaded relative to application root, while page URL
would be changing. For this reason we cannot rely on page URL, so it has to be configured additionally.

#### Dev mode
In dev mode all styles are loaded inside `<style>` tags and app itself is hosted on `localhost:4200`. It means that we need
to point all `url()` to correct URL, e.g.
``` 
font : url('myfont.eot') -> font : url('http://localhost:4200/myfont.eot')
```

Below config does just that
```
// ganttConfig.ts
pdfExport : {
    exportServer            : 'http://localhost:8080/',
    translateURLsToAbsolute : 'http://localhost:4200/',
    keepPathName            : false
}
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
// ganttConfig.ts
pdfExport : {
    exportServer            : 'http://localhost:8080/',
    translateURLsToAbsolute : 'http://localhost:8080/resources/', // Trailing slash is important!
    keepPathName            : false
}
```

Then run this:

```
// build for production
examples/angular/pdf-export$ npm run prod

// serve the app using `serve` npm package
examples/angular/pdf-export$ serve -l 8081 dist/pdf-export

// start the export server
examples/angular/pdf-export$ cd ../../_shared/server
examples/_shared/server$ node ./src/server.js -h 8080 -r ../../angular/pdf-export/dist/pdf-export
```

Serve doesn't disable CORS by default, which is required to load styles on our origin-less page. So we
rely on export server to provide resources. Last command makesit to host resources on the
address `http://localhost:8080/resources` and disables CORS by default.
 

## Start development server

To start development server run: 

```
npm install
npm start
``` 

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build example

To build example run:

```
npm install
npm run build
```

 The build artifacts will be stored in the `dist` directory.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Troubleshooting

In the case of compile error (`npm run build` or `npm start` fails) try to delete `node_modules` folder and `package-lock.json` file in example's folder and then build example or run development server as suggested above.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
