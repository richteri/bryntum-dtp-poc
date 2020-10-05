Ext.define('Bryntum.Compat', {
    override : 'Ext.dom.Element'
},
function(Element) {
    var eventMap = Element.prototype.eventMap;

    if (eventMap) {
        // Since 5.1.0, Ext JS has preferred webkit* vendor prefix for these. In the
        // past both webkitTransitionEnd and the standard transitionend event would be
        // fired, but in Chrome 79 (though the change was likely earlier), this is no
        // longer true. Since Bryntum Core requires the standard event, it is fair to
        // simply remove these from the mapping used by Ext JS (it will then use the
        // standard events as well):
        delete eventMap.transitionend;
        delete eventMap.animationstart;
        delete eventMap.animationend;
    }
});
