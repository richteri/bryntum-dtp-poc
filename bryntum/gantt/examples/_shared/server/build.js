const { exec } = require('pkg');
const Downloader = require('./downloader.js');
const path = require('path');
const copy = require('recursive-copy');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const moveFile = require('move-file');
const fs = require('fs');

const downloadPath = path.join(__dirname, './build/server/chromium');
const buildPath = path.join(__dirname, './build/server');
const binDir = path.join(__dirname, './bin');

let build = function () {

    console.log('Start build');

    return new Promise(async (resolve, reject) => {
        let downloader = new Downloader(downloadPath);
        let revision = Downloader.defaultRevision();
        let platforms = downloader.supportedPlatforms();

        await mkDir(downloadPath);

        for (let i = 0; i < platforms.length; i++) {
            let canDownload = await downloader.canDownloadRevision(platforms[i], revision);
            if (canDownload) {
                let targetBinDir = path.join(binDir,  platforms[i].includes('win') ? 'win' : platforms[i]);

                console.log('Download puppeteer for ' + platforms[i]);
                await downloader.downloadRevision(platforms[i], revision);
                console.log('Download puppeteer for ' + platforms[i] + ' completed');
                await mkDir(path.join(targetBinDir,'/chromium'));

                let chromiumTarget = path.join(targetBinDir, '/chromium/' + platforms[i] + '-' + revision);
                await rmDir(chromiumTarget);

                console.log('Move puppeteer executable to os target');
                await moveFile(path.join(downloadPath, platforms[i] + '-' + revision), chromiumTarget);

                await rmDir(path.join(targetBinDir, 'cert'));

                console.log('Copy https certificates to os target destination');
                await copy(path.join(__dirname, './src/cert'), path.join(targetBinDir, 'cert'))
                    .catch(function(error) {
                        console.error('Copy failed: ' + error);
                    });
            }
        }

        console.log('Clean up download path');
        await rmDir(downloadPath);

        createExecutables().then(async result => {
            fs.readdir(buildPath, function (err, files) {
                if (err) throw err;
                files.forEach(async (file) => {

                    let target = '';
                    if (file.includes('linux'))
                        target = 'linux';

                    if (file.includes('macos'))
                        target = 'mac';

                    if (file.includes('win'))
                        target = 'win';

                    console.log('Move server executable to os target destination');
                    if (target)
                        await moveFile(path.join(buildPath, file), path.join(binDir, target + '/server' + (target === 'win' ? '.exe' : '')));
                });
            });

            console.log('Executables created');
            await rmDir(path.join(buildPath, '..'));
            resolve();
        });

    });
};

let createExecutables = async function () {
   console.log('Create server executables');
   await exec(['./src/server.js', '--out-path','./build/server'])
};

let mkDir = function (dir) {
    return new Promise((resolve, reject) => {
        mkdirp(dir, function (err) {
            if (err) reject(err);
            else resolve()
        });
    })
};

let rmDir = function(dir) {
    return new Promise((resolve, reject) => {
        rimraf(dir, resolve);
    });
};

build().then(() => console.log('Build finished successfully!'));


