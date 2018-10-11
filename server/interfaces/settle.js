/**
 * @description This file contains all settlement Use Case for User (API Routes)
 */

const express = require('express');

const { 
    AuthMiddleware,
    AuthBorrowerMiddleware,
} = require('./../interators/middlewares/AuthMiddlewares');

const {
    issueIdentityMiddleware,
    recoverUserCardMiddleware
} = require('./../interators/middlewares/BlockchainMiddlewares');

const { 
    GettingSettlementController,
    SettledLoanContractController
} = require('./../interators/controllers/SettlementControllers');

const settle = express.Router();

settle.get('/', 
    AuthMiddleware,
    issueIdentityMiddleware,
    recoverUserCardMiddleware,
    GettingSettlementController
);
settle.post('/loan', 
    AuthBorrowerMiddleware,
    issueIdentityMiddleware,
    recoverUserCardMiddleware,
    SettledLoanContractController
);


module.exports = settle;
