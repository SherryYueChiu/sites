module.exports = {
  staticFileGlobs: [
    './',
    './img/**.*',
    './app.js',
    './style.css',
    './index.html'
  ],
  runtimeCaching: [{
    urlPattern: /this\\.is\\.a\\.regex/,
    handler: 'networkFirst'
  }],
  swFile: 'sw-generated.js'
};