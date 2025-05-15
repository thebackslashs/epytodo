/** @type {import('@hey-api/openapi-ts').UserConfig} */

import { defaultPlugins } from '@hey-api/openapi-ts';

export default {
  input: 'http://localhost:3000/openapi-specs.yaml',
  output: 'src/',
  plugins: [
    ...defaultPlugins,
    '@hey-api/client-fetch',
    {
      asClass: false,
      name: '@hey-api/sdk',
    },
  ],
};
