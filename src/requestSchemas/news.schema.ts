import Joi from "joi";
//TODO: validation messages are vague
export const getAllNewsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page must be a number.",
    "number.min": "page must be at least 1.",
  }),
  pageSize: Joi.number().integer().min(1).default(10).messages({
    "number.base": "pageSize must be a number.",
    "number.min": "pageSize must be at least 1.",
  }),
});
