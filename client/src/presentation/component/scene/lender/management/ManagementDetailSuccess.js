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
    TimeLine,
    TextCenter
} from '../../../common';
import Detail from '../Detail';
import { onGetLoanDetail } from '../../../../../domain';
import { ErrorMsg } from '../../../../../Constant';
import DataUtils from '../../../../../utils/DataUtils';
import StringUtils from '../../../../../utils/StringUtils';
import { 
    Color,
    Size
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
class ManagementDetailSuccess extends Component {
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
        investContractId: null,
        error: '', 
        invest: null,
        isLoadFirstTime: true,
        loading: false,
        loan: null,
        settlement: null,
        userDetail: null,
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
                loan: params ? params.loan : null,
                loanContractId: params ? params.loanContractId : null,
                investContractId: params ? params.investContractId : null,
                invest: params ? params.invest : null
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
                    !result.data.userDetail ||
                    !result.data.settlement) {
                    this.setState({ 
                        error: ErrorMsg.COMMON,
                        settlement: null,
                        userDetail: null
                    });
                    return;
                }
                this.setState({ 
                    settlement: result.data.settlement, 
                    userDetail: result.data.userDetail 
                });
            })
            .catch(error => {
                this.setState({ 
                    error: error.msg, 
                    isLoadFirstTime: false,
                    loading: false, 
                    settlement: null, 
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
        const { error, invest, investContractId,
            isLoadFirstTime, loading, loan, settlement, userDetail } = this.state;
        const timeline = DataUtils.combineSettlementTimelineLenderData(settlement || null);
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
                <Text style={style.txtTitle}>TIẾN ĐỘ THANH TOÁN</Text>
                <TimeLine data={timeline} />

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
});

export default ManagementDetailSuccess;
