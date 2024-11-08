/* eslint-disable no-unused-vars */
import { defineConfig } from 'cypress';
import mochawesome from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  projectId: 'qos6rs',
  component: {
    supportFile: 'cypress/support/component.ts',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      mochawesome(on);
    },
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/{e2e,component}/**/*.cy.{js,jsx,ts,tsx}',
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
