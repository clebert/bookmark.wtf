// @ts-check

const plugins = require('@onecmd/standard-plugins');
const deepmerge = require('deepmerge');
const nodeVersion = '16';

/** @type {import('onecmd').Plugin[]} */
module.exports = [
  plugins.babel(),
  plugins.editorconfig(),
  plugins.eslint(),
  plugins.git(),
  plugins.github({nodeVersion, omitReleaseStep: true, runner: 'macos-latest'}),
  plugins.jest({coverage: true}),
  plugins.node(nodeVersion),
  plugins.npm(),
  plugins.preact(),
  plugins.prettier(),
  plugins.typescript('web', 'bundle'),
  plugins.vscode({showFilesInEditor: false}),

  {
    sources: [
      {type: 'unknown', path: 'cdk.out'},
      {type: 'unknown', path: 'dist'},
      {type: 'unknown', path: 'src/queries/types.d.ts', versionable: true},
      {type: 'unknown', path: '.envrc', editable: true},
    ],
    dependencies: [
      {
        type: 'object',
        path: '.github/workflows/ci.yml',

        generate: (input) =>
          deepmerge(input, {
            jobs: {
              ci: {
                steps: [
                  {
                    name: 'Run end-to-end tests on localhost',
                    env: {
                      DEBUG: 'pw:api',
                      CLIENT_ID: '${{ secrets.DEV_CLIENT_ID }}',
                      CLIENT_SECRET: '${{ secrets.DEV_CLIENT_SECRET }}',
                      E2E_TEST_ORIGIN: 'http://localhost:3000',
                      E2E_TEST_LOGIN: '${{ secrets.ITEST_LOGIN }}',
                      E2E_TEST_PASSWORD: '${{ secrets.ITEST_PASSWORD }}',
                      E2E_TEST_SECRET: '${{ secrets.ITEST_SECRET }}',
                    },
                    run: 'npm run build:dev && (npm start &) && npm run e2e-test',
                  },
                  {
                    name: 'Deploy to AWS',
                    if: "${{ github.ref == 'refs/heads/main' }}",
                    env: {
                      CLIENT_ID: '${{ secrets.PROD_CLIENT_ID }}',
                      CLIENT_SECRET: '${{ secrets.PROD_CLIENT_SECRET }}',
                      AWS_REGION: 'eu-central-1',
                      AWS_ACCESS_KEY_ID: '${{ secrets.AWS_ACCESS_KEY_ID }}',
                      AWS_SECRET_ACCESS_KEY:
                        '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
                      CERTIFICATE_ARN: '${{ secrets.CERTIFICATE_ARN }}',
                      HOSTED_ZONE_ID: '${{ secrets.HOSTED_ZONE_ID }}',
                    },
                    run: 'npm run deploy -- --require-approval never',
                  },
                  {
                    name: 'Run end-to-end tests on bookmark.wtf',
                    if: "${{ github.ref == 'refs/heads/main' }}",
                    env: {
                      DEBUG: 'pw:api',
                      E2E_TEST_ORIGIN: 'https://bookmark.wtf',
                      E2E_TEST_LOGIN: '${{ secrets.ITEST_LOGIN }}',
                      E2E_TEST_PASSWORD: '${{ secrets.ITEST_PASSWORD }}',
                      E2E_TEST_SECRET: '${{ secrets.ITEST_SECRET }}',
                    },
                    run: 'npm run e2e-test',
                  },
                ],
              },
            },
          }),
      },
    ],
  },
];
