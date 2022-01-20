// @ts-check

/**
 * @type {import('aws-simple').App}
 */
exports.default = {
  appName: 'bookmarkwtf',
  customDomain: {
    certificateArn: process.env.CERTIFICATE_ARN,
    hostedZoneId: process.env.HOSTED_ZONE_ID,
    hostedZoneName: 'bookmark.wtf',
  },
  throttling: {
    burstLimit: 0,
    rateLimit: 10,
  },
  routes: () => ({
    '/': {
      kind: 'file',
      filename: 'dist/app/index.html',
      catchAll: true,
      responseHeaders: {'Cache-Control': 'no-store'},
    },
    '/apple-touch-icon.png': {
      kind: 'file',
      filename: 'src/apple-touch-icon.png',
      binaryMediaType: 'image/png',
      responseHeaders: {'Cache-Control': 'max-age=86400'}, // 24 hours
    },
    '/app': {
      kind: 'folder',
      dirname: 'dist/app',
      responseHeaders: {'Cache-Control': 'max-age=157680000'}, // 5 years
    },
    '/api/get-title': {
      kind: 'function',
      filename: 'dist/api/get-title.js',
      memorySize: 1769, // At 1,769 MB, a function has the equivalent of one vCPU.
      timeoutInSeconds: 3,
      parameters: {url: {required: true}},
    },
    '/api/redirect': {
      kind: 'function',
      filename: 'dist/api/redirect.js',
      timeoutInSeconds: 3,
      parameters: {code: {required: true}, state: {required: true}},
    },
  }),
};
