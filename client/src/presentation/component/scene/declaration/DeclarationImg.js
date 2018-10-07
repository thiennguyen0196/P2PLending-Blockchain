import moment from 'moment';
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    View,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
    ButtonCustom,
    ImagePickerContainer,
    Gradient,
    HeaderTransparent,
    TextCenter,
} from '../../common';
import { 
    onDeclareInfo,
    onEditInfo 
} from '../../../../domain';
import DataUtils from '../../../../utils/DataUtils';
import { 
    DateTime, 
    ErrorMsg 
} from '../../../../Constant';
import style from '../../../style/Style';

class DeclarationImg extends Component {
    static navigationOptions = {
        header: null
    };

    state = { error: '', loading: false, ssnBackImg: null, ssnFrontImg: null, selfieImg: null };

    onButtonPress() {
        const { params } = this.props.navigation.state;
        const address = params ? params.address : null;
        let birth = params ? params.birth : null;
        const city = params ? params.city : null;
        const email = params ? params.email : null;
        const job = params ? params.job : null;
        const incomeNum = params ? params.incomeNum : null;
        const name = params ? params.name : null;
        const sex = params ? params.sex : null;
        const ssn = params ? params.ssn : null;
        const patch = params ? params.patch : false;
        const { ssnBackImg, ssnFrontImg, selfieImg } = this.state;
        birth = moment(birth, DateTime.FORMAT_DISPLAY).format(DateTime.FORMAT_SEND);
        console.log(address, birth, city, email, job, incomeNum, name, sex, ssn, patch);
        this.checkValidation()
            .then(() => {
                this.setState({ error: '', loading: true });
                if (!patch) {
                    return onDeclareInfo(address, birth, city, email, job, 
                        incomeNum, name, sex, ssn, ssnBackImg, ssnFrontImg, selfieImg);
                }
                return onEditInfo(address, birth, city, email, job, 
                    incomeNum, name, sex, ssn, ssnBackImg, ssnFrontImg, selfieImg);
            })
            .then(result => {
                console.log(result);
                this.setState({ 
                    loading: false, 
                    ssnBackImg: '', 
                    ssnFrontImg: '', 
                    selfieImg: '' 
                });
                const loan = null;
                if (patch) {
                    this.props.navigation.state.params.onNavigateTop();
                    this.props.navigation.popToTop();
                    return;
                }
                this.props.navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ 
                            routeName: 'BorrowerTabNavigator',
                            params: { loan } 
                        })
                    ]
                }));
            })
            .catch(error => {
                this.setState({ error: error.msg, loading: false });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    onSSNBackImgChanged(img) {
        this.setState({ error: '', ssnBackImg: img });
    }

    onSSNFrontImgChanged(img) {
        this.setState({ error: '', ssnFrontImg: img });
    }

    onSelfieImgChanged(img) {
        this.setState({ error: '', selfieImg: img });
    }

    checkValidation() {
        const { ssnBackImg, ssnFrontImg, selfieImg } = this.state;
        return new Promise((resolve, reject) => {
            if (!ssnBackImg || !ssnFrontImg || !selfieImg) {
                return reject(ErrorMsg.FIELD_MISSING);
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
        const { loading, ssnBackImg, ssnFrontImg, selfieImg } = this.state;
        return (
            <ScrollView contentContainerStyle={style.fullCenterScroll}>
                <Text style={style.txtTitleWhite}>
                    MẶT TRƯỚC CMND
                </Text>

                <ImagePickerContainer
                    imgSource={ssnFrontImg}
                    disabled={loading}
                    onPressAction={this.onSSNFrontImgChanged.bind(this)}
                    text='Chọn ảnh'
                />

                <Text style={style.txtTitleWhite}>
                    MẶT SAU CMND
                </Text>

                <ImagePickerContainer
                    imgSource={ssnBackImg}
                    disabled={loading}
                    onPressAction={this.onSSNBackImgChanged.bind(this)}
                    text='Chọn ảnh'
                />

                <Text style={style.txtTitleWhite}>
                    ẢNH THẬT CỦA BẠN
                </Text>

                <ImagePickerContainer
                    containerStyle={style.imgSpacingBottom}
                    imgSource={selfieImg}
                    disabled={loading}
                    onPressAction={this.onSelfieImgChanged.bind(this)}
                    text='Chọn ảnh'
                />

                {this.renderError()}

                <ButtonCustom
                    disabled={loading}   
                    elevation
                    loading={loading}
                    onPress={this.onButtonPress.bind(this)}
                    title='XÁC MINH'
                />

                <View style={style.viewPadding} />
            </ScrollView>
        );
    }

    renderUI() {
        return (
            <View style={style.full}>
                <HeaderTransparent 
                    goBack
                    onBackIconPress={() => this.props.navigation.goBack()}
                    title='Xác Minh'
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

export default DeclarationImg;
