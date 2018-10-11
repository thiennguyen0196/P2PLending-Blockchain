/**
 * @description This file contains the connection to Hyperledger Blockchain Fabric.
 */

const _ = require('lodash');
const Helpers = require('../../utils/helpers');
const mongoose = require('mongoose');
const { AdminConnection } = require('composer-admin');
const { BusinessNetworkConnection } = require('composer-client');
const { FileSystemCardStore } = require('composer-common');
const { IdCard } = require('composer-common');
const ModifyBNConnection = require('./ModifyBNConnection');

const Constant = require('./../../data/constant');
const Helper = require('../../utils/helpers');
const Messages = require('./../../data/messages.json');
const Profile = require('./../../data/storage/connection.json');

const { 
    HLFV1_ADMIN_CARD, 
    HLFV1_NAMESPACE,
    NETWORK_NAME 
} = process.env;

/*Helper Function */
const createIdentifier = (name, instance) => {
    const type = name.includes('create') ? name : _.upperFirst(name);
    const id = instance ? instance.toString() : null;
    
    return id ? `${HLFV1_NAMESPACE}.${type}#${id}` : `${HLFV1_NAMESPACE}.${type}`;
};

const createParticipantData = (network, user, data) => {
    const factory = network.getFactory();
    const id = user._id.toString();
    const type = _.startCase(user.category);

    const participant = factory.newResource(HLFV1_NAMESPACE, type, id);

    participant._id = id;
    participant.phone = user.phone;

    if (user.checkCategory(Constant.borrowerRegex)) {
        const participantData = _.pick(data, Constant.userDetailHLReqRegex);

        participantData.$class = createIdentifier(Constant.userDetailConcept);
        participant.details = network.getSerializer().fromJSON(participantData);
    }

    return participant;
};

const createLoanTransaction = (network, data, loan) => {
    console.log('    ', 'createLoanTransaction');

    const factory = network.getFactory();

    const transaction = factory.newTransaction(HLFV1_NAMESPACE, Constant.createLoanTransaction);
    const loanData = _.pick(loan, Constant.createLoanReqRegex);

    const investingEndDate = Helper.getToday();
    investingEndDate.setDate(investingEndDate.getDate() + Constant.investingStageDay);

    loanData.$class = createIdentifier(Constant.loanApplicationConcept);
    loanData.rate = Helper.calculateLoanRate(loan.capital, loan.periodMonth, data.score);
    loanData.createdDate = Helper.getToday();
    loanData.investingEndDate = investingEndDate;
    loanData.monthlyPrincipalPay = Helper.calculateMonthlyPrincipalPay(loan.capital, 
        loan.periodMonth);
    loanData.monthlyInterestPay = Helper.calculateMonthlyInterestPay(loan.capital,
        loan.periodMonth, loanData.rate);
    loanData.monthlyPay = Helper.calculateMonthlyPay(loan.capital,
        loan.periodMonth, loanData.rate);
    loanData.entirelyPay = Helper.calculateEntirelyPay(loan.capital,
        loan.periodMonth, loanData.rate);

    transaction.loanId = mongoose.Types.ObjectId().toString();  
    transaction.totalNotes = Helper.calculateTotalLoanNotes(loan.capital);
    transaction.info = network.getSerializer().fromJSON(loanData);

    return transaction;
};

const createInvestTransaction = (network, loan) => {
    console.log('    ', 'createInvestTransaction');

    const factory = network.getFactory();
    const transaction = factory.newTransaction(HLFV1_NAMESPACE, Constant.createInvestTransaction);

    const {
        monthlyPrincipalPay,
        monthlyInterestPay,
        periodMonth
    } = loan.info;
    const investData = {};

    investData.$class = createIdentifier(Constant.investApplicationConcept);
    investData.numNotes = 1;
    investData.capital = Constant.baseUnitPrice * investData.numNotes;
    investData.createdDate = Helper.getToday();
    investData.monthlyPrincipalIncome = 
        Helper.calculateMonthlyPrincipalIncome(monthlyPrincipalPay, loan.totalNotes);
    investData.monthlyInterestIncome = 
        Helper.calculateMonthlyInterestIncome(monthlyInterestPay, loan.totalNotes);
    investData.monthlyIncome = Helper.calculateMonthlyIncome(monthlyPrincipalPay, 
        monthlyInterestPay, loan.totalNotes);
    investData.serviceFee = Helper.caculateMonthlyServiceFee(
        investData.monthlyInterestIncome);
    investData.monthlyProfit = Helper.calculateMonthlyProfit(investData.monthlyIncome, 
        investData.monthlyInterestIncome);        
    investData.entirelyProfit = Helper.calculateEntirelyProfit(investData.monthlyIncome, 
        investData.monthlyInterestIncome, periodMonth);

    transaction.investId = mongoose.Types.ObjectId().toString();  
    transaction.loanId = loan.contractId;
    transaction.info = network.getSerializer().fromJSON(investData);

    return transaction;
};

