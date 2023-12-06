const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Требуется ввести электронный адрес',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 6,
        message: 'Пароль должен состоять минимум из 6 символов',
      },
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Имя пользователя должно быть длиной от 2 до 30 символов',
      },
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Информация о пользователе должна быть длиной от 2 до 30 символов',
      },
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validator: {
        validate: /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
        message: 'Требуется ввести URL',
      },
    },
  },
  {
    versionKey: false,
  },
);

const User = mongoose.model('user', userSchema);

module.exports = { User };
