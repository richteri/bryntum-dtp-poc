const presets = [
    ['@babel/preset-env', {
        targets : [
            'defaults',
            'not IE 11'
        ],
        modules : false,
        corejs  : {
            version   : '3.4',
            proposals : true
        },
        useBuiltIns : 'usage'
    }]
];

module.exports = {
    presets
};
