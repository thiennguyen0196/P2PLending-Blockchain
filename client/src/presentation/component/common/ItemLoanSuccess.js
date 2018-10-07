import React, { Component } from 'react';
import { 
    Dimensions,
    TouchableOpacity,
    View,
    StyleSheet 
} from 'react-native';
import { Card } from 'react-native-elements';
import { TextCenter } from '../common'; 
import { Currency } from '../../../Constant';
import {
    Color,
    Size
} from '../../style/Theme';
import NumberUtils from '../../../utils/NumberUtils';
import StringUtils from '../../../utils/StringUtils';
import style from '../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class ItemLoanSuccess extends Component {
    render() {
        const { loan, invest } = this.props;
        const { cardStyle, containerDetailStyle, containerDivideStyle, 
            containerRowStyle, txtBigStyle, txtNormalStyle, txtNormarlDetailStyle } = styles;
        return (
            <TouchableOpacity {...this.props}>
                <Card containerStyle={cardStyle}>
                    <View>
                        <TextCenter 
                            style={txtNormalStyle}
                            text={invest ? (invest.contractId ? 
                                `${StringUtils.formatId(invest.contractId)}` : 'BLANK') : 'BLANK'}
                        />
                        <TextCenter 
                            numberOfLines={1}
                            style={style.txtCaption}
                            text={loan ? (loan.info ? loan.info.willing || 'BLANK' : 'BLANK') : 'BLANK'} 
                        />
                        <TextCenter 
                            numberOfLines={1}
                            style={txtBigStyle}
                            text={loan ? (loan.info ? 
                                `${NumberUtils.addMoneySeparator(loan.info.capital.toString())}${Currency.UNIT_VN}`
                                : 'BLANK') : 'BLANK'}
                        />
                        <View style={containerDetailStyle}>
                            <View style={containerRowStyle}>
                                <TextCenter 
                                    numberOfLines={1}
                                    style={txtNormarlDetailStyle}
                                    text={invest ? (invest.info ? 
                                        (Number.isInteger(invest.info.entirelyProfit) && Number.isInteger(invest.info.capital) ? 
                                        `${NumberUtils.addMoneySeparator((invest.info.entirelyProfit - invest.info.capital).toString())}${Currency.UNIT_VN}`
                                        : 'BLANK') : 'BLANK') : 'BLANK'}
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text={'Thực lãi'}
                                />
                            </View>
                            <View style={containerDivideStyle} />
                            <View style={containerRowStyle}>
                                <TextCenter 
                                    numberOfLines={1}
                                    style={txtNormarlDetailStyle}
                                    text={loan ? (loan.info ? (loan.info.rate ? 
                                        `${loan.info.rate.toFixed(2)}%`
                                        : 'BLANK') : 'BLANK') : 'BLANK'}
                                />
                                <TextCenter 
                                    numberOfLines={1}
                                    style={style.txtCaption}
                                    text={'Lãi suất'} 
                                />
                            </View>
                        </View>
                    </View>          
                </Card>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        borderRadius: Size.radius,
        marginBottom: Size.spacing,
        marginHorizontal: Size.spacing_xs * 2,
        marginTop: 0,
        padding: 0,
        width: (Dimensions.get('window').width / 2) - (Size.spacing_sm * 2)
    },
    containerDetailStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: Size.spacing_xs
    },
    containerDivideStyle: {
        backgroundColor: Color.grayLight,
        height: Size.spacing_xlg,
        width: 1,
        margin: Size.spacing_xs
    },
    containerRowStyle: {
        justifyContent: 'center',
        paddingHorizontal: Size.spacing_xs,
    },
    txtNormalStyle: {
        color: Color.grayDark,
        fontSize: Size.font,
        marginTop: Size.spacing_sm,
        marginBottom: Size.spacing_xs
    },
    txtNormarlDetailStyle: {
        color: Color.grayDark,
        fontSize: Size.font,
        margin: Size.spacing_xs
    },
    txtBigStyle: {
        color: Color.primary,
        fontSize: Size.font_xlg,
        fontWeight: 'bold',
        marginVertical: Size.spacing_xs
    }
});

export { ItemLoanSuccess };
