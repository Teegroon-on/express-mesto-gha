const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database on ${DATABASE_URL}`);
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(limiter);

app.use(requestLogger);

app.use(helmet());

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
