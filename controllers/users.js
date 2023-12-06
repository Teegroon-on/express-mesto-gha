const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const {
  ConflictError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} = require('../error-classes');

const SALT_LENGTH = 10;

async function createUser(req, res, next) {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH);
    let user = await User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    });
    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`Ошибка! Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Ошибка! Пользователь с таким email уже существует'));
      return;
    }
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Ошибка! Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError(`Ошибка! Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Ошибка! Неверные данные для входа');
    }
    const hasRightPassword = await bcrypt.compare(password, user.password);
    if (!hasRightPassword) {
      throw new UnauthorizedError('Ошибка! Неверные данные для входа');
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretkey',
      {
        expiresIn: '7d',
      },
    );
    res.send({ jwt: token });
  } catch (err) {
    next(err);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Ошибка! Неверные данные в запросе'));
      return;
    }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Ошибка! Неверные данные в запросе'));
      return;
    }
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  login,
  updateAvatar,
  updateUser,
  getCurrentUser,
};
