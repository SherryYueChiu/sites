module.exports = {
  staticFileGlobs: [
    './',
    './img/**.*',
    './js/index.js',
    './css/index.css',
    './index.html'
  ],
  runtimeCaching: [{
    urlPattern: /this\\.is\\.a\\.regex/,
    handler: 'networkFirst'
  }],
  swFile: 'sw-generated.js'
};