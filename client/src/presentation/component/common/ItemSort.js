import React, { Component } from 'react';
import { 
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TextCenter } from '../common';
import { 
    Color,
    Size
} from '../../style/Theme';
import style from '../../style/Style';

class ItemSort extends Component {
    render() {
        const { containerStyle, iconNormalStyle, iconSelectedStyle } = styles;
        const iconStyle = this.props.selected ? iconSelectedStyle : iconNormalStyle;
        return (
            <TouchableOpacity 
                style={containerStyle}
                onPress={this.props.onPress}
            >
                <Icon 
                    color={this.props.selected ? Color.white : Color.primary}
                    name={this.props.iconName || 'star-o'}
                    size={this.props.iconSize || Size.icon}
                    type={this.props.iconType || 'font-awesome'}
                    raised
                    containerStyle={iconStyle}
                />
                <TextCenter 
                    style={style.txtGray}
                    text={this.props.text || 'Sắp xếp'}
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        marginRight: Size.spacing_sm
    },
    iconNormalStyle: {
        alignSelf: 'center',
        backgroundColor: Color.white,
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        margin: Size.spacing_sm,
        shadowColor: 'transparent',
        elevation: 0
    },
    iconSelectedStyle: {
        alignSelf: 'center',
        backgroundColor: Color.primary,
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        margin: Size.spacing_sm,
        shadowColor: 'transparent',
        elevation: 0
    }
});

export { ItemSort };
