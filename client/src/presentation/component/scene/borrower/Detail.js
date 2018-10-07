import moment from 'moment';
import React, { Component } from 'react';
import { 
    View,
    StyleSheet 
} from 'react-native';
import { Card } from 'react-native-elements';
import { ListItemCustom } from '../../common';
import NumberUtils from '../../../../utils/NumberUtils';
import {
    Currency,
    DateTime 
} from '../../../../Constant';
import {
    Size,
    Color
} from '../../../style/Theme';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class Detail extends Component {
    render() {
        const { data } = this.props;
        const { containerCardStyle, smallListItemStyle, smallTxtListItemStyle, txtHighlightStyle } = styles;
        return (
            <View>
                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='money'
                        iconType='font-awesome'
                        rightTitle={data ? (data.capital ? 
                            `${NumberUtils.addMoneySeparator(data.capital.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title='Số tiền vay'
                    />
                    <ListItemCustom
                        iconName='clock-o'
                        iconType='font-awesome'
                        rightTitle={data ? (data.periodMonth ? 
                            `${data.periodMonth} tháng` : 'BLANK') : 'BLANK'}
                        title='Thời gian'
                    />
                    <ListItemCustom
                        iconName='calendar-check-o'
                        iconType='font-awesome'
                        rightTitle={data ? (data.maturityDate ? 
                            moment(data.maturityDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY) : 'BLANK') 
                            : 'BLANK'}
                        title='Ngày giải ngân'
                    />
                    <ListItemCustom
                        iconName='bullseye'
                        iconType='font-awesome'
                        hideDivider
                        rightTitle={data ? (data.willing || 'BLANK') : 'BLANK'}
                        title='Mục đích vay'
                    />
                </Card>

                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='line-chart'
                        iconType='font-awesome'
                        iconColor={this.props.highlight ? Color.orange : null}
                        rightTitle={data ? (data.rate ? `\u2248 ${data.rate}%` : 'BLANK') : 'BLANK'}
                        rightTitleStyle={this.props.highlight ? txtHighlightStyle : {}}
                        title='Lãi suất'
                        titleStyle={this.props.highlight ? txtHighlightStyle : {}}
                    />
                    <ListItemCustom
                        iconName='cash-multiple'
                        iconType='material-community'
                        iconColor={this.props.highlight ? Color.green : null}
                        hideDivider
                        rightTitle={data ? (data.monthlyPay ? 
                            `${NumberUtils.addMoneySeparator(data.monthlyPay.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        rightTitleStyle={this.props.highlight ? txtHighlightStyle : {}}
                        title='Tiền trả/tháng'
                        titleStyle={this.props.highlight ? txtHighlightStyle : {}}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        iconColor={this.props.highlight ? Color.green : null}
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={data ? (data.monthlyPrincipalPay ? 
                            `${NumberUtils.addMoneySeparator(data.monthlyPrincipalPay.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        rightTitleStyle={this.props.highlight ? 
                            StyleSheet.flatten([txtHighlightStyle, smallTxtListItemStyle]) 
                            : smallTxtListItemStyle}
                        title='Tiền gốc'
                        titleStyle={this.props.highlight ? 
                            StyleSheet.flatten([txtHighlightStyle, smallTxtListItemStyle]) 
                            : smallTxtListItemStyle}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        iconColor={this.props.highlight ? Color.green : null}
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={data ? (data.monthlyInterestPay ? 
                            `${NumberUtils.addMoneySeparator(data.monthlyInterestPay.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        rightTitleStyle={this.props.highlight ? 
                                StyleSheet.flatten([txtHighlightStyle, smallTxtListItemStyle]) 
                                : smallTxtListItemStyle}
                        title='Tiền lãi'
                        titleStyle={this.props.highlight ? 
                            StyleSheet.flatten([txtHighlightStyle, smallTxtListItemStyle]) 
                            : smallTxtListItemStyle}
                    />
                </Card>

                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='wallet'
                        iconType='entypo'
                        iconColor={this.props.highlight ? Color.pink : null}
                        hideDivider
                        rightTitle={data ? (data.entirelyPay ? 
                            `${NumberUtils.addMoneySeparator(data.entirelyPay.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        rightTitleStyle={this.props.highlight ? txtHighlightStyle : {}}
                        title='Tổng tiền trả'
                        titleStyle={this.props.highlight ? txtHighlightStyle : {}}
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
        marginBottom: Size.spacing_lg,
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
        fontWeight: 'bold'
    }
});

export default Detail;
