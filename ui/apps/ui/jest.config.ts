/* eslint-disable */
export default {
  displayName: 'ui',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  coverageDirectory: '../../coverage/apps/ui',
  transform: {
    // Inlines templateUrl templates, so components can be rendered
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      { stringifyContentPathRegex: '\\.(html|svg)$' },
    ],
  },
  // lodash-es ships ES modules only
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|lodash-es)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
