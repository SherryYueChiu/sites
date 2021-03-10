module.exports = {
    staticFileGlobs: [
        './',
        './app.js',
        './style.css',
        './index.html'
    ],
    runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'cacheFirst'
    }],
    swFile: 'sw-generated.js'
};