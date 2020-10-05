/**
 * Angular pdf-export demo test
 */
describe('Test buttons', function(t) {

    t.it('Header button click must not throw exception', (t) => {

        t.chain(

            { click: '.b-button:contains(Export)'},

            { waitForSelector : '.b-button:contains(Cancel)'},

            { click: '.b-button:contains(Cancel)'}
        );

    }); 

}); 
