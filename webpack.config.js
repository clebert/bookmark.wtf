// @ts-check

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const {appName, appUrl} = require('./aws-simple.config');

// https://github.com/settings/applications/1238959
const devClientId = '11fad4b65813aa89347e';
const devClientSecret = process.env.DEV_CLIENT_SECRET;

// https://github.com/settings/applications/1181805
const prodClientId = 'fae9329e8bd2e706c920';
const prodClientSecret = process.env.PROD_CLIENT_SECRET;

/**
 * @type {import('webpack').RuleSetRule}
 */
const babelLoader = {
  test: /\.tsx?$/,
  use: {loader: 'babel-loader'},
  exclude: [/node_modules/],
};

/**
 * @param {boolean} dev
 * @returns {import('webpack').Configuration}
 */
function createAppConfig(dev) {
  return {
    target: ['web', 'es2018'],
    entry: './src/index.tsx',
    output: {
      filename: 'app/index.[contenthash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'app/index.html',
        title: appName,
        template: './src/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.CLIENT_ID': JSON.stringify(
          dev ? devClientId : prodClientId
        ),
        'process.env.APP_NAME': JSON.stringify(appName),
        'process.env.APP_URL': JSON.stringify(
          dev ? 'http://localhost:3000' : appUrl
        ),
      }),
    ],
    module: {rules: [babelLoader]},
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
    target: ['node12', 'es2018'],
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
    module: {rules: [babelLoader]},
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
