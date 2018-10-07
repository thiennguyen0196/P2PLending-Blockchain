/*eslint-disable max-len */
/*eslint-disable no-useless-escape */
import NumberUtils from './utils/NumberUtils';

const Action = {
    CREATE_LOAN: 'CREATE_LOAN',
    CREATE_INVEST: 'CREATE_INVEST',
    SETTLE_LOAN: 'SETTLE_LOAN'
};

const Api = {
    DECLARE_ADDRESS: 'address',
    DECLARE_BIRTH: 'birth',
    DECLARE_CITY: 'city',
    DECLARE_EMAIL: 'email',
    DECLARE_INCOME: 'income',
    DECLARE_IMG: 'img',
    DECLARE_IMG_SELFIE: 'selfieImg.jpg',
    DECLARE_IMG_SSN_BACK: 'ssnBackImg.jpg',
    DECLARE_IMG_SSN_FRONT: 'ssnFrontImg.jpg',
    DECLARE_IMG_TYPE: 'image/jpg',
    DECLARE_JOB: 'job',
    DECLARE_NAME: 'name',
    DELCARE_SEX: 'sex',
    DECLARE_SSN: 'ssn',
    TOKEN: 'x-auth',
    TYPE_BORROWER: 'borrower',
    TYPE_LENDER: 'lender'
};

const Bcrypt = {
    SALT: '$2a$10$YiTI4lGejge8/fOVZ/pcau'
};

const Currency = {
    UNIT_VN: 'đ'
};

const DateTime = {
    FORMAT_DISPLAY: 'DD.MM.YYYY',
    FORMAT_FIREBASE: 'DD-MM-YYYY',
    FORMAT_ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
    FORMAT_SEND: 'MM.DD.YYYY'
};

const Default = {
    CODE: '1',
    TRANSACTION_WEB_LINK: 'https://aqueous-hollows-61580.herokuapp.com/#/tx/'
};

const Maximum = {
    CARD_NUM: 19,
    LOAN: 50000000,
    NUM_MONTH: 18,
    SCORE: 890
};

const Minimum = {
    CARD_NUM: 16,
    CODE: 6,
    INCOME: 100000,
    LOAN: 1000000,
    LOAN_NODE: 500000,
    MATURITY_DATE: 10,
    NUM_MONTH: 1,
    // PASSWORD: 6,
    PHONE: 10,
    SCORE: 580
};

const ErrorMsg = {
    CARD_NOT_ENOUGH: `Số thẻ phải từ ${Minimum.CARD_NUM} đến ${Maximum.CARD_NUM} in trên mặt thẻ`,
    CARD_INVALID: 'Số thẻ không hợp lệ',
    CODE_INVALID: 'Mã xác nhận không đúng',
    CODE_NOT_ENOUGH: `Mã xác nhận phải có đúng ${Minimum.CODE} ký tự`,
    COMMON: 'Có lỗi đã xảy ra\nVui lòng thử lại',
    EMAIL_INVALID: 'Email không hợp lệ',
    FIELD_MISSING: 'Vui lòng điền đầy đủ thông tin',
    INCOME_INVALID: `Thu nhập phải lớn hơn ${NumberUtils.addMoneySeparator(Minimum.INCOME.toString())}${Currency.UNIT_VN}/tháng`,
    LOAN_INVALID: `Số tiền vay phải là bội của ${NumberUtils.addMoneySeparator(Minimum.LOAN_NODE.toString())}${Currency.UNIT_VN} và trong khoảng ${NumberUtils.addMoneySeparator(Minimum.LOAN.toString())}${Currency.UNIT_VN} - ${NumberUtils.addMoneySeparator(Maximum.LOAN.toString())}${Currency.UNIT_VN}`,
    NAME_INVALID: 'Họ tên không hợp lệ',
    NETWORK_INVALID: 'Không có kết nối internet\nVui lòng thử lại',
    NUM_MONTH_INVALID: `Số tháng vay phải trong khoảng\n${NumberUtils.addMoneySeparator(Minimum.NUM_MONTH.toString())} tháng và ${NumberUtils.addMoneySeparator(Maximum.NUM_MONTH.toString())} tháng`,
    PASSWORD_CONFIRM_FALSE: 'Xác nhận mật khẩu không khớp',
    // PASSWORD_NOT_ENOUGH: `Mật khẩu phải có ít nhất ${Minimum.PASSWORD} ký tự`,
    PHONE_INVALID: 'Số điện thoại không hợp lệ',
    PHONE_NOT_ENOUGH: `Số điện thoại phải có ít nhất ${Minimum.PHONE} số`,
    SSN_INVALID: 'Số CMND không hợp lệ'
};

const RegularExp = {
    CARD: /^[0-9-]*$/,
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    NUMBER: /^[0-9]*$/,
    NUMBER_SEPARATOR: /^[0-9,]*$/,
    PHONE: /^(\+84|0)(1[2689]|9)[0-9]{8}$/,
    SSN: /^(\d{9}|\d{12})$/
};

const Sort = {
    TYPE_RATE: 'rate',
    TYPE_CAPITAL: 'capital',
    TYPE_INTEREST: 'interest',
    TYPE_INVESTING_DAY_LEFT: 'investingDayLeft'
};

export {
    Action,
    Api,
    Bcrypt,
    Currency,
    DateTime,
    Default,
    Maximum,
    Minimum,
    ErrorMsg,
    RegularExp,
    Sort
};
