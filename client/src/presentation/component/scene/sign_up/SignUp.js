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
    ButtonGroupCustom,
    ConfirmDialog,
    FormInput,
    Gradient,
    HeaderTransparent,
    TextCenter
} from '../../common';
import { onSignUp } from '../../../../domain';
import { 
    Api,
    Minimum, 
    ErrorMsg,
    RegularExp,
} from '../../../../Constant';
import { Size } from '../../../style/Theme';
import style from '../../../style/Style';

class SignUp extends Component {
    static navigationOptions = {
        header: null
    };

    state = { 
        category: 'borrower',
        error: '',
        loading: false,
        password: '', 
        passwordConfirm: '',
        phone: '', 
        user: null
    };
    
    onButtonPress() {
        const { phone } = this.state;
        Keyboard.dismiss();
        this.checkValidation()
            .then(() => {
                this.setState({ error: '', loading: true });
                return onSignUp(phone);
            })
            .then(result => {
                console.log(result);
                this.setState({ loading: false, user: result });
                this.onShowAlert();
            })
            .catch(errMsg => this.setState({
                error: errMsg,
                loading: false,
                password: '',
                passwordConfirm: ''
            }));
    }

    onCategoryChanged(index) {
        let text = Api.TYPE_BORROWER;
        if (index === 1) {
            text = Api.TYPE_LENDER;
        }
        this.setState({ category: text, error: '' });
    }

    onPasswordChanged(text) {
        this.setState({ error: '', password: text });
    }

    onPasswordConfirmChanged(text) {
        this.setState({ error: '', passwordConfirm: text });
    }

    onPhoneChanged(text) {
        this.setState({ error: '', phone: text });
    }

    onShowAlert() { 
        const { category, password, phone, user } = this.state;
        if (user != null) {
            ConfirmDialog(
                'Mã xác nhận',
                'Nhập mã xác nhận đã được gửi đến số ĐTDĐ của bạn',
                false
            ).then(() => {
                this.props.navigation.navigate('VerifySignUp', {
                    category,
                    password,
                    phone
                });
                this.setState({ password: '', passwordConfirm: '', phone: '', user: null });
            });
        }
    }

    checkValidation() {
        const { password, passwordConfirm, phone } = this.state;
        return new Promise((resolve, reject) => {
            if (phone.length < Minimum.PHONE) {
                return reject(ErrorMsg.PHONE_NOT_ENOUGH);
            } else if (!RegularExp.PHONE.test(phone)) {
                return reject(ErrorMsg.PHONE_INVALID);
            } else if (password.length < Minimum.PASSWORD) {
                return reject(ErrorMsg.PASSWORD_NOT_ENOUGH);
            } else if (password !== passwordConfirm) {
                return reject(ErrorMsg.PASSWORD_CONFIRM_FALSE);
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
        const buttonProps = ['Người đi vay', 'Nhà đầu tư'];
        const { category, loading, password, passwordConfirm, phone } = this.state;
        const { buttonStyle, buttonGroupStyle, inputLastStyle } = styles;
        return (
            <ScrollView contentContainerStyle={style.fullCenterScroll}>
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
                    onChangeText={this.onPasswordChanged.bind(this)}
                    placeholder='Mật khẩu'
                    secureTextEntry
                    value={password}
                />

                <FormInput
                    editable={!loading}
                    containerViewStyle={inputLastStyle}
                    iconName='lock'
                    iconType='feather'
                    onChangeText={this.onPasswordConfirmChanged.bind(this)}
                    placeholder='Xác nhận mật khẩu'
                    secureTextEntry
                    value={passwordConfirm}
                />

                <ButtonGroupCustom
                    containerStyle={buttonGroupStyle}
                    onPress={this.onCategoryChanged.bind(this)}
                    selectedIndex={category === Api.TYPE_BORROWER ? 0 : 1}
                    buttons={buttonProps}
                />
            
                <ButtonCustom  
                    buttonActiveStyle={buttonStyle}
                    disabled={loading}  
                    elevation
                    loading={loading}
                    onPress={this.onButtonPress.bind(this)}
                    title='ĐĂNG KÝ'
                />
            
                {this.renderError()}
                
                <View style={style.viewPadding} />
            </ScrollView>
        );
    }

    renderUI() {
        if (Platform.OS === 'ios') {
            return (
                <View style={style.full}>
                    <HeaderTransparent 
                        goBack
                        onBackIconPress={() => this.props.navigation.goBack()}
                    />
                    <KeyboardAvoidingView 
                        behavior='padding'
                        style={style.full}
                    >
                        {this.renderInputForm()}
                    </KeyboardAvoidingView>
                </View>
            );
        }
        return (
            <View style={style.full}>
                <HeaderTransparent 
                    goBack
                    onBackIconPress={() => this.props.navigation.goBack()}
                />
                <View style={style.full}>
                    {this.renderInputForm()}
                </View>
            </View>
        );
    }

    render() {
        /*eslint-disable global-require */
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
                    view={this.renderUI()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: Size.spacing
    },
    buttonGroupStyle: {
        flexDirection: 'column',
        minWidth: 200,
        minHeight: 70
    },
    inputLastStyle: {
        marginBottom: Size.spacing
    }
});

export default SignUp;
