const cardRoutes = require('express')
  .Router();

const {
  getCards,
  deleteCard,
  createCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

const {
  createCardValidation,
  cardByIdValidation,
} = require('../middlewares/validation');

cardRoutes.get('/', getCards);
cardRoutes.post('/', createCardValidation, createCard);
cardRoutes.delete('/:cardId', cardByIdValidation, deleteCard);
cardRoutes.put('/:cardId/likes', cardByIdValidation, addLike);
cardRoutes.delete('/:cardId/likes', cardByIdValidation, deleteLike);

module.exports = cardRoutes;
