(function() {
    const targetElement = document.querySelector('div[data-file="widget/Menu.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

    //START
    new Button({
        appendTo : targetElement,
        cls      : 'b-raised',
        text     : 'Show menu',
        onClick  : ({ source : btn }) => {
            const menu = btn.menu || (btn.menu = new Menu({
                forElement : btn.element,
                items      : [
                    {
                        icon : 'b-icon b-icon-add',
                        text : 'Add'
                    },
                    {
                        icon : 'b-icon b-icon-trash',
                        text : 'Remove'
                    },
                    {
                        icon     : 'b-icon b-icon-lock',
                        disabled : true,
                        text     : 'I am disabled'
                    },
                    {
                        text : 'Sub menu',
                        menu : [{
                            icon : 'b-icon b-fa-play',
                            text : 'Play'
                        }]
                    }
                ],
                // Method is called for all ancestor levels
                onItem({ item }) {
                    Toast.show('You clicked ' + item.text);
                }
            }));
            menu.show();
        }
    });
//END
})();
