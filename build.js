import autoprefixer from 'autoprefixer';
import * as esbuild from 'esbuild';
import {htmlPlugin} from 'esbuild-html-plugin';
import stylePlugin from 'esbuild-style-plugin';
import {rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import process from 'node:process';

const require = createRequire(import.meta.url);
const outdir = `dist`;
const nodeEnv = process.env.NODE_ENV ?? `production`;
const dev = nodeEnv !== `production`;

/** @type {import('esbuild').BuildOptions} */
const staticAppBuildOptions = {
  entryPoints: [{out: `app`, in: `src/index.tsx`}],
  entryNames: `[dir]/[name]-[hash]`,
  bundle: true,
  minify: !dev,
  sourcemap: dev,
  define: {
    'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
  },
  target: `es2022`,
  tsconfig: `tsconfig.base.json`,
  outdir: `${outdir}/static`,
  publicPath: `/static`,
  plugins: [
    stylePlugin({
      postcss: {
        // eslint-disable-next-line import/no-commonjs
        plugins: [require(`tailwindcss`), autoprefixer],
      },
    }),
    htmlPlugin({
      outfile: `index.html`,
      language: `en`,

      createHeadElements: (outputUrls) => [
        `<meta charset="utf-8" />`,
        `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
        `<title>bookmark.wtf</title>`,
        `<link rel="icon" href="/apple-touch-icon.png" />`,
        `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,

        ...outputUrls
          .filter((url) => url.endsWith(`.css`))
          .map((url) => `<link href="${url}" rel="stylesheet">`),
      ],

      createBodyElements: (outputUrls) => [
        `<main id="app"></main>`,

        `<script src="${outputUrls.find(
          (url) => url.includes(`app`) && url.endsWith(`.js`),
        )}" async></script>`,
      ],
    }),
  ],
};

/** @type {(handlerName: string) => import('esbuild').BuildOptions} */
function createLambdaBuildOptions(handlerName) {
  return {
    entryPoints: [{out: handlerName, in: `src/handlers/${handlerName}.ts`}],
    entryNames: `[dir]/[name]`,
    outExtension: {'.js': `.cjs`},
    platform: `node`,
    bundle: true,
    minify: !dev,
    sourcemap: dev,
    define: {
      'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
      'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    },
    target: `es2022`,
    tsconfig: `tsconfig.base.json`,
    outdir: `${outdir}/api`,
  };
}

const redirectLambdaBuildOptions = createLambdaBuildOptions(`redirect`);

if (process.argv.includes(`--watch`)) {
  await Promise.all([
    esbuild.context(staticAppBuildOptions).then((ctx) => ctx.watch()),
    esbuild.context(redirectLambdaBuildOptions).then((ctx) => ctx.watch()),
  ]);
} else {
  await rm(outdir, {recursive: true, force: true});

  await Promise.all([
    esbuild.build(staticAppBuildOptions),
    esbuild.build(redirectLambdaBuildOptions),
  ]);
}
