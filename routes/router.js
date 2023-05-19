const router = require('express')
  .Router();

const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', (request, response) => {
  response.status(404)
    .send({ message: '404: Not Found' });
});

module.exports = router;
