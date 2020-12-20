// @ts-check

const {createHash} = require('crypto');
const {readFileSync} = require('fs');
const packageJson = require('./package.json');

const appName = (exports.appName = packageJson.name);
const appUrl = (exports.appUrl = 'https://bookmark.wtf');

const screenshotHash = (exports.screenshotHash = createHash('md5')
  .update(readFileSync('./screenshot.png'))
  .digest('hex'));

const cacheControl = `max-age=${5 * 365 * 24 * 60 * 60}`; // 5 years

/**
 * @type {import('aws-simple').App}
 */
exports.default = {
  appName: appName.replace(/[^a-z]/g, ''),
  customDomain: {
    certificateArn: process.env.CERTIFICATE_ARN,
    hostedZoneId: process.env.HOSTED_ZONE_ID,
    hostedZoneName: new URL(appUrl).hostname,
  },
  routes: () => ({
    '/': {kind: 'file', filename: 'dist/app/index.html', catchAll: true},
    '/app': {kind: 'folder', dirname: 'dist/app', cacheControl},
    [`/images/screenshot.${screenshotHash}.png`]: {
      kind: 'file',
      filename: 'screenshot.png',
      binaryMediaType: 'image/png',
      cacheControl,
    },
    '/api/redirect': {
      kind: 'function',
      filename: 'dist/api/redirect.js',
      timeoutInSeconds: 3,
      parameters: {code: {}, state: {}},
    },
  }),
};
