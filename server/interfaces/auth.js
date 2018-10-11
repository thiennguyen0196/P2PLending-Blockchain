/**
 * @description This file contains all authentication Use Case (API Routes)
 */

const express = require('express');

const { AuthMiddleware } = require('./../interators/middlewares/AuthMiddlewares');

const { 
    ConfirmController,
    SignInController,
    SignOutController,
    SignUpController
} = require('./../interators/controllers/AuthControllers');

const auth = express.Router();

auth.post('/signup', SignUpController);

auth.post('/confirm', ConfirmController);

auth.post('/signin', SignInController);

auth.delete('/signout', AuthMiddleware, SignOutController);

module.exports = auth;
