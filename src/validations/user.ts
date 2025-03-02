import Joi from 'joi';
import joiDate from '@joi/date';
import { StatusCode } from '../types/response';
import { Response } from 'express';
import { ResponseUtils } from '../utils/reponse';

const joi = Joi.extend(joiDate);
const reservedWords = ['admin', 'support', 'null'];

const authValidations = {
  async register(payload: any, res: Response) {
    const schema = joi.object({
      username: joi
        .string()
        .min(4)
        .max(30)
        .invalid(...reservedWords)
        .pattern(/^[^\s-_.]*$/)
        .required()
        .messages({
          'string.min': 'Username must be at least 4 characters long.',
          'string.max': 'Username must not exceed 30 characters.',
          'any.invalid': 'Username cannot be a reserved word.',
          'string.pattern.base': 'Username must not contain "_", ".", or "-"',
          'any.required': 'Username is required!',
        }),

      email: joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required!',
      }),

      password: joi.string().min(8).max(30).required().messages({
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must not exceed 30 characters.',
        'any.required': 'Password is required!',
      }),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return ResponseUtils.error(res, error.details[0].message, StatusCode.BAD_REQUEST);
    }
    return true;
  },

  async login(payload: any, res: Response) {
    const schema = joi.object({
      email: joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required!',
      }),
      password: joi.string().required().messages({
        'any.required': 'Password is required!',
      }),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return ResponseUtils.error(res, error.details[0].message, StatusCode.BAD_REQUEST);
    }
    return true;
  },

  async forgotPassword(payload: any, res: Response) {
    const schema = joi.object({
      email: joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required!',
      }),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return ResponseUtils.error(res, error.details[0].message, StatusCode.BAD_REQUEST);
    }
    return true;
  },

  async resetPassword(payload: any, res: Response) {
    const schema = Joi.object({
      token: Joi.string().required().messages({ 'any.required': 'Token is required!' }),
      newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'New password is required!',
      }),
    });

    const { error } = schema.validate(payload);
    if (error) {
      return ResponseUtils.error(res, error.details[0].message, StatusCode.BAD_REQUEST);
    }
    return true;
  },
};

export default authValidations;
