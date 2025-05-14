const path = require('path');

module.exports = {
  mode: 'production',
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
};
