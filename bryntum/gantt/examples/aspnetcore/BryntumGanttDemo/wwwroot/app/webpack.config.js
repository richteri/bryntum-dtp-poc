const
    path      = require('path'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
    {
        entry : {
            cruddemo : path.join(__dirname, 'app.js')
        },
        output : {
            library       : 'cruddemo',
            libraryTarget : 'umd',
            path          : path.join(__dirname, 'build'),
            filename      : 'cruddemo.js'
        },
        module : {
            rules : [
                {
                    test    : /\.js$/,
                    loader  : 'babel-loader',
                    exclude : /(node_modules(?!\/bryntum-gantt\/))/
                }
            ]
        }
    },
    {
        entry  : path.join(__dirname, 'resources', 'app.css'),
        output : {
            path     : path.join(__dirname, 'build'),
            filename : 'tmp'
        },
        module : {
            rules : [
                {
                    test : /\.(css|sass|scss)$/,
                    use  : [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test   : /\.(eot|svg|ttf|woff|woff2)$/,
                    loader : 'file-loader?name=fonts/[name].[ext]'
                },
                {
                    test    : /\.png$/,
                    loader  : 'file-loader',
                    options : {
                        name(resourcePath) {
                            if (resourcePath.match(/favicon.png/)) {
                                return 'favicon.png';
                            }
                            else {
                                return '[path][name].[ext]';
                            }
                        }
                    }
                }
            ]
        },
        plugins : [new MiniCssExtractPlugin({
            filename : 'cruddemo.css'
        })]
    }
];
