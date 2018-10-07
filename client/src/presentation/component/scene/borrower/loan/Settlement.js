import moment from 'moment';
import React, { Component } from 'react';
import { 
    ScrollView,
    StyleSheet
} from 'react-native';
import { Card } from 'react-native-elements';
import {
    ButtonCustom,
    ConfirmDialog,
    ListItemCustom,
    TextCenter
} from '../../../common';
import { 
    Action,
    Currency,
    DateTime,
    ErrorMsg 
} from '../../../../../Constant';
import NumberUtils from '../../../../../utils/NumberUtils';
import StringUtils from '../../../../../utils/StringUtils';
import {
    Color,
    Size
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class Settlement extends Component {
    static navigationOptions = {
        headerTitle: 'Thanh Toán Kỳ Hạn',
    };

    state = { data: null, error: '', loanId: null }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            this.setState({ 
                data: params.data || null,
                loanId: params.loanId || null
            });
        }
    }

    onButtonPress() {
        const { data, loanId } = this.state;
        ConfirmDialog(
            'Xác nhận thanh toán kỳ hạn',
            'Bạn có chắc chắn muốn thanh toán kỳ hạn cho khoản vay này?',
            true
        ).then(() =>
            this.props.navigation.navigate('Gateway', { 
                action: Action.SETTLE_LOAN,
                contractId: data ? data.contractId : null,
                data: [
                    data ? data.contractId : null, 
                    loanId, 
                    data ? (data.info ? (data.info.maturityDate ? 
                        moment(data.info.maturityDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_FIREBASE) 
                        : null) : null) : null
                    ],
                money: data ? (data.info ? data.info.totalAmount : null) : null,
                onNavigateTop: this.onNavigateTop.bind(this)
            })
        ).catch(() => console.log('Cancel Confirm Settlement'));
    }

    onNavigateTop() {
        this.props.navigation.state.params.onNavigateTop();
    }

    renderError() {
        const { error } = this.state;
        if (error) {
            return (
                <TextCenter 
                    style={style.txtRed}
                    text={error}
                />
            );
        }
    }

    render() {
        const { data } = this.state;
        const { buttonStyle, containerCardStyle, smallListItemStyle, 
            smallTxtListItemStyle, txtHighlightStyle } = styles;
        return (
            <ScrollView contentContainerStyle={style.fullScroll}>
                <Card containerStyle={style.cardFull}>
                        <TextCenter 
                            style={style.txtCaption}
                            text='Mã hợp đồng thanh toán kỳ hạn' 
                        />
                        <TextCenter 
                            style={style.txtPrimary}
                            text={data ? `${StringUtils.formatId(data.contractId)}` : 'BLANK'} 
                        />
                </Card>

                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='calendar-check-o'
                        iconType='font-awesome'
                        rightTitle={data ? (data.info ? (data.info.maturityDate ? 
                            moment(data.info.maturityDate, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY) 
                            : 'BLANK') : 'BLANK') : 'BLANK'}
                        title='Kỳ hạn'
                    />
                    <ListItemCustom
                        iconName='cash-multiple'
                        iconType='material-community'
                        iconColor={Color.green}
                        hideDivider
                        rightTitle={data ? (data.info ? (Number.isInteger(data.info.totalAmount) ?
                            `${NumberUtils.addMoneySeparator(data.info.totalAmount.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK') : 'BLANK'}
                        rightTitleStyle={txtHighlightStyle}
                        title='Tổng tiền trả'
                        titleStyle={txtHighlightStyle}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={data ? (data.info ? (Number.isInteger(data.info.principalAmount) ?
                            `${NumberUtils.addMoneySeparator(data.info.principalAmount.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK') : 'BLANK'}
                        rightTitleStyle={smallTxtListItemStyle}
                        title='Tiền gốc'
                        titleStyle={smallTxtListItemStyle}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={data ? (data.info ? (Number.isInteger(data.info.interestAmount) ?
                            `${NumberUtils.addMoneySeparator(data.info.interestAmount.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK') : 'BLANK'}
                        rightTitleStyle={smallTxtListItemStyle}
                        title='Tiền lãi'
                        titleStyle={smallTxtListItemStyle}
                    />
                    <ListItemCustom
                        iconName='subdirectory-arrow-right'
                        iconType='material-comunity'
                        listItemStyle={smallListItemStyle}
                        hideDivider
                        rightTitle={data ? (data.info ? (Number.isInteger(data.info.penaltyAmount) ?
                            `${NumberUtils.addMoneySeparator(data.info.penaltyAmount.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK') : 'BLANK'}
                        rightTitleStyle={smallTxtListItemStyle}
                        title='Nợ dồn'
                        titleStyle={smallTxtListItemStyle}
                    />
                </Card>

                {this.renderError()}

                <ButtonCustom 
                    onPress={this.onButtonPress.bind(this)}
                    buttonActiveStyle={buttonStyle}
                    title='THANH TOÁN NGAY'
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginVertical: Size.spacing_sm,
        marginHorizontal: Size.spacing_lg
    },
    containerCardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: Size.spacing_lg,
        marginBottom: Size.spacing,
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

export default Settlement;
