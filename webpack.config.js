// @ts-check

const {createHash} = require('crypto');
const {readFileSync} = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

// https://github.com/settings/applications/1238959
const devClientId = '11fad4b65813aa89347e';
const devClientSecret = process.env.DEV_CLIENT_SECRET;

// https://github.com/settings/applications/1181805
const prodClientId = 'fae9329e8bd2e706c920';
const prodClientSecret = process.env.PROD_CLIENT_SECRET;

const screenshotHash = createHash('md5')
  .update(readFileSync('screenshot.png'))
  .digest('hex');

/**
 * @param {boolean} dev
 * @returns {import('webpack').Configuration}
 */
function createAppConfig(dev) {
  return {
    target: 'web',
    entry: './src/index.tsx',
    output: {
      filename: 'index.[contenthash].js',
      path: path.join(__dirname, 'dist/app'),
      publicPath: '/app/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        title: 'bookmark.wtf',
        template: './src/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.CLIENT_ID': JSON.stringify(
          dev ? devClientId : prodClientId
        ),
        'process.env.APP_NAME': JSON.stringify('bookmark.wtf'),
        'process.env.APP_BASE_URL': JSON.stringify(
          dev ? 'http://localhost:3000' : 'https://bookmark.wtf'
        ),
        'process.env.SCREENSHOT_HASH': JSON.stringify(screenshotHash),
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        publicPath: '/app/',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {loader: 'ts-loader', options: {transpileOnly: dev}},
          exclude: [/node_modules/],
        },
      ],
    },
    resolve: {extensions: ['.js', '.json', '.ts', '.tsx']},
    devtool: dev ? 'eval-source-map' : 'source-map',
  };
}

/**
 * @param {boolean} dev
 * @param {string} dev
 * @returns {import('webpack').Configuration}
 */
function createLambdaConfig(dev, apiName) {
  return {
    target: 'node',
    node: {__dirname: false},
    entry: `./src/handlers/${apiName}.ts`,
    output: {
      filename: `api/${apiName}.js`,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.CLIENT_ID': JSON.stringify(
          dev ? devClientId : prodClientId
        ),
        'process.env.CLIENT_SECRET': JSON.stringify(
          dev ? devClientSecret : prodClientSecret
        ),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {loader: 'ts-loader', options: {transpileOnly: dev}},
          exclude: [/node_modules/],
        },
      ],
    },
    resolve: {extensions: ['.js', '.json', '.ts', '.tsx']},
  };
}

/**
 * @type {(_env: unknown, argv: {readonly mode?: string}) => import('webpack').Configuration[]}
 */
module.exports = (_env, argv) => {
  const dev = argv.mode !== 'production';

  return [createAppConfig(dev), createLambdaConfig(dev, 'redirect')];
};
