import { defineConfig } from '@rspack/cli';
import path from 'path';

export default defineConfig({
  mode: 'production', // ou "production", mais sans minification
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
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
