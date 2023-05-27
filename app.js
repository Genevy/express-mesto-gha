const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/router');
const {
  createUserValidation,
  loginValidation,
} = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(auth);
app.use(router);
app.use(errors());

app.use((error, request, response, next) => {
  const {
    status = 500,
    message,
  } = error;
  response.status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение запущено в порте ${PORT}`);
});
