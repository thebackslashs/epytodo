import { client } from 'epytodo-sdk';

client.setConfig({
  baseUrl: process.env.BACKEND_API_URL,
});
