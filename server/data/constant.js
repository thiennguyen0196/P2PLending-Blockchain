/**
 * @description This file contains some useful Constants and Regexs
 */

const path = require('path');

/*Regular Expression for Model */

const genderRegex = ['male', 'female'];

const phoneRegex = /^(\+84|0)(1[2689]|9)[0-9]{8}$/;

const ssnRegex = /^(\d{9}|\d{12})$/;

const userCategoryRegex = ['lender', 'borrower'];

/*Regular Expression for HTTP Request */

const borrowerRegex = 'borrower';

const createLoanReqRegex = [
    'capital',
    'maturityDate',
    'periodMonth',
    'willing',
];

const confirmReqRegex = ['phone', 'password', 'category'];

const confirmResReqex = ['phone', 'category', 'detail'];

const InvestContractResRegex = [
    'contractId',
    'status',
    'loanId',
    'txId'
];

const InvestInfoResRegex = [
    'capital',
    'numNotes',
    'serviceFee',
    'monthlyPrincipalIncome',
    'monthlyInterestIncome',
    'monthlyIncome',
    'monthlyProfit',
    'entirelyProfit'
];

const LoanContractResRegex = [
    'totalNotes',
    'status',
    'info',
    'contractId',
    'investedNotes',
    'txId'
];

const LoanInfoResRegex = [
    'capital',
    'rate',
    'periodMonth',
    'willing',
    'maturityDate',
    'createdDate',
    'investingEndDate',
    'monthlyPrincipalPay',
    'monthlyInterestPay',
    'monthlyPay',
    'entirelyPay'
];

const SettlementContractResRegex = [
    'contractId',
    'status',
    'txId'
];

const SettlementInfoBorrowerRegex = [
    'principalAmount',
    'interestAmount',
    'penaltyAmount',
    'totalAmount',
    'maturityDate',
    'realpaidDate'
];

const SettlementInfoLenderRegex = [
    'maturityDate',
    'realpaidDate'
];

const lenderRegex = 'lender';

const signInReqRegex = ['phone', 'password'];

const signUpReqRegex = ['phone'];

const userDetailReqRegex = [
    'name', 
    'birth', 
    'sex', 
    'email', 
    'address', 
    'city', 
    'ssn', 
    'job',
    'income',
];

const userDetailResRegex = [
    'name', 
    'birth', 
    'sex', 
    'email', 
    'address', 
    'city', 
    'ssn', 
    'job',
    'income',
    'score',
    'imageURLs'
];

const userDetailHLReqRegex = [
    'name', 
    'birth', 
    'sex', 
    'email', 
    'address', 
    'city', 
    'ssn', 
    'job',
    'income',
    'score',
];

/*HTTP Response Status code */

const badReqCode = 400;

const failTokenCode = 401;

const serverErrCode = 500;

const successResCode = 200;

/*Financial Business Logic Constant */

const baseUnitPrice = 50 * Math.pow(10, 4);   

const capitalCoefficient = 3 * Math.pow(10, -7);

const defaultScore = 580;

const factorConstant = 36;

const ficoCoefficient = 3 / 100;

const monthCoefficient = 1 / 3;

const maxCapital = 50 * Math.pow(10, 6);

const minCapital = 1 * Math.pow(10, 6);

const maxPeriod = 18;

const minPeriod = 1;

const investingStageDay = 10;

const serviceFee = 5;

const settlementDayGap = 5;

/*Hyperledger Fabric Blockchain Constant */

/*participant*/
const userDetailConcept = 'UserDetails'; 

/*Transaction */
const createLoanTransaction = 'createLoanContract';

const createSettlementTransaction = 'createSettlementContract';

const createInvestTransaction = 'createInvestContract';

const createInvestFeeTransaction = 'createInvestFeeContract';

const settleLoanContract = 'settleLoanContract';

const onFullFilledLoan = 'onFullFilledLoanContract';

const onFullFilledSettlement = 'onFullFilledSettlementContract';

/*Loan*/
const loanApplicationConcept = 'LoanAplication';

const loanContractAsset = 'LoanContract';

const loanStatus = {
    waiting: 'waiting',
    success: 'success',
    clean: 'clean',
    fail: 'fail',
    all: 'all',
    current: 'current'
};

/*Invest*/

const investContractAsset = 'InvestingContract';

const investApplicationConcept = 'InvestApplication';

const investStatus = {
    waiting_other: 'waiting_other',
    waiting_transfer: 'waiting_other',
    fail_transfer: 'fail_transfer',
    success: 'success',
    clean: 'clean',
    fail: 'fail',
    all: 'all',
};

/*Settlement*/

const settlementContractAsset = 'SettlementContract';

const settleApplicationConcept = 'SettlementApplication';

const settlementStatus = {
    undue: 'undue',
    due: 'due',
    settled: 'settled',
    overdue: 'overdue',
    all: 'all'
};

/*InvestingFee */

const feeContractAsset = 'InvestingFeeContract';

/*Other Constants */

const appDirPath = path.dirname(require.main.filename);

const authTokenProp = 'x-auth';

const defaultResData = 'ok';

const cardStorePath = `${appDirPath}/data/storage/cardstores/cards`;

const clientComposerDataPath = process.env.NODE_ENV ? `${appDirPath}/.composer/client-data` 
    : 'C:/Users/admin/.composer/client-data';

const imageDirPath = `${appDirPath}/data/storage/images/`;

const imageExt = ['image/jpeg', 'image/png', 'image/jpg'];

const imageRegex = 'img';

const oneDayMilliseconds = 1000 * 60 * 60 * 24;

const reqImgFiles = 3;

const verifyCodeLength = 6;

/* */

module.exports = {
    appDirPath,
    baseUnitPrice,
    borrowerRegex,
    authTokenProp,
    badReqCode,
    capitalCoefficient,
    cardStorePath,
    clientComposerDataPath,
    createInvestTransaction,
    createLoanTransaction,
    createInvestFeeTransaction,
    createLoanReqRegex,
    createSettlementTransaction,
    LoanContractResRegex,
    LoanInfoResRegex,
    confirmReqRegex,
    confirmResReqex,
    defaultResData,
    defaultScore,
    genderRegex,
    factorConstant,
    failTokenCode,
    ficoCoefficient,
    onFullFilledLoan,
    onFullFilledSettlement,
    imageDirPath,
    imageExt,
    imageRegex,
    investStatus,
    investContractAsset,
    InvestContractResRegex,
    InvestInfoResRegex,
    investingStageDay,
    maxCapital,
    minCapital,
    maxPeriod,
    minPeriod,
    monthCoefficient,
    loanApplicationConcept,
    investApplicationConcept,
    lenderRegex,
    loanContractAsset,
    loanStatus,
    phoneRegex,
    oneDayMilliseconds,
    reqImgFiles,
    serverErrCode,
    serviceFee,
    signInReqRegex,
    signUpReqRegex,
    ssnRegex,
    successResCode,
    settlementContractAsset,
    settlementStatus,
    settleApplicationConcept,
    settleLoanContract,
    SettlementContractResRegex,
    SettlementInfoBorrowerRegex,
    SettlementInfoLenderRegex,
    settlementDayGap,
    feeContractAsset,
    userCategoryRegex,
    userDetailConcept,
    userDetailHLReqRegex,
    userDetailReqRegex,
    userDetailResRegex,
    verifyCodeLength
};
