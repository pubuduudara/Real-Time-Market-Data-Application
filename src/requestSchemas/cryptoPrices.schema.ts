import Joi from "joi";

/**
 * Schema for validating crypto prices query parameters.
 *
 * The schema defines the following fields:
 * - `tickers`: An optional comma-separated list of ticker symbols (only alphabets allowed).
 * - `startDate`: A required string representing the start date in the format `YYYY-MM-DD`.
 * - `endDate`: An optional string representing the end date in the format `YYYY-MM-DD`.
 * - `page`: An optional integer specifying the page number for pagination (minimum value: 1, default: 1).
 * - `pageSize`: An optional integer specifying the number of items per page (minimum value: 1, default: 10).
 */

export const cryptoPricesSchema = Joi.object({
  tickers: Joi.string()
    .optional()
    .pattern(/^[a-zA-Z,]+$/)
    .messages({
      "string.pattern.base":
        "tickers must be a comma-separated list of alphabets.",
    }),
  startDate: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "startDate must be in the format YYYY-MM-DD.",
    }),
  endDate: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "endDate must be in the format YYYY-MM-DD.",
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page must be a number.",
    "number.min": "page must be at least 1.",
  }),
  pageSize: Joi.number().integer().min(1).default(10).messages({
    "number.base": "pageSize must be a number.",
    "number.min": "pageSize must be at least 1.",
  }),
});
