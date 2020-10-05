/* eslint-disable no-unused-vars,no-undef */
(function() {
    const targetElement = document.querySelector('div[data-file="gantt/taskcontextmenu.js"] .external-target');
    
    // User may already have navigated away from the documentation part that shows the example
    if (!targetElement) return;
    
    targetElement.innerHTML = '<p>A basic grid with no extra configuration, this what you get straight out of the box</p>';
//START
// grid with basic configuration
    let grid = new Gantt({
        appendTo : targetElement,
        
        // makes grid as high as it needs to be to fit rows
        autoHeight : true,
        
        columns : [
            { type : 'name', field : 'name', text : 'Name' }
        ],
        
        features : {
            taskContextMenu : true
        },
        
        startDate : new Date(2019, 1, 4),
        endDate   : new Date(2019, 1, 11),
        
        tasks : [
            {
                id        : 1,
                name      : 'Project A',
                startDate : '2019-02-04',
                duration  : 5,
                expanded  : true,
                children  : [
                    {
                        id        : 11,
                        name      : 'Preparation work',
                        startDate : '2019-02-04',
                        duration  : 5
                    }
                ]
            }
        ]
    });
//END
})();
