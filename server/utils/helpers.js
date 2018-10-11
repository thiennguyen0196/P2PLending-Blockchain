/**
 * @description This file contains some helper functions for other usage
 */

const fs = require('fs');

const Constant = require('./../data/constant');

 /*eslint-disable no-mixed-operators */
/*Loan Helper */

const calculateLoanRate = (capital, periodMonth, score) => {
    const {
        factorConstant, 
        ficoCoefficient,
        capitalCoefficient,
        monthCoefficient,
    } = Constant;

    const rate = (factorConstant - (ficoCoefficient * score) + 
        (capitalCoefficient * capital) - (monthCoefficient * periodMonth));
    const result = Math.round(rate * 100) / 100;

    return result;
};

const calculateMonthlyPrincipalPay = (capital, periodMonth) => {
    const principal = capital / periodMonth;
    const result = Math.round(principal);

    return result;
};

const calculateMonthlyInterestPay = (capital, periodMonth, rate) => {
    const principalPay = calculateMonthlyPrincipalPay(capital, periodMonth);
    const interestPay = principalPay * rate / 100;
    const result = Math.round(interestPay);

    return result;
};

const calculateMonthlyPay = (capital, periodMonth, rate) => {
    const result = calculateMonthlyInterestPay(capital, periodMonth, rate) +
        calculateMonthlyPrincipalPay(capital, periodMonth);

    return result;
};

const calculateEntirelyPay = (capital, periodMonth, rate) => {
    const monthlyPay = calculateMonthlyPay(capital, periodMonth, rate);
    const result = monthlyPay * periodMonth;

    return result;
};

const calculateInvestingDayLeft = (endDate) => {
    const result = (endDate - getToday()) / Constant.oneDayMilliseconds;

    return Math.ceil(result);
};
    
const calculateTotalLoanNotes = (capital) => {
    const numBlocks = capital / Constant.baseUnitPrice;
    const result = Math.round(numBlocks);

    return result;
};

/*Lender Helper*/

const calculateMonthlyPrincipalIncome = (principalPay, numNotes) => {
    const result = principalPay / numNotes;
    
    return Math.round(result);
};

const calculateMonthlyInterestIncome = (interestPay, numNotes) => {
    const result = interestPay / numNotes;

    return Math.round(result);
};

const calculateMonthlyIncome = (principalPay, interestPay, numNotes) => {
    const principalIncome = calculateMonthlyPrincipalIncome(principalPay, numNotes);
    const interestIncome = calculateMonthlyInterestIncome(interestPay, numNotes);
    const result = principalIncome + interestIncome;

    return result;
};

const caculateMonthlyServiceFee = (monthlyInterestIncome) => {
    const result = (Constant.serviceFee / 100) * monthlyInterestIncome;

    return Math.round(result);
};

const calculateMonthlyProfit = (monthlyIncome, monthlyInterestIncome) => {
    const result = monthlyIncome - caculateMonthlyServiceFee(monthlyInterestIncome);

    return result;
};

const calculateEntirelyProfit = (monthlyIncome, monthlyInterestIncome, periodMonth) => {
    const result = calculateMonthlyProfit(monthlyIncome, monthlyInterestIncome) * periodMonth;

    return result;
};

const calculateMonthlyInvestedOverall = (investList) => {
    const summary = {};

    if (investList) {
        //console.log(investList);
        investList.forEach((item) => {
            const { info } = item;
            summary.serviceFee = (summary.serviceFee + info.serviceFee) || info.serviceFee;

            summary.monthlyPrincipalIncome = 
                (summary.monthlyPrincipalIncome + info.monthlyPrincipalIncome)
                || info.monthlyPrincipalIncome;

            summary.monthlyInterestIncome = 
                (summary.monthlyInterestIncome + info.monthlyInterestIncome) 
                || info.monthlyInterestIncome;

            summary.monthlyIncome = (summary.monthlyIncome + info.monthlyIncome) 
                || info.monthlyIncome;
                
            summary.monthlyProfit = (summary.monthlyProfit + info.monthlyProfit) 
                || info.monthlyProfit;
        });
    }

    return summary;
};

/*Settlement Helper*/

const findCurrentSettlementByStatus = (settlementList, status) => {
    console.log('findCurrentSettlement');

    return settlementList.findIndex((item) => item.status === status);
};

/*Phone number Helpers */
const covertPhone2InterBase = (phone) => {
    const countryCode = '+84';
    const localCode = '0';

    return phone.toString().indexOf(localCode) === 0 
        ? phone.replace(localCode, countryCode) : phone;
};

const covertPhone2LocalBase = (phone) => {
    const countryCode = '+84';
    const localCode = '0';

    return phone.toString().includes(countryCode) 
        ? phone.replace(countryCode, localCode) : phone;
};

/*General Helpers */
const createFeature = (name) => {
    console.log('Feature:', name);

    return name;
};

const generateVerifyCode = (length) => Math.random().toString().substr(2, length);

const getToday = () => new Date();

/*File Helper */
const readFile2String = (file) => {
    const fileType = 'utf8';

    return new Promise((resolve, reject) => {
        console.log('Helper: readFile');

        return fs.readFile(file, fileType, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};

const findFilePathinDir = (dir, fileRegex) => {
    console.log('Helper: readDir');

    return new Promise((resolve, reject) => {
        let filename;

        return fs.readdir(dir, (err, files) => {
            if (err) {
                return reject(err);
            }
            filename = files.find(file => file.includes(fileRegex));

            return resolve(filename);
        });
    });
};

module.exports = {
    calculateLoanRate,
    calculateMonthlyPrincipalPay,
    calculateMonthlyInterestPay,
    calculateMonthlyPay,
    calculateEntirelyPay,
    calculateTotalLoanNotes,
    calculateMonthlyPrincipalIncome,
    calculateMonthlyInterestIncome,
    calculateMonthlyIncome,
    caculateMonthlyServiceFee,
    calculateMonthlyInvestedOverall,
    calculateMonthlyProfit,
    calculateInvestingDayLeft,
    calculateEntirelyProfit,
    covertPhone2InterBase,
    covertPhone2LocalBase,
    createFeature,
    findFilePathinDir,
    findCurrentSettlementByStatus,
    generateVerifyCode,
    getToday,
    readFile2String
};
