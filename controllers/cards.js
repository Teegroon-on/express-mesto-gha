const { Card } = require('../models/card');
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require('../error-classes');

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const cardNew = await Card.create({ name, link, owner });
    res.status(201).send(cardNew);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Ошибка! Такая карточка не найдена');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Ошибка! Нельзя удалить чужую карточку');
      }
      return Card.findByIdAndRemove(cardId).then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Ошибка! Некорректные данные _id'));
        return;
      }
      next(err);
    });
}

async function dislikeCard(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Ошибка! Такая карточка не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Ошибка! Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function getAllCards(req, res, next) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

async function likeCard(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Ошибка! Такая карточка не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Ошбика! Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

module.exports = {
  createCard,
  deleteCard,
  dislikeCard,
  getAllCards,
  likeCard,
};
