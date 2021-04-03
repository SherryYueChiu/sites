module.exports = {
    staticFileGlobs: [
        './',
        './img/**.*',
        './js/**.js',
        './css/**.css',
        './index.html'
    ],
    runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'networkFirst'
    }],
    swFile: 'service-worker.js'
};