import { Injectable } from '@/core';
import { DOCS_PATH, OPENAPI_SPECS_PATH } from '../constants/paths';
import { readFileSync } from 'node:fs';

@Injectable('MiscService')
export class MiscService {
  async getDocsFile(): Promise<Buffer> {
    return readFileSync(DOCS_PATH);
  }

  async getOpenApiSpecsFile(): Promise<Buffer> {
    return readFileSync(OPENAPI_SPECS_PATH);
  }
}
