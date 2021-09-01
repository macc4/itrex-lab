import { StatusCodes } from 'http-status-codes';
import factory from './handler.factory.js';
import userService from '../services/user.service.js';

const createUser = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not defined! Please, use /signup instead.',
  });
};

const getAllUsers = factory.getAll(userService);
const getUser = factory.getOne(userService);
const deleteUser = factory.deleteOne(userService);

export default { createUser, getUser, getAllUsers, deleteUser };
