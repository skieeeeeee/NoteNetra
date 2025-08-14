import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps 'components' to 'src/components', etc.
      // It mirrors the 'baseUrl: "./src"' in jsconfig.json
      'components': path.resolve(__dirname, './src/components'),
      'config': path.resolve(__dirname, './src/config'),
      'contexts': path.resolve(__dirname, './src/contexts'),
      'pages': path.resolve(__dirname, './src/pages'),
      'styles': path.resolve(__dirname, './src/styles'),
      'utils': path.resolve(__dirname, './src/utils'),
      // Add other top-level directories in src if they are used as aliases
    },
  },
});
