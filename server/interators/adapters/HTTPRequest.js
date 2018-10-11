/**
 * @description This file contains the convention of HTTP Request to neccessary object
 */

const _ = require('lodash');

const Constant = require('./../../data/constant');

const convertReqBody = (feature, reqBody) => {
    let result;

    switch (feature) {
        case 'authMiddleware':
        case 'authLenderMiddleware':
        case 'authBorrowerMiddleware':
            result = reqBody.header(Constant.authTokenProp);
            break;
        case 'confirm':
            result = _.pick(reqBody, Constant.confirmReqRegex);
            break;
        case 'signin':
            result = _.pick(reqBody, Constant.signInReqRegex);
            break;
        case 'signup':
            result = _.pick(reqBody, Constant.signUpReqRegex);
            break;
        case 'createinfo':
        case 'updateinfo':
            result = _.pick(reqBody, Constant.userDetailReqRegex);
            break;
        case 'createloan':
        case 'checkloanrate':
            result = _.pick(reqBody, Constant.createLoanReqRegex);
            break;
        case 'getloan':
            if (reqBody.user.checkCategory(Constant.borrowerRegex)) {
                result = reqBody.query.status || Constant.loanStatus.current;
            } else {
                result = reqBody.query.status || Constant.loanStatus.waiting;
            }

            break;
        case 'getloandetail':
            result = reqBody.id || null;
            break;
        default:
            break;
    }

    return result;
};

module.exports = {
    convertReqBody
};
