import React, { Component } from 'react';
import { 
    Modal,
    Platform,
    View, 
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { BlurView } from 'react-native-blur';
import { 
    FormInput,
    TextCenter 
} from '../common';
import { 
    Color,
    Size
} from '../../style/Theme';
import { Minimum } from '../../../Constant';
import style from '../../style/Style';

class OTPDialog extends Component {
    renderBlurView() {
        if (Platform.OS === 'ios') {
            return (
                <BlurView
                    style={style.absoluteCenter}
                    blurType='dark'
                    blurAmount={5}
                />
            );
        }
        return (
            <View 
                style={StyleSheet.flatten([style.absoluteCenter, 
                    { backgroundColor: Color.blackTransparent }])} 
            />
        );
    }

    renderError() {
        if (this.props.error) {
            return (
                <TextCenter 
                    style={style.txtRed}
                    text={this.props.error}
                />
            );
        }
    }

    render() {
        const { contentStyle, containerBtnStyle, formInputStyle, 
            txtBtnStyle, txtMsgStyle } = styles;
        return (
            <Modal
                animationType='fade'
                onRequestClose={() => console.log('OTPDialog close')}
                onDismiss={() => console.log('OTPDialog dismiss')}
                visible={this.props.visible || false}
                transparent
            >
                {this.renderBlurView()}
                <View style={style.fullCenter}>
                    <View style={contentStyle}>
                        <TextCenter 
                            style={txtMsgStyle}
                            text={'Nhập mã OTP để hoàn tất'}
                        />
                        <FormInput
                            containerInputStyle={formInputStyle}
                            keyboardType={'phone-pad'}
                            iconName='code-tags-check'
                            iconType='material-community'
                            maxLength={Minimum.CODE}
                            onChangeText={this.props.onOTPDialogCodeChanged}
                            placeholder='Mã xác nhận'
                            value={this.props.code}
                        />

                        {this.renderError()}

                        <View style={containerBtnStyle}>
                            <TouchableOpacity onPress={this.props.onOTPDialogDismiss}>
                                <TextCenter 
                                    style={txtBtnStyle}
                                    text='HỦY BỎ'
                                />
                            </TouchableOpacity>  
                            <TouchableOpacity onPress={this.props.onOTPDialogBtnPress}>
                                <TextCenter 
                                    style={txtBtnStyle}
                                    text='XÁC NHẬN'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    contentStyle: {
        alignSelf: 'baseline',
        backgroundColor: Color.white,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing,
    },
    containerBtnStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    formInputStyle: {
        borderWidth: 2,
        borderColor: Color.grayLight
    },
    txtMsgStyle: {
        color: Color.grayDark,
        fontSize: Size.font,
        margin: Size.spacing_sm
    },
    txtBtnStyle: {
        color: Color.primary,
        fontSize: Size.font,
        marginHorizontal: Size.spacing_lg,
        marginVertical: Size.spacing_sm
    }
});

export { OTPDialog };
