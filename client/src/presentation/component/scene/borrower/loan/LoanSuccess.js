import moment from 'moment';
import React, { Component } from 'react';
import { 
    RefreshControl,
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { 
    Card,
    Icon 
} from 'react-native-elements';
import { 
    ButtonCustom,
    TextCenter,
    TimeLine
} from '../../../common';
import { 
    Color, 
    Size 
} from '../../../../style/Theme';
import { 
    Currency, 
    DateTime 
} from '../../../../../Constant';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import StringUtils from '../../../../../utils/StringUtils';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class LoanSuccess extends Component {
    renderButton() {
        const { buttonStyle } = styles;
        if (this.props.enablePay > -1) {
            return (
                <ButtonCustom 
                    disabled={this.props.loading}
                    onPress={this.props.onPayFunc}
                    buttonActiveStyle={buttonStyle}
                    title='THANH TOÁN KỲ HẠN'
                />
            );
        }
    }

    renderTxtStatePay() {
        const { txtStatePayGreenStyle, txtStatePayRedStyle } = styles;
        if (this.props.enablePay === -1) {
            return (
                <TextCenter
                    style={txtStatePayGreenStyle}
                    text='Chưa đến kỳ hạn trả tiếp theo'
                />
            );
        }
        return (
            <TextCenter
                style={txtStatePayRedStyle}
                text='Đã đến kỳ hạn trả tiếp theo'
            />
        );
    }

    render() {
        const { loan, settlement } = this.props;
        const { containerContractStyle, containerIconStyle, containerTxtViewStyle, 
            txtBigStyle } = styles;
        const timeline = DataUtils.combineSettlementTimelineBorrowerData(settlement || null);
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
                        {this.renderTxtStatePay()}
                    </Card>
                </TouchableOpacity>
                {this.renderButton()}
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
    buttonStyle: {
        marginVertical: Size.spacing,
        marginHorizontal: Size.spacing_lg
    },
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
    txtStatePayRedStyle: {
        color: Color.red,
        fontSize: Size.font,
        marginTop: Size.spacing_sm
    },
    txtStatePayGreenStyle: {
        color: Color.primary,
        fontSize: Size.font,
        marginTop: Size.spacing_sm
    }
});

export default LoanSuccess;
