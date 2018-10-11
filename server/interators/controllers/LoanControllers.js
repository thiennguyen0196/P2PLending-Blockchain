

/** 
 * @description This file all loan function 
 * 1. Checking Rate for Loan Application
 * 2. Create Loan in HLFV1 platform
 */
const mongoose = require('mongoose'); 
const Bluebird = require('bluebird');

const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Hyperledger = require('./../connectors/Hyperledger');
const Messages = require('./../../data/messages.json');
const { HTTPRequest, HTTPResponse } = require('./../adapters');
const { UserTxs } = require('./../../data/model/UserTransaction');

const checkLoanData = (loanData) => {
    const { minPeriod, minCapital, maxPeriod, maxCapital } = Constant;

    const { periodMonth, capital, willing, maturityDate } = loanData;

    if (!periodMonth || periodMonth < minPeriod || periodMonth > maxPeriod) {
        return Messages.loan.incorrectMonth;
    }

    if (!capital || capital < minCapital
            || capital > maxCapital) {
        return Messages.loan.incorrectCapital;
    }

    if (!maturityDate) {
        return Messages.loan.incorrectMaturityDate;
    }

    if (!willing) {
        return Messages.loan.incorrectWilling;
    }

    return true;
};

const CheckingRateController = (req, res) => {
    const feature = Helpers.createFeature('checkloanrate');

    const loanData = HTTPRequest.convertReqBody(feature, req.body);
    const loanConditionMsg = checkLoanData(loanData);
    const resBody = { loanData, userDetail: req.userDetail };

    if (loanConditionMsg !== true) {
        return HTTPResponse.sendError(res, Constant.badReqCode, loanConditionMsg);
    }

    return HTTPResponse.sendData(res, feature, Constant.successResCode, null, resBody);
};

