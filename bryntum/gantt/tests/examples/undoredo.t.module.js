StartTest(t => {
    t.chain(
        { dblclick : '[data-task-id="11"]' },

        { type : 'foo[ENTER]' },

        { dblclick : '[data-task-id="11"]' },

        { type : 'foo' },

        { click : 'button:contains(Cancel)' }
    );
});
