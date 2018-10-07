import { 
    Header,
    StackNavigator 
} from 'react-navigation';
import React from 'react';
import { 
    View, 
    StyleSheet 
} from 'react-native';
import { Gradient } from './presentation/component/common';
import BorrowerTabNavigator from './presentation/component/scene/borrower/BorrowerTabNavigator';
import DeclarationImg from './presentation/component/scene/declaration/DeclarationImg';
import DeclarationInfo from './presentation/component/scene/declaration/DeclarationInfo';
import Gateway from './presentation/component/scene/payment_link/Gateway';
import HistoryDetailClean from './presentation/component/scene/borrower/history/HistoryDetailClean';
import HistoryDetailFail from './presentation/component/scene/borrower/history/HistoryDetailFail';
import InvestDetail from './presentation/component/scene/lender/invest/InvestDetail';
import LenderTabNavigator from './presentation/component/scene/lender/LenderTabNavigator';
import LoanConfirm from './presentation/component/scene/borrower/loan/LoanConfirm';
import LoanCreate from './presentation/component/scene/borrower/loan/LoanCreate';
import LoanDetail from './presentation/component/scene/borrower/loan/LoanDetail';
import ManagementDetailSuccess 
    from './presentation/component/scene/lender/management/ManagementDetailSuccess';
import ManagementDetailWaiting 
    from './presentation/component/scene/lender/management/ManagementDetailWaiting';
import MyNotification from './presentation/component/scene/notification/MyNotification';
import PaymentLink from './presentation/component/scene/payment_link/PaymentLink';
import VerifySignUp from './presentation/component/scene/verify/VerifySignUp';
import Settlement from './presentation/component/scene/borrower/loan/Settlement';
import SignIn from './presentation/component/scene/sign_in/SignIn';
import SignUp from './presentation/component/scene/sign_up/SignUp';
import WebTransaction from './presentation/component/scene/web/WebTransaction';
import { Color } from './presentation/style/Theme';

const AppNavigator = 
    StackNavigator({
        BorrowerTabNavigator: {
            screen: BorrowerTabNavigator
        },
        DeclarationImg: {
            screen: DeclarationImg
        },
        DeclarationInfo: {
            screen: DeclarationInfo
        },
        Gateway: {
            screen: Gateway
        },
        HistoryDetailClean: {
            screen: HistoryDetailClean
        },
        HistoryDetailFail: {
            screen: HistoryDetailFail
        },
        InvestDetail: {
            screen: InvestDetail
        },
        LenderTabNavigator: {
            screen: LenderTabNavigator
        },
        LoanConfirm: {
            screen: LoanConfirm
        },
        LoanCreate: {
            screen: LoanCreate,
        },
        LoanDetail: {
            screen: LoanDetail
        },
        ManagementDetailSuccess: {
            screen: ManagementDetailSuccess
        },
        ManagementDetailWaiting: {
            screen: ManagementDetailWaiting
        },
        MyNotification: {
            screen: MyNotification
        },
        PaymentLink: {
            screen: PaymentLink
        },
        Settlement: {
            screen: Settlement
        },
        SignIn: {
            screen: SignIn
        },
        SignUp: {
            screen: SignUp
        },
        VerifySignUp: {
            screen: VerifySignUp
        },
        WebTransaction: {
            screen: WebTransaction
        },
    },
    {
        initialRouteName: 'SignIn',
        navigationOptions: {
            header: props => <GradientHeader {...props} />,
            headerBackTitle: null,
            headerStyle: {
                backgroundColor: 'transparent',
                shadowColor: Color.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                elevation: 2
            },
            headerTintColor: Color.white
        },
        cardStyle: {
            backgroundColor: Color.background
        }
    }
);

const GradientHeader = props => (
    <View>
        <Gradient 
            containerStyle={[StyleSheet.absoluteFill, { height: Header.HEIGHT }]}
        />
        <Header {...props} />
    </View>
);

export default AppNavigator;
