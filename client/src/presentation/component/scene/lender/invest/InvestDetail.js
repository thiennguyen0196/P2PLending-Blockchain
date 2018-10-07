import React, { Component } from 'react';
import { 
    ActivityIndicator,
    InteractionManager,
    View,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { Card } from 'react-native-elements';
import { 
    ButtonCustom,
    ConfirmDialog,
    ErrorView,
    ProgressSlide,
    TextCenter
} from '../../../common';
import Detail from '../Detail';
import { 
    onGetLoanDetail
} from '../../../../../domain';
import {
    Action,
    Currency, 
    ErrorMsg,
    Minimum
} from '../../../../../Constant';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import { 
    Color,
    Size 
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class InvestDetail extends Component {
    static navigationOptions = {
        headerTitle: 'Chi Tiết Khoản Vay',
    };

    state = { 
        loanContractId: null,
        error: '', 
        invest: null,
        investedDate: null,
        investedMoney: 0,
        isLoadFirstTime: true,
        loading: false,
        loan: null,
        userDetail: null
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
            this.setState({ 
                loanContractId: params ? params.loanContractId : null,
                loan: params ? params.loan : null,
                investedMoney: params ? params.investedMoney : 0
            });
        }
    }

    onButtonPress() {
        const { loan, loanContractId } = this.state;
        ConfirmDialog(
            'Xác nhận khoản đầu tư',
            'Bạn có chắc chắn muốn đầu tư cho khoản vay này?',
            true
        ).then(() => 
            this.props.navigation.navigate('Gateway', { 
                action: Action.CREATE_INVEST,
                contractId: loanContractId,
                data: loan, 
                money: Minimum.LOAN_NODE,
                onNavigateTop: this.onNavigateTop.bind(this)
            })
        ).catch(() => console.log('Cancel Confirm Create Invest'));
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
                    !result.data.investedDate ||
                    !result.data.userDetail) {
                    this.setState({ 
                        error: ErrorMsg.COMMON,
                        invest: null,
                        investedDate: null,
                        userDetail: null
                    });
                    return;
                }
                this.setState({ 
                    invest: result.data.invest,
                    investedDate: result.data.investedDate, 
                    userDetail: result.data.userDetail 
                });
            })
            .catch(error => {
                this.setState({ 
                    error: error.msg, 
                    isLoadFirstTime: false,
                    loading: false, 
                    invest: null, 
                    investedDate: null,
                    userDetail: null 
                });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    onNavigateTop() {
        this.props.navigation.state.params.onNavigateTop();
    }

    render() {
        const { error, invest, investedMoney,
            isLoadFirstTime, loading, loan, userDetail } = this.state;
        const { buttonStyle, txtInvestedMoneyStyle } = styles;
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
            <View style={style.full}>
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
                    <Text style={style.txtTitle}>TIẾN ĐỘ ĐẦU TƯ</Text>
                    <Card containerStyle={style.cardFull}>
                        <TextCenter 
                            style={txtInvestedMoneyStyle}
                            text={`${NumberUtils.addMoneySeparator(investedMoney.toString())}${Currency.UNIT_VN}`}
                        />
                        <ProgressSlide
                            disabled
                            maximumValue={loan ? (loan.info ? loan.info.capital : 1) : 1}
                            maximumTxt={loan ? (loan.info ? (Number.isInteger(loan.info.capital) ? 
                                `${NumberUtils.addMoneySeparator(loan.info.capital.toString())}${Currency.UNIT_VN}` 
                                : '1đ') : '1đ') : '1đ'}
                            minimumValue={0}
                            minimumTxt='0đ'
                            value={investedMoney}
                        />
                    </Card>

                    <Detail 
                        invest={invest}
                        loan={loan ? loan.info : null}
                        userDetail={userDetail}
                    />
                </ScrollView>
                <ButtonCustom 
                    disabled={loading}
                    onPress={this.onButtonPress.bind(this)}
                    buttonActiveStyle={buttonStyle}
                    title='CAM KẾT ĐẦU TƯ'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginVertical: Size.spacing,
        marginHorizontal: Size.spacing_lg
    },
    txtInvestedMoneyStyle: {
        color: Color.primary,
        fontSize: Size.font,
        marginBottom: 0,
        marginTop: Size.spacing_xs
    }
});

export default InvestDetail;
