process.env.BABEL_ENV = 'test';
const fs = require('fs');
const webpackConfig = require('./webpack.test.config.cjs');

// Detecta automáticamente Chrome, Brave o Microsoft Edge si no está definido CHROME_BIN
if (!process.env.CHROME_BIN) {
  const posiblesRutas = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    process.env.LOCALAPPDATA + '\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const ejecutable = posiblesRutas.find((ruta) => ruta && fs.existsSync(ruta));
  if (ejecutable) {
    process.env.CHROME_BIN = ejecutable;
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-coverage',
    ],
    files: [{ pattern: 'src/test/index.js', watched: false }],
    preprocessors: { 'src/test/index.js': ['webpack'] },
    webpack: webpackConfig,
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
  });
};