import moment from 'moment';
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
    DatePickerCustom, 
    FormInput,
    Gradient,
    HeaderTransparent,
    TextCenter
} from '../../common';
import {
    DateTime,
    Minimum,
    ErrorMsg,
    RegularExp
} from '../../../../Constant';
import NumberUtils from '../../../../utils/NumberUtils';
import { Size } from '../../../style/Theme';
import style from '../../../style/Style';

class DeclarationInfo extends Component {
    static navigationOptions = {
        header: null
    };

    state = { 
        address: '', 
        birth: null, 
        city: '',
        email: '', 
        error: '',
        job: '',
        income: '', 
        name: '', 
        sex: 'male', 
        ssn: '',
        patch: false,
        title: 'Khai Báo Thông Tin',
        goBack: false
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        if (params && params.data) {
            const data = params.data;
            this.setState({ 
                address: data.address || '',
                birth: data.birth ? 
                    moment(data.birth, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY)
                    : null,
                city: data.city || '',
                email: data.email || '',
                job: data.job || '',
                income: Number.isInteger(data.income) ? 
                    `${NumberUtils.addMoneySeparator(data.income.toString())}` : '',
                name: data.name || '',
                sex: data.sex || 'male',
                ssn: data.ssn || '',
                patch: params.patch || false,
                goBack: params.goBack || false,
                title: params.title || 'Khai Báo Thông Tin'
            });
        }
    }

    onButtonPress() {
        Keyboard.dismiss();
        const { address, birth, city, email, job, income, name, sex, ssn, patch } = this.state;
        this.checkValidation()
            .then(() => {
                this.setState({ error: '', loading: true });
                const incomeNum = NumberUtils.removeChar(income);
                this.props.navigation.navigate('DeclarationImg', {
                    address,
                    birth,
                    city,
                    email,
                    job,
                    incomeNum,           
                    name,
                    sex,
                    ssn,
                    patch,
                    onNavigateTop: this.onNavigateTop.bind(this)
                });
            })
            .catch(errMsg => this.setState({ error: errMsg }));
    }

    onAddressChanged(text) {
        this.setState({ address: text, error: '' });
    }

    onBirthChanged(text) {
        this.setState({ birth: text, error: '' });
    }

    onCityChanged(text) {
        this.setState({ city: text, error: '' });
    }

    onEmailChanged(text) {
        this.setState({ email: text, error: '' });
    }

    onJobChanged(text) {
        this.setState({ job: text, error: '' });
    }

    onIncomeChanged(text) {
        const displayIncome = NumberUtils.addMoneySeparator(text);
        this.setState({ income: displayIncome, error: '' });
    }

    onNavigateTop() {
        this.props.navigation.state.params.onNavigateTop();
    }

    onNameChanged(text) {
        this.setState({ name: text, error: '' });
    }

    onSexChanged(index) {
        let text = 'male';
        if (index === 1) {
            text = 'female';
        }
        this.setState({ sex: text, error: '' });
    }

    onSSNChanged(text) {
        this.setState({ ssn: text, error: '' });
    }

    checkValidation() {
        const { address, birth, city, email, job, income, name, ssn } = this.state;
        return new Promise((resolve, reject) => {
            if (address.length === 0 ||
                !birth ||
                city.length === 0 ||
                email.length === 0 ||
                job.length === 0 ||
                income.length === 0 ||
                name.length === 0 ||
                ssn.length === 0) {
                return reject(ErrorMsg.FIELD_MISSING);
            } else if (!RegularExp.EMAIL.test(email)) {
                return reject(ErrorMsg.EMAIL_INVALID);
            } else if (parseFloat(NumberUtils.removeChar(income)) < Minimum.INCOME ||
                !RegularExp.NUMBER_SEPARATOR.test(income)) {
                return reject(ErrorMsg.INCOME_INVALID);
            } else if (!RegularExp.SSN.test(ssn)) {
                return reject(ErrorMsg.SSN_INVALID);
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
        const { address, birth, city, email, job, income, name, sex, ssn } = this.state;
        const { containerDateSexStyle } = styles;
        const buttonProps = ['Nam', 'Nữ'];
        return (
            <ScrollView contentContainerStyle={style.fullCenterScroll}>
                <FormInput
                    autoCapitalize='words'
                    iconName='user-circle-o'
                    iconType='font-awesome'
                    onChangeText={this.onNameChanged.bind(this)}
                    placeholder='Họ tên'
                    value={name}
                />

                <View style={containerDateSexStyle}>
                    <View style={style.full}>
                        <ButtonGroupCustom
                            onPress={this.onSexChanged.bind(this)}
                            selectedIndex={sex === 'male' ? 0 : 1}
                            buttons={buttonProps}
                        />
                    </View>
                    <View style={style.full}>
                        <DatePickerCustom
                            date={birth}
                            onDateChange={this.onBirthChanged.bind(this)}
                            maxDate={new Date()}
                            placeholder='Ngày sinh' 
                        />
                    </View>
                </View>
            
                <FormInput
                    keyboardType={'email-address'}
                    iconName='email'
                    iconType='material'
                    onChangeText={this.onEmailChanged.bind(this)}
                    placeholder='Email'
                    value={email}
                />

                <FormInput
                    autoCapitalize='words'
                    iconName='home'
                    iconType='font-awesome'
                    onChangeText={this.onAddressChanged.bind(this)}
                    placeholder='Địa chỉ'
                    value={address}
                />

                <FormInput
                    autoCapitalize='words'
                    iconName='location-city'
                    iconType='material'
                    onChangeText={this.onCityChanged.bind(this)}
                    placeholder='Thành phố'
                    value={city}
                />

                <FormInput
                    keyboardType={'numeric'}
                    maxLength={12}
                    iconName='id-card-o'
                    iconType='font-awesome'
                    onChangeText={this.onSSNChanged.bind(this)}
                    placeholder='Số CMND'
                    value={ssn}
                />

                <FormInput
                    iconName='work'
                    iconType='material'
                    onChangeText={this.onJobChanged.bind(this)}
                    placeholder='Nghề nghiệp'
                    value={job}
                />

                <FormInput
                    keyboardType={'numeric'}
                    iconName='wallet'
                    iconType='entypo'
                    onChangeText={this.onIncomeChanged.bind(this)}
                    placeholder='Thu nhập cá nhân (VNĐ/tháng)'
                    value={income}
                />

                {this.renderError()}

                <ButtonCustom
                    elevation
                    onPress={this.onButtonPress.bind(this)}
                    title='TIẾP THEO'
                />

                <View style={style.viewPadding} />
            </ScrollView>
        );
    }

    renderUI() {
        const { goBack, title } = this.state;
        if (Platform.OS === 'ios') {
            return (
                <View style={style.full}>
                    <HeaderTransparent 
                        goBack={goBack}
                        onBackIconPress={() => this.props.navigation.goBack()}
                        title={title}
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
                    goBack={goBack}
                    onBackIconPress={() => this.props.navigation.goBack()}
                    title={title}
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
    containerDateSexStyle: {
        flexDirection: 'row', 
        margin: Size.spacing_sm
    }
});

export default DeclarationInfo;
