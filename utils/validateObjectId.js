const mongoose = require('mongoose');

function validateObjectId(value) {
  const isValid = mongoose.isValidObjectId(value);
  if (isValid) return value;
  throw new Error('Ошибка! Идентификатор не валиден');
}

module.exports = { validateObjectId };
