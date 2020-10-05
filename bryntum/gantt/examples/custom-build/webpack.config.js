const path = require('path');

module.exports = {
    mode   : 'development',
    entry  : './src/index.js',
    output : {
        path     : path.resolve(__dirname, 'dist'),
        filename : 'bundle.js'
    },
    performance : {
        hints : false
    },
    module : {
        rules : [
            {
                test    : /\.js$/,
                loader  : 'babel-loader',
                options : {
                    presets : [
                        ['@babel/preset-env', { targets : { chrome : '70' } }]
                    ]
                }
            }
        ]
    },
    resolve : {
        modules : [path.resolve(__dirname, 'node_modules')]
    }
};
