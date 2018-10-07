import { Color } from '../presentation/style/Theme';

/*eslint-disable global-require */
const banners = [
    {
        img: require('../presentation/img/banner1.jpg'),
        link: 'https://google.com/'
    },
    {
        img: require('../presentation/img/banner2.jpg'),
        link: 'https://google.com/'
    },
    {
        img: require('../presentation/img/banner3.jpg'),
        link: 'https://google.com/'
    }
];

const banks = [
    {
        id: '1',
        type: 'bank',
        prefix: '970405',
        img: require('../presentation/img/bank1.png')
    },
    {
        id: '2',
        type: 'bank',
        prefix: '970441',
        img: require('../presentation/img/bank2.png')
    },
    {
        id: '3',
        type: 'bank',
        prefix: '970436',
        img: require('../presentation/img/bank3.png')
    },
    {
        id: '4',
        type: 'bank',
        prefix: '970418',
        img: require('../presentation/img/bank4.png')
    },
    {
        id: '5',
        type: 'bank',
        prefix: '970426',
        img: require('../presentation/img/bank5.png')
    },
    {
        id: '6',
        type: 'bank',
        prefix: '970422',
        img: require('../presentation/img/bank6.png')
    }
];

const eWallets = [
    {
        id: '1',
        type: 'eWallet',
        img: require('../presentation/img/eWallet1.png')
    }
];

const moneyPack = [
    {
        money: 1000000,
        unit: 'VNĐ'
    },
    {
        money: 5000000,
        unit: 'VNĐ'
    },
    {
        money: 10000000,
        unit: 'VNĐ'
    },
    {
        money: 15000000,
        unit: 'VNĐ'
    },
    {
        money: 20000000,
        unit: 'VNĐ'
    },
    {
        money: 25000000,
        unit: 'VNĐ'
    },
    {
        money: 30000000,
        unit: 'VNĐ'
    },
    {
        money: 40000000,
        unit: 'VNĐ'
    },
    {
        money: 45000000,
        unit: 'VNĐ'
    },
    {
        money: 50000000,
        unit: 'VNĐ'
    }
];

const monthPack = [
    {
        month: 1,
        unit: 'tháng'
    },
    {
        month: 3,
        unit: 'tháng'
    },
    {
        month: 6,
        unit: 'tháng'
    },
    {
        month: 9,
        unit: 'tháng'
    },
    {
        month: 12,
        unit: 'tháng'
    },
    {
        month: 15,
        unit: 'tháng'
    },
    {
        month: 18,
        unit: 'tháng'
    }
];

const notiBorrower = [
    {
        iconColor: Color.blue,
        iconName: 'hourglass-half',
        iconType: 'font-awesome',
        notiName: 'Đến hạn trả vay',
        notiDescription: '15.06.2018    100,000đ'
    },

    {
        iconColor: Color.green,
        iconName: 'check',
        iconType: 'font-awesome',
        notiName: 'Khoản vay thành công',
        notiDescription: '15.05.2018'
    },
    {
        iconColor: Color.orange,
        iconName: 'file-text-o',
        iconType: 'font-awesome',
        notiName: 'Khoản vay được đầu tư',
        notiDescription: '15.04.2018    +500,000đ'
    },
    {
        iconColor: Color.orange,
        iconName: 'file-text-o',
        iconType: 'font-awesome',
        notiName: 'Khoản vay được đầu tư',
        notiDescription: '14.04.2018    +500,000đ'
    },
    {
        iconColor: Color.orange,
        iconName: 'file-text-o',
        iconType: 'font-awesome',
        notiName: 'Khoản vay được đầu tư',
        notiDescription: '12.04.2018    +500,000đ'
    },
];

const notiLender = [
    {
        iconColor: Color.blue,
        iconName: 'key',
        iconType: 'font-awesome',
        notiName: 'Hết thời hạn khóa tài khoản',
        notiDescription: '15.06.2018'
    },

    {
        iconColor: Color.orange,
        iconName: 'file-text-o',
        iconType: 'font-awesome',
        notiName: 'Khoản vay trả đúng hạn',
        notiDescription: '15.05.2018    Mã: QWN8NA3J202KCVS'
    },
    {
        iconColor: Color.red,
        iconName: 'lock',
        iconType: 'font-awesome',
        notiName: 'Khóa tài khoản không đầu tư',
        notiDescription: '15.04.2018'
    },
    {
        iconColor: Color.orange,
        iconName: 'file-text-o',
        iconType: 'font-awesome',
        notiName: 'Khoản vay trễ hạn',
        notiDescription: '15.03.2018    Mã: 2KR93JD93MD9SJ3'
    },
    {
        iconColor: Color.green,
        iconName: 'check',
        iconType: 'font-awesome',
        notiName: 'Khoản vay đầu tư thành công',
        notiDescription: '15.02.2018    Mã: 834NVO2JD8274MV'
    },
];

const sortSuccess = [
    {
        iconName: 'line-chart',
        iconType: 'font-awesome',
        selected: true,
        sortName: 'Lãi suất',
        sortType: 'rate'
    },
    {
        iconName: 'balance-scale',
        iconType: 'font-awesome',
        selected: false,
        sortName: 'Tổng thực lãi',
        sortType: 'interest'
    }
];

const sortWaiting = [
    {
        iconName: 'line-chart',
        iconType: 'font-awesome',
        selected: true,
        sortName: 'Lãi suất',
        sortType: 'rate'
    },
    {
        iconName: 'money',
        iconType: 'font-awesome',
        selected: false,
        sortName: 'Số tiền vay',
        sortType: 'capital'
    },
    {
        iconName: 'hourglass-half',
        iconType: 'font-awesome',
        selected: false,
        sortName: 'Ngày còn lại',
        sortType: 'investingDayLeft'
    }
];

export {
    banners,
    banks,
    eWallets,
    moneyPack,
    monthPack,
    notiBorrower,
    notiLender,
    sortSuccess,
    sortWaiting
};
