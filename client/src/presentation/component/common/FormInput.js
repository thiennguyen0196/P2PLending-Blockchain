import React, { Component } from 'react';
import { 
    Platform,
    View,
    StyleSheet,
    TextInput
} from 'react-native';
import {
    Icon,
    FormValidationMessage 
} from 'react-native-elements';
import {
    Color,
    Size
} from '../../style/Theme';

class FormInput extends Component {
    renderInput() {
        const { containerInputAndroidStyle, containerInputIOSStyle, 
            iconStyle, inputStyle } = styles;
        let containerInputStyle = containerInputAndroidStyle;
        if (Platform.OS === 'ios') {
            containerInputStyle = containerInputIOSStyle;
        }
        if (this.props.iconName) {
            return (
                <View 
                    style={StyleSheet.flatten([containerInputStyle, 
                        this.props.containerInputStyle])}
                >
                    <Icon
                        color={this.props.iconColor || Color.grayLight}
                        containerStyle={iconStyle}
                        name={this.props.iconName}
                        size={this.props.iconSize || Size.icon_sm}
                        type={this.props.iconType}
                    />
                    <TextInput 
                        {...this.props}
                        placeholderTextColor={this.props.placeholderTextColor || 
                            Color.grayLightExtreme}
                        underlineColorAndroid={this.props.underlineColorAndroid || 'transparent'}
                        style={StyleSheet.flatten([inputStyle, this.props.inputStyle])}
                    />
                    <View style={iconStyle} />
                </View>
            );
        } 
        return (
            <View 
                style={StyleSheet.flatten([containerInputStyle, 
                    this.props.containerInputStyle])}
            >
                <TextInput 
                    {...this.props}
                    placeholderTextColor={this.props.placeholderTextColor || Color.grayLightExtreme}
                    underlineColorAndroid={this.props.underlineColorAndroid || 'transparent'}
                    style={StyleSheet.flatten([inputStyle, this.props.inputStyle])}
                />
            </View>
        );
    }

    renderValidation() {
        const { validationTextStyle } = styles;
        if (this.props.validation) {
            return (
                <FormValidationMessage 
                    labelStyle={StyleSheet.flatten([validationTextStyle, 
                        this.props.validationTextStyle])}
                >
                    {this.props.validation}
                </FormValidationMessage>
            );
        }
    }

    render() {
        const { containerStyle } = styles;
        return (
            <View style={StyleSheet.flatten([containerStyle, this.props.containerViewStyle])}>
                
                {this.renderInput()}

                {this.renderValidation()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        marginHorizontal: Size.spacing,
        marginVertical: Size.spacing_sm
    },
    containerInputAndroidStyle: {
        flexDirection: 'row',
        backgroundColor: Color.white,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing_xs,
    },
    containerInputIOSStyle: {
        flexDirection: 'row',
        backgroundColor: Color.white,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing_sm,
    },
    iconStyle: {
        alignSelf: 'center',
        flex: 1,
        padding: Size.spacing_xs
    },
    inputStyle: {
        alignSelf: 'center',
        flex: 5,
        fontSize: Size.font,
        color: Color.gray,
        textAlign: 'center',
    },
    validationTextStyle: {
        color: Color.yellow,
        fontSize: Size.font,
        textAlign: 'center',
    }
});

export { FormInput };
