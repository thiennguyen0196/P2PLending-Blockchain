/** 
 * @description This file contains all settlement functions 
 * 1. Get SettlementContract on HLFV1 for user
 * 2. Settled LoanContract for borrower
 */

const mongoose = require('mongoose');

const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Hyperledger = require('./../connectors/Hyperledger');
const Messages = require('./../../data/messages.json');
const { HTTPResponse } = require('./../adapters');
const { UserTxs } = require('./../../data/model/UserTransaction');

const GettingSettlementController = (req, res) => {
    const feature = Helpers.createFeature('getsettlement');

    const loanId = req.query.loanId;
    const { badReqCode, successResCode } = Constant;

    if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
        return HTTPResponse.sendError(res, badReqCode, Messages.loan.incorrectId);
    }

    return Hyperledger.findSettlementByLoanId(loanId)
        .then((settlementList) => {
            if (req.user.checkCategory(Constant.borrowerRegex)) {
                const subFeature = `${feature}${Constant.borrowerRegex}`;

                return HTTPResponse.sendData(res, subFeature, successResCode, null, settlementList);
            }
            const subFeature = `${feature}${Constant.lenderRegex}`;

            return HTTPResponse.sendData(res, subFeature, successResCode, null, settlementList);
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

const checkSettlementLoanConnected = (loanId, settledId) => {
    console.log('    ', 'checkSettlementLoanConnected');

    return Hyperledger.findSettlementByLoanId(loanId)
        .then((settlementList) => {
            if (!(settlementList && settlementList.length)) {
                return Promise.reject(Messages.loan.incorrectId);
            }

            const result = settlementList.some((item) => item.contractId === settledId 
                 && item.status === Constant.settlementStatus.due);

            if (!result) {
                return Promise.reject(Messages.settlement.incorrectId);
            }

            return Promise.resolve();
        })
        .catch(() => Promise.reject(Messages.loan.incorrectId));
};

const fullFillSettementLoanContract = (loanId, settledId) => {
    console.log('    ', 'fullFillSettementLoanContract');

    return Hyperledger.findSettlementByLoanId(loanId)
        .then((settlementList) => {
            const data = settlementList.find((item) => item.contractId === settledId 
                && item.status === Constant.settlementStatus.settled);
            const result = Helpers.findCurrentSettlementByStatus(settlementList,
                Constant.settlementStatus.undue);

            if (result < 0) {
                return Hyperledger.onFullFilledLoanContract(loanId, Constant.loanStatus.clean, 
                    Constant.investStatus.clean)
                    .then(() => Promise.resolve(data))
                    .catch((e) => Promise.reject(e));
            }

            return Promise.resolve(data);
        })
        .catch(() => Promise.reject(Messages.common.blockchainErr));
};

const SettledLoanContractController = (req, res) => {
    const feature = Helpers.createFeature('settledloan');

    const settledId = req.body.settledId;
    const loanId = req.body.loanId;
    const { badReqCode, successResCode } = Constant;
    let transaction;

    if (!settledId || !mongoose.Types.ObjectId.isValid(settledId)) {
        return HTTPResponse.sendError(res, badReqCode, Messages.settlement.incorrectId);
    }

    if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
        return HTTPResponse.sendError(res, badReqCode, Messages.loan.incorrectId);
    }

    return checkSettlementLoanConnected(loanId, settledId)
        .then(() => Hyperledger.settledLoanContract(req.user, settledId))
        .then((txData) => {
            transaction = txData;
            transaction.loanId = loanId;

            return UserTxs.checkExistByUserId(req.user._id)
                .then((existUserTx) => {
                    const newUserTx = new UserTxs({ userId: req.user._id });

                    if (existUserTx) {
                        return UserTxs.findByUserId(req.user._id);
                    }
        
                    return Promise.resolve(newUserTx);
                })
                .then((userTx) => userTx.addLastestTx(transaction))
                .then(() => fullFillSettementLoanContract(loanId, settledId))
                .catch((e) => Promise.reject(e));
        })
        .then((data) => {
            data.txId = transaction.txId;

            return HTTPResponse.sendData(res, feature, successResCode, null, data);
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

module.exports = {
    GettingSettlementController,
    SettledLoanContractController
};
