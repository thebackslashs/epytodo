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
  }

  private setupRoutes(): void {
    const controllers = this.container.getControllers();

    for (const controller of controllers) {
      const controllerClass = controller.constructor;
      const prefix = getMetadata(controllerClass, 'prefix') || '';
      const routes = getMetadata(controllerClass, 'routes') || [];

      const logger = createLogger(`${controllerClass.name}Controller`);

      for (const route of routes) {
        const { method, path, handlerName, status } = route;

        const fullPath = `${prefix}${path !== '/' ? `/${path}` : ''}`.replace(
          /\/+/g,
          '/'
        );

        this.app[method.toLowerCase() as keyof ExpressApplication](
          fullPath,
          (req: express.Request, res: express.Response) => {
            try {
              const result = controller[handlerName](req, res);
              if (result instanceof Promise) {
                result
                  .then((data) => {
                    logger.debug(
                      `Promise Request ${method} ${fullPath} : \n${JSON.stringify(data, null, 2)}`
                    );
                    res.status(status).json(data).end();
                  })
                  .catch((err) => {
                    logger.debug(
                      `Promise Error ${method} ${fullPath} : \n${JSON.stringify(err, null, 2)}`
                    );
                    if (err instanceof ApiError) {
                      res
                        .status(err.statusCode)
                        .json({ msg: err.message })
                        .end();
                    } else {
                      logger.error(
                        `Promise Unhandled error in ${method} ${fullPath}: ${err.message}`
                      );
                      logger.debug(err);
                      res
                        .status(500)
                        .json({ msg: 'Internal server error' })
                        .end();
                    }
                  });
              } else {
                logger.debug(
                  `Request ${method} ${fullPath} : \n${JSON.stringify(result, null, 2)}`
                );
                res.status(status).json(result).end();
              }
            } catch (err) {
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
          }
        );

        RouterExplorerLogger.info(
          `Mapped ${yellow(`{${method} ${fullPath}}`)} route`
        );
      }
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
