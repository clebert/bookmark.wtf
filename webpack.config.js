import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ResolveTypeScriptPlugin from 'resolve-typescript-plugin';
import webpack from 'webpack';

/**
 * @param {boolean} dev
 * @returns {import('webpack').Configuration}
 */
function createAppConfig(dev) {
  return {
    target: `web`,
    entry: {index: `./src/index.tsx`},
    output: {
      filename: `[name].[contenthash].js`,
      path: join(dirname(fileURLToPath(import.meta.url)), `dist/app`),
      publicPath: `/app/`,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: `[name].html`,
        title: `bookmark.wtf`,
        template: `./src/index.html`,
      }),
      new webpack.DefinePlugin({
        'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: `[file].map`,
        publicPath: `/app/`,
      }),
      new MiniCssExtractPlugin({filename: `[name].[contenthash].css`}),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {loader: `swc-loader`},
          exclude: [/node_modules/],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            `css-loader`,
            {
              loader: `postcss-loader`,
              options: {
                postcssOptions: {plugins: [`tailwindcss`, `autoprefixer`]},
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [`.js`, `.json`, `.ts`, `.tsx`],
      plugins: [new ResolveTypeScriptPlugin()],
    },
    devtool: dev ? `eval-source-map` : `source-map`,
    optimization: {
      minimize: !dev,
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
  };
}

/**
 * @param {string} apiName
 * @returns {import('webpack').Configuration}
 */
function createLambdaConfig(apiName) {
  return {
    target: `node`,
    node: {__dirname: false},
    entry: `./src/handlers/${apiName}.ts`,
    output: {
      filename: `api/${apiName}.cjs`,
      libraryTarget: `commonjs2`,
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
          use: {loader: `swc-loader`},
          exclude: [/node_modules/],
        },
      ],
    },
    resolve: {
      extensions: [`.js`, `.json`, `.ts`, `.tsx`],
      plugins: [new ResolveTypeScriptPlugin()],
    },
  };
}

/**
 * @type {(_env: unknown, argv: {readonly mode?: string}) => import('webpack').Configuration[]}
 */
export default (_env, argv) => {
  const dev = argv.mode !== `production`;

  process.env.NODE_ENV = dev ? `development` : argv.mode;

  return [
    createAppConfig(dev),
    createLambdaConfig(`redirect`),
    createLambdaConfig(`get-title`),
  ];
};
