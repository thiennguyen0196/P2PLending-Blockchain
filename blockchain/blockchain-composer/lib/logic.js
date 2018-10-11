'use strict';


/**Constant */
var Namespace = 'hcmus.fit.clc.lending';
var LoanContractName= 'LoanContract';
var SettlementContractName = 'SettlementContract';
var SettlementApplicationName = 'SettlementApplication';
var InvestContractName = 'InvestingContract';
var InvestFeeContractName = 'InvestingFeeContract';

/**Borrower transaction */

/**
 * Create LoanContract asset for the borrower
 * @param {hcmus.fit.clc.lending.createLoanContract} data - from NodeJS server
 * @transaction
 */
function createLoanContract(data) {
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();

    var borrower = getCurrentParticipant();
    var loanContract = factory.newResource(Namespace, LoanContractName, data.loanId);
    
    loanContract.contractId = data.loanId;
    loanContract.info = data.info;
    loanContract.totalNotes = data.totalNotes;
    loanContract.status = 'waiting';
    loanContract.borrower = borrower;
   
    return getAssetRegistry(Namespace + '.' + LoanContractName)
        .then(function(loanRegistry) {
            return loanRegistry.add(loanContract);
        });
}

/**
 * Create SettlementContract asset for the borrower
 * @param {hcmus.fit.clc.lending.createSettlementContract} data - from NodeJS server
 * @transaction
 */
function createSettlementContract(data) {
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();

    var borrower = getCurrentParticipant();
    var loan = factory.newRelationship(Namespace, LoanContractName ,data.loanId);
    var loanData;

    return getAssetRegistry(Namespace + '.' + LoanContractName)
        .then(function(loanRegistry){
            return loanRegistry.get(data.loanId);
        })
        .then(function(loanContract){
            loanData = loanContract;

            return getAssetRegistry(Namespace + '.' + SettlementContractName);
        })
        .then(function(settlementRegistry){
            var listSettlement = [];
            var settlementInfo = {
                $class: 'hcmus.fit.clc.lending.SettlementApplication',
                principalAmount: loanData.info.monthlyPrincipalPay,
                interestAmount: loanData.info.monthlyInterestPay,
                penaltyAmount: 0,
                totalAmount: loanData.info.monthlyPay,
            };

            data.settledId.forEach(function(id, i){
                var settlementContract = factory.newResource(Namespace, SettlementContractName, id);
                var payDate = new Date(loanData.info.maturityDate);

                payDate.setMonth(payDate.getMonth() + i + 1);
                settlementInfo.maturityDate = payDate;

                settlementContract.contractId = id;
                settlementContract.status = 'undue';
                settlementContract.info = getSerializer().fromJSON(settlementInfo);
                settlementContract.orderNo = i + 1;
                settlementContract.borrower = borrower;
                settlementContract.loan = loan;
                listSettlement.push(settlementContract);
            });

            return settlementRegistry.addAll(listSettlement);
        });
}

/**
 * Borrower pay a portion of loan
 * @param {hcmus.fit.clc.lending.settleLoanContract} data - from NodeJS server
 * @transaction
 */
function settleLoanContract(data) {
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();
        
    return getAssetRegistry(Namespace + '.' + SettlementContractName)
        .then(function(settlementRegistry){
            return settlementRegistry.get(data.settledId)
                .then(function(settlementContract){
                    settlementContract.status = 'settled';
                    settlementContract.info.realpaidDate = data.realpaidDate;
        
                    return settlementRegistry.update(settlementContract);
                });
        });
}

/**Investor Transaction */

/**
 * Create InvestingContract asset for the participant
 * @param {hcmus.fit.clc.lending.createInvestContract} data - from NodeJS server
 * current participant(Lender) and the Invest Contract
 * @transaction
 */
function createInvestContract(data) {
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();

    var lender = getCurrentParticipant();
    var investContract = factory.newResource(Namespace, InvestContractName, data.investId);
    var loan = factory.newRelationship(Namespace, LoanContractName ,data.loanId);

    investContract.contractId = data.investId;
    investContract.info = data.info;
    investContract.status = 'waiting_other';
    investContract.lender = lender;
    investContract.loan = loan;
        
    return getAssetRegistry(Namespace + '.' + InvestContractName)
        .then(function(investRegistry){
            return investRegistry.add(investContract);
        });
}

/**Network Admin Transaction */

/**
 * Create InvestingFeeContracts that contains Platform's profit relating to SettlementContract
 * @param {hcmus.fit.clc.lending.createInvestFeeContract} data - from NodeJS server
 * @transaction
 */
