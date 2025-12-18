import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';

// ビルド後にファイルをコピーするプラグイン
function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      const outDir = 'PrivacyCleanup';

      // manifest.jsonをコピー
      copyFileSync(
        resolve(__dirname, 'public/manifest.json'),
        resolve(__dirname, outDir, 'manifest.json')
      );

      // iconsフォルダをコピー
      const iconsDir = resolve(__dirname, outDir, 'icons');
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }

      const srcIconsDir = resolve(__dirname, 'public/icons');
      if (existsSync(srcIconsDir)) {
        const icons = readdirSync(srcIconsDir);
        for (const icon of icons) {
          copyFileSync(
            resolve(srcIconsDir, icon),
            resolve(iconsDir, icon)
          );
        }
      }

      console.log('拡張機能ファイルのコピーが完了しました');
    },
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  base: './',  // Chrome拡張機能用に相対パスを使用
  build: {
    outDir: 'PrivacyCleanup',
    emptyDirBeforeWrite: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // バックグラウンドスクリプトは直接出力
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          // CSSファイルの名前を整理
          if (assetInfo.name?.endsWith('.css')) {
            return 'popup.css';
          }
          return '[name].[ext]';
        },
      },
    },
  },
});
