import path from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

/** Interactive storyboard dev server. Serves storyboard/ with the shared scene components. */
export default defineConfig({
  root: 'storyboard',
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [react()],
  // allowedHosts: the storyboard is reached over Tailscale by hostname; dev-only server
  server: {port: 8094, host: '0.0.0.0', strictPort: true, allowedHosts: true},
  resolve: {alias: {'@': path.resolve(__dirname, 'src')}},
});
