/**
 * @description This file is used to set up API Router handling HTTP Request
 */

const express = require('express');

const Loan = express.Router();

const { 
    AuthBorrowerMiddleware,
    AuthLenderMiddleware,
 } = require('./../interators/middlewares/AuthMiddlewares');

const {
    issueIdentityMiddleware,
    recoverUserCardMiddleware
} = require('./../interators/middlewares/BlockchainMiddlewares');

const {
    CreatingLoanController,
    CheckingRateController,
    GettingRestrictLoanController,
    GettingLoanDetailController,
    LenderGetWaitingLoanController
} = require('./../interators/controllers/LoanControllers');

//Borrowers API
Loan.post('/create', AuthBorrowerMiddleware, 
    issueIdentityMiddleware, recoverUserCardMiddleware, CreatingLoanController);

//Borrower Swipe refresh, history (status == clean) item, list
Loan.get('/me', AuthBorrowerMiddleware, 
    issueIdentityMiddleware, recoverUserCardMiddleware, GettingRestrictLoanController);

Loan.post('/rate', AuthBorrowerMiddleware, CheckingRateController);

//Lenders API
//Lender get filter waiting/success ==> List Loan Contract and Invest(Mock Data/Blockchain)
Loan.get('/current', AuthLenderMiddleware, 
    issueIdentityMiddleware, recoverUserCardMiddleware, GettingRestrictLoanController);

//Lender get invested waiting Loan
Loan.get('/invested/waiting', AuthLenderMiddleware, 
issueIdentityMiddleware, recoverUserCardMiddleware, LenderGetWaitingLoanController);

//Lender press item from above list ==> Settlement and Borrower Info
Loan.get('/details', AuthLenderMiddleware, 
    issueIdentityMiddleware, recoverUserCardMiddleware, GettingLoanDetailController);


module.exports = Loan;
