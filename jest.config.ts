import type { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s?$': [
      '@swc/jest',
      {
        $schema: 'https://json.schemastore.org/swcrc',
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
          },
          keepClassNames: true,
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
        },
        sourceMaps: 'inline',
      },
    ],
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!<rootDir>/src/main.(t|J)s',
    '!<rootDir>/src/**/*.dto.(t|J)s',
    '!<rootDir>/src/**/*.module.(t|J)s',
    '!<rootDir>/src/**/migrations/*',
    '!<rootDir>/src/app/@common/**/config/swagger.config.ts',
    '!<rootDir>/src/app/@common/**/documentations/**/*',
    '!<rootDir>/src/app/@common/**/prisma/prisma-database.adapter.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
} as Config.InitialOptions;
