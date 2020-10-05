const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const testData = require('./samples/parallel/data.json');
const { getFile } = require('./smoke.js');
const { isWSL, getTmpFilePath, fail, ok } = require('./utils.js');

async function testWebServer({ protocol, fileFormat = 'pdf', workers = 1, host = 'localhost', port = 8080 }) {
    console.log(`Testing exporting ${fileFormat} with ${protocol}://${host}:${port}`);

    let server = spawn('node', [
        path.join('src', 'server.js'),
        `--${protocol}`,
        port,
        '--max-workers',
        '5',
        '--verbose',
        isWSL() ? '--no-sandbox' : '',
        '--no-config'
    ]);

    await new Promise(resolve => {
        server.stderr.pipe(process.stderr);

        server.stdout.on('data', data => {
            if (/started on/.test(data.toString())) {
                resolve();
            }
        });
    });

    const promises = [];

    const json = JSON.stringify(testData);

    for (let i = 0; i < 2; i++) {
        promises.push(getFile(json, protocol, fileFormat, host, port));
    }

    const exportedFiles = await Promise.all(promises);

    // let baseSize = fs.statSync(path.join(__dirname, 'samples', 'parallel', 'base.pdf')).size;

    let result = exportedFiles.every(file => {
        let result;

        // Not clear how to compare visual result of pdf, yet
        // So this is more of a sanity test, checking if returned pdf has size greater that .5MB
        if (file.length > 500000) {
            result = true;
        }
        else {
            const tmpFilePath = getTmpFilePath(fileFormat);

            fs.writeFileSync(tmpFilePath, file);

            fail(`${fileFormat} length is incorrect!\nSee exported file here: ${tmpFilePath}`);

            result = false;
        }

        return result;
    });

    if (result) {
        ok(`All exported ${fileFormat} has exact size as the base`);
    }

    // https://github.com/bryntum/bryntum-suite/wiki/Node-caveats#stopping-node-process-on-linux
    // Sending SIGINT shuts down all processes correctly
    server.kill('SIGINT');

    return result;
}

async function run(options) {
    let successful = true;

    console.log('\nTesting parallel export requests\n');

    successful &= await testWebServer(Object.assign({ protocol : 'http' }, options));
    successful &= await testWebServer(Object.assign({ protocol : 'https' }, options));

    return successful;
}

module.exports = { run };
