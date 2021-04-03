module.exports = {
    staticFileGlobs: [
        './',
        './img/**.*',
        './app.js',
        './style.css',
        './index.html'
    ],
    runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'networkFirst'
    }],
    swFile: 'service-worker.js'
};