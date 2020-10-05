# Rendering and styling
Gantt is styled using SASS (scss). It ships with both compiled CSS bundles for its five themes and the original scss files.
You can also programmatically modify the appearance of cells, headers and task bars using "renderer" methods.

**Note:** Trial version has no SASS and Themes. You need the fully licensed version to be able to follow the instructions below.

## Using a theme

Gantt ships with five themes, stockholm, default, light, dark and material. Each theme is compiled into a self containing
bundle under build/. Simply include it on your page to use it (don't forget the id!):

```html
<link rel="stylesheet" href="build/gantt.stockholm.css" id="bryntum-theme">
<link rel="stylesheet" href="build/gantt.default.css" id="bryntum-theme">
<link rel="stylesheet" href="build/gantt.light.css" id="bryntum-theme">
<link rel="stylesheet" href="build/gantt.dark.css" id="bryntum-theme">
<link rel="stylesheet" href="build/gantt.material.css" id="bryntum-theme">
```

If you are using a build process based on WebPack or similar, depending on your setup you might also be able to include
the themes using `import`:

```javascript
import 'build/gantt.stockholm.css';
```

Comparison of themes:

<div class="image-row">
    <img src="resources/images/theme-stockholm.png" alt="Stockholm theme" style="max-width : 512px"><img src="resources/images/theme-default.png" alt="Default theme" style="max-width : 512px"><img src="resources/images/theme-light.png" alt="Light theme" style="max-width : 512px"><img src="resources/images/theme-dark.png" alt="Dark theme" style="max-width : 512px"><img src="resources/images/theme-material.png" alt="Material theme" style="max-width : 512px">
</div>

In most of the included examples you can switch theme on the fly by clicking on the info icon found in the header and
then picking a theme in the dropdown.

## Creating a theme

To create your own theme, follow these steps:

1. Make a copy of an existing theme found under resources/sass/themes, for example light.scss
2. Edit the variables in it to suit your needs (you can find all available variables by looking in resources/sass/variables.scss)
3. Compile it to CSS and bundle it using your favorite SASS compiler/bundler
4. Include your theme on your page (and remove any default theme you where using)

## Using renderers and CSS

For performance reasons, scheduled task elements are reused when scrolling, meaning that you should not manipulate them
directly. Instead the contents of cells, headers and tasks can be customized using renderers. Renderers are functions
with access to a cell/header/tasks data (such as style and CSS classes, and in some cases elements). They can
manipulate the data to alter appearances or return a value to have it displayed.

For more information, see the [theme](../examples/theme) demo or check API docs for:
* [Cell renderer](#Grid/column/Column#config-renderer)
* [Header renderer](#Grid/column/Column#config-headerRenderer)
* [Task renderer](#Gantt/view/Gantt#config-taskRenderer)
