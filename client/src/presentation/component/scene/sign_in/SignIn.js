import React, { Component } from 'react';
import {
    Dimensions,
    Keyboard, 
    KeyboardAvoidingView,
    Image,
    Platform,
    View,
    ScrollView,
    StyleSheet
} from 'react-native';
import {
    ButtonCustom, 
    FormInput,
    Gradient,
    ImageCenter,
    TextCenter
} from '../../common';
import { onSignIn } from '../../../../domain';
import { 
    Api,
    Minimum, 
    ErrorMsg,
    RegularExp
} from '../../../../Constant';
import style from '../../../style/Style';
import { Size } from '../../../style/Theme';

class SignIn extends Component {
    static navigationOptions = {
        header: null
    };

    state = { error: '', loading: false, password: '', phone: '' };

    onButtonPress() {
        const { password, phone } = this.state;
        Keyboard.dismiss();
        this.checkValidation()
            .then(() => {
                this.setState({ error: '', loading: true });
                return onSignIn(password, phone);
            })
            .then(result => {
                console.log(result);
                this.setState({ loading: false, password: '', phone: '' });
                if (!result.data || 
                    !result.data.category || 
                    !result.data.detail ||
                    typeof (result.data.detail.declared) === 'undefined') {
                    this.setState({ error: ErrorMsg.COMMON });
                    return;
                }
                let enablePay;
                let investedDate;
                let loan;
                let settlement;
                let summary;
                let navigateRoute;
                if (result.data.category === Api.TYPE_BORROWER) {
                    if (result.data.detail.declared === false) {
                        navigateRoute = 'DeclarationInfo';
                    } else {
                        navigateRoute = 'BorrowerTabNavigator';
                        enablePay = Number.isInteger(result.data.enablePay) ? 
                            result.data.enablePay : -1;
                        investedDate = result.data.investedDate || null;
                        loan = result.data.loan || null;
                        settlement = result.data.settlement || null;
                    }
                } else {
                    navigateRoute = 'LenderTabNavigator';
                    summary = result.data.summary || null;
                }
                this.props.navigation.replace(navigateRoute, 
                    { enablePay, investedDate, loan, settlement, summary });
            })
            .catch(error => this.setState({ error: error.msg, loading: false, password: '' }));
    }

    onPasswordChange(text) {
        this.setState({ error: '', password: text });
    }

    onPhoneChanged(text) {
        this.setState({ error: '', phone: text });
    }

    onTextSignUpPress() {
        const { loading } = this.state;
        if (!loading) {
            Keyboard.dismiss();
            this.props.navigation.navigate('SignUp');
        }
    }

    checkValidation() {
        const { phone } = this.state;
        return new Promise((resolve, reject) => {
            if (phone.length < Minimum.PHONE) {
                return reject(ErrorMsg.PHONE_NOT_ENOUGH);
            } else if (!RegularExp.PHONE.test(phone)) {
                return reject(ErrorMsg.PHONE_INVALID);
            // } else if (password.length < Minimum.PASSWORD) {
            //     return reject(ErrorMsg.PASSWORD_NOT_ENOUGH);
            }
            return resolve();
        });
    }

    renderError() {
        const { error } = this.state;
        if (error) {
            return (
                <TextCenter 
                    style={style.txtYellow}
                    text={error}
                />
            );
        }
    }

    renderInputForm() {
        const { loading, password, phone } = this.state;
        return (
            <ScrollView contentContainerStyle={style.fullCenterScroll}>
                <ImageCenter
                    /*eslint-disable global-require */
                    ratio={Size.ratio_3_2}
                    source={require('../../../img/logo_white.png')}
                    style={style.imgSpacingBottom}
                />
                <FormInput
                    editable={!loading}
                    keyboardType={'phone-pad'}
                    iconName='phone'
                    iconType='feather'
                    maxLength={15}
                    onChangeText={this.onPhoneChanged.bind(this)}
                    placeholder='Số ĐTDĐ'
                    value={phone}
                />
            
                <FormInput
                    editable={!loading}
                    iconName='lock'
                    iconType='feather'
                    onChangeText={this.onPasswordChange.bind(this)}
                    placeholder='Mật khẩu'
                    secureTextEntry
                    value={password}
                />

                <TextCenter 
                    onPress={this.onTextSignUpPress.bind(this)}
                    text='Tạo tài khoản'
                />

                <ButtonCustom  
                    disabled={loading}  
                    elevation
                    loading={loading}
                    onPress={this.onButtonPress.bind(this)}
                    title='ĐĂNG NHẬP'
                />

                {this.renderError()}
            </ScrollView>
        );
    }

    render() {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAvoidingView 
                    behavior='padding'
                    style={style.full}
                >
                    <Image 
                        source={require('../../../img/background.png')}
                        style={StyleSheet.flatten([style.absoluteCenter, {
                            height: Dimensions.get('window').height,
                            width: Dimensions.get('window').width
                        }])}
                        resizeMode='cover'
                    />
                    <Gradient
                        opacity
                        view={this.renderInputForm()}
                    />
                </KeyboardAvoidingView>
            );
        }
        return (
            <View style={style.full}>
                <Image 
                    source={require('../../../img/background.png')}
                    style={StyleSheet.flatten([style.absoluteCenter, {
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width
                    }])}
                    resizeMode='cover'
                />
                <Gradient
                    opacity
                    view={this.renderInputForm()}
                />
            </View>
        );
    }
}

export default SignIn;
