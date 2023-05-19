const httpConstants = require('http2').constants;
const cardSchema = require('../models/card');

module.exports.getCards = (request, response) => {
  cardSchema
    .find({})
    .then((cards) => response.status(200)
      .send(cards))
    .catch((err) => response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: err.message }));
};

module.exports.deleteCard = (request, response) => {
  const { cardId } = request.params;

  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return response.status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found: Invalid _id' });
      }

      return response.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Card with _id cannot be found' });
      } else {
        response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.createCard = (request, response) => {
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
        response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data for card creation' });
      } else {
        response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: err.message });
      }
    });
};

module.exports.addLike = (request, response) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $addToSet: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return response.status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found: Invalid _id' });
      }

      return response.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data to add like' });
      }

      return response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.deleteLike = (request, response) => {
  cardSchema
    .findByIdAndUpdate(
      request.params.cardId,
      { $pull: { likes: request.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return response.status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Not found: Invalid _id' });
      }

      return response.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data to delete like' });
      }

      return response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
