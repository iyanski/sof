/** @type {import('jest').Config} */
module.exports = {
    // Test environment
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    // Module name mapping for absolute imports
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@data/(.*)$': '<rootDir>/src/data/$1',
    },

    // Transform files
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react-jsx',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                module: 'commonjs',
                target: 'es2020',
                lib: ['es2020', 'dom'],
            },
        }],
    },

    // File extensions
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Test patterns
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
        '<rootDir>/src/**/*.(test|spec).(ts|tsx)',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/main.tsx',
        '!src/vite-env.d.ts',
        '!src/setupTests.ts',
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Coverage reporters
    coverageReporters: ['text', 'lcov', 'html'],

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks between tests
    restoreMocks: true,

    // Verbose output
    verbose: true,

    // Test timeout
    testTimeout: 10000,

    // Ignore patterns
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
    ],

    // Transform ignore patterns
    transformIgnorePatterns: [
        'node_modules/(?!(rsuite)/)',
    ],
}