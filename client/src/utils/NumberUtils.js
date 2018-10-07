/*eslint-disable max-len */
import { Sort } from '../Constant';

class NumberUtils {
    static addCardAccountSeparator(text) {
        if (!text) {
            return text;
        }
        const number = this.removeChar(text);
        if (!number) {
            return number;
        }
        const newText = number.replace(/\B(?=(\d{4})+(?!\d))/g, '-');
        return newText;
    }

    static addMoneySeparator(text) {
        if (!text) {
            return text;
        }
        const number = this.removeChar(text);
        if (!number) {
            return number;
        }
        const newText = number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return newText;
    }

    static calculateProgress(investedNotes, totalNotes) {
        let progress = 100;
        if (Number.isInteger(totalNotes) && Number.isInteger(investedNotes)) {
            progress = Math.round((investedNotes / totalNotes) * 100);
        }
        console.log(progress);
        return progress;
    }

    static getProgressData(data, sum) {
        if (!data || !Array.isArray(data) || !sum) {
            return null;
        }
        const progressData = data.map((item) => {
            const tmp = {};
            tmp.x = ' ';
            tmp.y = Math.round((item / sum) * 100);
            return tmp;
        });
        return progressData;
    }

    static getSummaryProgressDescription(progress) {
        const progressDescription = progress && Array.isArray(progress) && progress.length === 3 ?
            [
                `Tiền gốc\n-- \u2248${progress[0]}% --`,
                `Tiền thực lãi\n-- \u2248${progress[1]}% --`,
                `Phí dịch vụ\n-- \u2248${progress[2]}% --`
            ] : 
            [
                'Tiền gốc\n-- 0% --',
                'Tiền thực lãi\n-- 0% --',
                'Phí dịch vụ\n-- 0% --'
            ];
        return progressDescription;
    }

    static removeChar(text) {
        if (!text) {
            return text;
        }
        const newText = text.replace(/[^0-9]/g, '');
        return newText;
    }

    static sortInvestItem(items, sortType) {
        if (!items) {
            return null;
        }
        if (items.length > 0) {
            if (sortType === Sort.TYPE_CAPITAL) {
                return items.sort((a, b) => b.info.capital - a.info.capital);
            } else if (sortType === Sort.TYPE_RATE) {
                return items.sort((a, b) => b.info.rate - a.info.rate);
            } else if (sortType === Sort.TYPE_INVESTING_DAY_LEFT) {
                return items.sort((a, b) => b.info.investingDayLeft - a.info.investingDayLeft);
            }
        }
    }

    static sortManagementItem(items, sortType) {
        if (!items) {
            return null;
        }
        if (items.length > 0) {
            if (sortType === Sort.TYPE_RATE) {
                return items.sort((a, b) => b.loan.info.rate - a.loan.info.rate);
            } else if (sortType === Sort.TYPE_INTEREST) {
                return items.sort((a, b) => 
                    (b.invest.info.entirelyProfit - b.invest.info.capital) - 
                    (a.invest.info.entirelyProfit - a.invest.info.capital)
                );
            }
        }
    }

    static validateCardNum(cardAccount, prefix) {
        if (!cardAccount || !prefix) {
            return false;
        } 
        if (this.removeChar(cardAccount).slice(0, 6) === prefix) {
            return true;
        }
        return false;
    }
}

export default NumberUtils;
