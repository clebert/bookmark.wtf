// @ts-check

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

/**
 * @param {boolean} dev
 * @returns {import('webpack').Configuration}
 */
function createAppConfig(dev) {
  return {
    target: 'web',
    entry: {index: './src/index.tsx'},
    output: {
      filename: '[name].[contenthash].js',
      path: path.join(__dirname, 'dist/app'),
      publicPath: '/app/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: '[name].html',
        title: 'bookmark.wtf',
        template: './src/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.APP_BASE_URL': JSON.stringify(
          dev ? 'http://localhost:3000' : 'https://bookmark.wtf'
        ),
        'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        publicPath: '/app/',
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {loader: 'ts-loader', options: {transpileOnly: dev}},
          exclude: [/node_modules/],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {plugins: ['tailwindcss', 'autoprefixer']},
              },
            },
          ],
        },
      ],
    },
    resolve: {extensions: ['.js', '.json', '.ts', '.tsx']},
    devtool: dev ? 'eval-source-map' : 'source-map',
    optimization: {
      minimize: !dev,
      minimizer: ['...', new CssMinimizerPlugin()],
    },
  };
}

/**
 * @param {boolean} dev
 * @param {string} apiName
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
        'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
        'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
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

  process.env.NODE_ENV = dev ? 'development' : argv.mode;

  return [createAppConfig(dev), createLambdaConfig(dev, 'redirect')];
};
