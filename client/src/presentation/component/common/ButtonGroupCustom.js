import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import {
    Color,
    Size
} from '../../style/Theme';

class ButtonGroupCustom extends Component {
    render() {
        const { containerStyle, buttonStyle, 
            selectedButtonStyle, selectedTextStyle, textStyle } = styles;
        return (
            <ButtonGroup
                {...this.props}
                containerStyle={StyleSheet.flatten([containerStyle, this.props.containerStyle])}
                buttonStyle={StyleSheet.flatten([buttonStyle, this.props.buttonStyle])}
                selectedButtonStyle={StyleSheet.flatten([selectedButtonStyle, 
                    this.props.selectedButtonStyle])}
                selectedTextStyle={StyleSheet.flatten([selectedTextStyle, 
                    this.props.selectedTextStyle])}
                textStyle={StyleSheet.flatten([textStyle, this.props.textStyle])}
            />
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center',
        backgroundColor: 'transparent',
        borderRadius: Size.radius_xxlg,
        borderWidth: 1,
        borderColor: Color.white,
        maxWidth: 300
    },
    buttonStyle: {
        backgroundColor: 'transparent',  
    },
    selectedButtonStyle: {
        backgroundColor: Color.white,
    },
    selectedTextStyle: {
        alignSelf: 'center',
        color: Color.primary,
        fontSize: Size.font,
        justifyContent: 'center',
        margin: Size.spacing_xs
    },
    textStyle: {
        alignSelf: 'center',
        color: Color.white,
        fontSize: Size.font,
        justifyContent: 'center',
        margin: Size.spacing_xs
    }
});

export { ButtonGroupCustom };
