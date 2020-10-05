/* eslint-disable */
let el = document.querySelector('.b-gantt-task-wrap');
let tip = gantt.features.taskTooltip.tooltip;

tip.activeTarget = el;
tip.updateContents();
tip.showBy(el);
// raise flag for thumb generator indicating page is ready for taking screenshot
window.__thumb_ready = true;
