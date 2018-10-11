/**
 * @description This file contains some useful middleware Functions for Loan API
 */

const Constant = require('./../../data/constant');
const Hyperledger = require('./../connectors/Hyperledger');
const { HTTPResponse } = require('./../adapters');

const issueIdentityMiddleware = (req, res, next) => {
   if (!req.user.checkHLConnected()) {
        let userSecret;

        Hyperledger.issueIdentity(req.user, req.userDetail)
            .then((data) => {
                userSecret = data.userSecret;
                
                return Hyperledger.importParticipantCardStore(data, null);
            })
            .then(() => Hyperledger.getClientCredentials(req.user._id))
            .then((credentials) => req.user.connectHLIdentity(userSecret, 
                credentials.certificate, credentials.privateKey))
            .then(() => next())
            .catch((e) => HTTPResponse.sendError(res, Constant.serverErrCode, e));
    } else {
        next();
    }     
};

const recoverUserCard = (userData) => {
    if (userData.checkHLConnected()) { 
        return Hyperledger.checkUserCardExist(userData._id)
            .then((res) => {
                if (!res) {
                    const data = {
                        userID: userData._id.toString(),
                        userSecret: userData.connectedHL
                    };

                    const credentials = {
                        certificate: userData.certificateHL,
                        privateKey: userData.privateKey
                    };
        
                    return Hyperledger.importParticipantCardStore(data, credentials);
                }

                return Promise.resolve();
            })
            .then(() => Promise.resolve())
            .catch((e) => Promise.reject(e));
    }

    return Promise.resolve();
};

/*eslint-disable arrow-body-style */
const recoverUserCardMiddleware = (req, res, next) => {
    return recoverUserCard(req.user)
        .then(() => next())
        .catch((e) => HTTPResponse.sendError(res, Constant.serverErrCode, e));
};

module.exports = {
    issueIdentityMiddleware,
    recoverUserCard,
    recoverUserCardMiddleware
};
