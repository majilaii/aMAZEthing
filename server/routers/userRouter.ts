import express from 'express';
const userRouter = express.Router();

import {
    checkRequiredPermissions,
    validateAccessToken,
  } from "../middleware/auth0.middleware.js";

const users = require('../controllers/user');
const avatars = require('../controllers/avatar');


// This route needs authentication
userRouter.post('/profile', validateAccessToken, users.getUserData);



export {userRouter};