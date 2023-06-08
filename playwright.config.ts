import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: `./test`,
  forbidOnly: !!process.env.CI,
  reporter: `list`,
  use: {viewport: {width: 1024, height: 768}},
  projects: [
    {
      name: `setup-localhost`,
      testMatch: /.*\.setup\.ts/,
      use: {baseURL: `http://localhost:3000`},
    },
    {
      name: `setup-bookmark.wtf`,
      testMatch: /.*\.setup\.ts/,
      use: {baseURL: `https://bookmark.wtf`},
    },
    {
      name: `localhost`,
      dependencies: [`setup-localhost`],
      use: {
        ...devices[`Desktop Chrome`],
        baseURL: `http://localhost:3000`,
        storageState: `playwright/.auth/user.json`,
      },
    },
    {
      name: `bookmark.wtf`,
      dependencies: [`setup-bookmark.wtf`],
      use: {
        ...devices[`Desktop Chrome`],
        baseURL: `https://bookmark.wtf`,
        storageState: `playwright/.auth/user.json`,
      },
    },
  ],
  webServer: {
    command: `npm run start`,
    url: `http://localhost:3000`,
    reuseExistingServer: !process.env.CI,
  },
});
