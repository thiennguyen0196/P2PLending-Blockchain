import moment from 'moment';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet,
    Text
} from 'react-native';
import { Card } from 'react-native-elements';
import { ListItemCustom } from '../../common';
import {
    Currency, 
    DateTime 
} from '../../../../Constant';
import {
    Color,
    Size
} from '../../../style/Theme';
import NumberUtils from '../../../../utils/NumberUtils';
import style from '../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class Detail extends Component {

    render() {
        const { invest, userDetail, loan } = this.props;
        const { containerCardStyle, smallListItemStyle, smallTxtListItemStyle, txtHighlightStyle } = styles;
        return (
            <View>
                <Text style={style.txtTitle}>ĐẦU TƯ</Text>
                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        rightTitle={invest ? (invest.capital ? 
                            `${NumberUtils.addMoneySeparator(invest.capital.toString())}${Currency.UNIT_VN}` 
                            : '500,000đ') : '500,000đ'}
                        title='Đầu tư'
                        rightTitleStyle={txtHighlightStyle}
                        titleStyle={txtHighlightStyle}
                    />
                    <ListItemCustom
                        hideDivider
                        rightTitle={invest ? (invest.numNotes ? 
                            invest.numNotes.toString() : '1') : '1'}
                        title='Số note đầu tư'
                    />
                </Card>

                <Text style={style.txtTitle}>LỢI NHUẬN</Text>
                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconColor={Color.green}
                        iconName='cash-multiple'
                        iconType='material-community'
                        hideDivider
                        rightTitle={invest ? (invest.monthlyIncome ? 
                            `${NumberUtils.addMoneySeparator(invest.monthlyIncome.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title='Tiền nhận/tháng'
                        rightTitleStyle={txtHighlightStyle}
                        titleStyle={txtHighlightStyle}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={invest ? (invest.monthlyPrincipalIncome ? 
                            `${NumberUtils.addMoneySeparator(
                                invest.monthlyPrincipalIncome.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        rightTitleStyle={smallTxtListItemStyle}
                        title='Tiền gốc'
                        titleStyle={smallTxtListItemStyle}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={invest ? (invest.monthlyInterestIncome ? 
                            `${NumberUtils.addMoneySeparator(
                                invest.monthlyInterestIncome.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        rightTitleStyle={smallTxtListItemStyle}
                        title='Tiền lãi'
                        titleStyle={smallTxtListItemStyle}
                    />
                    <ListItemCustom
                        iconName='room-service'
                        iconType='material'
                        rightTitle={invest ? (invest.serviceFee ? 
                            `${NumberUtils.addMoneySeparator(invest.serviceFee.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title={'Phí dịch vụ \u2248 5%'}
                    />
                    <ListItemCustom
                        iconColor={Color.green}
                        iconName='ios-cash-outline'
                        iconType='ionicon'
                        rightTitle={invest ? (invest.monthlyProfit ? 
                            `${NumberUtils.addMoneySeparator(invest.monthlyProfit.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title='Thực nhận/tháng'
                        rightTitleStyle={txtHighlightStyle}
                        titleStyle={txtHighlightStyle}
                    />
                    <ListItemCustom
                        iconColor={Color.green}
                        iconName='money'
                        iconType='font-awesome'
                        hideDivider
                        rightTitle={invest ? (invest.entirelyProfit ? 
                            `${NumberUtils.addMoneySeparator(invest.entirelyProfit.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title='Tổng tiền nhận'
                        rightTitleStyle={txtHighlightStyle}
                        titleStyle={txtHighlightStyle}
                    />
                </Card>

                <Text style={style.txtTitle}>KHOẢN VAY</Text>
                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='money'
                        iconType='font-awesome'
                        rightTitle={loan ? (loan.capital ? 
                            `${NumberUtils.addMoneySeparator(loan.capital.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title='Số tiền vay'
                    />
                    <ListItemCustom
                        iconName='clock-o'
                        iconType='font-awesome'
                        rightTitle={loan ? (loan.periodMonth ? 
                            `${loan.periodMonth} tháng` : 'BLANK') : 'BLANK'}
                        title='Thời gian'
                    />
                    <ListItemCustom
                        iconName='calendar-check-o'
                        iconType='font-awesome'
                        rightTitle={loan ? (loan.maturityDate ? 
                            moment(loan.maturityDate, DateTime.FORMAT_ISO)
                                .format(DateTime.FORMAT_DISPLAY) : 'BLANK') : 'BLANK'}
                        title='Ngày giải ngân'
                    />
                    <ListItemCustom
                        iconName='bullseye'
                        iconType='font-awesome'
                        rightTitle={loan ? (loan.willing || 'BLANK') : 'BLANK'}
                        title='Mục đích vay'
                    />
                    <ListItemCustom
                        iconName='line-chart'
                        iconType='font-awesome'
                        hideDivider
                        rightTitle={loan ? (loan.rate ? `\u2248 ${loan.rate}%` : 'BLANK') : 'BLANK'}
                        rightTitleStyle={style.txtBlack}
                        title='Lãi suất'
                    />
                </Card>


                <Text style={style.txtTitle}>NGƯỜI VAY</Text>
                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='user-circle-o'
                        iconType='font-awesome'
                        rightTitle={userDetail ? 
                            (userDetail.name || 'BLANK') : 'BLANK'}
                        title='Họ tên'
                    />
                    <ListItemCustom
                        iconName='transgender'
                        iconType='font-awesome'
                        rightTitle={userDetail ? 
                            (userDetail.sex === 'male' ? 'Nam' : 'Nữ') : 'BLANK'}
                        title='Giới tính'
                    />
                    <ListItemCustom
                        iconName='work'
                        iconType='material'
                        rightTitle={userDetail ? 
                            (userDetail.job || 'BLANK') : 'BLANK'}
                        title='Nghề nghiệp'
                    />
                    <ListItemCustom
                        iconName='wallet'
                        iconType='entypo'
                        hideDivider
                        rightTitle={userDetail ? (userDetail.income ? 
                                `${NumberUtils.addMoneySeparator(userDetail.income.toString())}${Currency.UNIT_VN}` 
                                : 'BLANK') : 'BLANK'}
                        title='Thu nhập'
                    />
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerCardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: 0,
        padding: 0
    },
    smallListItemStyle: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        marginLeft: Size.icon
    },
    smallTxtListItemStyle: {
        color: Color.grayDark,
        fontSize: Size.font_sm
    },
    txtHighlightStyle: {
        color: Color.green,
        fontWeight: 'bold'
    }
});

export default Detail;
