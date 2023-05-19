const httpConstants = require('http2').constants;

const userSchema = require('../models/user');

module.exports.getUsers = (request, response) => {
  userSchema
    .find({})
    .then((users) => response.send(users))
    .catch(() => response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Default error' }));
};

module.exports.getUserById = (request, response) => {
  const { userId } = request.params;

  userSchema
    .findById(userId)
    .orFail()
    .then((user) => response.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Bad Request' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return response.status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: 'User with _id cannot be found' });
      }

      return response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Default error' });
    });
};

module.exports.createUser = (request, response) => {
  const {
    name,
    about,
    avatar,
  } = request.body;

  userSchema
    .create({
      name,
      about,
      avatar,
    })
    .then((user) => response.status(201)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data to create user' });
      } else {
        response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Default error' });
      }
    });
};

module.exports.updateUser = (request, response) => {
  const {
    name,
    about,
  } = request.body;

  userSchema
    .findByIdAndUpdate(
      request.user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => response.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data to update user' });
      }

      return response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Default error' });
    });
};

module.exports.updateAvatar = (request, response) => {
  const { avatar } = request.body;

  userSchema
    .findByIdAndUpdate(
      request.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => response.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        response.status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Invalid data to update avatar' });
      } else {
        response.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Default error' });
      }
    });
};
