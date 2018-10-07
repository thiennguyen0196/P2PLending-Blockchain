import moment from 'moment';
import React, { Component } from 'react';
import { 
    View,
    RefreshControl,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Text
} from 'react-native';
import { 
    Card,
    Icon 
} from 'react-native-elements';
import {
    ProgressSlide,
    TextCenter,
    TimeLine
} from '../../../common';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import StringUtils from '../../../../../utils/StringUtils';
import { 
    Color,
    Size
} from '../../../../style/Theme';
import {
    Currency, 
    DateTime,
    Minimum
} from '../../../../../Constant';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
/*eslint-disable global-require */
class LoanWaiting extends Component {
    render() {
        const { loan, investedDate } = this.props;
        const { containerContractStyle, containerIconStyle, containerTxtViewStyle, 
            txtBigStyle, txtInvestedMoneyStyle } = styles;
        const investedMoney = loan ? 
            (Number.isInteger(loan.investedNotes) ? (Number.isInteger(loan.baseUnitPrice) ? 
            (loan.investedNotes * loan.baseUnitPrice) : (loan.investedNotes * Minimum.LOAN_NODE)) 
            : 0) : 0;
        const timeline = DataUtils.combineInvestWaitingTimelineBorrowerData(investedDate || null, 
            loan ? loan.baseUnitPrice : null);
        return (
            <View style={style.full}>
                <TouchableOpacity onPress={this.props.onDetailPress}>
                    <Card containerStyle={style.cardFull}>
                        <View style={containerContractStyle}>
                            <Icon
                                containerStyle={containerIconStyle}
                                color={Color.orange}
                                name='file-text-o'
                                reverse
                                size={Size.icon_sm}
                                type='font-awesome'
                            />
                            <View style={containerTxtViewStyle}>
                                <Text 
                                    numberOfLines={1}
                                    style={txtBigStyle}
                                >
                                    {loan ? (loan.info ? (Number.isInteger(loan.info.capital) ? 
                                    `${NumberUtils.addMoneySeparator(loan.info.capital.toString())}${Currency.UNIT_VN}` 
                                    : 'BLANK') : 'BLANK') : 'BLANK'} 
                                </Text>
                                <Text 
                                    numberOfLines={1}
                                    style={style.txtCaption}
                                >
                                    {loan ? (loan.contractId ? 
                                        `Mã hợp đồng: ${StringUtils.formatId(loan.contractId)}` : 'BLANK') : 'BLANK'}
                                </Text>
                                <Text 
                                    numberOfLines={1}
                                    style={style.txtCaption}
                                >
                                    {loan ? (loan.info ? (loan.info.createdDate ? 
                                        `Ngày tạo: ${moment(loan.info.createdDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY)}` 
                                        : 'BLANK') : 'BLANK') : 'BLANK'}
                                </Text>
                            </View>
                        </View>
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
                </TouchableOpacity>
                <ScrollView 
                    contentContainerStyle={style.fullScroll}
                    refreshControl={
                        <RefreshControl
                            colors={[Color.primary, Color.orange]}
                            refreshing={this.props.loading} 
                            onRefresh={this.props.onRefresh}
                            tintColor={Color.primary}
                        />
                    }
                >
                    <TimeLine data={timeline} />
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerContractStyle: {
        flexDirection: 'row'
    },
    containerIconStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        margin: Size.spacing_sm
    },
    containerTxtViewStyle: {
        flex: 1,
        justifyContent: 'center',
        margin: Size.spacing_xs
    },
    txtBigStyle: {
        color: Color.primary,
        fontSize: Size.font_xlg,
        marginVertical: Size.spacing_xs
    },
    txtInvestedMoneyStyle: {
        color: Color.primary,
        fontSize: Size.font,
        marginBottom: 0,
        marginTop: Size.spacing_xs
    }
});

export default LoanWaiting;
