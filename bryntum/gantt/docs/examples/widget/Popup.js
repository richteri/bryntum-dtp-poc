(function () {
    const targetElement = document.querySelector('div[data-file="widget/Popup.js"] .external-target');

    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;

//START
    // button that display a popup containing html
    new Button({
        appendTo : targetElement,
        cls      : 'b-raised',
        text     : 'Show html popup',
        style    : 'margin-right: .5em',
        onClick  : function(e) {
            const btn = e.source,
                    popup = btn.popup || (btn.popup = new Popup({
                    header     : 'A simple text Popup',
                    autoShow   : false,
                    centered   : true,
                    style      : 'width: 20em',
                    html       : `<p>Bacon ipsum dolor amet flank ribeye ham hock rump, 
                        alcatra pork belly pancetta leberkas bacon shoulder 
                        meatloaf ball tip pig. Tongue jerky meatloaf pancetta 
                        pork sirloin. Hamburger corned beef ball tip cupim 
                        sirloin frankfurter tri-tip. Swine kevin ham hock, 
                        drumstick flank pig shoulder shankle. Tri-tip pork 
                        chop fatback turducken pork salami. Tongue boudin 
                        salami flank bacon sirloin</p>`
                }));
            popup.show();
        }
    });

    // button that displays a popup containing widgets
    new Button({
        appendTo : targetElement,
        cls      : 'b-raised',
        text     : 'Show widget popup',
        onClick  : function(e) {
            const btn = e.source,
                popup = btn.popup || (btn.popup = new Popup({
                    header   : 'A Popup containing Widgets',
                    autoShow : false,
                    centered : true,
                    style    : 'width: 20em',
                    items    : [
                        // a text field
                        {
                            ref   : 'nameField',
                            type  : 'text',
                            label : 'Enter your name'
                        },
                        // and a button
                        {
                            type    : 'button',
                            cls     : 'b-raised',
                            text    : 'Greet',
                            onClick : () => {
                                Toast.show('Hello ' + popup.widgetMap.nameField.value);
                            }
                        }
                    ]
                }));
            popup.show();
        }
    });
//END
})();
