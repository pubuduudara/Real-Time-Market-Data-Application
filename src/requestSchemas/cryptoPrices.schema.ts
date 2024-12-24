import Joi from "joi";

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
