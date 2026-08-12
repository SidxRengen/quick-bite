import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', setupFiles: './test/setup.js', fileParallelism: false, coverage: { reporter: ['text', 'html'], include: ['src/**/*.js'], exclude: ['src/server.js', 'src/scripts/**'] } } });
