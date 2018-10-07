import React, { Component } from 'react';
import {
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { 
    Card,
    Icon 
} from 'react-native-elements';
import {
    ErrorView,
    SliderAd,
    TextCenter,
} from '../../../common';
import { onGetLoan } from '../../../../../domain';
import LoanWaiting from './LoanWaiting';
import LoanSuccess from './LoanSuccess';
import DataUtils from '../../../../../utils/DataUtils';
import { 
    Color, 
    Size
} from '../../../../style/Theme';
import { ErrorMsg } from '../../../../../Constant';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
class Loan extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Khoản Vay',
            headerRight: (
                <View style={style.alignRow}>
                    <Icon
                        color={Color.white}
                        containerStyle={style.iconHeader}
                        component={TouchableOpacity}
                        name='refresh'
                        onPress={params.onGetData} 
                        type='font-awesome'
                        size={Size.icon_sm}
                    />
                    <Icon
                        color={Color.white}
                        containerStyle={style.iconHeader}
                        component={TouchableOpacity}
                        name='bell-o'
                        onPress={() => navigation.navigate('MyNotification', { type: 'borrower' })} 
                        type='font-awesome'
                        size={Size.icon_sm}
                    />
                </View>
            ),
        };
    }

    state = { 
        enablePay: -1, 
        error: '', 
        investedDate: null, 
        loading: false, 
        loan: null, 
        settlement: null 
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ onGetData: this.onGetData.bind(this) });
        });
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            this.setState({ 
                enablePay: Number.isInteger(params.enablePay) ? params.enablePay : -1,
                investedDate: params.investedDate || null,
                loan: params.loan || null, 
                settlement: params.settlement || null 
            });
        }
    }

    onGetData() {
        this.setState({ loading: true });
        onGetLoan()
            .then(result => {
                console.log(result);
                this.setState({ loading: false });
                if (!result.data ||
                    !result.data.loan ||
                    !Array.isArray(result.data.loan) ||
                    (result.data.loan.length > 0 && result.data.loan[0].status === 'success' && 
                        (!result.data.settlement || !Array.isArray(result.data.settlement)))) {
                    this.setState({ error: ErrorMsg.COMMON, loan: null });
                    return;
                }
                if (result.data.loan.length > 0) {
                    if (result.data.loan[0].status === 'success') {
                        this.setState({ 
                            error: '',
                            enablePay: result.data.enablePay,
                            loan: result.data.loan[0], 
                            settlement: result.data.settlement
                        });
                    } else if (result.data.loan[0].status === 'waiting') {
                        this.setState({ 
                            error: '',
                            investedDate: result.data.investedDate[0],
                            loan: result.data.loan[0] 
                        });
                    } else {
                        this.setState({ error: '', loan: null });
                    }
                } else if (result.data.loan.length === 0) {
                    this.setState({ error: '', loan: null });
                }
            })
            .catch(error => {
                this.setState({ error: error.msg, loading: false, loan: null });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    renderDataNullView() {
        const { cardStyle, iconStyle, txtBigStyle } = styles;
        const { error, loan, loading } = this.state;
        if (error && !loan) {
            return (
                <ErrorView
                    onPress={this.onGetData.bind(this)}
                    error={error}
                    loading={loading}
                />
            );
        }
        if (!error && !loan) {
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
                    <SliderAd />
                    <View style={StyleSheet.flatten([style.alignRow, style.full])}>
                        <TouchableOpacity 
                            style={style.full}
                            onPress={() => this.props.navigation.navigate('LoanCreate', { 
                                money: '10000000',
                                willing: 'Đóng học phí' 
                            })}
                        >
                            <Card containerStyle={cardStyle}>
                                <Icon
                                    color={Color.green}
                                    containerStyle={iconStyle}
                                    name='book'
                                    reverse
                                    size={Size.icon}
                                    type='font-awesome'
                                />
                                <TextCenter 
                                    style={txtBigStyle}
                                    text='Học Phí'
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text='Đóng học phí nhanh chóng tiện lợi' 
                                />
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={style.full}
                            onPress={() => this.props.navigation.navigate('LoanCreate', { 
                                money: '40000000',
                                willing: 'Mua xe máy' 
                            })}
                        >
                            <Card containerStyle={cardStyle}>
                                <Icon
                                    color={Color.orange}
                                    containerStyle={iconStyle}
                                    name='motorcycle'
                                    reverse
                                    size={Size.icon}
                                    type='font-awesome'
                                />
                                <TextCenter 
                                    style={txtBigStyle}
                                    text='Xe Máy'
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text='Thay đổi phong cách vi vu của bạn' 
                                />
                            </Card>
                        </TouchableOpacity>
                    </View>
                    <View style={StyleSheet.flatten([style.alignRow, style.full])}>
                        <TouchableOpacity 
                            style={style.full}
                            onPress={() => this.props.navigation.navigate('LoanCreate', { 
                                money: '5000000',
                                willing: 'Đi du lịch' 
                            })}
                        >
                            <Card containerStyle={cardStyle}>
                                <Icon
                                    color={Color.blue}
                                    containerStyle={iconStyle}
                                    name='beach'
                                    reverse
                                    size={Size.icon}
                                    type='material-community'
                                />
                                <TextCenter 
                                    style={txtBigStyle}
                                    text='Du Lịch'
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text='Tận hưởng một chuyến đi tuyệt vời' 
                                />
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={style.full}
                            onPress={() => this.props.navigation.navigate('LoanCreate')}
                        >
                            <Card containerStyle={cardStyle}>
                                <Icon
                                    color={Color.grayLight}
                                    containerStyle={iconStyle}
                                    name='dots-three-horizontal'
                                    reverse
                                    size={Size.icon}
                                    type='entypo'
                                />
                                <TextCenter 
                                    style={txtBigStyle}
                                    text='Khác'
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text='Hãy tạo khoản vay tiêu dùng ngay' 
                                />
                            </Card>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            );
        }
    }

    renderLoanWaiting() {
        const { investedDate, loading, loan } = this.state;
        return (
            <LoanWaiting 
                investedDate={investedDate || null}
                loan={loan || null}
                onDetailPress={() => this.props.navigation.navigate('LoanDetail', { 
                    data: loan ? loan.info : null,
                    contractId: loan ? loan.contractId : null,
                    transactionId: loan ? loan.txId : null,
                })}
                onRefresh={this.onGetData.bind(this)}
                loading={loading}
            />
        );
    }

    renderLoanSuccess() {
        const { enablePay, loading, loan, settlement } = this.state;
        return (
            <LoanSuccess
                enablePay={enablePay}
                loan={loan || null}
                loading={loading}
                onDetailPress={() => this.props.navigation.navigate('LoanDetail', { 
                    data: loan ? loan.info : null,
                    contractId: loan ? loan.contractId : null,
                    transactionId: loan ? loan.txId : null,
                })}
                onRefresh={this.onGetData.bind(this)}
                onPayFunc={() => this.props.navigation.navigate('Settlement', { 
                    loanId: loan ? loan.contractId : null, 
                    data: settlement && enablePay > -1 ? settlement[enablePay] : null,
                    onNavigateTop: this.onGetData.bind(this)
                })}
                settlement={settlement || null}
            />
        );
    }

    renderLoanUI() {
        const { error, loan } = this.state;
        if (!loan || loan.length === 0 || error) {
            return this.renderDataNullView();
        }
        if (loan.status === 'waiting') {
            return this.renderLoanWaiting();
        } else if (loan.status === 'success') {
            return this.renderLoanSuccess();
        }
    }

    render() {
        return (
            <View style={style.full}>
                {this.renderLoanUI()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 0,
        marginTop: 0
    },
    iconStyle: {
        alignSelf: 'center',
    },
    txtBigStyle: {
        color: Color.primary,
        fontSize: Size.font_xxlg,
        marginVertical: 0
    }
});

export default Loan;
