export default {
  testMatch: [`**/src/**/*.e2e-test.ts`],
  testTimeout: 30000,
  verbose: true,
  extensionsToTreatAsEsm: [`.ts`, `.tsx`],
  moduleNameMapper: {'^(\\.{1,2}/.*)\\.js$': `$1`},
  transform: {'^.+\\.tsx?$': [`@swc/jest`]},
};
