// @ts-check

import {
  editorconfig,
  eslint,
  git,
  github,
  ignore,
  javascript,
  jest,
  node,
  npm,
  preact,
  prettier,
  swc,
  typescript,
  vscode,
} from '@onecfg/standard';
import {mergeContent, onecfg} from 'onecfg';

onecfg(
  ...editorconfig(),
  ...eslint(),
  ...git(),
  ...github({omitReleaseStep: true}),
  ...ignore(`dist`),
  ...javascript({target: {ecmaVersion: `es2019`, moduleType: `es2020`}}),
  ...jest(),
  ...node({nodeVersion: `16`}),
  ...npm(),
  ...preact(),
  ...prettier(),
  ...swc(),
  ...typescript({sourceMap: true}),
  ...vscode({includeAllFiles: false}),

  mergeContent(eslint.ignoreFile, [`src/queries/types.d.ts`]),
  mergeContent(git.ignoreFile, [`.envrc`]),
  mergeContent(swc.configFile, {jsc: {externalHelpers: true}}),

  mergeContent(github.ciFile, {
    jobs: {
      ci: {
        'runs-on': `macos-latest`,
        'steps': [
          {
            name: `Run end-to-end tests on localhost`,
            env: {
              DEBUG: `pw:api`,
              CLIENT_ID: `\${{ secrets.DEV_CLIENT_ID }}`,
              CLIENT_SECRET: `\${{ secrets.DEV_CLIENT_SECRET }}`,
              E2E_TEST_ORIGIN: `http://localhost:3000`,
              E2E_TEST_LOGIN: `\${{ secrets.ITEST_LOGIN }}`,
              E2E_TEST_PASSWORD: `\${{ secrets.ITEST_PASSWORD }}`,
              E2E_TEST_SECRET: `\${{ secrets.ITEST_SECRET }}`,
            },
            run: `npm run build:dev && npx start-server-and-test 'npm start' 3000 'npm run e2e-test'`,
          },
          {
            name: `Deploy to AWS`,
            if: `\${{ github.ref == 'refs/heads/main' }}`,
            env: {
              CLIENT_ID: `\${{ secrets.PROD_CLIENT_ID }}`,
              CLIENT_SECRET: `\${{ secrets.PROD_CLIENT_SECRET }}`,
              AWS_REGION: `eu-central-1`,
              AWS_ACCESS_KEY_ID: `\${{ secrets.AWS_ACCESS_KEY_ID }}`,
              AWS_SECRET_ACCESS_KEY: `\${{ secrets.AWS_SECRET_ACCESS_KEY }}`,
            },
            run: `npm run deploy -- --require-approval never`,
          },
          {
            name: `Run end-to-end tests on bookmark.wtf`,
            if: `\${{ github.ref == 'refs/heads/main' }}`,
            env: {
              DEBUG: `pw:api`,
              E2E_TEST_ORIGIN: `https://bookmark.wtf`,
              E2E_TEST_LOGIN: `\${{ secrets.ITEST_LOGIN }}`,
              E2E_TEST_PASSWORD: `\${{ secrets.ITEST_PASSWORD }}`,
              E2E_TEST_SECRET: `\${{ secrets.ITEST_SECRET }}`,
            },
            run: `npm run e2e-test`,
          },
        ],
      },
    },
  }),
);
