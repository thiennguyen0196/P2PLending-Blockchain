/**
 * @description This file contains all investment Use Case for Lenders (API Routes)
 */

const express = require('express');

const { AuthLenderMiddleware } = require('./../interators/middlewares/AuthMiddlewares');

const {
    issueIdentityMiddleware,
    recoverUserCardMiddleware
} = require('./../interators/middlewares/BlockchainMiddlewares');

const { 
    CreatingInvestController,
    GettingSummaryController
} = require('./../interators/controllers/InvestController');

const invest = express.Router();

invest.post('/create', 
    AuthLenderMiddleware,
    issueIdentityMiddleware,
    recoverUserCardMiddleware,
    CreatingInvestController
);

invest.get('/summary/success',
    AuthLenderMiddleware,
    issueIdentityMiddleware,
    recoverUserCardMiddleware,
    GettingSummaryController
);

module.exports = invest;
