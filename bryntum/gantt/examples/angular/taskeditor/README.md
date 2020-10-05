# Taskeditor

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7

## Bryntum Shared Library
This example uses BryntumGantt wrapper that makes use of the Bryntum Scheduler easy because it turns it into an Angular component. This wrapper, widgets and assets are implemented in shared library.
 
Library package is located in `examples/angular/_shared` folder. 

This library is automatically installed and built during `npm install` for the example by `preinstall` script in `package.json` so it not required do it separately.    

To install and build it manually go to library folder and run:

```
npm install
npm run build
```

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