/*Init connection function */
const initCard = () => {
    const StorageDirPath = { storePath: Constant.cardStorePath };

    const card = new FileSystemCardStore(StorageDirPath);

    return card;
};

const initAdminConnection = () => {
    const card = initCard();
    const options = { cardStore: card };
    const NetworkAdminConnection = new AdminConnection(options);

    return NetworkAdminConnection;
};

const initUserConnection = () => {
    const card = initCard();
    const options = { cardStore: card };
    const UserConnection = new BusinessNetworkConnection(options);

    return UserConnection;
};

const initModifyConnection = () => {
    const card = initCard();
    const options = { cardStore: card };
    const UserConnection = new ModifyBNConnection(options);

    return UserConnection;
};

/*Blockchain Loan Contract Function*/

const createLoanContract = (borrower, data, loanData) => {
    console.log('    ', 'createLoanContract');

    const connection = initModifyConnection();

    const userId = borrower._id.toString();
    const resData = {};
    let definition;
    let newTransaction;

    return connection.connect(userId)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;
            
            newTransaction = createLoanTransaction(definition, data, loanData);

            return connection.submitTransaction(newTransaction);
        })
        .then((txData) => { 
            resData.entry = Constant.createLoanTransaction;
            resData.txId = txData.idStr;
            resData.loanId = newTransaction.loanId;

            return connection.disconnect(); 
        })
        .then(() => Promise.resolve(resData))
        .catch((e) => Promise.reject(e)); 
};

const existCurrentLoanContract = (borrower) => {
    console.log('    ', 'existCurrentLoanContract');

    const connection = initUserConnection();
    const id = borrower._id.toString();
    let definition;
    let expected = false;

    return connection.connect(id)
        .then((res) => {
            const identifier = createIdentifier(Constant.loanContractAsset);

            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            return connection.getAssetRegistry(identifier);
        })
        .then(loanRegistry => loanRegistry.getAll())
        .then((loanData) => {
            if (loanData) {
                loanData.forEach(item => {
                    const itemData = definition.getSerializer().toJSON(item);

                    if (itemData.status === Constant.loanStatus.waiting 
                        || itemData.status === Constant.loanStatus.success) { 
                        expected = true;
                    }
                });
            }

            return connection.disconnect();
        })
        .then(() => Promise.resolve(expected))
        .catch((e) => Promise.reject(e));
};

const findLoanById = (user, loanId) => {
    console.log('    ', 'findLoanById');

    const connection = initUserConnection();
    const id = user._id.toString();

    let definition;
    let data;
    
    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.loanContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(loanRegistry => loanRegistry.get(loanId))
        .then((loanData) => {
            if (loanData) {
                data = definition.getSerializer().toJSON(loanData);

                return connection.disconnect();    
            }
        })
        .then(() => Promise.resolve(data))
        .catch(() => Promise.reject(Messages.common.blockchainErr));
};

