// @ts-check

const {createHash} = require('crypto');
const {readFileSync} = require('fs');

const screenshotHash = createHash('md5')
  .update(readFileSync('screenshot.png'))
  .digest('hex');

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
    },
    '/app': {
      kind: 'folder',
      dirname: 'dist/app',
      cacheControl: 'max-age=157680000', // 5 years
    },
    [`/app/screenshot.${screenshotHash}.png`]: {
      kind: 'file',
      filename: 'screenshot.png',
      binaryMediaType: 'image/png',
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
