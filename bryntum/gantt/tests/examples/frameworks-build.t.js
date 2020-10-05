import AjaxHelper from '../../lib/Core/helper/AjaxHelper.js';

StartTest(t => {
    t.it('Check for frameworks build-error.log should be empty', async t => {
        await AjaxHelper.fetch(`../.temp/build-error.log`).then(async response => {
            if (response.status === 200) {
                t.fail(`Frameworks build-error.log has errors`);
                const
                    errTxt = await response.text();
                errTxt.split('\n').forEach(txt => t.fail(txt));
            }
            else {
                t.pass('No build-error.log');
            }
        });
    });
});
