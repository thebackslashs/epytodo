const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.ts',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js',
    library: {
      type: 'commonjs2',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
