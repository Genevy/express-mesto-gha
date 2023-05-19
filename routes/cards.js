const cardRoutes = require('express')
  .Router();

const {
  getCards,
  deleteCard,
  createCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.post('/', createCard);
cardRoutes.put('/:cardId/likes', addLike);
cardRoutes.delete('/:cardId/likes', deleteLike);

module.exports = cardRoutes;
