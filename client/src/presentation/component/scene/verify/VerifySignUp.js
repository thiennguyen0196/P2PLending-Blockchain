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
import { NavigationActions } from 'react-navigation';
import {
    ButtonCustom, 
    FormInput,
    Gradient,
    HeaderTransparent,
    ImageCenter,
    TextCenter
} from '../../common';
import { onVerify } from '../../../../domain';
import { 
    Api,
    Minimum, 
    ErrorMsg
} from '../../../../Constant';
import { Size } from '../../../style/Theme';
import style from '../../../style/Style';

class VerifySignUp extends Component {
    static navigationOptions = {
        header: null,
    };

    state = { code: '', error: '', loading: false };

    onButtonPress() {
        const { params } = this.props.navigation.state;
        const category = params ? params.category : null;
        const password = params ? params.password : null;
        const phone = params ? params.phone : null;
        console.log(category, password, phone);
        const { code } = this.state;
        Keyboard.dismiss();
        this.checkValidation()
            .then(() => {
                this.setState({ error: '', loading: true });
                return onVerify(category, code, password, phone);
            })
            .then(result => {
                console.log(result);
                this.setState({ loading: false, code: '' });
                if (!result.data || 
                    !result.data.category || 
                    !result.data.detail ||
                    typeof (result.data.detail.declared) === 'undefined') {
                    this.setState({ error: ErrorMsg.COMMON });
                    return;
                }
                let navigateRoute;
                if (result.data.category === Api.TYPE_BORROWER) {
                    if (result.data.detail.declared === false) {
                        navigateRoute = 'DeclarationInfo';
                    } else {
                        navigateRoute = 'BorrowerTabNavigator';
                    }
                } else {
                    navigateRoute = 'LenderTabNavigator';
                }
                const loan = null;
                this.props.navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ 
                            routeName: navigateRoute,
                            params: { loan }
                        })
                    ]
                }));
            })
            .catch(error => this.setState({ error: error.msg, loading: false, code: '' }));
    }

    onCodeChanged(text) {
        this.setState({ code: text, error: '' });
    }

    checkValidation() {
        const { code } = this.state;
        return new Promise((resolve, reject) => {
            if (code.length < Minimum.CODE) {
                return reject(ErrorMsg.CODE_NOT_ENOUGH);
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
        const { code, loading } = this.state;
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
                    iconName='code-tags-check'
                    iconType='material-community'
                    maxLength={6}
                    onChangeText={this.onCodeChanged.bind(this)}
                    placeholder='Mã xác nhận'
                    value={code}
                />
            
                <ButtonCustom  
                    disabled={loading}
                    elevation
                    onPress={this.onButtonPress.bind(this)}
                    loading={loading}
                    title='XÁC NHẬN'
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

export default VerifySignUp;
