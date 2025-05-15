import { Controller, Get, Inject } from '@/core';
import { Request, Response } from 'express';
import { BasicAuthGuard } from '../guards/basic-auth.guard';
import { MiscService } from '../services/misc.service';

@Controller('/')
export default class MiscController {
  constructor(
    @Inject('BasicAuthGuard') private readonly basicAuthGuard: BasicAuthGuard,
    @Inject('MiscService') private readonly miscService: MiscService
  ) {}

  @Get('/docs', 200, 'text/html')
  async getDocs(req: Request, res: Response): Promise<Buffer> {
    await this.basicAuthGuard.guardIsAdmin(req, res);

    return await this.miscService.getDocsFile();
  }

  @Get('/openapi-specs.yaml', 200, 'text/yaml')
  async getOpenApiSpecs(): Promise<Buffer> {
    return await this.miscService.getOpenApiSpecsFile();
  }
}
