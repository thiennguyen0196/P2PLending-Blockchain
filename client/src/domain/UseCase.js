import * as localService from '../data/local';
import * as networkService from '../data/network';
import DataUtils from '../utils/DataUtils';
import HashUtils from '../utils/HashUtils';

/*eslint-disable no-nested-ternary */
export const onCreateInvest = (contractId) => {
    console.log(contractId);
    let resultData;
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.createInvest(contractId, token))
            .then(data => {
                resultData = data;
                return localService.setFlag('true');
            })
            .then(() => networkService.createInvestFB(contractId))
            .then(() => resolve(resultData))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
            );
        });
};

export const onCreateLoan = (capital, periodMonth, maturityDate, willing) => {
    console.log(capital, periodMonth, willing);
    let resultData;
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.createLoan(capital, periodMonth, 
                maturityDate, willing, token))
            .then(data => {
                resultData = data;
                return localService.setFlag('true');
            })
            .then(() => {
                if (resultData && resultData.data && resultData.data.contractId) {
                    return networkService.createLoanFB(resultData.data.contractId, willing);
                } 
                console.log('Error loanContractID');
                return reject('Error Firebase');
            })
            .then(() => resolve(resultData))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
            );
        });
};

export const onDeclareInfo = (address, birth, city, email, job, income, name, sex, ssn, 
    ssnBackImg, ssnFrontImg, selfieImg) => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.declareInfo(address, birth, city, 
                email, job, income, name, sex, ssn, token, ssnBackImg, ssnFrontImg, selfieImg))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onDeleteAllLocalInfo = () => {
    return localService.deleteAll();
};

export const onSetFlagDialogFalse = () => {
    return new Promise((resolve, reject) => {
        return localService.setFlag('false')
            .then(() => resolve())
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onEditInfo = (address, birth, city, email, job, income, name, sex, ssn, 
    ssnBackImg, ssnFrontImg, selfieImg) => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.editInfo(address, birth, city, 
                email, job, income, name, sex, ssn, token, ssnBackImg, ssnFrontImg, selfieImg))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetFlagDialog = () => {
    return new Promise((resolve, reject) => {
        return localService.getFlag()
            .then(value => resolve(value))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetLoan = () => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getLoan(token))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetHistory = () => {
    const history = [];
    let userToken;
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => {
                userToken = token;
                return networkService.getLoanCleanList(userToken);
            })
            .then(loanClean => {
                history.push(loanClean ? loanClean.data : null);
                return networkService.getLoanFailList(userToken);
            })
            .then(loanFail => {
                history.push(loanFail ? loanFail.data : null);
                return resolve(history);
            })
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetLoanInvestedSuccessList = () => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getLoanInvestedSuccessList(token))
            .then(result => DataUtils.combineInvestSuccessData(result.data))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetLoanInvestedWaitingList = () => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getLoanInvestedWaitingList(token))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetLoanDetail = (contractId) => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getLoanDetail(token, contractId))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetLoanWaitingList = () => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getLoanWaitingList(token))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetPhoneNumber = () => {
    return new Promise((resolve, reject) => {
        return localService.getPhoneNumber()
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetSettlement = (contractId) => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getSettlement(token, contractId))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetSummary = () => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getSummary(token))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onGetUserInfo = () => {
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.getUserInfo(token))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onSettleLoan = (loanId, settleId, maturityDate) => {
    let resultData;
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.settleLoan(loanId, settleId, token))
            .then(data => {
                resultData = data;
                return localService.setFlag('true');
            })
            .then(() => networkService.settleLoanFB(loanId, maturityDate))
            .then(() => resolve(resultData))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
            );
        });
};

export const onSignIn = (password, phone) => {
    let userInfo;
    return new Promise((resolve, reject) => {
        return HashUtils.hashPassword(password)
            .then(hashPassword => {
                console.log(hashPassword, phone);
                return networkService.signIn(hashPassword, phone);
            })
            .then(data => {
                userInfo = data[1];
                return localService.saveUserInfo(phone, data[0]);
            })
            .then(() => networkService.requestPermissionFB())
            .then(() => resolve(userInfo))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
            );
    });
};

export const onSignOut = () => {
    let data;
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.signOut(token))
            .then(resultData => {
                data = resultData;
                return localService.deleteAll();
            })
            .then(() => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onSignUp = (phone) => {
    console.log(phone);
    return new Promise((resolve, reject) => {
        return networkService.signUp(phone)
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
        );
    });
};

export const onSubmitLoan = (capital, periodMonth, maturityDate, willing) => {
    console.log(capital, periodMonth, maturityDate, willing);
    return new Promise((resolve, reject) => {
        return localService.getUserToken()
            .then(token => networkService.submitLoan(capital, periodMonth, 
                maturityDate, willing, token))
            .then(data => resolve(data))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
            );
    });
};

export const onVerify = (category, code, password, phone) => {
    let userInfo;
    return new Promise((resolve, reject) => {
        return HashUtils.hashPassword(password)
            .then(hashPassword => {
                console.log(category, code, hashPassword, phone);
                return networkService.verifyAccount(category, code, hashPassword, phone);
            })
            .then(data => {
                userInfo = data[1];
                return localService.saveUserInfo(phone, data[0]);
            })
            .then(() => resolve(userInfo))
            .catch(error => DataUtils.handleError(error)
                .then(null, errorHandled => reject(errorHandled))
            );
    });
};
