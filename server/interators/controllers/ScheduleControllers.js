/** 
 * @description This file contains all schedule functions 
 * 1. onFullfillLoanContract && onFullFillSettlementContract on HLFV1
 */

const Bluebird = require('bluebird');

const Constant = require('./../../data/constant');
const Helpers = require('./../../utils/helpers');
const Hyperledger = require('./../connectors/Hyperledger');
//const Messages = require('./../../data/messages.json');
const { HTTPResponse } = require('./../adapters');

const onFullFillController = (req, res) => {
    const feature = Helpers.createFeature('fullfillController');

    const { badReqCode, successResCode } = Constant;
    const { waiting, fail } = Constant.loanStatus;
    const { fail: investFail } = Constant.investStatus;
    const { undue, due, overdue } = Constant.settlementStatus;

    // FullfillLoanContract that is out of investingEndDate (waiting -> fail)
    return Hyperledger.findLoanByAdmin(waiting)
        .then((loanData) => {
            let loanList = [];

            if (loanData && loanData.length > 0) {
                loanList = loanData.filter((item) => {
                    const investingEndDate = new Date(item.info.investingEndDate);
                    const investingDayLeft = Helpers.calculateInvestingDayLeft(investingEndDate);

                    return investingDayLeft <= 0;
                });
            }

            if (loanList && loanList.length > 0) {
                return Bluebird.each(loanList, (item) => {
                    console.log('   Fail', item.contractId);

                    return Hyperledger.onFullFilledLoanContract(item.contractId, fail, investFail);
                });
            }
            

            return Promise.resolve();
        })
        // FullfillSettlementContract that is near to maturityDate (undue -> due)
        .then(() => Hyperledger.findSettlementByAdmin(undue))
        .then((settlementData) => {
            let settlementList = [];
           
            
            if (settlementData && settlementData.length > 0) {
                settlementList = settlementData.filter((item) => {
                    const maturityDate = new Date(item.info.maturityDate);
                    const result = Helpers.calculateInvestingDayLeft(maturityDate);

                    return result <= Constant.settlementDayGap;
                });
            }

            if (settlementList && settlementList.length > 0) {
                return Bluebird.each(settlementList, (item) => {
                    console.log('   Due', item.contractId);

                    return Hyperledger.onFullFilledSettlementContract(item.contractId, due);
                });
            }
            
            return Promise.resolve();
        })
        // FullfillSettlementContract that is out of maturityDate (due -> overdue)
        .then(() => Hyperledger.findSettlementByAdmin(due))
        .then((settlementData) => {
            let settlementList = [];
           
            if (settlementData && settlementData.length > 0) {
                settlementList = settlementData.filter((item) => {
                    const maturityDate = new Date(item.info.maturityDate);
                    const result = Helpers.calculateInvestingDayLeft(maturityDate);
                 
                    return result < 0;
                });
            }

            if (settlementList && settlementList.length > 0) {
                return Bluebird.each(settlementList, (item) => {
                    console.log('   Overdue', item.contractId);

                    return Hyperledger.onFullFilledSettlementContract(item.contractId, overdue);
                });
            }
          
            return Promise.resolve();
        })
        .then(() => HTTPResponse.sendData(res, feature, successResCode, null, null))
        .catch((e) => HTTPResponse.sendError(res, badReqCode, e));
};

module.exports = {
    onFullFillController
};
