/* eslint-disable no-unused-vars */
import { defineConfig } from 'cypress';
import mochawesome from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  component: {
    supportFile: 'cypress/support/component.ts',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // mochawesome 리포터 설정
      mochawesome(on);

      // 기타 노드 이벤트 설정
    },
    baseUrl: 'http://localhost:5173', // 예시 URL
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true,
    },
    // 기타 설정 옵션
  },
});
