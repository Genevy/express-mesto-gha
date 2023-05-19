const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((request, _response, next) => {
  request.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
