StartTest(t => {
    t.chain(
        { waitForSelector : '.b-gantt-task' },
        
        next => {
            if (document.querySelector('.x-messagebox')) {
                t.click('.x-messagebox .x-button', next);
            }
            else {
                next();
            }
        },

        { click : '.b-add-task' },
        
        { waitFor : 1000 }
    );
});
