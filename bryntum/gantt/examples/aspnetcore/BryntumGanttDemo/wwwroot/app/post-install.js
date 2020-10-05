/**
 * This script will resolve symlink by copying contents of the linked folder directly
 */
const { ncp } = require('ncp');
const path = require('path');

ncp.limit = 16;

new Promise((resolve, reject) => {
    ncp(
        path.join(__dirname, 'node_modules', 'bryntum-gantt'),
        path.join(__dirname, 'node_modules', '_bryntum-gantt'),
        { dereference : true },
        err => {
            if (err) {
                reject(err);
            }
            resolve();
        }
    );
})
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e.stack);
        process.exit(1);
    });
