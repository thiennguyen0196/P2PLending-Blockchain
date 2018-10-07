import React, { Component } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import { 
    onGetPhoneNumber,
    onSignOut
 } from '../../../../../domain';
import {
    ConfirmDialog,
    ErrorView,
    ImageCenter,
    ListItemCustom,
    ProgressLoading
} from '../../../common';
import DataUtils from '../../../../../utils/DataUtils';
import { 
    Color,
    Size
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable global-require */
class Profile extends Component {
    static navigationOptions = {
        headerTitle: 'Cá Nhân',
    };

    state = { error: '', isLoadFirstTime: true, loading: false, loadingSignOut: false, phone: ' ' }

    componentDidMount() {
        this.onGetData();
    }

    onGetData() {
        this.setState({ loading: true, phone: ' ' });
        onGetPhoneNumber()
            .then(result => {
                console.log(result);
                this.setState({ error: '', isLoadFirstTime: false, loading: false, phone: result });
            })
            .catch(error => this.setState({ 
                error: error.msg, 
                isLoadFirstTime: false, 
                loading: false, 
                phone: ' ' 
            }));
    }

    onSignOut() {
        ConfirmDialog(
            'Đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            true
        ).then(() => {
            this.setState({ error: '', loading: false, loadingSignOut: true });
            return onSignOut();
        })
        .then(result => {
            console.log(result);
            this.setState({ loadingSignOut: false });
            this.props.navigation.dispatch(NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'SignIn' })
                ]
            }));
        })
        .catch(error => {
            this.setState({ error: error.msg, loadingSignOut: false });
            DataUtils.handleApiCatch(error, this.props.navigation);
        });
    }

    render() {
        const { error, isLoadFirstTime, loading, loadingSignOut, phone } = this.state;
        const { containerCardStyle, imgStyle } = styles;
        if (error) {
            return (
                <ErrorView
                    onPress={this.onGetData.bind(this)}
                    error={error}
                    loading={loading}
                />
            );
        }
        if (isLoadFirstTime) {
            return (
                <ActivityIndicator
                    color={Color.primary}
                    size='large'
                    style={style.absoluteCenter}
                />
            );
        }
        return (
            <View style={style.full}>
                <ImageCenter
                    ratio={Size.ratio_3_2}
                    source={require('../../../../img/logo_gradient.png')}
                    style={imgStyle}
                />

                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='phone'
                        iconType='feather'
                        hideDivider
                        rightTitle={phone}
                        title='Số điện thoại'
                    />
                </Card>

                <TouchableOpacity onPress={this.onSignOut.bind(this)}>
                    <Card containerStyle={containerCardStyle}>
                        <ListItemCustom
                            chevron
                            chevronColor={Color.grayLight}
                            iconName='sign-out'
                            iconType='font-awesome'
                            hideDivider
                            hideChevron={false}
                            title='Đăng xuất'
                        />
                    </Card>
                </TouchableOpacity>

                <ProgressLoading loading={loadingSignOut} /> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerCardStyle: {
        borderWidth: 1,
        borderColor: Color.grayLightExtreme,
        marginHorizontal: 0,
        marginTop: 0,
        marginBottom: Size.spacing_lg,
        padding: 0
    },
    imgStyle: {
        margin: Size.spacing_lg,
        height: Dimensions.get('window').width - (Size.spacing_lg * 7),
        width: (Dimensions.get('window').width - (Size.spacing_lg * 7)) * Size.ratio_3_2
    }
});

export default Profile;
