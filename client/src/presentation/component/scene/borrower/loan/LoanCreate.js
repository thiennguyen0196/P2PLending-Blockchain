import moment from 'moment';
import React, { Component } from 'react';
import {
    FlatList,
    Keyboard, 
    KeyboardAvoidingView,
    Platform,
    View,
    StyleSheet,
    ScrollView,
    Text
} from 'react-native';
import { 
    Card,
    Icon
} from 'react-native-elements';
import {
    ButtonCustom, 
    DatePickerCustom,
    FormInput,
    ItemLoanPack,
    ProgressSlide,
    TextCenter
} from '../../../common';
import { 
    Minimum, 
    Maximum,
    DateTime,
    ErrorMsg,
    RegularExp
} from '../../../../../Constant';
import { onSubmitLoan } from '../../../../../domain';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import { moneyPack } from '../../../../../utils/MockDataUtils';
import {
    Size,
    Color
} from '../../../../style/Theme';
import style from '../../../../style/Style';

class LoanCreate extends Component {
    static navigationOptions = {
        headerTitle: 'Tạo Khoản Vay',
    };

    state = {
        error: '', 
        loading: false, 
        date: null,
        money: '', 
        month: 1, 
        willing: '',  
    };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        if (params) {
            this.setState({ 
                money: params.money ? NumberUtils.addMoneySeparator(params.money) : '',
                willing: params.willing || ''
            });
        }
    }

    onButtonPress() {
        const { date, money, month, willing } = this.state;
        const capital = parseFloat(NumberUtils.removeChar(money));
        const periodMonth = parseInt(month, 10);
        const maturityDate = moment(date, DateTime.FORMAT_DISPLAY).format(DateTime.FORMAT_SEND);
        Keyboard.dismiss();
        this.checkValidation()
            .then(() => {
                this.setState({ error: '', loading: true });
                return onSubmitLoan(capital, periodMonth, maturityDate, willing);
            })
            .then(result => {
                console.log(result);
                this.setState({ loading: false });
                if (!result.data) {
                    this.setState({ error: ErrorMsg.COMMON });
                    return;
                }
                const data = result.data;
                data.maturityDate = moment(data.maturityDate, DateTime.FORMAT_SEND)
                    .format(DateTime.FORMAT_ISO);
                this.props.navigation.navigate('LoanConfirm', { data });
            })
            .catch(error => {
                this.setState({ error: error.msg, loading: false });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    onWillingChanged(text) {
        this.setState({ willing: text, error: '' });
    }

    onMaturityDateChanged(text) {
        this.setState({ date: text, error: '' });
    }

    onMoneyChanged(text) {
        const displayMoney = NumberUtils.addMoneySeparator(text);
        this.setState({ money: displayMoney, error: '' });
    }

    onMonthChanged(text) {
        this.setState({ month: text, error: '' });
    }

    checkValidation() {
        const { date, money, month, willing } = this.state;
        return new Promise((resolve, reject) => {
            if (!date ||
                money.length === 0 ||
                month.length === 0 ||
                willing.length === 0) {
                return reject(ErrorMsg.FIELD_MISSING);
            } else if (parseFloat(NumberUtils.removeChar(money)) < Minimum.LOAN || 
                parseFloat(NumberUtils.removeChar(money)) > Maximum.LOAN ||
                parseFloat(NumberUtils.removeChar(money)) % Minimum.LOAN_NODE !== 0 ||
                    !RegularExp.NUMBER_SEPARATOR.test(money)) {
                return reject(ErrorMsg.LOAN_INVALID);
            } else if (parseInt(month, 10) < Minimum.NUM_MONTH ||
                parseInt(month, 10) > Maximum.NUM_MONTH ||
                !RegularExp.NUMBER.test(month)) {
                return reject(ErrorMsg.NUM_MONTH_INVALID);
            }
            return resolve();
        });
    }

    renderDatePicker() {
        const { containerDateInputStyle, iconDateStyle, inputDateStyle,
            inputDatePlaceholderStyle } = styles;
        const { date, loading } = this.state;
        const minDate = new Date();
        minDate.setDate((new Date()).getDate() + Minimum.MATURITY_DATE);
        return (
            <View style={containerDateInputStyle}>
                <Icon
                    color={Color.grayLight}
                    containerStyle={iconDateStyle}
                    name='calendar-check-o'
                    size={Size.icon_xs}
                    type='font-awesome'
                />
                <DatePickerCustom
                    dateInputStyle={inputDateStyle}
                    dateTextStyle={style.txtPrimary}
                    date={date}
                    disabled={loading}
                    onDateChange={this.onMaturityDateChanged.bind(this)}
                    minDate={minDate}
                    placeholder='Ngày giải ngân' 
                    placeholderTextStyle={inputDatePlaceholderStyle}
                    showIcon={false}
                />
                <View style={iconDateStyle} />
            </View>
        );
    }

    renderError() {
        const { error } = this.state;
        const { txtErrorStyle } = styles;
        if (error) {
            return (
                <TextCenter 
                    style={StyleSheet.flatten([style.txtRed, txtErrorStyle])}
                    text={error}
                />
            );
        }
    }

    renderMoneyPackItem(data) {
        return (
            <ItemLoanPack
                value={NumberUtils.addMoneySeparator(data.money.toString())}
                onPress={() => this.onMoneyChanged(data.money.toString())}
                unit={data.unit}
            />
        );
    }

    renderInputForm() {
        const { loading, money, month, willing } = this.state;
        const { buttonStyle, formInputStyle, txtMonthStyle } = styles;
        return (
            <ScrollView contentContainerStyle={style.fullCenterScroll}>
                <Text style={style.txtTitle}>SỐ TIỀN VAY</Text>
                <Card containerStyle={style.cardFull}>
                    <FlatList
                        contentContainerStyle={style.list}
                        data={moneyPack} 
                        horizontal
                        keyExtractor={(item) => item.money.toString()}
                        renderItem={({ item }) => this.renderMoneyPackItem(item)}
                    />
                    <FormInput
                        containerInputStyle={formInputStyle}
                        editable={!loading}
                        keyboardType={'numeric'}
                        iconName='money'
                        iconType='font-awesome'
                        inputStyle={style.txtPrimary}
                        maxLength={10}
                        onChangeText={this.onMoneyChanged.bind(this)}
                        placeholder='Số tiền vay'
                        value={money}
                    />
                </Card>

                <Text style={style.txtTitle}>SỐ THÁNG VAY</Text>
                <Card containerStyle={style.cardFull}>
                    <TextCenter 
                        style={txtMonthStyle}
                        text={`${month} tháng`}
                    />
                    <ProgressSlide
                        maximumValue={18}
                        maximumTxt='18 tháng'
                        minimumValue={1}
                        minimumTxt='1 tháng'
                        onValueChange={this.onMonthChanged.bind(this)}
                        value={month}
                    />
                </Card>

                <Text style={style.txtTitle}>MỤC ĐÍCH VAY</Text>
                <Card containerStyle={style.cardFull}>
                    <FormInput
                        containerInputStyle={formInputStyle}
                        editable={!loading}
                        iconName='bullseye'
                        iconType='font-awesome'
                        inputStyle={style.txtPrimary}
                        onChangeText={this.onWillingChanged.bind(this)}
                        placeholder='Mục đích vay'
                        value={willing}
                    /> 
                </Card>

                <Text style={style.txtTitle}>NGÀY GIẢI NGÂN</Text>
                <Card containerStyle={style.cardFull}>
                    {this.renderDatePicker()}
                </Card>

                {this.renderError()}

                <ButtonCustom 
                    disabled={loading} 
                    loading={loading}
                    onPress={this.onButtonPress.bind(this)}
                    buttonActiveStyle={buttonStyle}
                    title='TIẾP THEO'
                />
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
                    {this.renderInputForm()}
                </KeyboardAvoidingView>
            );
        }
        return (
            <View style={style.full}>
                {this.renderInputForm()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginVertical: Size.spacing,
        marginHorizontal: Size.spacing_sm
    },
    containerDateInputStyle: {
        flexDirection: 'row',
        backgroundColor: Color.white,
        borderWidth: 2,
        borderColor: Color.grayLight,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing_xs,
        margin: Size.spacing_sm
    },
    formInputStyle: {
        borderWidth: 2,
        borderColor: Color.grayLight
    },
    txtErrorStyle: {
        marginTop: Size.spacing
    },
    iconDateStyle: {
        alignSelf: 'center',
        flex: 1,
        padding: Size.spacing_xs
    },
    inputDateStyle: {
        alignSelf: 'center',
        flex: 5,
        padding: 0,
        margin: 0
    },
    txtMonthStyle: {
        color: Color.primary,
        fontSize: Size.font,
        marginBottom: 0,
        marginTop: Size.spacing_xs
    }
});

export default LoanCreate;
