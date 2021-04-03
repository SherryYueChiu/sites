module.exports = {
    staticFileGlobs: [
        './',
        './img/**.*',
        './js/index.js',
        './js/allClass.js',
        './css/index.css',
        './index.html'
    ],
    runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'networkFirst'
    }],
    swFile: 'service-worker.js'
};