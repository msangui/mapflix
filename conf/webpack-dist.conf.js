const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');
const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.(css|scss)$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?minimize!sass-loader!postcss-loader'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    FailPlugin,
    new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    }),
    new ExtractTextPlugin('index-[contenthash].css'),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer]
      }
    })
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    filename: '[name]-[hash].js'
  },
  entry: {
    app: `./${conf.path.src('index')}`,
    vendor: Object.keys(pkg.dependencies).filter(dep => [
      'express',
      'mongodb',
      'crawler',
      'serve-static',
      'config',
      '@types/classnames',
      '@types/react',
      '@types/react-addons-test-utils',
      '@types/react-dom',
      '@types/react-redux',
      '@types/react-router',
      'autoprefixer',
      'babel-core',
      'babel-eslint',
      'babel-loader',
      'babel-plugin-istanbul',
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-es2015-spread',
      'babel-plugin-transform-object-rest-spread',
      'babel-polyfill',
      'babel-preset-es2015',
      'babel-preset-react',
      'browser-sync',
      'browser-sync-spa',
      'css-loader',
      'del',
      'es6-shim',
      'eslint',
      'eslint-config-xo-react',
      'eslint-config-xo-space',
      'eslint-loader',
      'eslint-plugin-babel',
      'eslint-plugin-react',
      'extract-text-webpack-plugin',
      'gulp',
      'gulp-filter',
      'gulp-hub',
      'gulp-nodemon',
      'gulp-sass',
      'gulp-util',
      'html-webpack-plugin',
      'http-proxy-middleware',
      'jasmine',
      'json-loader',
      'karma',
      'karma-coverage',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-phantomjs-launcher',
      'karma-phantomjs-shim',
      'karma-webpack',
      'node-sass',
      'phantomjs-prebuilt',
      'postcss-loader',
      'react-addons-test-utils',
      'react-hot-loader',
      'sass-loader',
      'style-loader',
      'webpack',
      'webpack-dev-middleware',
      'webpack-fail-plugin',
      'webpack-hot-middleware'
    ].indexOf(dep) === -1)
  }
};
