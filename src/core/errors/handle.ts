import { ApiError } from './base';
import { Logger } from '@/lib/logger';
import { Response } from 'express';

export const handleError = (
  error: unknown,
  res: Response,
  logger: Logger
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).send({ msg: error.message });
  } else {
    logger.error('Unhandled error in middleware');
    logger.debug(error as Error);
    res.status(500).send({ msg: 'Internal server error' });
  }
};