const CreatingLoanController = (req, res) => {
    const feature = Helpers.createFeature('createloan');

    const { badReqCode, successResCode } = Constant;
    const borrower = req.user;
    const borrowerDetails = req.userDetail;
    const loanData = HTTPRequest.convertReqBody(feature, req.body);
    let transaction;

    const loanConditionMsg = checkLoanData(loanData);
    if (loanConditionMsg !== true) {
        return HTTPResponse.sendError(res, Constant.badReqCode, loanConditionMsg);
    }

    return Hyperledger.existCurrentLoanContract(borrower)
        .then((existLoan) => {
            if (existLoan) {
                return Promise.reject(Messages.loan.existLoan);
            }

            return Hyperledger.updateParticipantData(borrower, borrowerDetails);
        })
        .then(() => Hyperledger.createLoanContract(borrower, borrowerDetails, loanData))
        .then((txData) => {
            transaction = txData;

            return UserTxs.checkExistByUserId(borrower._id)
                .then((existUserTx) => {
                    const newUserTx = new UserTxs({ userId: borrower._id });

                    if (existUserTx) {
                        return UserTxs.findByUserId(borrower._id);
                    }
        
                    return Promise.resolve(newUserTx);
                })
                .then((userTx) => userTx.addLastestTx(transaction))
                .catch((e) => Promise.reject(e));
        })
        .then(() => Hyperledger.findLoanByStatus(borrower, Constant.loanStatus.waiting))
        .then((loan) => {
            const data = loan[0];
            const investingDateArr = Array(Constant.investingStageDay + 1)
                .fill(0).map((date, index) => {
                    const startDate = new Date(data.info.createdDate);

                    startDate.setDate(startDate.getDate() + index);
                    startDate.setHours(0);
                    startDate.setMinutes(0);
                    startDate.setSeconds(0);
                    startDate.setMilliseconds(0);
            
                    return startDate;
                });

            data.txId = transaction.txId;

            return Hyperledger.calculateInvestedNotesByDate(data.contractId, investingDateArr)
                .then(payload => {
                    data.investedNotes = payload.investedNotes;
                    data.investedDate = payload.investedNotesByDate;
                
                    return HTTPResponse.sendData(res, feature, successResCode, null, data);
                })
                .catch(e => Promise.reject(e));
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

const restrictReadLoanDataByStatus = (lender, loanData, status) => {
    /*eslint-disable arrow-body-style*/
    
    if (status === Constant.loanStatus.waiting) {
        return Bluebird.filter(loanData, (item) => {
            return Hyperledger.existInvestOnLoan(lender, item.contractId)
                .then((result) => !(result && item.status === Constant.loanStatus.waiting));
        });
    }
    
    return Bluebird.filter(loanData, (item) => {
        return Hyperledger.existInvestOnLoan(lender, item.contractId)
            .then((result) => !(!result && item.status === status));
    });
};

//Lender Bottom Tab 2 => List<LoanContract-calculateInvestedNote>
//Lender Bottom Tab 1 - Screen 2 => List<LoanContract-InvestContract>
const LenderGetRestrictLoanController = (res, user, loanList, status) => {
    const feature = Helpers.createFeature('getloanlender');

    const { successResCode } = Constant;
    const data = {};
    
    return restrictReadLoanDataByStatus(user, loanList, status)
        .then(loanData => {
            if (loanData && loanData.length) {
                //Lender Bottom Tab 2 - Invest
                if (status === Constant.loanStatus.waiting) {
                    return Promise.all(loanData.map((item) => {
                            const loan = Object.assign(item);
        
                            return Hyperledger.calculateInvestedNotes(loan.contractId)
                                .then(investedNotes => {
                                    loan.investedNotes = investedNotes;
                                
                                    return loan;
                                });    
                            })
                        );
                }
                //Lender Bottom Tab 1 - Screen 2 - Success Invest
                if (status === Constant.loanStatus.success) {
                    const loanIds = loanData.map((item) => item.contractId);

                    return Hyperledger.findInvestByLoanIds(user, loanIds)
                        .then(investData => {
                            data.invest = investData;

                            return UserTxs.findByUserId(user._id)
                                .then((userTx) => {
                                    const tmp = loanData.map((item) => {
                                        item.txId = userTx.findTxByloanId(item.contractId).id;

                                        return item;
                                    });

                                    return Promise.resolve(tmp);
                                })
                                .catch((e) => Promise.reject(e));
                        });
                }

                return Promise.resolve(loanData);
            } 

            return Promise.resolve([]);
        })
        .then((loan) => {
            data.loan = loan;

            return HTTPResponse.sendData(res, feature, successResCode, null, data);
        })
        .catch((e) => Promise.reject(e));
};

const BorrowerGetLoanController = (res, borrower, loanList) => {
    const feature = Helpers.createFeature('getloanborrower');

    const { successResCode, investingStageDay } = Constant;
    const data = {};
    const investedDate = [];

    if (loanList[0].status === Constant.loanStatus.waiting) {
        return Promise.all(loanList.map((item) => {
            const loan = Object.assign(item);
            const investingDateArr = Array(investingStageDay + 1)
                .fill(0).map((date, index) => {
                    const startDate = new Date(loan.info.createdDate);

                    startDate.setDate(startDate.getDate() + index);
                    startDate.setHours(0);
                    startDate.setMinutes(0);
                    startDate.setSeconds(0);
                    startDate.setMilliseconds(0);
            
                    return startDate;
                });

            return Hyperledger.calculateInvestedNotesByDate(loan.contractId, investingDateArr)
                .then(payload => {
                    loan.investedNotes = payload.investedNotes;
                    investedDate.push(payload.investedNotesByDate);
                
                    return loan;
                });    
            }))
            .then(payload => {
                return UserTxs.findByUserId(borrower._id)
                    .then((userTx) => {
                        const tmp = payload.map((item) => {
                            item.txId = userTx.findTxByloanId(item.contractId).id;

                            return item;
                        });

                        return Promise.resolve(tmp);
                    })
                    .catch(e => Promise.reject(e));
            })
            .then((loan) => {
                data.loan = loan;
                data.investedDate = investedDate;

                return HTTPResponse.sendData(res, feature, successResCode, null, data);
            })
            .catch((e) => Promise.reject(e));
    }

    if (loanList[0].status === Constant.loanStatus.success) {
        return UserTxs.findByUserId(borrower._id)
            .then((userTx) => {
                data.loan = loanList.map((item) => {
                    item.txId = userTx.findTxByloanId(item.contractId).id;

                    return item;
                });

                return Hyperledger.findSettlementByLoanId(loanList[0].contractId);
            })
            .then((settlement) => {
                data.settlement = settlement;

                return HTTPResponse.sendData(res, feature, successResCode, null, data);
            })
            .catch((e) => Promise.reject(e));
    }

    if (loanList[0].status === Constant.loanStatus.clean) {
        return UserTxs.findByUserId(borrower._id)
            .then((userTx) => {
                const payload = {};

                payload.loan = loanList.map((item) => {
                    item.txId = userTx.findTxByloanId(item.contractId).id;

                    return item;
                });

                return HTTPResponse.sendData(res, feature, successResCode, null, payload);
            })
            .catch(e => Promise.reject(e));
    }

    data.loan = loanList;

    return HTTPResponse.sendData(res, feature, successResCode, null, data);
};

const GettingRestrictLoanController = (req, res) => {
    const feature = Helpers.createFeature('getloan');

    const status = HTTPRequest.convertReqBody(feature, req);
    const user = req.user;
    const { badReqCode, successResCode } = Constant;

    return Hyperledger.findLoanByStatus(user, status)
        .then(loanList => {
            if (loanList && loanList.length === 0) {
                return HTTPResponse.sendData(res, feature, successResCode, null, []);
            }

            if (user.checkCategory(Constant.lenderRegex)) {
                return LenderGetRestrictLoanController(res, user, loanList, status);
            }

            return BorrowerGetLoanController(res, user, loanList);
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

//Lender Bottom Tab 2 => List<WaitingItem> --> Click -> UserInfo, MockInvestData, investedDate
//Lender Bottom Tab 1 - Screen 2 => List<SuccessItem> --> Click -> Settlement, UserInfo
//Lender Bottom Tab 1 - Screen 3 => List<WaitingItem> --> Click -> UInfo, InvestData, investedDate
const GettingLoanDetailController = (req, res) => {
    const feature = Helpers.createFeature('getloandetaillender');

    const { badReqCode, successResCode, investingStageDay } = Constant;
    const id = req.query.id;
    const lender = req.user;
    let loan;
    let invest;
    let userDetail;
    let settlement;
    let investedDate = [];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return HTTPResponse.sendError(res, badReqCode, Messages.loan.incorrectId);
    }

    return Hyperledger.findOwerAndLoanById(lender, id)
        .then((data) => {
            loan = data.loan;

            return Hyperledger.findParticipantData(data.owner);
        })
        .then((data) => {
            userDetail = data;

            if (loan.status === Constant.loanStatus.success) {
                return Hyperledger.findSettlementByLoanId(loan.contractId)
                    .then((settledList) => {
                        settlement = settledList;

                        return Promise.resolve();
                    })
                    .catch(e => Promise.reject(e));
            }

            if (loan.status === Constant.loanStatus.waiting) {
                const investingDateArr = Array(investingStageDay + 1)
                    .fill(0).map((date, index) => {
                        const startDate = new Date(loan.info.createdDate);
        
                        startDate.setDate(startDate.getDate() + index);
                        startDate.setHours(0);
                        startDate.setMinutes(0);
                        startDate.setSeconds(0);
                        startDate.setMilliseconds(0);
                
                        return startDate;
                    });

                return Hyperledger.calculateInvestedNotesByDate(loan.contractId, investingDateArr)
                    .then((payload) => {
                        investedDate = payload.investedNotesByDate;

                        return Hyperledger.existInvestOnLoan(lender, loan.contractId);
                    })
                    .then((result) => {
                        const {
                            monthlyPrincipalPay,
                            monthlyInterestPay,
                            periodMonth
                        } = loan.info;

                        if (!result) {
                            invest = {};
                            invest.numNotes = 1;
                            invest.baseUnitPrice = Constant.baseUnitPrice;
                            invest.capital = invest.baseUnitPrice * invest.numNotes;
                            invest.monthlyPrincipalIncome = 
                                Helpers.calculateMonthlyPrincipalIncome(monthlyPrincipalPay, 
                                    loan.totalNotes);
                            invest.monthlyInterestIncome = 
                                Helpers.calculateMonthlyInterestIncome(monthlyInterestPay, 
                                    loan.totalNotes);
                            invest.monthlyIncome = Helpers.calculateMonthlyIncome(
                                monthlyPrincipalPay, monthlyInterestPay, loan.totalNotes);
                            invest.serviceFee = Helpers.caculateMonthlyServiceFee(
                                invest.monthlyInterestIncome);
                            invest.monthlyProfit = Helpers.calculateMonthlyProfit(
                                invest.monthlyIncome, invest.monthlyInterestIncome);        
                            invest.entirelyProfit = Helpers.calculateEntirelyProfit(
                                invest.monthlyIncome, invest.monthlyInterestIncome, periodMonth);

                            return Promise.resolve();
                        }
                        
                        return Hyperledger.findInvestByLoanId(lender, loan.contractId)
                            .then((investcontract) => {
                                invest = investcontract;

                                return Promise.resolve();
                            })
                            .catch((e) => Promise.reject(e));
                    })
                    .catch((e) => Promise.reject(e));
            }
        })
        .then(() => {
            const data = { userDetail, settlement, invest, investedDate };

            return HTTPResponse.sendData(res, feature, successResCode, null, data);
        })
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

//
//Lender Bottom Tab 1 - Screen 3 => List<LoanContract-calculateInvestedNote>
const LenderGetWaitingLoanController = (req, res) => {
    const feature = Helpers.createFeature('getwaitingloanlender');

    const lender = req.user;
    const { badReqCode, successResCode } = Constant;

    return Hyperledger.findLoanByStatus(lender, Constant.loanStatus.waiting)
        .then(loanList => {
            if (loanList && loanList.length > 0) { 
                return Bluebird.filter(loanList, (item) => {
                        return Hyperledger.existInvestOnLoan(lender, item.contractId)
                            .then((result) => result);
                    })
                    .then(loanData => {
                        if (loanData && loanData.length > 0) {
                            return Promise.all(loanData.map(
                                (item) => {
                                    const loan = Object.assign(item);
                
                                    return Hyperledger.calculateInvestedNotes(loan.contractId)
                                        .then(investedNotes => {
                                            loan.investedNotes = investedNotes;
                                        
                                            return loan;
                                        });    
                                    }
                                ))
                                .then((payload) => {
                                    return UserTxs.findByUserId(lender._id)
                                        .then(userTx => {
                                            const data = payload.map((item) => {
                                                item.txId = 
                                                userTx.findTxByloanId(item.contractId).id;
    
                                                return item;
                                            });
    
                                            return Promise.resolve(data);
                                        })
                                        .catch((e) => Promise.reject(e));
                                })
                                .catch((e) => Promise.reject(e));
                        }

                        return Promise.resolve([]);
                    })
                    .catch(e => Promise.reject(e)); 
            } 

            return Promise.resolve([]);
        })
        .then((data) => HTTPResponse.sendData(res, feature, successResCode, null, data))
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

module.exports = {
    CreatingLoanController,
    CheckingRateController,
    GettingRestrictLoanController,
    GettingLoanDetailController,
    LenderGetWaitingLoanController
};
