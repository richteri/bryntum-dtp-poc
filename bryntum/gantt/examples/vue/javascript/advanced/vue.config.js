module.exports = {
    publicPath: '',
    css: {
        sourceMap: true
    },
    transpileDependencies: [
        'bryntum-gantt'
    ],
    chainWebpack: (config) => {
        config.resolve.symlinks(false);
    }
};
