import firebase from 'react-native-firebase';
/*eslint-disable no-undef */

export const createInvestFB = (loanId) => {
    return new Promise((resolve, reject) => {
        return firebase.messaging().getToken()
            .then(deviceToken => {
                console.log(deviceToken);
                return firebase.database().ref()
                    .child(loanId)
                    .child('investor')
                    .child(deviceToken)
                    .set(true);
            })
            .then(() => resolve())
            .catch(error => reject(error));
    });
};

export const createLoanFB = (loanId, willing) => {
    return new Promise((resolve, reject) => {
        return firebase.messaging().getToken()
            .then(deviceToken => {
                console.log(deviceToken);
                return firebase.database().ref()
                    .child(loanId)
                    .child('borrower')
                    .child(deviceToken)
                    .set(true);
            })
            .then(() => firebase.database().ref()
                .child(loanId)
                .child('Goal')
                .set(willing))
            .then(() => resolve())
            .catch(error => reject(error));
    });
};

export const requestPermissionFB = () => {
    return new Promise((resolve, reject) => {
        return firebase.messaging().hasPermission()
            .then(enabled => {
                console.log(enabled);
                if (enabled) {
                    return resolve();
                }
                return resolve(firebase.messaging().requestPermission());
            })
            .catch(error => reject(error));
    });
};

export const settleLoanFB = (loanId, maturityDate) => {
    return new Promise((resolve, reject) => {
        return firebase.database().ref()
                .child(loanId)
                .child('settlement')
                .child(maturityDate)
                .set(true)
            .then(() => resolve())
            .catch(error => reject(error));
    });
};
