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
 * @type {import('aws-simple').AppConfig}
 */
exports.default = {
  appName: appName.replace(/[^a-z]/g, ''),
  appVersion: 'latest',
  createStackConfig: () => {
    return {
      customDomainConfig: {
        certificateArn: process.env.CERTIFICATE_ARN,
        hostedZoneId: process.env.HOSTED_ZONE_ID,
        hostedZoneName: new URL(appUrl).hostname,
      },
      binaryMediaTypes: ['image/png'],
      minimumCompressionSizeInBytes: 1000,
      lambdaConfigs: [
        {
          httpMethod: 'GET',
          publicPath: `/api/redirect`,
          localPath: 'dist/api/redirect.js',
          memorySize: 128,
          loggingLevel: 'INFO',
          acceptedParameters: {code: {}, state: {}},
        },
      ],
      s3Configs: [
        {
          type: 'file',
          publicPath: '/',
          localPath: 'dist/app/index.html',
          bucketPath: 'app/index.html',
        },
        {
          type: 'file',
          publicPath: '/{proxy+}',
          localPath: 'dist/app/index.html',
          bucketPath: 'app/index.html',
        },
        {
          type: 'folder',
          publicPath: '/app',
          localPath: 'dist/app',
          bucketPath: '/app',
          responseHeaders: {cacheControl},
        },
        {
          type: 'file',
          publicPath: `/images/screenshot.${screenshotHash}.png`,
          localPath: 'screenshot.png',
          bucketPath: 'images/screenshot.png',
          responseHeaders: {cacheControl},
          binary: true,
        },
      ],
    };
  },
};
