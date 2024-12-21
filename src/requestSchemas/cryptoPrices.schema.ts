import Joi from "joi";

export const cryptoPricesSchema = Joi.object({
  tickers: Joi.string()
    .required()
    .pattern(/^[a-zA-Z,]+$/)
    .messages({
      "string.pattern.base":
        "tickers must be a comma-separated list of alphabets.",
    }),
  startDate: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "endDate must be in the format YYYY-MM-DD.",
    }),
  endDate: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .messages({
      "string.pattern.base": "endDate must be in the format YYYY-MM-DD.",
    }),
});
