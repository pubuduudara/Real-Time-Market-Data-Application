import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";

/**
 * Middleware to validate request data dynamically.
 * @param schema - Joi schema to validate against
 * @param target - The part of the request to validate (query, body, params)
 */
export const validateRequest = (
  schema: ObjectSchema,
  target: "query" | "body" | "params"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationResult = schema.validate(req[target], {
      abortEarly: false,
    });

    if (validationResult.error) {
      res.status(400).json({
        success: false,
        errors: validationResult.error.details.map((err) => ({
          message: err.message,
          field: err.context?.key,
        })),
      });
    } else {
      next();
    }
  };
};
