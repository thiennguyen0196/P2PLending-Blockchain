import React, { Component } from 'react';
import {
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { 
    Card,
    Icon
} from 'react-native-elements';
import {
    ErrorView,
    PieChart,
    SliderAd,
    TextCenter
} from '../../../common';
import { onGetSummary } from '../../../../../domain';
import { 
    Currency,
    ErrorMsg
} from '../../../../../Constant';
import { 
    Color,
    Size
} from '../../../../style/Theme';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class ManagementOverall extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Quản Lý',
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
                        onPress={() => navigation.navigate('MyNotification', { type: 'lender' })} 
                        type='font-awesome'
                        size={Size.icon_sm}
                    />
                </View>
            ),
        };
    }

    state = { error: '', loading: false, summary: null };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ onGetData: this.onGetData.bind(this) });
        });
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            this.setState({ summary: params.summary || null });
        }
    }

    onGetData() {
        this.setState({ loading: true });
        onGetSummary()
            .then(result => {
                console.log(result);
                this.setState({ loading: false });
                if (!result.data) {
                    this.setState({ error: ErrorMsg.COMMON, summary: null });
                    return;
                }
                if (!result.data.summary) {
                    this.setState({ error: '' });
                } else {
                    this.setState({ error: '', summary: result.data.summary });
                }
            })
            .catch(error => {
                this.setState({ error: error.msg, loading: false, summary: null });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    renderErrorView() {
        const { error, loading } = this.state;
        return (
            <ErrorView
                onPress={this.onGetData.bind(this)}
                error={error}
                loading={loading}
            />
        );
    }

    renderOverallUI() {
        const { error, loading, summary } = this.state;
        console.log(summary);
        const { cardStyle, containerSmallStyle, iconStyle, txtBigStyle } = styles;
        let progressData = null;
        if (summary &&
            Number.isInteger(summary.monthlyPrincipalIncome) &&
            Number.isInteger(summary.monthlyInterestIncome) &&
            Number.isInteger(summary.serviceFee) &&
            Number.isInteger(summary.monthlyIncome) &&
            summary.monthlyPrincipalIncome > 0 &&
            summary.monthlyInterestIncome > 0 &&
            summary.serviceFee > 0 && 
            summary.monthlyIncome > 0) {
                progressData = NumberUtils.getProgressData([
                    summary.monthlyPrincipalIncome, 
                    summary.monthlyInterestIncome, 
                    summary.serviceFee
                ], summary.monthlyIncome);
            }
        const progress = progressData ? progressData.map((item) => item.y) : null;
        const progressDescription = NumberUtils.getSummaryProgressDescription(progress);
        console.log(progressData, progress, progressDescription);
        if (error) {
            return this.renderErrorView();
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
                <SliderAd />
                <View style={style.full}>
                    <View style={style.alignRow}>
                        <Card containerStyle={cardStyle}>
                            <View>
                                <Icon
                                    color={Color.primary}
                                    containerStyle={iconStyle}
                                    name='money'
                                    reverse
                                    size={Size.icon}
                                    type='font-awesome'
                                />
                                <TextCenter 
                                    style={txtBigStyle}
                                    text={summary ? (summary.monthlyIncome ? 
                                        `${NumberUtils.addMoneySeparator(summary.monthlyIncome.toString())}${Currency.UNIT_VN}`
                                        : `0${Currency.UNIT_VN}`) : `0${Currency.UNIT_VN}`}
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text={'Tổng tiền nhận\ntháng này'}
                                />
                            </View>
                            <View style={containerSmallStyle}>
                                <Text 
                                    numberOfLines={1}
                                    style={style.txtCaption} 
                                >
                                    Tiền gốc: {summary ? (summary.monthlyPrincipalIncome ? 
                                        `${NumberUtils.addMoneySeparator(summary.monthlyPrincipalIncome.toString())}${Currency.UNIT_VN}`
                                        : `0${Currency.UNIT_VN}`) : `0${Currency.UNIT_VN}`}
                                </Text>
                                <Text 
                                    numberOfLines={1}
                                    style={style.txtCaption} 
                                >
                                    Tiền lãi: {summary ? (summary.monthlyInterestIncome ? 
                                        `${NumberUtils.addMoneySeparator(summary.monthlyInterestIncome.toString())}${Currency.UNIT_VN}`
                                        : `0${Currency.UNIT_VN}`) : `0${Currency.UNIT_VN}`}
                                </Text>
                            </View>
                        </Card>
                        <Card containerStyle={cardStyle}>
                            <View>
                                <Icon
                                    color={Color.primary}
                                    containerStyle={iconStyle}
                                    name='wallet'
                                    reverse
                                    size={Size.icon}
                                    type='entypo'
                                />
                                <TextCenter 
                                    style={txtBigStyle}
                                    text={summary ? (summary.monthlyProfit ? 
                                        `${NumberUtils.addMoneySeparator(summary.monthlyProfit.toString())}${Currency.UNIT_VN}`
                                        : `0${Currency.UNIT_VN}`) : `0${Currency.UNIT_VN}`}
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text={'Tổng thực nhận\ntháng này'} 
                                />
                            </View>
                            <View style={containerSmallStyle}>
                                <Text 
                                    numberOfLines={1}
                                    style={style.txtCaption} 
                                >
                                    Phí dịch vụ: {summary ? (summary.serviceFee ? 
                                        `${NumberUtils.addMoneySeparator(summary.serviceFee.toString())}${Currency.UNIT_VN}`
                                        : `0${Currency.UNIT_VN}`) : `0${Currency.UNIT_VN}`}
                                </Text>
                                <Text style={style.txtCaption}>{' '}</Text>
                            </View>
                        </Card>
                    </View>
                    <Card containerStyle={cardStyle}>
                        <PieChart
                            colors={[Color.green, Color.yellow, Color.blue]}
                            data={progressData}
                            descripts={progressDescription}
                        />
                    </Card>
                </View>
            </ScrollView>
        );
    }

    render() {
        return this.renderOverallUI();
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 0,
        marginTop: 0,
        paddingLeft: Size.spacing
    },
    containerSmallStyle: {
        marginTop: Size.spacing_sm
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

export default ManagementOverall;

