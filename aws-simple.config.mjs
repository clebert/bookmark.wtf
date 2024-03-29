/** @type {import('aws-simple').ConfigFileDefaultExport} */
export default () => ({
  hostedZoneName: `bookmark.wtf`,
  terminationProtectionEnabled: true,
  routes: [
    {
      type: `file`,
      publicPath: `/*`,
      path: `dist/static/index.html`,
      responseHeaders: {'cache-control': `no-store`},
    },
    {
      type: `file`,
      publicPath: `/apple-touch-icon.png`,
      path: `apple-touch-icon.png`,
      responseHeaders: {'cache-control': `max-age=86400`}, // 24 hours
    },
    {
      type: `folder`,
      publicPath: `/static/*`,
      path: `dist/static`,
      responseHeaders: {'cache-control': `max-age=157680000`}, // 5 years
    },
    {
      type: `function`,
      httpMethod: `GET`,
      publicPath: `/api/redirect`,
      path: `dist/api/redirect.cjs`,
      functionName: `redirect`,
      timeoutInSeconds: 3,
      environment: {NODE_OPTIONS: `--enable-source-maps`},
      requestParameters: {code: {required: true}, state: {required: true}},
      throttling: {burstLimit: 5, rateLimit: 10},
    },
  ],
});
