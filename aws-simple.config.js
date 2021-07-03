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
  routes: () => ({
    '/': {
      kind: 'file',
      filename: 'dist/app/index.html',
      catchAll: true,
      cacheControl: 'no-store',
    },
    '/apple-touch-icon.png': {
      kind: 'file',
      filename: 'src/apple-touch-icon.png',
      binaryMediaType: 'image/png',
      cacheControl: 'max-age=86400', // 24 hours
    },
    '/app': {
      kind: 'folder',
      dirname: 'dist/app',
      cacheControl: 'max-age=157680000', // 5 years
    },
    '/api/redirect': {
      kind: 'function',
      filename: 'dist/api/redirect.js',
      timeoutInSeconds: 3,
      parameters: {code: {required: true}, state: {required: true}},
    },
  }),
};
