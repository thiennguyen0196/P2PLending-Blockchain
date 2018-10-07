import React, { Component } from 'react';
import { 
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Card } from 'react-native-elements';
import { TextCenter } from '../common';
import { Currency } from '../../../Constant';
import { 
    Color,
    Size
} from '../../style/Theme';

class ItemLoanPack extends Component {
    render() {
        const { containerCardStyle, txtUnit, txtValue } = styles;
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <Card containerStyle={containerCardStyle}>
                    <TextCenter 
                        style={txtValue}
                        text={this.props.value || '5,000,000'}
                    />
                    <TextCenter 
                        style={txtUnit}
                        text={this.props.unit || Currency.UNIT_VN}
                    />
                </Card> 
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containerCardStyle: {
        alignSelf: 'baseline',
        backgroundColor: Color.white,
        borderColor: Color.grayLight,
        borderWidth: 2,
        borderRadius: Size.radius,
        marginLeft: Size.spacing_xs,
        marginRight: Size.spacing_sm,
        marginVertical: Size.spacing_sm
    },
    txtUnit: {
        color: Color.gray,
    },
    txtValue: {
        color: Color.primary,
        fontSize: Size.font_xlg
    },
});

export { ItemLoanPack };
