import React, { Component } from 'react';
import {
    Dimensions,
    Keyboard,
    Image,
    ScrollView,
    StyleSheet,
    View,
    Text
} from 'react-native';
import { Card } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import {
    BlockchainLoading,
    ButtonCustom,
    ConfirmDialog,
    FormInput,
    ListItemCustom,
    OTPDialog,
    TextCenter,
} from '../../common';
import { 
    onCreateLoan,
    onCreateInvest,
    onSettleLoan,
    onSetFlagDialogFalse,
} from '../../../../domain';
import { 
    Action, 
    Currency,
    Default,
    ErrorMsg, 
    RegularExp,
    Minimum,
    Maximum
} from '../../../../Constant';
import DataUtils from '../../../../utils/DataUtils';
import NumberUtils from '../../../../utils/NumberUtils';
import StringUtils from '../../../../utils/StringUtils';
import { 
    Color,
    Size
} from '../../../style/Theme';
import style from '../../../style/Style';

/*eslint-disable no-param-reassign */
/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
/*eslint-disable global-require */
class PaymentLink extends Component {
    static navigationOptions = {
        headerTitle: 'Liên Kết Cổng Thanh Toán',
    };

    state = { 
        action: null,
        cardName: null,
        cardNum: null,
        codeOTPDialog: '',
        contractId: null,
        data: null,
        dismissOTPDialog: false,
        error: '', 
        errorOTPDialog: '',
        eWalletAccount: null,
        item: null,
        loading: false,
        money: null,
        visibleOTPDialog: false,
        result: null
    };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            this.setState({ 
                action: params.action || null,
                contractId: params.contractId || null,
                data: params.data || null,
                item: params.item || null,
                money: params.money || null
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { action, data, dismissOTPDialog, loading, result, visibleOTPDialog } = this.state;
        if (prevState.visibleOTPDialog && !visibleOTPDialog && !dismissOTPDialog) {
            return this.onPostData()
                    .then(response => {
                        console.log(response);
                        this.setState({ loading: false, result: response });
                    })
                    .catch(error => {
                        this.setState({ error: error.msg, loading: false });
                        DataUtils.handleApiCatch(error, this.props.navigation);
                    });
        }
        if (prevState.loading && !loading && result) {
            let message;
            if (action === Action.CREATE_LOAN) {
                message = 'Bạn đã tạo khoản vay thành công';
            } else if (action === Action.CREATE_INVEST) {
                message = 'Bạn đã cam kết đầu tư thành công';
            } else if (action === Action.SETTLE_LOAN) {
                message = 'Bạn đã thanh toán kỳ hạn thành công';
            }
            return setTimeout(() =>
                ConfirmDialog(
                    'Thông báo',
                    message,
                    false
                )
                .then(() => onSetFlagDialogFalse())
                .then(() => {
                    if (!result.data) {
                        this.setState({ error: ErrorMsg.COMMON });
                        return;
                    }
                    console.log(data, result.data);
                    if (action === Action.CREATE_LOAN) {
                        const investedDate = result.data.investedDate;
                        const loan = result.data;
                        this.props.navigation.dispatch(NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ 
                                    routeName: 'BorrowerTabNavigator', 
                                    params: { investedDate, loan } 
                                })
                            ]
                        }));
                    } else if (action === Action.SETTLE_LOAN) {
                        this.props.navigation.popToTop();
                        this.props.navigation.state.params.onNavigateTop(data, result.data);
                    } else if (action === Action.CREATE_INVEST) {
                        this.onNavigateManagementDetail(data, result.data);
                    }
                })
                .catch(errMsg => this.setState({ error: errMsg, loading: false, result: null })), 100);
        }
    }

    onAccountNumChanged(text) {
        const displayAccountNum = NumberUtils.addCardAccountSeparator(text);
        this.setState({ error: '', accountNum: displayAccountNum });
    }

    onAccountNameChanged(text) {
        this.setState({ error: '', accountName: text });
    }

    onButtonPress() {
        Keyboard.dismiss();
        this.checkValidation()
            .then(() => this.setState({ error: '', visibleOTPDialog: true, dismissOTPDialog: false }))
            .catch(errMsg => this.setState({ error: errMsg }));
    }

    onEWalletAccountChanged(text) {
        this.setState({ error: '', eWalletAccount: text });
    }

    onNavigateManagementDetail(loan, invest) {
        const investedMoney = loan ? (Number.isInteger(loan.investedNotes) ? 
            (Number.isInteger(loan.baseUnitPrice) ? ((loan.investedNotes + 1) * loan.baseUnitPrice) 
            : ((loan.investedNotes + 1) * Minimum.LOAN_NODE)) : 0) : 0;
        const transactionId = invest.txId;
        console.log(loan, invest, transactionId);
        if (invest.status === 'waiting_other') {
            this.props.navigation.navigate('ManagementDetailWaiting', { 
                loanContractId: loan.contractId,
                loan: loan.info, 
                investedMoney,
                transactionId,
                onNavigateTop: this.onNavigateTop.bind(this)
            });
        } else if (invest.status === 'success') {
            this.props.navigation.navigate('ManagementDetailSuccess', { 
                loanContractId: loan.contractId,
                loan: loan.info,
                invest: invest.info,
                investContractId: invest.contractId,
                transactionId,
                onNavigateTop: this.onNavigateTop.bind(this)
            });
        }
    }

    onNavigateTop() {
        this.props.navigation.state.params.onNavigateTop();
    }

    onOTPDialogBtnPress() {
        const { codeOTPDialog } = this.state;
        Keyboard.dismiss();
        if (!codeOTPDialog) {
            this.setState({ errorOTPDialog: ErrorMsg.FIELD_MISSING });
        // } else if (codeOTPDialog.length < Minimum.CODE) {
        //     this.setState({ errorOTPDialog: ErrorMsg.CODE_NOT_ENOUGH });
        } else if (codeOTPDialog !== Default.CODE) {
            this.setState({ errorOTPDialog: ErrorMsg.CODE_INVALID });
        } else {
            this.setState({ errorOTPDialog: '', visibleOTPDialog: false, codeOTPDialog: '' });
        } 
    }

    onOTPDialogCodeChanged(text) {
        this.setState({ codeOTPDialog: text, errorOTPDialog: '' });
    }

    onPostData() {
        const { action, data } = this.state;
        this.setState({ loading: true });
        return new Promise((resolve) => setTimeout(() => {
            if (action === Action.CREATE_LOAN) {
                return resolve(onCreateLoan(
                    data ? (data.capital || null) : null, 
                    data ? (data.periodMonth || null) : null, 
                    data ? (data.maturityDate || null) : null,
                    data ? (data.willing || null) : null
                ));
            } else if (action === Action.CREATE_INVEST) {
                return resolve(onCreateInvest(data ? (data.contractId || null) : null));
            } else if (action === Action.SETTLE_LOAN) {
                return resolve(onSettleLoan(data[1], data[0], data[2]));
            }
        }, 500));
    }

    checkValidation() {
        const { accountName, accountNum, eWalletAccount, action, data, item } = this.state;
        return new Promise((resolve, reject) => {
            if (!data || !action) {
                return reject(ErrorMsg.COMMON);
            } else if (item.type === 'bank') {
                if (!accountName || !accountNum) {
                    return reject(ErrorMsg.FIELD_MISSING);
                } else if (NumberUtils.removeChar(accountNum).length < Minimum.CARD_NUM ||
                    NumberUtils.removeChar(accountNum).length > Maximum.CARD_NUM) {
                    return reject(ErrorMsg.CARD_NOT_ENOUGH);
                } else if (!RegularExp.CARD.test(accountNum) ||
                    !NumberUtils.validateCardNum(accountNum, item.prefix)) {
                    return reject(ErrorMsg.CARD_INVALID);
                }
            } else if (item.type === 'eWallet' && !eWalletAccount) {
                return reject(ErrorMsg.FIELD_MISSING);
            }
            return resolve();
        });
    }

    renderAccountInfo() {
        const { accountName, accountNum, eWalletAccount, item, loading } = this.state;
        const { containerCardStyle, formInputStyle } = styles;
        if (item && item.type === 'bank') {
            return (
                <View>
                    <Text style={style.txtTitle}>THÔNG TIN THẺ</Text>
                    <Card containerStyle={containerCardStyle}>
                        <FormInput
                            containerInputStyle={formInputStyle}
                            editable={!loading}
                            iconName='wallet'
                            iconType='entypo'
                            keyboardType={'numeric'}
                            maxLength={24}
                            onChangeText={this.onAccountNumChanged.bind(this)}
                            placeholder='Số thẻ'
                            value={accountNum}
                        />
                        <FormInput
                            autoCapitalize='words'
                            containerInputStyle={formInputStyle}
                            editable={!loading}
                            iconName='user-circle-o'
                            iconType='font-awesome'
                            onChangeText={this.onAccountNameChanged.bind(this)}
                            placeholder='Họ tên chủ thẻ'
                            value={accountName}
                        />
                    </Card>
                </View>
            );
        } else if (item && item.type === 'eWallet') {
            return (
                <View>
                    <Text style={style.txtTitle}>THÔNG TIN VÍ</Text>
                    <Card containerStyle={containerCardStyle}>
                        <FormInput
                            containerInputStyle={formInputStyle}
                            editable={!loading}
                            iconName='wallet'
                            iconType='entypo'
                            onChangeText={this.onEWalletAccountChanged.bind(this)}
                            placeholder='Tài khoản ví/Số điện thoại'
                            value={eWalletAccount}
                        />
                    </Card>
                </View>
            );
        }
    }

    renderError() {
        const { error } = this.state;
        if (error) {
            return (
                <TextCenter 
                    style={styles.txtErrorStyle}
                    text={error}
                />
            );
        }
    }

    renderPayInfo() {
        const { action, contractId, money } = this.state;
        const { containerCardStyle, txtHighlightStyle } = styles;
        if (action === Action.SETTLE_LOAN) {
            return (
                <View>
                    <Text style={style.txtTitle}>THÔNG TIN THANH TOÁN</Text>
                    <Card containerStyle={containerCardStyle}>
                        <ListItemCustom
                            iconName='file-text-o'
                            iconType='font-awesome'
                            rightTitle={contractId ? StringUtils.formatId(contractId) : 'BLANK'}
                            rightTitleNumberOfLines={3}
                            rightTitleStyle={txtHighlightStyle}
                            title='Mã hợp đồng'
                        />
                        <ListItemCustom
                            iconName='money'
                            iconType='font-awesome'
                            hideDivider
                            rightTitle={Number.isInteger(money) ?
                                `${NumberUtils.addMoneySeparator(money.toString())}${Currency.UNIT_VN}` 
                                : 'BLANK'}
                            rightTitleStyle={txtHighlightStyle}
                            title='Tổng tiền'
                        />
                    </Card>
                </View>
            );
        } else if (action === Action.CREATE_INVEST) {
            return (
                <View>
                    <Text style={style.txtTitle}>THÔNG TIN THANH TOÁN</Text>
                    <Card containerStyle={containerCardStyle}>
                        <ListItemCustom
                            iconName='money'
                            iconType='font-awesome'
                            hideDivider
                            rightTitle={Number.isInteger(money) ?
                                `${NumberUtils.addMoneySeparator(money.toString())}${Currency.UNIT_VN}` 
                                : 'BLANK'}
                            rightTitleStyle={txtHighlightStyle}
                            title='Tổng tiền'
                        />
                    </Card>
                </View>
            );
        }
    }

    render() {
        const { codeOTPDialog, errorOTPDialog, item, loading, visibleOTPDialog } = this.state;
        const { buttonStyle, logoStyle } = styles;
        return (
            <ScrollView>
                <View style={style.alignRow}>
                    <Image
                        source={item ? item.img : null}
                        resizeMode={this.props.resizeMode || 'contain'}
                        style={logoStyle}
                    />
                    <Image
                        source={require('../../../img/logo_gradient.png')}
                        resizeMode={this.props.resizeMode || 'contain'}
                        style={logoStyle}
                    />
                </View>

                {this.renderAccountInfo()}

                {this.renderPayInfo()}

                {this.renderError()}

                <ButtonCustom 
                    disabled={loading}    
                    loading={loading}
                    onPress={this.onButtonPress.bind(this)}
                    buttonActiveStyle={buttonStyle}
                    title='HOÀN THÀNH'
                />

                <OTPDialog 
                    code={codeOTPDialog}
                    error={errorOTPDialog}
                    visible={visibleOTPDialog}
                    onOTPDialogCodeChanged={this.onOTPDialogCodeChanged.bind(this)}
                    onOTPDialogDismiss={() => this.setState({ 
                        codeOTPDialog: '',
                        dismissOTPDialog: true,
                        visibleOTPDialog: false 
                    })}
                    onOTPDialogBtnPress={this.onOTPDialogBtnPress.bind(this)}
                />

                <BlockchainLoading 
                    loading={loading} 
                    textState={'Hệ thống đang ghi dữ liệu\nlên blockchain'}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginVertical: Size.spacing,
        marginHorizontal: Size.spacing_sm
    },
    containerCardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: 0,
        padding: 0
    },
    formInputStyle: {
        borderWidth: 2,
        borderColor: Color.grayLight
    },
    logoStyle: {
        height: (Dimensions.get('window').width / 2.5) / Size.ratio_16_9,
        width: (Dimensions.get('window').width / 2.5),
        margin: Size.spacing
    },
    txtErrorStyle: {
        color: Color.red,
        marginTop: Size.spacing
    },
    txtHighlightStyle: {
        fontWeight: 'bold'
    }
});

export default PaymentLink;
