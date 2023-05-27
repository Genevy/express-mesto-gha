const cardSchema = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (request, response, next) => {
  cardSchema
    .find({})
    .then((cards) => response.status(200)
      .send(cards))
    .catch(next);
};

module.exports.createCard = (request, response, next) => {
  const {
    name,
    link,
  } = request.body;
  const owner = request.user._id;

  cardSchema
    .create({
      name,
      link,
      owner,
    })
    .then((card) => response.status(201)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data for card creation'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (request, response, next) => {
  const { cardId } = request.params;

  cardSchema.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('User not found');
      }
      if (!card.owner.equals(request.user._id)) {
        return next(new ForbiddenError('Card cannot be deleted'));
      }
      return card.deleteOne().then(() => response.send({ message: 'Card was deleted' }));
    })
    .catch(next);
};

module.exports.addLike = (request, response, next) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $addToSet: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('User not found');
      }
      response.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Incorrect data'));
      }
      return next(err);
    });
};

module.exports.deleteLike = (request, response, next) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $pull: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('User not found');
      }
      response.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Incorrect data'));
      }
      return next(err);
    });
};
