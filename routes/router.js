const router = require('express')
  .Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((request, response, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
