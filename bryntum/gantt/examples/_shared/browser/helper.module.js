//This JS script should be ES5 version compatible to work in old browsers
var
    match       = navigator.userAgent.match(/Edge?\/(\d+)\./),
    edgeVersion = match ? parseInt(match[1]) : 0;

window._isEdge = edgeVersion > 0 && edgeVersion < 80;
window._isIE11 = Boolean(navigator.userAgent.match(/rv:11/));

// Redirect to UMD bundle for browsers without module support and non-Chrome Edge browser
if (!/index\.umd\.html/.test(document.location.href)) {
    var
        moduleSupport = 'noModule' in HTMLScriptElement.prototype;
    if (!moduleSupport || window._isEdge || window._isIE11) {
        document.location = 'index.umd.html' + document.location.search;
    }
}

if (document.location.protocol === 'file:') {
    alert('WARNING: You should run examples on a Web server (not using the file: protocol)');
}
