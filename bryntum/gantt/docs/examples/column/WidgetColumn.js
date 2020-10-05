(function () {
const targetElement = document.querySelector('div[data-file="column/WidgetColumn.js"] .external-target');

// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

//START
// grid with WidgetColumn
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        {
            type    : 'widget',
            field   : 'city',
            text    : 'WidgetColumn',
            width   : 140,
            widgets : [{
                type    : 'button',
                cls     : 'b-raised',
                text    : 'Hello',
                onClick : ({ source : btn }) => {
                    const { record } = btn.cellInfo;
                    Toast.show(`Hello ${record.name} from ${record.city}`)
                }
            }]
        },
        {
            type    : 'widget',
            text    : 'Checkboxes',
            field   : 'field',
            width   : 140,
            widgets : [
                {
                    type     : 'checkbox',
                    onChange : ({ source : widget, checked }) => {
                        widget.cellInfo.record.set('field1', checked, true);
                    }
                },
                {
                    type     : 'checkbox',
                    onChange : ({ source : widget, checked }) => {
                        widget.cellInfo.record.set('field2', checked, true);
                    }
                },
                {
                    type     : 'checkbox',
                    onChange : ({ source : widget, checked }) => {
                        widget.cellInfo.record.set('field3', checked, true);
                    }
                }
            ]
        }
    ]
});
//END
})();
