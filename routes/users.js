const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  updateAvatar,
  updateUser,
  getCurrentUser,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getAllUsers);
users.get('/me', getCurrentUser);

users.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

users.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
      ),
    }),
  }),
  updateAvatar,
);

module.exports = { users };
