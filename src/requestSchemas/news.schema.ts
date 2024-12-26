import Joi from "joi";

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

export const getNewsByTopicSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page must be a number.",
    "number.min": "page must be at least 1.",
  }),
  pageSize: Joi.number().integer().min(1).default(10).messages({
    "number.base": "pageSize must be a number.",
    "number.min": "pageSize must be at least 1.",
  }),
  topics: Joi.string()
    .pattern(/^[a-zA-Z,]+$/)
    .messages({
      "string.pattern.base": "topics must be a comma-separated list",
    }),
});

export const getNewsByAuthorSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "page must be a number.",
    "number.min": "page must be at least 1.",
  }),
  pageSize: Joi.number().integer().min(1).default(10).messages({
    "number.base": "pageSize must be a number.",
    "number.min": "pageSize must be at least 1.",
  }),
  author: Joi.string().optional().messages({
    "string.pattern.base": "topics must be a comma-separated list",
  }),
});
