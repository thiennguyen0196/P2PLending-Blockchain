import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { DateTime } from '../../../Constant';
import {
    Color,
    Size
} from '../../style/Theme';

class DatePickerCustom extends Component {
    render() {
        const { 
            btnTextIOSStyle, 
            dateInputStyle,
            datePickerStyle, 
            dateTextStyle, 
            placeholderTextStyle 
        } = styles;
        return (
            <DatePicker
                {...this.props}
                cancelBtnText='Hủy bỏ'
                confirmBtnText='OK'
                customStyles={{
                    btnTextCancel: StyleSheet.flatten([btnTextIOSStyle, 
                        this.props.btnTextIOSStyle]),
                    btnTextConfirm: StyleSheet.flatten([btnTextIOSStyle, 
                        this.props.btnTextIOSStyle]),
                    dateInput: StyleSheet.flatten([dateInputStyle, this.props.dateInputStyle]),
                    dateText: StyleSheet.flatten([dateTextStyle, this.props.dateTextStyle]),
                    placeholderText: StyleSheet.flatten([placeholderTextStyle, 
                        this.props.placeholderTextStyle])
                }}
                duration={this.props.duration || 200}
                format={this.props.format || DateTime.FORMAT_DISPLAY}
                style={StyleSheet.flatten([datePickerStyle, this.props.style])}
            />
        );
    }
}

const styles = StyleSheet.create({
    btnTextIOSStyle: {
        color: Color.gray,
        fontSize: Size.font,
        height: 20
    },
    dateInputStyle: {
        backgroundColor: Color.white,
        borderColor: 'transparent',
        borderRadius: Size.radius_xlg
    },
    datePickerStyle: {
        alignSelf: 'center',
        margin: Size.spacing_xs,
        minWidth: 160
    },
    dateTextStyle: {
        color: Color.gray,
        fontSize: Size.font,
    },
    placeholderTextStyle: {
        color: Color.grayLightExtreme,
        fontSize: Size.font,
    }
});

export { DatePickerCustom };
