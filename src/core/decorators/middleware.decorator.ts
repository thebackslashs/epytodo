import { createLogger } from '@/lib/logger';
import { NextFunction, Request, Response } from 'express';
import { handleError } from '../errors/handle';

export const Middleware = (
  middleware: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>
) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      const logger = createLogger(`Middleware`);

      return new Promise((resolve, reject) => {
        try {
          const result = middleware(req, res, () => {
            try {
              resolve(originalMethod.call(this, req, res, next));
            } catch (error) {
              reject(error);
            }
          });

          if (result instanceof Promise) {
            result.then(resolve).catch((error) => {
              handleError(error, res, logger);
            });
          } else {
            resolve(result);
          }
        } catch (error) {
          handleError(error, res, logger);
        }
      });
    };
    return descriptor;
  };
};