const findLoanByStatus = (user, status) => {
    console.log('    ', 'findLoanByStatus');

    const connection = initUserConnection();
    const id = user._id.toString();

    const data = []; 
    let definition;

    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.loanContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(loanRegistry => loanRegistry.getAll())
        .then((loanData) => {
            if (loanData) {
                loanData.forEach(item => {
                    const itemData = definition.getSerializer().toJSON(item);

                    if (status === Constant.loanStatus.all 
                        || (status === Constant.loanStatus.current 
                            && itemData.status !== Constant.loanStatus.clean 
                            && itemData.status !== Constant.loanStatus.fail)
                        || (status === itemData.status)) {
                            data.push(itemData);
                    } 
                });
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const findLoanByAdmin = (status) => {
    console.log('    ', 'findLoanByAdmin');

    const connection = initUserConnection();

    const data = []; 
    let definition;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.loanContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(loanRegistry => loanRegistry.getAll())
        .then((loanData) => {
            if (loanData) {
                loanData.forEach(item => {
                    const itemData = definition.getSerializer().toJSON(item);

                    if (status === Constant.loanStatus.all 
                        || (status === Constant.loanStatus.current 
                            && itemData.status !== Constant.loanStatus.clean 
                            && itemData.status !== Constant.loanStatus.fail)
                        || (status === itemData.status)) {
                            data.push(itemData);
                    } 
                });
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const findOwerAndLoanById = (lender, loanId) => {
    console.log('    ', 'findOwerAndLoanById');

    const connection = initUserConnection();
    const id = lender._id.toString();

    const data = {}; 
    let definition;
    
    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.loanContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(loanRegistry => loanRegistry.get(loanId))
        .then((loanData) => {
            if (loanData) {
                data.loan = definition.getSerializer().toJSON(loanData);
                data.owner = loanData.borrower.$identifier;

                return connection.disconnect();    
            }
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

/*Blockchain Invest Contract Function  */

const createInvestContract = (lender, loanData) => {
    console.log('    ', 'createInvestContract');

    const connection = initModifyConnection();
    const userId = lender._id.toString();
    let definition;
    const data = {};

    return connection.connect(userId)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const newTransaction = createInvestTransaction(definition, loanData);
            data.investId = newTransaction.investId;

            return connection.submitTransaction(newTransaction);
        })
        .then((transaction) => { 
            data.entry = Constant.createInvestTransaction;
            data.txId = transaction.idStr;
            data.loanId = loanData.contractId;

            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e)); 
};

const existInvestOnLoan = (lender, loanId) => {
    console.log('    ', 'existInvestOnLoan');

    const connection = initUserConnection();
    const id = lender._id.toString();
    let expected = false;

    return connection.connect(id)
        .then((res) => {
            const identifier = createIdentifier(Constant.investContractAsset);

            if (!res) { throw new Error(Messages.common.blockchainErr); }

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.getAll())
        .then((investData) => {
            if (investData && investData.length > 0) {
                expected = investData.some((item) => item.loan.$identifier === loanId);
            }

            return connection.disconnect();
        })
        .then(() => Promise.resolve(expected))
        .catch((e) => Promise.reject(e));
};

const findInvestByStatus = (lender, condition) => {
    console.log('    ', 'findInvestByStatus');

    const connection = initUserConnection();
    const id = lender._id.toString();

    const data = []; 
    let definition;

    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.investContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.getAll())
        .then((investData) => {
            if (investData) {
                investData.forEach(item => {
                    const itemData = definition.getSerializer().toJSON(item);

                    if (condition === Constant.investStatus.all || condition === itemData.status) {
                        itemData.loanId = item.loan.$identifier;
                        data.push(itemData);
                    } 
                });
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const findInvestById = (lender, investId) => {
    console.log('    ', 'findInvestById');

    const connection = initUserConnection();
    const id = lender._id.toString();

    let definition;
    let data;

    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.investContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.get(investId))
        .then((investData) => {
            if (investData) {
                data = definition.getSerializer().toJSON(investData);
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const findInvestByLoanId = (lender, loanId) => {
    console.log('    ', 'findInvestByLoanId');

    const connection = initUserConnection();
    const id = lender._id.toString();

    let definition;
    let data;

    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.investContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.getAll())
        .then((investData) => {
            if (investData && investData.length > 0) {
                data = investData.find((item) => item.loan.$identifier === loanId);
                data = definition.getSerializer().toJSON(data);
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const findInvestByLoanIds = (lender, loanIds) => {
    console.log('    ', 'findInvestByLoanIds');

    const connection = initUserConnection();
    const id = lender._id.toString();

    let definition;
    let data = [];

    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.investContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.getAll())
        .then((investData) => {
            if (investData && investData.length > 0) {
                data = loanIds.map(item => {
                    const relatedInvest = investData.find((invest) => 
                        invest.loan.$identifier === item);

                    return definition.getSerializer().toJSON(relatedInvest);
                });
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

/*Blockchain Settlement Contract Function */

const createSettlementContract = (borrowerId, loanId, periodMonth) => {
    console.log('    ', 'createSettlementContract');

    const connection = initModifyConnection();
    const userId = borrowerId.toString();
    let factory;
    let transaction;
    const data = {};

    return connection.connect(userId)
        .then((res) => {
            if (!res) { 
                throw new Error(Messages.common.blockchainErr); 
            }

            factory = res.getFactory();
            transaction = factory.newTransaction(HLFV1_NAMESPACE, 
                Constant.createSettlementTransaction);
            transaction.loanId = loanId;
            transaction.settledId = 
                Array(periodMonth).fill(0).map(() => mongoose.Types.ObjectId().toString());
   
            return connection.submitTransaction(transaction);
        })
        .then((txData) => { 
            data.entry = Constant.createSettlementTransaction;
            data.txId = txData.idStr;
            data.loanId = loanId;

            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));  
};

const settledLoanContract = (borrower, settledId) => {
    console.log('    ', 'settledLoanContract');

    const connection = initModifyConnection();
    const userId = borrower._id.toString();
    let factory;
    let transaction;
    const data = {};

    return connection.connect(userId)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            factory = res.getFactory();
            transaction = factory.newTransaction(HLFV1_NAMESPACE, 
                Constant.settleLoanContract);
            transaction.settledId = settledId;
            transaction.realpaidDate = Helper.getToday();
   
            return connection.submitTransaction(transaction);
        })
        .then((txData) => {
            data.entry = Constant.settleLoanContract;
            data.txId = txData.idStr;
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));  
};

const findSettlementBySettleId = (borrower, settledId) => {
    console.log('    ', 'findSettlementBySettleId');

    const connection = initUserConnection();
    const id = borrower._id.toString();

    let definition;
    let data;

    return connection.connect(id)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.settlementContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(settlementRegistry => settlementRegistry.get(settledId))
        .then((settlementData) => {
            if (settlementData) {
                data = definition.getSerializer().toJSON(settlementData);
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const findSettlementByAdmin = (status) => {
    console.log('    ', 'findSettlementByAdmin');

    const connection = initUserConnection();

    const data = []; 
    let definition;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.settlementContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(settlementRegistry => settlementRegistry.getAll())
        .then((settlementData) => {
            if (settlementData) {
                settlementData.forEach(item => {
                    const itemData = definition.getSerializer().toJSON(item);

                    if (status === itemData.status) {
                        data.push(itemData);
                    } 
                });
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

/*Blockchain Investing Fee Contract Function */

const createInvestingFeeContract = (loanId, periodMonth) => {
    console.log('    ', 'createInvestingFeeContract');

    const connection = initUserConnection();
    let factory;
    let transaction;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            factory = res.getFactory();
            transaction = factory.newTransaction(HLFV1_NAMESPACE, 
                Constant.createInvestFeeTransaction);
            transaction.loanId = loanId;
            transaction.feeId = 
                Array(periodMonth).fill(0).map(() => mongoose.Types.ObjectId().toString());
   
            return connection.submitTransaction(transaction);
        })
        .then(() => connection.disconnect())
        .then(() => Promise.resolve())
        .catch((e) => Promise.reject(e));  
};

/*Blockchain Admin Function */

const calculateInvestedNotes = (loanId) => {
    console.log('    ', 'calculateLoanInvestedNotes');

    const connection = initUserConnection();

    let investedNotes = 0; 

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }

            const identifier = createIdentifier(Constant.investContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.getAll())
        .then((investContract) => {
            if (investContract) {
                investContract.forEach(item => {
                    if (item.loan.$identifier === loanId) {
                        ++investedNotes;
                    }
                });
            }

            return connection.disconnect();
        })
        .then(() => Promise.resolve(investedNotes))
        .catch((e) => Promise.reject(e));
};

const calculateInvestedNotesByDate = (loanId, investingDateArr) => {
    console.log('    ', 'calculateLoanInvestedNotesByDate');

    const connection = initUserConnection();
    let investedNotes = 0; 
    let investedNotesByDate = [];

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }

            const identifier = createIdentifier(Constant.investContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(investRegistry => investRegistry.getAll())
        .then((investContract) => { 
            if (investContract) {
                const clarifyInvest = investContract.filter((item) => 
                    item.loan.$identifier === loanId);
                const dateInvests = clarifyInvest.map((item) => new Date(item.info.createdDate));

                investedNotes = clarifyInvest.length;
                investedNotesByDate = investingDateArr.map((item) => {
                    const categorizeDate = dateInvests.filter((value) => 
                        value.getMonth() === item.getMonth() && 
                        value.getFullYear() === item.getFullYear() && 
                        value.getDate() === item.getDate()
                    );
                   
                    if (item > Helper.getToday()) {
                        return { date: item, investedNotes: -1 };
                    }

                    return { date: item, investedNotes: categorizeDate.length };
                });
            }

            return connection.disconnect();
        })
        .then(() => Promise.resolve({ investedNotes, investedNotesByDate }))
        .catch((e) => Promise.reject(e));
};

const findSettlementByLoanId = (loanId) => {
    console.log('    ', 'findSettlementByLoanId');

    const connection = initUserConnection();

    let data = [];
    let definition; 

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.settlementContractAsset);

            return connection.getAssetRegistry(identifier);
        })
        .then(settlementRegistry => settlementRegistry.getAll())
        .then((settlementData) => {
            if (settlementData) {
                data = settlementData.filter((contract) => contract.loan.$identifier === loanId);
                data = data.map((item) => definition.getSerializer().toJSON(item));
            }
            
            return connection.disconnect();
        })
        .then(() => Promise.resolve(data))
        .catch((e) => Promise.reject(e));
};

const onFullFilledLoanContract = (loanId, loanStatus, investStatus) => {
    console.log('    ', 'onFullFilledLoanContract');

    const connection = initUserConnection();
    let factory;
    let transaction;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            factory = res.getFactory();
            transaction = factory.newTransaction(HLFV1_NAMESPACE, Constant.onFullFilledLoan);
            transaction.loanId = loanId;
            transaction.loanStatus = loanStatus;
            transaction.investStatus = investStatus;
   
            return connection.submitTransaction(transaction);
        })
        .then(() => connection.disconnect())
        .then(() => Promise.resolve())
        .catch((e) => Promise.reject(e)); 
};

const onFullFilledSettlementContract = (settledId, status) => {
    console.log('    ', 'onFullFilledSettlementContract');

    const connection = initUserConnection();
    let factory;
    let transaction;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            factory = res.getFactory();
            transaction = factory.newTransaction(HLFV1_NAMESPACE, 
                Constant.onFullFilledSettlement);
            transaction.settledId = settledId;
            transaction.status = status;
   
            return connection.submitTransaction(transaction);
        })
        .then(() => connection.disconnect())
        .then(() => Promise.resolve())
        .catch((e) => Promise.reject(e)); 
};

/*Blockchain Identity and Pariticipant Function */

const checkUserCardExist = (id) => {
    console.log('    ', 'checkUserCardExist');

    const connection = initAdminConnection();
    const cardId = id.toString();
    let result = false;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then(() => connection.hasCard(cardId))
        .then((res) => {
            result = res;

            return connection.disconnect();
        })
        .then(() => Promise.resolve(result))
        .catch((e) => Promise.reject(e));
};

const findParticipantData = (participantId) => {
    console.log('    ', 'findParticipantData');

    const connection = initUserConnection();

    let data = {}; 
    let definition;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            const identifier = createIdentifier(Constant.borrowerRegex);

            return connection.getParticipantRegistry(identifier);
        })
        .then(paricipantRegistry => paricipantRegistry.get(participantId))
        .then((participant) => {
            if (participant) {
                data = definition.getSerializer().toJSON(participant);
            }

            return connection.disconnect();
        })
        .then(() => Promise.resolve(data.details))
        .catch((e) => Promise.reject(e));
};

const importParticipantCardStore = (data, credentials) => { 
    console.log('    ', 'importCard');

    const metaData = {};
    
    metaData.userName = data.userID;
    metaData.enrollmentSecret = data.userSecret;
    metaData.businessNetwork = NETWORK_NAME;

    const card = new IdCard(metaData, Profile);

    if (credentials) {
        card.setCredentials(credentials);
    }

    const connection = initAdminConnection();
    const testConnection = initUserConnection();
    
    return connection.connect(HLFV1_ADMIN_CARD)
        .then(() => connection.importCard(data.userID, card))
        .then(() => testConnection.connect(data.userID))
        .then((definition) => {
            if (!definition) {
                return Promise.reject(Messages.common.blockchainErr);
            }

            return testConnection.disconnect();
        })
        .then(() => connection.disconnect())
        .then(() => Promise.resolve())
        .catch((e) => Promise.reject(e));
};

const issueIdentity = (user, data) => {
    console.log('    ', 'issueIdentity');

    const connection = initUserConnection();
    const id = user._id.toString();
    let resData = {}; 
    let definition;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            const identifier = createIdentifier(user.category);

            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            return connection.getParticipantRegistry(identifier);
        })
        .then(participantRegistry => {
            const participant = createParticipantData(definition, user, data);

            return participantRegistry.add(participant);
        })
        .then(() => {
            const identifier = createIdentifier(user.category, id);

            return connection.issueIdentity(identifier, id);
        })
        .then((identityData) => {
            resData = identityData;

            return connection.disconnect();
        })
        .then(() => Promise.resolve(resData))
        .catch((e) => Promise.reject(e));
};

const getClientCredentials = (id) => {
    const cliendId = id.toString();

    const userDataDirPath = `${Constant.clientComposerDataPath}/${cliendId}`;
    const certificatePath = `${userDataDirPath}/${cliendId}`;
    const privateRegex = '-priv';
    const credentials = {};

    return Helpers.readFile2String(certificatePath)
        .then((data) => {
            const clientData = JSON.parse(data);

            credentials.certificate = clientData.enrollment.identity.certificate.toString();

            return Helpers.findFilePathinDir(userDataDirPath, privateRegex);
        })
        .then((data) => {
            const privatePath = `${userDataDirPath}/${data}`;

           return Helpers.readFile2String(privatePath);
        })
        .then((data) => {
            credentials.privateKey = data;

            return Promise.resolve(credentials);
        })
        .catch(e => Promise.reject(e));
};

const updateParticipantData = (user, data) => {
    console.log('    ', 'updateParticipantData');

    const connection = initUserConnection();
    const id = user._id.toString();
    let definition;
    let newPariticipantData;

    return connection.connect(HLFV1_ADMIN_CARD)
        .then((res) => {
            const identifier = createIdentifier(user.category);

            if (!res) { throw new Error(Messages.common.blockchainErr); }
            definition = res;

            return connection.getParticipantRegistry(identifier);
        })
        .then(participantRegistry => participantRegistry.get(id))
        .then(participantData => {
            const identifier = createIdentifier(user.category);
            const oldParticipantData = definition.getSerializer().toJSON(participantData);
            const newDetailData = _.pick(data, Constant.userDetailHLReqRegex);

            oldParticipantData.details = newDetailData;
            newPariticipantData = definition.getSerializer().fromJSON(oldParticipantData);

            return connection.getParticipantRegistry(identifier);
        })
        .then(participantRegistry => participantRegistry.update(newPariticipantData))
        .then(() => connection.disconnect())
        .then(() => Promise.resolve())
        .catch((e) => Promise.reject(e));
};

module.exports = {
    checkUserCardExist,
    existInvestOnLoan,
    existCurrentLoanContract,
    createLoanContract,
    createInvestContract,
    createSettlementContract,
    createInvestingFeeContract,
    calculateInvestedNotes,
    calculateInvestedNotesByDate,
    findOwerAndLoanById,
    findLoanByAdmin,
    findLoanByStatus,
    findLoanById,
    findInvestByStatus,
    findInvestById,
    findInvestByLoanId,
    findInvestByLoanIds,
    findParticipantData,
    findSettlementByAdmin,
    findSettlementByLoanId,
    findSettlementBySettleId,
    getClientCredentials,
    onFullFilledLoanContract,
    onFullFilledSettlementContract,
    importParticipantCardStore,
    issueIdentity,
    settledLoanContract,
    updateParticipantData,
};
