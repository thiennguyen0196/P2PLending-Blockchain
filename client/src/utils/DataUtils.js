import moment from 'moment';
import { NavigationActions } from 'react-navigation';
import { onDeleteAllLocalInfo } from '../domain';
import { ConfirmDialog } from '../presentation/component/common';
import NumberUtils from './NumberUtils';
import { 
    Currency,
    DateTime,
    ErrorMsg,
    Minimum
} from '../Constant';
import { Color } from '../presentation/style/Theme';

/*eslint-disable global-require */
/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class DataUtils {
    static combineInvestSuccessData(data) {
        return new Promise((resolve, reject) => {
            if (!data ||
                !data.loan ||
                !Array.isArray(data.loan) ||
                (data.loan.length > 0 && 
                    (!data.invest || !Array.isArray(data.invest)))) {
                return reject(ErrorMsg.COMMON);
            }
            const result = data.loan.map((item, index) => {
                const tmp = {};
                tmp.loan = item;
                tmp.invest = data.invest[index];
                return tmp;
            });
            return resolve(result);
        });
    }

    static combineInvestWaitingTimelineBorrowerData(data, baseUnitPrice) {
        if (!data ||
            !Array.isArray(data)) {
            return [{
                time: 'BLANK',
                title: 'BLANK',
                description: 'BLANK'
            }];
        }
        let unit = Minimum.LOAN_NODE;
        if (Number.isInteger(baseUnitPrice)) {
            unit = baseUnitPrice;
        }
        const nowDate = moment(new Date(), DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY);
        const timeline = data.map((item) => {
            const tmp = {};
            tmp.time = item.date ?
                moment(item.date, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY) : 'BLANK';
            const investedNotes = Number.isInteger(item.investedNotes) ? item.investedNotes : -2;
            if (investedNotes < 0) {
                tmp.description = 'Chưa đến ngày đầu tư';
                return tmp;
            }
            tmp.title = `+${NumberUtils.addMoneySeparator((investedNotes * unit).toString())}${Currency.UNIT_VN}`;
            tmp.description = `Số note đầu tư: ${investedNotes}`;
            if (tmp.time === nowDate && investedNotes >= 0) {
                tmp.lineColor = Color.greenLight;
                tmp.icon = require('../presentation/img/due_green.png');

                return tmp;
            } else if (investedNotes === 0) {
                tmp.lineColor = Color.grayLight;
                tmp.icon = require('../presentation/img/due_gray.png');

                return tmp;
            }
            tmp.lineColor = Color.blueLight;
            tmp.icon = require('../presentation/img/due.png');

            return tmp;
        });
        return timeline;
    }

    static combineSettlementTimelineBorrowerData(settlement) {
        if (!settlement ||
            !Array.isArray(settlement)) {
            return [{
                time: 'BLANK',
                title: 'BLANK',
                description: 'BLANK'
            }];
        }
        const timeline = settlement.map((item) => {
            const tmp = {};
            tmp.time = item.info ? (item.info.maturityDate ? 
                moment(item.info.maturityDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY)
                : '   BLANK  ') : '   BLANK  ';
            tmp.title = item.info ? (Number.isInteger(item.info.totalAmount) ? 
                `${NumberUtils.addMoneySeparator(item.info.totalAmount.toString())}${Currency.UNIT_VN}`
                : 'BLANK') : 'BLANK';
            tmp.description = item.info ? (Number.isInteger(item.info.principalAmount) && 
                Number.isInteger(item.info.interestAmount) && Number.isInteger(item.info.penaltyAmount) ? 
                `Tiền gốc: ${NumberUtils.addMoneySeparator(item.info.principalAmount.toString())}${Currency.UNIT_VN}\nTiền lãi: ${NumberUtils.addMoneySeparator(item.info.interestAmount.toString())}${Currency.UNIT_VN}\nNợ dồn: ${NumberUtils.addMoneySeparator(item.info.penaltyAmount.toString())}${Currency.UNIT_VN}`
                : 'BLANK') : 'BLANK';
            if (item.status === 'due') {
                tmp.description = [tmp.description, '\n-- Kỳ hạn trả hiện tại --'].join('');
                tmp.lineColor = Color.blueLight;
                tmp.icon = require('../presentation/img/due.png');
            } else if (item.status === 'settled') {
                tmp.description = [tmp.description, '\n-- Đã thanh toán kỳ hạn --'].join('');
                tmp.lineColor = Color.greenLight;
                tmp.icon = require('../presentation/img/check.png');
            } else if (item.status === 'overdue') {
                tmp.description = [tmp.description, '\n-- Quá hạn thanh toán --'].join('');
                tmp.lineColor = Color.redLight;
                tmp.icon = require('../presentation/img/uncheck.png');
            } else {
                tmp.description = [tmp.description, '\n-- Chưa đến kỳ hạn --'].join('');
            }
            return tmp;
        });
        return timeline;
    }

    static combineSettlementTimelineLenderData(settlement) {
        if (!settlement ||
            !Array.isArray(settlement)) {
            return [{
                time: 'BLANK',
                title: 'BLANK',
                description: 'BLANK'
            }];
        }
        const timeline = settlement.map((item) => {
            const tmp = {};
            tmp.time = item.info ? (item.info.maturityDate ? 
                moment(item.info.maturityDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY)
                : '   BLANK  ') : '   BLANK  ';
            tmp.description = 'Chưa đến kỳ hạn thanh toán';
            if (item.status === 'due') {
                tmp.description = 'Kỳ hạn trả hiện tại';
                tmp.lineColor = Color.blueLight;
                tmp.icon = require('../presentation/img/due.png');
            } else if (item.status === 'settled') {
                tmp.description = `Ngày thực trả: ${moment(item.info.realpaidDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY)}\nĐã thanh toán kỳ hạn`;
                tmp.lineColor = Color.greenLight;
                tmp.icon = require('../presentation/img/check.png');
            } else if (item.status === 'overdue') {
                tmp.description = 'Quá hạn thanh toán';
                tmp.lineColor = Color.redLight;
                tmp.icon = require('../presentation/img/uncheck.png');
            }
            return tmp;
        });
        return timeline;
    }

    static handleError(error) {
        return new Promise((resolve, reject) => {
            console.log(error);
            const errorHandled = {
                status: null,
                msg: ErrorMsg.COMMON
            };
            if (!error || !error.response) {
                return reject(errorHandled);
            }
            if (error.message) {
                if (error.message === 'Network request failed') {
                    errorHandled.msg = ErrorMsg.NETWORK_INVALID;
                    return reject(errorHandled);
                }
            }
            return error.response.json()
                .then(errorResponse => {
                    console.log(errorResponse.errMsg);
                    if (errorResponse.errMsg instanceof String || 
                        typeof (errorResponse.errMsg) === 'string') {
                        errorHandled.status = error.response.status;
                        errorHandled.msg = errorResponse.errMsg;
                    } 
                    return reject(errorHandled);
                }).catch(() => reject(errorHandled));
        });
    }

    static handleApiStatus(response) {
        return new Promise((resolve, reject) => {
            console.log(response);
            if (!response) {
                return resolve(response);
            }
            if (response.ok) {
                return resolve(response);
            } 
            const error = new Error(response.statusText);
            error.response = response;
            return reject(error);
        });
    }

    static handleApiCatch(error, navigation) {
        console.log(error);
        setTimeout(() => {
            if (error.status === 401) {
                console.log(error.status);
                ConfirmDialog(
                    'Hết phiên đăng nhập',
                    'Bạn đã hết phiên đăng nhập, vui lòng đăng nhập lại để sử dụng chức năng',
                    false
                )
                .then(() => onDeleteAllLocalInfo())
                .then(() => navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'SignIn' })
                    ]
                })))
                .catch(err => {
                    console.log(err);
                    navigation.dispatch(NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignIn' })
                        ]
                    }));
                });
            }
        }, 100);
    }
}

export default DataUtils;