function createInvestFeeContract(data) {
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();
    var settledId = [];
    var investId = [];
    var feeAmount = 0;

    return getAssetRegistry(Namespace + '.' + SettlementContractName)
        .then(function(settlementRegistry){
            return settlementRegistry.getAll();
        })
        .then(function(settlementList){
            settledId = settlementList.filter(function(item){
                return item.loan.getIdentifier() === data.loanId;
            });
            settledId = settledId.map(function(item){
                return item.contractId;
            });

            return getAssetRegistry(Namespace + '.' + InvestContractName);
        })
        .then(function(investRegistry){
            return investRegistry.getAll();
        })
        .then(function(investList){
            investId = investList.filter(function(item){
                return item.loan.getIdentifier() === data.loanId;
            });
            investId.forEach(function(item){
                feeAmount += item.info.serviceFee;
            });
            investId = investId.map(function(item){
                return item.contractId;
            });

            return getAssetRegistry(Namespace + '.' + InvestFeeContractName);
        })
        .then(function(feeRegistry){
            var listFee = [];

            data.feeId.forEach(function(id, i){
                var feeContract = factory.newResource(Namespace, InvestFeeContractName, id);
                var settleRelationship = factory.newRelationship(Namespace, SettlementContractName, settledId[i]);
                var investRelationships = investId.map(function(item){
                    return factory.newRelationship(Namespace, InvestContractName, item);
                });
                
                feeContract.contractId = id;
                feeContract.feeAmount = feeAmount;
                feeContract.settledContract = settleRelationship;
                feeContract.investContract = investRelationships;
                listFee.push(feeContract);
            });

            return feeRegistry.addAll(listFee);
        });
}

/**
 * Change status of InvestContract and LoanContract in 2 case: 'success' or 'fail'
 * @param {hcmus.fit.clc.lending.onFullFilledLoanContract} data - from NodeJS server
 * @transaction
 */
function onFullFilledLoanContract(data) {
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();
    var listInvest = [];

    return getAssetRegistry(Namespace + '.' + InvestContractName)
        .then(function(investRegistry){
            return investRegistry.getAll()
                .then(function(investList){
                    investList.forEach(function(investContract){
                        if(investContract.loan.getIdentifier() === data.loanId) {
                            investContract.status = data.investStatus; 
                            listInvest.push(investContract);
                        }
                    });      
                    
                    return investRegistry.updateAll(listInvest);
                })
                .then(function(){
                    return getAssetRegistry(Namespace + '.' + LoanContractName);
                });
        })
        .then(function(loanRegistry){
            return loanRegistry.get(data.loanId)
                .then(function(loan){
                    loan.status = data.loanStatus;

                    return loanRegistry.update(loan);
                });
        });
}

/**
 * Change the status of the SelltementContract and related InvestingFeeContract in 2 case: 'due' or 'overdue'
 * @param {hcmus.fit.clc.lending.onFullFilledSettlementContract} data - from NodeJS server
 * @transaction
 */
function onFullFilledSettlementContract(data){
    /*eslint-disable no-tabs*/
    /*eslint-disable indent*/
    /*eslint-disable no-undef */
    /*eslint-disable no-trailing-spaces */
    var factory = getFactory();
    var settledNo;
    var totalAmount;
    var borrower;
    var loan;

    return getAssetRegistry(Namespace + '.' + SettlementContractName)
        .then(function(settlementRegistry){
            return settlementRegistry.get(data.settledId)
                .then(function(settledContract){
                    settledNo = settledContract.orderNo;
                    totalAmount = settledContract.info.totalAmount;
                    borrower = settledContract.borrower.getIdentifier();
                    loan= settledContract.loan.getIdentifier();

                    settledContract.status = data.status;
                    return settlementRegistry.update(settledContract);
                })
                .then(function(){
                    if (data.status === 'overdue') {
                        var nextSettled;

                        return settlementRegistry.getAll()
                            .then(function(loanList){
                                nextSettled = loanList.find(function(item){
                                    return item.orderNo === (settledNo + 1) && 
                                        item.borrower.getIdentifier() === borrower &&
                                        item.loan.getIdentifier() === loan;
                                });

                                if (!nextSettled) {
                                    return Promise.reject('Kỳ hạn thanh toán cuối cùng');
                                //    var error = borrower;
                                //    return Promise.reject(error);
                                }
                                nextSettled.info.penaltyAmount = totalAmount;
                                nextSettled.info.totalAmount += nextSettled.info.penaltyAmount;

                                return settlementRegistry.update(nextSettled)
                                    .then(function(){
                                        return getAssetRegistry(Namespace + '.' + InvestFeeContractName);
                                    })
                                    .then(function(feeRegistry){
                                        return feeRegistry.getAll()
                                            .then(function(feeList){
                                                var lastFee = feeList.find(function(item){
                                                    return item.settledContract.getIdentifier() === data.settledId;
                                                });
                                                var nextFee = feeList.find(function(item){
                                                    return item.settledContract.getIdentifier() === nextSettled.contractId;
                                                });

                                                nextFee.feeAmount += lastFee.feeAmount;
                                                lastFee.feeAmount = 0;

                                                return feeRegistry.updateAll([lastFee, nextFee]);
                                            });
                                    });
                            });
                    }

                    return Promise.resolve();
                });
        });
}