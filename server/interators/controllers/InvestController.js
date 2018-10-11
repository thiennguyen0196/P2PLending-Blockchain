/** 
 * @description This file contains all invest functions 
 * 1. Creating InvestingContract on HLFV1
 */
const mongoose = require('mongoose'); 

const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Hyperledger = require('./../connectors/Hyperledger');
const Messages = require('./../../data/messages.json');
const { HTTPResponse } = require('./../adapters');
const { UserTxs } = require('./../../data/model/UserTransaction');

const checkInvestCondition = (lender, loanId) => {
    console.log('    ', 'checkInvestCondition');

    return Hyperledger.findInvestByStatus(lender, Constant.investStatus.fail_transfer)
        .then((invest) => {
            if (invest && invest.length > 0) {
                return Promise.reject(`${Messages.invest.penalty}${invest[0].contractId}`);
            }

            return Hyperledger.existInvestOnLoan(lender, loanId);
        })
        .then((result) => {
            if (result) {
                return Promise.reject(Messages.invest.existInvest);
            }

            return Promise.resolve();
        }) 
        .catch((e) => Promise.reject(e));
};

const checkLoanCondition = (lender, loanId) => {
    console.log('    ', 'checkLoanCondition');

    return Hyperledger.findOwerAndLoanById(lender, loanId)
        .then((data) => {
            if (!(data && data.loan)) {
                return Promise.reject(Messages.invest.missingLoan);
            }
            if (data.loan.status !== Constant.loanStatus.waiting) {
                return Promise.reject(Messages.invest.incorrectLoan);
            }

            return Promise.resolve(data);
        })
        .catch((e) => Promise.reject(e));
};

const handleFullFilledLoan = (borrowerId, loanData) => {
    const { contractId, info } = loanData;
    const investStatus = Constant.investStatus.success;
    const loanStatus = Constant.loanStatus.success;
    let transaction;

    return Hyperledger.createSettlementContract(borrowerId, contractId, info.periodMonth)
        .then((txData) => {
            transaction = txData;

            return UserTxs.checkExistByUserId(borrowerId)
                .then((existUserTx) => {
                    const newUserTx = new UserTxs({ userId: borrowerId });

                    if (existUserTx) {
                        return UserTxs.findByUserId(borrowerId);
                    }
        
                    return Promise.resolve(newUserTx);
                })
                .then((userTx) => userTx.addLastestTx(transaction))
                .then(() => Hyperledger.createInvestingFeeContract(contractId, info.periodMonth))
                .catch((e) => Promise.reject(e));
        })
        .then(() => Hyperledger.onFullFilledLoanContract(contractId, investStatus, loanStatus))
        .then(() => Promise.resolve())
        .catch(() => Promise.reject(Messages.common.blockchainErr));
};

const CreatingInvestController = (req, res) => {
    const feature = Helpers.createFeature('createinvest');

    const lender = req.user;
    const loanId = req.body.loanId.toString();   
    const { badReqCode, successResCode } = Constant;
    let newInvestId;
    let loanData;
    let loanOwner;
    let transaction;

    if (!loanId || !mongoose.Types.ObjectId.isValid(loanId)) {
        return HTTPResponse.sendError(res, badReqCode, Messages.loan.incorrectId);
    }

    return checkLoanCondition(lender, loanId)
        .then((data) => {
            loanData = data.loan;
            loanOwner = data.owner;
            
            return checkInvestCondition(lender, loanId);
        })
        .then(() => Hyperledger.createInvestContract(lender, loanData))
        .then((txData) => {
            transaction = txData;

            return UserTxs.checkExistByUserId(lender._id)
                .then((existUserTx) => {
                    const newUserTx = new UserTxs({ userId: lender._id });

                    if (existUserTx) {
                        return UserTxs.findByUserId(lender._id);
                    }
        
                    return Promise.resolve(newUserTx);
                })
                .then((userTx) => userTx.addLastestTx(transaction))
                .then(() => {
                    newInvestId = txData.investId;
        
                    return Hyperledger.calculateInvestedNotes(loanId);
                })
                .catch((e) => Promise.reject(e));
        })
        .then((investedNotes) => {
            let totalNotes = 0; 

            if (process.env.NODE_ENV && !process.env.NOTES) {
                totalNotes = loanData.totalNotes;
            } else {
                const a = Number(loanData.totalNotes);
                const b = Number.parseInt(process.env.NOTES, 10);

                totalNotes = Math.min(a, b);
            }

            console.log(totalNotes, investedNotes);

            if (investedNotes === totalNotes) {
                return handleFullFilledLoan(loanOwner, loanData);
            }

            return Promise.resolve();
        })
        .then(() => Hyperledger.findInvestById(lender, newInvestId))
        .then((data) => {
            data.loanId = loanId;
            data.txId = transaction.txId;

            return HTTPResponse.sendData(res, feature, successResCode, null, data);
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

const GettingSummaryController = (req, res) => {
    const feature = Helpers.createFeature('getsummarysuccess');
    const lender = req.user;
    const { badReqCode, successResCode } = Constant;

	return Hyperledger.findInvestByStatus(lender, Constant.investStatus.success)
        .then((invest) => {
            if (invest && invest.length > 0) {
                return UserTxs.findByUserId(lender._id)
                    .then((userTx) => {
                        const data = invest.map((item) => {
                            item.txId = userTx.findTxByloanId(item.loanId).id;

                            return item;
                        });

                        return HTTPResponse.sendData(res, feature, successResCode, null, data);
                    })
                    .catch((e) => Promise.reject(e));
            }

            return HTTPResponse.sendData(res, feature, successResCode, null, invest);
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

module.exports = {
    CreatingInvestController,
    GettingSummaryController
};
