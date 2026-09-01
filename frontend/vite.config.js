import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  plugins: [
    {
      name: 'copy-src-assets',
      closeBundle() {
        const srcDir = resolve(__dirname, 'src/assets');
        const destDir = resolve(__dirname, 'dist/src/assets');
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
        console.log('✅ Successfully copied src/assets into dist/src/assets');
      }
    }
  ]
});
