import React, { Component } from 'react';
import { 
    Dimensions,
    TouchableOpacity,
    View,
    StyleSheet 
} from 'react-native';
import { 
    Card,
    Slider 
} from 'react-native-elements';
import { TextCenter } from '../common'; 
import {
    Color,
    Size
} from '../../style/Theme';
import { 
    Currency,
    Minimum,
    Maximum
} from '../../../Constant';
import NumberUtils from '../../../utils/NumberUtils';
import style from '../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class ItemLoanWaiting extends Component {
    render() {
        const { data } = this.props;
        const { cardStyle, containerDetailStyle, containerDivideStyle,
            containerRowStyle, sliderStyle, sliderThumbStyle, 
            txtBigStyle, txtNormalStyle, txtNormarlDetailStyle } = styles;
        return (
            <TouchableOpacity {...this.props}>
                <Card containerStyle={cardStyle}>
                    <View>
                        <TextCenter 
                            numberOfLines={1}
                            style={txtNormalStyle}
                            text={data ? (data.investingDayLeft ? 
                                `Còn ${data.investingDayLeft} ngày` : 'BLANK') : 'BLANK'}
                        />
                        <TextCenter 
                            numberOfLines={1}
                            style={style.txtCaption}
                            text={data ? (data.willing || 'BLANK') : 'BLANK'} 
                        />
                        <TextCenter 
                            numberOfLines={1}
                            style={txtBigStyle}
                            text={`${NumberUtils.addMoneySeparator(data.capital.toString())}${Currency.UNIT_VN}`}
                        />
                        <View style={containerDetailStyle}>
                            <View style={containerRowStyle}>
                                <TextCenter 
                                    numberOfLines={1}
                                    style={txtNormarlDetailStyle}
                                    text={`${Minimum.SCORE}/${Maximum.SCORE}`}
                                />
                                <TextCenter 
                                    style={style.txtCaption}
                                    text={'Điểm'}
                                />
                            </View>
                            <View style={containerDivideStyle} />
                            <View style={containerRowStyle}>
                                <TextCenter 
                                    numberOfLines={1}
                                    style={txtNormarlDetailStyle}
                                    text={data ? (data.rate ? ` ${data.rate.toFixed(2)}%` : 'BLANK') : 'BLANK'}
                                />
                                <TextCenter 
                                    numberOfLines={1}
                                    style={style.txtCaption}
                                    text={'Lãi suất'} 
                                />
                            </View>
                        </View>
                        <Slider
                            value={this.props.investedMoney || 0}
                            disabled
                            maximumValue={data ? data.capital : 1}
                            minimumValue={0}
                            step={1}
                            style={sliderStyle}
                            thumbStyle={sliderThumbStyle}
                            maximumTrackTintColor={Color.grayLightExtreme}
                            minimumTrackTintColor={Color.primary}
                            trackStyle={sliderStyle}
                        />
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
    sliderStyle: {
        height: Size.font_xlg,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: Size.radius,
        borderBottomRightRadius: Size.radius
    },
    sliderThumbStyle: {
        width: 0,
        height: 0
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

export { ItemLoanWaiting };
