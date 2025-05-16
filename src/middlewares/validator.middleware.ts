import { NextFunction, Request, Response } from 'express';
import { ValidationResult } from '@/lib/validator';
import { ApiError } from '@/core';

export function BodyValidatorMiddleware(
  schema: (data: unknown) => ValidationResult
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema(req.body);
    if (!result.valid) {
      throw new ApiError('Bad parameter', 400);
    }
    next();
  };
}

export function ParamsValidatorMiddleware(
  schema: (data: unknown) => ValidationResult
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema(req.params);
    if (!result.valid) {
      throw new ApiError('Bad parameter', 400);
    }
    next();
  };
}
