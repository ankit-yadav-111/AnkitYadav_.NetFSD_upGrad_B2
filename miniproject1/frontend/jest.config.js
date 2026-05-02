// ============================================================
// jest.config.js
// Purpose : Jest configuration for the Employee Management
//           System test suite.
// ============================================================

module.exports = {
    // Run tests in Node environment
    testEnvironment: 'node',

    // Look for tests only inside the tests/ directory
    testMatch: [
        '**/tests/**/*.test.js'
    ],

    // Display individual test results verbosely
    verbose: true
};
