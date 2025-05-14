import { defineConfig } from '@rspack/cli';
import rspack from '@rspack/core';
import path from 'path';

const __dirname = path.resolve();

export default defineConfig({
  mode: 'development', // ou "production", mais sans minification
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  decorators: true,
                },
                transform: {
                  decoratorMetadata: true,
                  // désactiver minification
                  react: {
                    refresh: true,
                  },
                },
                target: 'es2020',
              },
            },
          },
        ],
      },
    ],
  },
  stats: {
    warnings: false,
  },
  infrastructureLogging: {
    level: 'none',
  },
});
