var tests = [
    'BryntumCoreTest',
    'BryntumGridTest',
    'BryntumSchedulerTest',
    'BryntumSchedulerProTest',
    'BryntumGanttData',
    'BryntumGanttTest'
];

// Run transpiled tests for IE11 and Edge 18
var old = (/MSIE \d|Trident.*rv:/.test(navigator.userAgent) || /Edge?\/18\./.test(navigator.userAgent));
if (old) {
    document.write('<script src="lib/polyfill.js"></script>');
}
tests.map(function(lib) {
    document.write('<script src="lib/' + lib + (old ? '.transpiled' : '') + '.js"></script>');
});
