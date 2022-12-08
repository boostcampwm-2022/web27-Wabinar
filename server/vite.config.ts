import { config } from 'dotenv';
import { resolve } from 'path';

import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

config();

export default defineConfig({
  server: {
    port: Number(process.env.PORT),
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './index.ts',
      tsCompiler: 'esbuild',
    }),
  ],
  resolve: {
    alias: [
      { find: '@apis', replacement: resolve(__dirname, './apis') },
      { find: '@config', replacement: resolve(__dirname, './config') },
      { find: '@constants', replacement: resolve(__dirname, './constants') },
      { find: '@errors', replacement: resolve(__dirname, './errors') },
      { find: '@db', replacement: resolve(__dirname, './db') },
      {
        find: '@middlewares',
        replacement: resolve(__dirname, './middlewares'),
      },
      { find: '@utils', replacement: resolve(__dirname, './utils') },
      { find: '@socket', replacement: resolve(__dirname, './socket') },
    ],
  },
});
