import React, { Component } from 'react';
import { 
    ActivityIndicator,
    BackHandler,
    InteractionManager,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { 
    Card,
    Icon 
} from 'react-native-elements';
import { 
    ButtonCustom,
    ErrorView,
    ProgressSlide,
    TextCenter
} from '../../../common';
import Detail from '../Detail';
import { onGetLoanDetail } from '../../../../../domain';
import {
    Currency, 
    ErrorMsg
} from '../../../../../Constant';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import StringUtils from '../../../../../utils/StringUtils';
import { 
    Color,
    Size 
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class ManagementDetailWaiting extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        if (params.onNavigateTop) {
            return {
                gesturesEnabled: false,
                headerTitle: 'Chi Tiết Khoản Đầu Tư',
                headerLeft: (
                    <Icon
                        color={Color.white}
                        containerStyle={Platform.OS === 'ios' ? {} : styles.iconHeaderAndroidStyle}
                        component={TouchableOpacity}
                        name={Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left'}
                        onPress={() => {
                            navigation.popToTop();
                            params.onNavigateTop();
                        }}  
                        type='material-community'
                        size={Platform.OS === 'ios' ? Size.spacing_xlg : Size.icon}
                    />
                )
            };
        }
        return {
            headerTitle: 'Chi Tiết Khoản Đầu Tư'
        };
    }

    constructor(props) {
        super(props);
        this.backButtonListener = null;
    }

    state = { 
        loanContractId: null,
        error: '', 
        invest: null,
        investContractId: null,
        investedMoney: 0,
        isLoadFirstTime: true,
        loading: false, 
        loan: null,
        userDetail: null,
        transactionId: null
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.onGetData();
        });
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            if (params.onNavigateTop) {
                this.addHandleBackPress();
            }
            this.setState({ 
                loanContractId: params ? params.loanContractId : null,
                loan: params ? params.loan : null,
                investedMoney: params ? params.investedMoney : 0
            });
        }
    }

    componentWillUnmount() {
        this.removeHandleBackPress();
    }

    onGetData() {
        const { loanContractId } = this.state;
        this.setState({ loading: true });
        onGetLoanDetail(loanContractId)
            .then(result => {
                console.log(result);
                this.setState({ loading: false, isLoadFirstTime: false });
                if (!result.data ||
                    !result.data.invest ||
                    !result.data.userDetail) {
                    this.setState({ 
                        error: ErrorMsg.COMMON,
                        invest: null,
                        userDetail: null
                    });
                    return;
                }
                this.setState({ 
                    invest: result.data.invest.info,
                    investContractId: result.data.invest.contractId,
                    userDetail: result.data.userDetail 
                });
            })
            .catch(error => {
                this.setState({ 
                    error: error.msg, 
                    isLoadFirstTime: false,
                    loading: false, 
                    invest: null,
                    investContractId: null,
                    userDetail: null 
                });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    addHandleBackPress() {
        this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.popToTop();
            this.props.navigation.state.params.onNavigateTop();
            return true;
        });
    }

    removeHandleBackPress() {
        if (this.props.navigation.state.params.onNavigateTop) {
            this.backButtonListener.remove();
        }
    }

    render() {
        const { error, invest, investContractId, investedMoney, 
            isLoadFirstTime, loading, loan, userDetail } = this.state;
        const { txtInvestedMoneyStyle } = styles;
        const { params } = this.props.navigation.state;
        const transactionId = params ? params.transactionId : null;
        if (error) {
            return (
                <ErrorView
                    onPress={this.onGetData.bind(this)}
                    error={error}
                    loading={loading}
                />
            );
        }
        if (isLoadFirstTime) {
            return (
                <ActivityIndicator
                    color={Color.primary}
                    size='large'
                    style={style.absoluteCenter}
                />
            );
        }
        return (
            <ScrollView 
                contentContainerStyle={style.fullScroll}
                refreshControl={
                    <RefreshControl
                        colors={[Color.primary, Color.orange]}
                        refreshing={loading} 
                        onRefresh={this.onGetData.bind(this)}
                        tintColor={Color.primary}
                    />
                }
            >
                <Card containerStyle={style.cardFull}>
                    <TextCenter 
                        style={style.txtCaption}
                        text='Mã hợp đồng đầu tư' 
                    />
                    <TextCenter 
                        style={style.txtPrimary}
                        text={investContractId ? `${StringUtils.formatId(investContractId)}` 
                            : 'BLANK'} 
                    />
                </Card>
                <Text style={style.txtTitle}>TIẾN ĐỘ ĐẦU TƯ</Text>
                <Card containerStyle={style.cardFull}>
                    <TextCenter 
                        style={txtInvestedMoneyStyle}
                        text={`${NumberUtils.addMoneySeparator(investedMoney.toString())}${Currency.UNIT_VN}`}
                    />
                    <ProgressSlide
                        disabled
                        maximumValue={loan ? loan.capital : 1}
                        maximumTxt={loan ? (Number.isInteger(loan.capital) ? 
                            `${NumberUtils.addMoneySeparator(loan.capital.toString())}${Currency.UNIT_VN}` 
                            : '1đ') : '1đ'}
                        minimumValue={0}
                        minimumTxt='0đ'
                        value={investedMoney}
                    />
                </Card>

                <Detail 
                    invest={invest}
                    loan={loan}
                    userDetail={userDetail}
                />
                
                <ButtonCustom
                    buttonActiveStyle={styles.buttonStyle}
                    icon={{
                        name: 'link', 
                        type: 'feather'
                    }}
                    onPress={() => {
                        this.removeHandleBackPress();
                        this.props.navigation.navigate('WebTransaction', { 
                            transactionId,
                            onNavigateBack: this.addHandleBackPress.bind(this)
                        });
                    }}
                    title='XEM GIAO DỊCH'
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginBottom: Size.spacing,
        marginHorizontal: Size.spacing_xlg,
        marginTop: Size.spacing_lg
    },
    iconHeaderAndroidStyle: {
        marginLeft: Size.spacing_sm
    },
    txtInvestedMoneyStyle: {
        color: Color.primary,
        fontSize: Size.font,
        marginBottom: 0,
        marginTop: Size.spacing_xs
    }
});

export default ManagementDetailWaiting;
