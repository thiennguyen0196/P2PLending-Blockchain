import ApiJson from './api.json';
import DataUtils from '../../utils/DataUtils';
import { Api } from '../../Constant';
/*eslint-disable no-undef */

export const createInvest = (contractId, token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_INVEST_CREATE, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify({
                loanId: contractId
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const createLoan = (capital, periodMonth, maturityDate, willing, token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_CREATE, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify({
                capital,
                periodMonth,
                maturityDate,
                willing
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const declareInfo = (address, birth, city, email, job, income, name, sex, ssn, token, 
    ssnBackImg, ssnFrontImg, selfieImg) => {
    return new Promise((resolve, reject) => {
        const params = new FormData();
        params.append(Api.DECLARE_NAME, name);
        params.append(Api.DECLARE_BIRTH, birth);
        params.append(Api.DELCARE_SEX, sex);
        params.append(Api.DECLARE_EMAIL, email);
        params.append(Api.DECLARE_ADDRESS, address);
        params.append(Api.DECLARE_CITY, city);
        params.append(Api.DECLARE_SSN, ssn);
        params.append(Api.DECLARE_JOB, job);
        params.append(Api.DECLARE_INCOME, parseFloat(income));
        params.append(Api.DECLARE_IMG, 
            { uri: ssnBackImg.uri, name: Api.DECLARE_IMG_SSN_BACK, type: Api.DECLARE_IMG_TYPE });
        params.append(Api.DECLARE_IMG, 
            { uri: ssnFrontImg.uri, name: Api.DECLARE_IMG_SSN_FRONT, type: Api.DECLARE_IMG_TYPE });
        params.append(Api.DECLARE_IMG, 
            { uri: selfieImg.uri, name: Api.DECLARE_IMG_SELFIE, type: Api.DECLARE_IMG_TYPE });
        console.log(params);
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_DECLARE, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'x-auth': token
            },
            body: params
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoan = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoanCleanList = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_CLEAN_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoanDetail = (token, contractId) => {
    return new Promise((resolve, reject) => {
        console.log(ApiJson.LINK_URL + ApiJson.LINK_LOAN_DETAIL_GET + contractId);
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_DETAIL_GET + contractId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoanFailList = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_FAIL_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoanInvestedSuccessList = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_INVEST_SUCCESS_LIST_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoanInvestedWaitingList = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_INVEST_WAITING_LIST_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getLoanWaitingList = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_WAITING_LIST_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getSettlement = (token, contractId) => {
    return new Promise((resolve, reject) => {
        console.log(ApiJson.LINK_URL + ApiJson.LINK_SETTLEMENT_GET + contractId);
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_SETTLEMENT_GET + contractId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getSummary = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_SUMMARY_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const getUserInfo = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_USER_INFO_GET, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const editInfo = (address, birth, city, email, job, income, name, sex, ssn, token, 
    ssnBackImg, ssnFrontImg, selfieImg) => {
    return new Promise((resolve, reject) => {
        const params = new FormData();
        params.append(Api.DECLARE_NAME, name);
        params.append(Api.DECLARE_BIRTH, birth);
        params.append(Api.DELCARE_SEX, sex);
        params.append(Api.DECLARE_EMAIL, email);
        params.append(Api.DECLARE_ADDRESS, address);
        params.append(Api.DECLARE_CITY, city);
        params.append(Api.DECLARE_SSN, ssn);
        params.append(Api.DECLARE_JOB, job);
        params.append(Api.DECLARE_INCOME, parseFloat(income));
        params.append(Api.DECLARE_IMG, 
            { uri: ssnBackImg.uri, name: Api.DECLARE_IMG_SSN_BACK, type: Api.DECLARE_IMG_TYPE });
        params.append(Api.DECLARE_IMG, 
            { uri: ssnFrontImg.uri, name: Api.DECLARE_IMG_SSN_FRONT, type: Api.DECLARE_IMG_TYPE });
        params.append(Api.DECLARE_IMG, 
            { uri: selfieImg.uri, name: Api.DECLARE_IMG_SELFIE, type: Api.DECLARE_IMG_TYPE });
        console.log(params);
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_USER_INFO_PATCH, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'x-auth': token
            },
            body: params
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const settleLoan = (loanId, settledId, token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_SETTLE, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify({
                settledId,
                loanId
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const signIn = (password, phone) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_SIGNIN, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                password
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => {
            let token;
            if (responseHandled.headers) {
                token = responseHandled.headers.get(Api.TOKEN);
            }
            console.log(token);
            return resolve([token, responseHandled.json()]);
        })
        .catch(error => reject(error));
    });
};

export const signOut = (token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_SIGNOUT, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const signUp = (phone) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_SIGNUP, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const submitLoan = (capital, periodMonth, maturityDate, willing, token) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_LOAN_SUBMIT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify({
                capital,
                periodMonth,
                maturityDate,
                willing
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => responseHandled.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
};

export const verifyAccount = (category, code, password, phone) => {
    return new Promise((resolve, reject) => {
        return fetch(ApiJson.LINK_URL + ApiJson.LINK_CONFIRM, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                password,
                category,
                code
            })
        })
        .then(response => DataUtils.handleApiStatus(response))
        .then(responseHandled => {
            let token;
            if (responseHandled.headers) {
                token = responseHandled.headers.get(Api.TOKEN);
            }
            console.log(token);
            return resolve([token, responseHandled.json()]);
        })
        .catch(error => reject(error));
    });
};
