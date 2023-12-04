const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const paramsValidationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
};

const cards = express.Router();
cards.get('/', getAllCards);
cards.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);

cards.delete('/:cardId', celebrate(paramsValidationConfig), deleteCard);
cards.put('/:cardId/likes', celebrate(paramsValidationConfig), likeCard);
cards.delete('/:cardId/likes', celebrate(paramsValidationConfig), dislikeCard);
module.exports = { cards };
