/* eslint-disable @typescript-eslint/no-explicit-any */

import express, {
  ErrorRequestHandler,
  Application as ExpressApplication,
} from 'express';
import { Container } from './container';
import { getMetadata } from './decorators/metadata.storage';
import { ApiError } from './errors';
import { ModuleConstructor } from './decorators/index';
import { createLogger, yellow } from '@/lib/logger';
import bodyParser from 'body-parser';

const RouterExplorerLogger = createLogger('RouterExplorer');
const ApplicationLogger = createLogger('Application');

export class Application {
  private app = express();
  private container = new Container();

  constructor(private readonly moduleClass: ModuleConstructor) {
    this.container.registerModule(moduleClass);
    this.app.use(bodyParser.json());
    this.app.use(((err, _req, res, next) => {
      if (
        err instanceof SyntaxError &&
        'status' in err &&
        err.status === 400 &&
        'body' in err
      ) {
        return res
          .status(400)
          .json({
            msg: 'Bad parameter',
          })
          .end();
      }
      next(err);
    }) as ErrorRequestHandler);

    this.setupRoutes();
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ msg: 'OK' }).end();
    });
  }

  private setupRoutes(): void {
    const controllers = this.container.getControllers();

    for (const controller of controllers) {
      this.setupControllerRoutes(controller);
    }
  }

  private setupControllerRoutes(controller: any): void {
    const controllerClass = controller.constructor;
    const prefix = getMetadata(controllerClass, 'prefix') || '';
    const routes = getMetadata(controllerClass, 'routes') || [];
    const logger = createLogger(`${controllerClass.name}Controller`);

    for (const route of routes) {
      this.setupRoute(controller, route, prefix, logger);
    }
  }

  private setupRoute(
    controller: any,
    route: any,
    prefix: string,
    logger: ReturnType<typeof createLogger>
  ): void {
    const {
      method,
      path,
      handlerName,
      status,
      contentType = 'application/json',
    } = route;
    const fullPath = this.buildFullPath(prefix, path);

    this.app[method.toLowerCase() as keyof ExpressApplication](
      fullPath,
      (req: express.Request, res: express.Response) => {
        this.handleRouteRequest(controller, handlerName, req, res, {
          method,
          fullPath,
          status,
          contentType,
          logger,
        });
      }
    );

    RouterExplorerLogger.info(
      `Mapped ${yellow(`{${method} ${fullPath}}`)} route`
    );
  }

  private buildFullPath(prefix: string, path: string): string {
    return `${prefix}${path !== '/' ? `/${path}` : ''}`.replace(/\/+/g, '/');
  }

  private handleRouteRequest(
    controller: any,
    handlerName: string,
    req: express.Request,
    res: express.Response,
    options: {
      method: string;
      fullPath: string;
      status: number;
      contentType: string;
      logger: ReturnType<typeof createLogger>;
    }
  ): void {
    try {
      const result = controller[handlerName](req, res);
      if (result instanceof Promise) {
        this.handlePromiseResponse(result, res, options);
      } else {
        this.handleSyncResponse(result, res, options);
      }
    } catch (err) {
      this.handleError(err, res, options);
    }
  }

  private handlePromiseResponse(
    promise: Promise<any>,
    res: express.Response,
    options: {
      method: string;
      fullPath: string;
      status: number;
      contentType: string;
      logger: ReturnType<typeof createLogger>;
    }
  ): void {
    const { method, fullPath, status, contentType, logger } = options;

    promise
      .then((data) => {
        logger.debug(
          `Promise Request ${method} ${fullPath} : \n${JSON.stringify(data, null, 2)}`
        );
        this.sendResponse(data, res, { status, contentType });
      })
      .catch((err) => {
        logger.debug(
          `Promise Error ${method} ${fullPath} : \n${JSON.stringify(err, null, 2)}`
        );
        this.handleError(err, res, options);
      });
  }

  private handleSyncResponse(
    result: any,
    res: express.Response,
    options: {
      method: string;
      fullPath: string;
      status: number;
      contentType: string;
      logger: ReturnType<typeof createLogger>;
    }
  ): void {
    const { method, fullPath, status, contentType, logger } = options;

    logger.debug(
      `Request ${method} ${fullPath} : \n${JSON.stringify(result, null, 2)}`
    );
    this.sendResponse(result, res, { status, contentType });
  }

  private sendResponse(
    data: any,
    res: express.Response,
    options: { status: number; contentType: string }
  ): void {
    const { status, contentType } = options;
    res.setHeader('Content-Type', contentType);

    if (Buffer.isBuffer(data)) {
      res.status(status).send(data).end();
    } else if (contentType === 'application/json') {
      res.status(status).json(data).end();
    } else {
      res.status(status).send(data).end();
    }
  }

  private handleError(
    err: any,
    res: express.Response,
    options: {
      method: string;
      fullPath: string;
      logger: ReturnType<typeof createLogger>;
    }
  ): void {
    const { method, fullPath, logger } = options;

    logger.debug(
      `Error ${method} ${fullPath} :\n${JSON.stringify(err, null, 2)}`
    );

    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ msg: err.message }).end();
    } else {
      logger.error(
        `Unhandled error in ${method} ${fullPath}: ${(err as Error).message}`
      );
      logger.debug(err as Error);
      res.status(500).json({ msg: 'Internal server error' }).end();
    }
  }

  private logListen(port: number): void {
    ApplicationLogger.info(
      `Application listening on port ${yellow(port.toString())}`
    );
  }

  listen(port: number): void {
    this.app.listen(port, () => this.logListen(port));
  }

  getApp(): ExpressApplication {
    return this.app;
  }
}
