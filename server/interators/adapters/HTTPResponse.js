/**
 * @description This file contains the convention of server data to  HTTP Response Data
 */

const _ = require('lodash');

const Constant = require('./../../data/constant');
const Helper = require('./../../utils/helpers');
const Messages = require('./../../data/messages.json');

const handleResBodyData = (feature, resBody) => {
    let data;

    switch (feature) {
        //Authentication
        case 'confirm':
            data = _.pick(resBody, Constant.confirmResReqex);
            break;
        case 'borrowersignin':
            data = _.pick(resBody, Constant.confirmResReqex);

            if (data.detail && data.detail.declared) {
                data.detail = _.pick(data.detail, Constant.userDetailResRegex);
                data.detail.declared = true;
                if (resBody.loan) {
                    data.loan = handleResBodyData('baseloan', resBody.loan);
                } 
                if (resBody.settlement && resBody.settlement.length > 0) {
                    data.settlement = handleResBodyData('getsettlementborrower', 
                        resBody.settlement);
                    data.enablePay = Helper.findCurrentSettlementByStatus(data.settlement, 
                        Constant.settlementStatus.due);
                }
                if (resBody.investedDate && resBody.investedDate.length > 0) {
                    data.investedDate = resBody.investedDate;
                }
            }
            break;
        case 'lendersignin': 
            data = _.pick(resBody, Constant.confirmResReqex);

            if (data.detail && data.detail.declared) {
                data.detail = _.pick(data.detail, Constant.userDetailResRegex);
                data.detail.declared = true;
            }
            if (resBody.invest) {
                data.summary = Helper.calculateMonthlyInvestedOverall(resBody.invest);
                data.invest = [];
                resBody.invest.forEach((item) => {
                    const itemData = handleResBodyData('createinvest', item);

                    data.invest.push(itemData);
                });
            } 
            
            break;
        //Identify
        case 'createinfo': 
        case 'getinfo':
        case 'updateinfo':
            data = _.pick(resBody, Constant.userDetailResRegex);
            break;
        case 'getimg': 
          data = resBody;
          break;
        //Loan
        case 'checkloanrate':
            data = _.pick(resBody.loanData, Constant.createLoanReqRegex);

            data.rate = Helper.calculateLoanRate(data.capital, 
                data.periodMonth, resBody.userDetail.score);
            data.monthlyPrincipalPay = Helper.calculateMonthlyPrincipalPay(data.capital,
                data.periodMonth);
            data.monthlyInterestPay = Helper.calculateMonthlyInterestPay(data.capital, 
                data.periodMonth, data.rate);
            data.monthlyPay = Helper.calculateMonthlyPay(data.capital, data.periodMonth, data.rate);
            data.entirelyPay = Helper.calculateEntirelyPay(
                data.capital, data.periodMonth, data.rate);
            break;
        case 'baseloan': {
            data = _.pick(resBody, Constant.LoanContractResRegex);
            data.info = _.pick(data.info, Constant.LoanInfoResRegex);

            if (data.status === Constant.loanStatus.waiting) {
                const investingEndDate = new Date(data.info.investingEndDate);

                data.info.investingDayLeft = Helper.calculateInvestingDayLeft(investingEndDate);
            }
            data.baseUnitPrice = Constant.baseUnitPrice;
            break;
        }
        case 'createloan': {
            data = handleResBodyData('baseloan', resBody);
            
            if (resBody.investedDate && resBody.investedDate.length > 0) {
                data.investedDate = resBody.investedDate;
            }
            break;
        }
        case 'getloan':
        case 'getloanlender':
            data = {};
            data.loan = [];

            if (resBody.loan && resBody.loan.length > 0) {
                resBody.loan.forEach(item => {
                    const itemData = handleResBodyData('baseloan', item);

                    data.loan.push(itemData);
                });
            }

            if (resBody.invest && resBody.invest.length > 0) {
                data.invest = [];
                resBody.invest.forEach(item => {
                    const itemData = handleResBodyData('createinvest', item);

                    data.invest.push(itemData);
                });
            }

            break;
        case 'getloanborrower':
            data = {};
            data.loan = [];

            if (resBody && resBody.loan && resBody.loan.length > 0) {
                resBody.loan.forEach(item => {
                    const itemData = handleResBodyData('baseloan', item);
    
                    data.loan.push(itemData);
                });
            }
            
            if (resBody && resBody.settlement && resBody.settlement.length > 0) {
                data.settlement = handleResBodyData('getsettlementborrower', resBody.settlement);
                data.enablePay = Helper.findCurrentSettlementByStatus(data.settlement, 
                    Constant.settlementStatus.due);
            }

            if (resBody && resBody.investedDate && resBody.investedDate.length > 0) {
                data.investedDate = resBody.investedDate;
            }

            break;
        case 'getloandetaillender': {
            data = {};

            data.userDetail = _.pick(resBody.userDetail, Constant.userDetailResRegex);
            if (resBody.invest && resBody.invest.contractId) {
                data.invest = handleResBodyData('createinvest', resBody.invest);
            } else if (resBody.invest && !resBody.invest.contractId) {
                data.invest = resBody.invest;
            }
            if (resBody.settlement && resBody.settlement.length > 0) {
                data.settlement = handleResBodyData('getsettlementlender', resBody.settlement);
            }
            if (resBody.investedDate && resBody.investedDate.length > 0) {
                data.investedDate = resBody.investedDate;
            }

            break;
        }
        case 'getwaitingloanlender': 
            data = {};
            if (resBody && resBody.length) {
                data.loan = resBody.map((item) => handleResBodyData('baseloan', item));
            } else {
                data.loan = [];
            }
            break;
        // Invest 
        case 'createinvest':
            data = _.pick(resBody, Constant.InvestContractResRegex);
            data.info = _.pick(resBody.info, Constant.InvestInfoResRegex);
            
            break;
        case 'getsummarysuccess':
            data = {};
            
            if (resBody && resBody.length > 0) {
                data.summary = Helper.calculateMonthlyInvestedOverall(resBody);
                data.invest = [];
                resBody.forEach((item) => {
                    const itemData = handleResBodyData('createinvest', item);

                    data.invest.push(itemData);
                });
            }
            break;
        //SettleLoan
        case 'getsettlementborrower': {
            data = [];
            data = resBody.map((item) => {
                const tmp = _.pick(item, Constant.SettlementContractResRegex);

                tmp.info = _.pick(item.info, Constant.SettlementInfoBorrowerRegex);

                return tmp;
            });

            break;
        }
        case 'getsettlementlender': {
            data = [];
            data = resBody.map((item) => {
                const tmp = _.pick(item, Constant.SettlementContractResRegex);

                tmp.info = _.pick(item.info, Constant.SettlementInfoLenderRegex);

                return tmp;
            });

            break;
        }
        case 'settledloan':
            data = _.pick(resBody, Constant.SettlementContractResRegex);
            data.info = _.pick(resBody.info, Constant.SettlementInfoBorrowerRegex);

            break;

        //Default
        default:
            data = Constant.defaultResData;

            break;
    }

    return data;
};

const handleResMesData = (message) => {
    console.log('Error:', message);

    let errMsg;

    if (typeof message !== String && typeof message !== 'string') {
        if (message.code && message.message) {
            errMsg = {
                code: message.code,
                message: message.message
            };
        } else {
            errMsg = Messages.common.internalErr;

            return Promise.reject(errMsg);
        }
    }  
    errMsg = message;

    return Promise.resolve(errMsg);
};

const sendData = (res, feature, statusCode, headerValue, resBody) => {
    const data = handleResBodyData(feature, resBody);

    switch (feature) {
        case 'confirm':
        case 'lendersignin':
        case 'borrowersignin': {
            const token = Constant.authTokenProp;

            return res.status(statusCode).header(token, headerValue).send({ data });
        }
        case 'getimg': 
            return res.status(statusCode).sendFile(data);
        default:

            return res.status(statusCode).send({ data });
    }
};

const sendError = (res, statusCode, message) => {
    const severErrCode = 500;

    return handleResMesData(message)
        .then((errMsg) => res.status(statusCode).send({ errMsg }), 
            (errMsg) => res.status(severErrCode).send({ errMsg }));
};

module.exports = {
    sendData,
    sendError
};

