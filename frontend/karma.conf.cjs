process.env.BABEL_ENV = 'test';
const webpackConfig = require('./webpack.test.config.cjs');

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