// @ts-check

const std = require(`@onecmd/standard-plugins`);
const deepmerge = require(`deepmerge`);
const nodeVersion = `16`;

/** @type {readonly import('onecmd').Plugin[]} */
const plugins = [
  std.babel(),
  std.editorconfig(),
  std.eslint(),
  std.git(),
  std.github({nodeVersion, omitReleaseStep: true, runner: `macos-latest`}),
  std.jest({coverage: true}),
  std.node(nodeVersion),
  std.npm(),
  std.preact(),
  std.prettier(),
  std.typescript(`web`, `bundle`),
  std.vscode({showFilesInEditor: false}),

  {
    setup: () => [
      {
        type: `mod`,
        path: `.github/workflows/ci.yml`,
        is: std.isObject,

        update: (content) =>
          deepmerge(content, {
            jobs: {
              ci: {
                steps: [
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
                    run: `npm run build:dev && (npm start &) && npm run e2e-test`,
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
      },

      {type: `ref`, path: `.envrc`, attrs: {visible: true}},
      {type: `ref`, path: `cdk.out`},
      {type: `ref`, path: `dist`},

      {
        type: `ref`,
        path: `src/queries/types.d.ts`,
        attrs: {pretty: true, versioned: true, visible: true},
      },
    ],
  },
];

module.exports = plugins;
