// @ts-check

/**
 * @type {import('aws-simple').ConfigFileDefaultExport}
 */
exports.default = () => ({
  hostedZoneName: `bookmark.wtf`,
  throttling: {burstLimit: 5, rateLimit: 10},
  monitoring: {loggingEnabled: true, metricsEnabled: true},
  routes: [
    {
      type: `file`,
      publicPath: `/`,
      path: `dist/app/index.html`,
      responseHeaders: {'cache-control': `no-store`},
    },
    {
      type: `file`,
      publicPath: `/*`,
      path: `dist/app/index.html`,
      responseHeaders: {'cache-control': `no-store`},
    },
    {
      type: `file`,
      publicPath: `/apple-touch-icon.png`,
      path: `src/apple-touch-icon.png`,
      responseHeaders: {'cache-control': `max-age=86400`}, // 24 hours
    },
    {
      type: `folder`,
      publicPath: `/app/*`,
      path: `dist/app`,
      responseHeaders: {'cache-control': `max-age=157680000`}, // 5 years
    },
    {
      type: `function`,
      httpMethod: `GET`,
      publicPath: `/api/get-title`,
      path: `dist/api/get-title.js`,
      functionName: `get-title`,
      memorySize: 1769, // At 1,769 MB, a function has the equivalent of one vCPU.
      timeoutInSeconds: 3,
      requestParameters: {url: {required: true}},
    },
    {
      type: `function`,
      httpMethod: `GET`,
      publicPath: `/api/redirect`,
      path: `dist/api/redirect.js`,
      functionName: `redirect`,
      timeoutInSeconds: 3,
      requestParameters: {code: {required: true}, state: {required: true}},
    },
  ],
});
