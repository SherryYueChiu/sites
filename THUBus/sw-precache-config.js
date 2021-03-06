module.exports = {
    staticFileGlobs: [
        './',
        './img/**.*',
        './js/index.js',
        './css/index.css',
        './index.html'
    ],
    runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'cacheFirst'
    }],
    swFile: 'sw-generated.js'
};