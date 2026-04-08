const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: [
    {
      command: 'npm --prefix ../API start',
      url: 'http://127.0.0.1:3001/health',
      reuseExistingServer: true,
      timeout: 120000
    },
    {
      command: 'npm start',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: true,
      timeout: 120000
    }
  ]
});
