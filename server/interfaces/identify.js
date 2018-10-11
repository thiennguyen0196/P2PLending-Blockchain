
/**
 * @description This file contains all identify Use Case (API Routes)
 */

const express = require('express');

const Constant = require('./../data/constant');

const { AuthMiddleware } = require('./../interators/middlewares/AuthMiddlewares');

const {
    CalculateScoreMiddleware,
    EvaluateUserImageMiddleware,
    HandleImgMiddleware
} = require('./../interators/middlewares/IdentifyMiddleware');

const {
    CreateUserInfoController,
    GetUserInfoController,
    GetUserImgController,
    UpdateUserInfoController,
} = require('./../interators/controllers/IdentifyControllers');

const Identify = express.Router();

Identify.post('/user', 
    AuthMiddleware,
    HandleImgMiddleware.array(Constant.imageRegex, Constant.reqImgFiles),
    EvaluateUserImageMiddleware,
    CalculateScoreMiddleware,
    CreateUserInfoController
);

Identify.get('/user/me', AuthMiddleware, GetUserInfoController);

Identify.get('/user/image/:name', AuthMiddleware, GetUserImgController);

Identify.patch('/user/me', 
    AuthMiddleware, 
    HandleImgMiddleware.array(Constant.imageRegex, Constant.reqImgFiles),
    EvaluateUserImageMiddleware,
    CalculateScoreMiddleware,
    UpdateUserInfoController
);

module.exports = Identify;
