import moment from 'moment';
import React, { Component } from 'react';
import {
    ActivityIndicator,
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import { 
    onGetUserInfo,
    onSignOut
 } from '../../../../../domain';
import {
    ConfirmDialog,
    ErrorView,
    ListItemCustom,
    ProgressLoading,
    TextCenter
} from '../../../common';
import { 
    Currency,
    DateTime,
    ErrorMsg,
    Minimum,
    Maximum 
} from '../../../../../Constant';
import DataUtils from '../../../../../utils/DataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import { 
    Color,
    Size
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class Profile extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Cá Nhân',
            headerRight: (
                <Text
                    style={styles.txtHeaderRight}
                    onPress={params.onNavigateUpdateInfo}
                >
                    Sửa
                </Text>
            ),
        };
    }

    state = { error: '', data: null, isLoadFirstTime: true, loading: false, loadingSignOut: false }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ 
                onNavigateUpdateInfo: this.onNavigateUpdateInfo.bind(this) 
            });
        });
        this.onGetData();
    }

    onGetData() {
        this.setState({ loading: true });
        onGetUserInfo()
            .then(result => {
                console.log(result);
                this.setState({ loading: false, isLoadFirstTime: false });
                if (!result.data) {
                    this.setState({ error: ErrorMsg.COMMON, loan: null });
                    return;
                }
                this.setState({ error: '', data: result.data });
            })
            .catch(error => {
                this.setState({ 
                    error: error.msg, 
                    loading: false, 
                    isLoadFirstTime: false, 
                    data: null
                });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    onNavigateUpdateInfo() {
        const { data, error, loading } = this.state;
        if (!error && data && !loading) {
            this.props.navigation.navigate('DeclarationInfo', {
                goBack: true,
                title: 'Cập Nhật Thông Tin',
                data,
                patch: true,
                onNavigateTop: this.onGetData.bind(this)
            });
        }
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
        const { error, data, isLoadFirstTime, loading, loadingSignOut } = this.state;
        const { containerCardStyle, containerScoreStyle, txtScoreStyle, } = styles;
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
            <ScrollView 
                contentContainerStyle={style.fullScroll}
                refreshControl={
                    <RefreshControl
                        colors={[Color.primary, Color.orange]}
                        refreshing={loading} 
                        onRefresh={this.onGetData.bind(this)}
                        tintColor={Color.primary}
                    />
                }
            >
                <View style={containerScoreStyle}>
                    <TextCenter 
                        style={txtScoreStyle}
                        text={data ? (Number.isInteger(data.score) ? 
                            `${data.score} / ${Maximum.SCORE}` : `${Minimum.SCORE}/${Maximum.SCORE}`) 
                            : `${Minimum.SCORE}/${Maximum.SCORE}`}
                    />
                    <TextCenter 
                        style={style.txtPrimary}
                        text='Điểm đánh giá cá nhân'
                    />
                </View>

                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='user-circle-o'
                        iconType='font-awesome'
                        rightTitle={data ? data.name : 'BLANK'}
                        title='Họ tên'
                    />
                    <ListItemCustom
                        iconName='calendar'
                        iconType='font-awesome'
                        rightTitle={data ? (data.birth ? 
                            moment(data.birth, DateTime.FORMAT_ISO).format(DateTime.FORMAT_DISPLAY) 
                            : 'BLANK') : 'BLANK'}
                        title='Ngày sinh'
                    />
                    <ListItemCustom
                        iconName='transgender'
                        iconType='font-awesome'
                        rightTitle={data ? (data.sex === 'male' ? 'Nam' : 'Nữ') : 'BLANK'}
                        title='Giới tính'
                    />
                    <ListItemCustom
                        iconName='email'
                        iconType='material'
                        rightTitle={data ? data.email : 'BLANK'}
                        title='Email'
                    />
                    <ListItemCustom
                        iconName='home'
                        iconType='font-awesome'
                        rightTitle={data ? data.address : 'BLANK'}
                        title='Địa chỉ'
                    />
                    <ListItemCustom
                        iconName='location-city'
                        iconType='material'
                        rightTitle={data ? data.city : 'BLANK'}
                        title='Thành phố'
                    />
                    <ListItemCustom
                        iconName='id-card-o'
                        iconType='font-awesome'
                        hideDivider
                        rightTitle={data ? data.ssn : 'BLANK'}
                        title='Số CMND'
                    />
                </Card>

                <Card containerStyle={containerCardStyle}>
                    <ListItemCustom
                        iconName='work'
                        iconType='material'
                        rightTitle={data ? (data.job || 'BLANK') : 'BLANK'}
                        title='Nghề nghiệp'
                    />
                    <ListItemCustom
                        iconName='wallet'
                        iconType='entypo'
                        hideDivider
                        rightTitle={data ? (Number.isInteger(data.income) ? 
                            `${NumberUtils.addMoneySeparator(data.income.toString())}${Currency.UNIT_VN}` 
                            : 'BLANK') : 'BLANK'}
                        title='Thu nhập'
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
            </ScrollView>
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
    containerScoreStyle: {
        margin: Size.spacing_lg
    },
    txtHeaderRight: {
        color: Color.white,
        fontSize: Size.font_lg,
        marginHorizontal: Size.spacing_sm
    },
    txtScoreStyle: {
        color: Color.primary,
        fontSize: Size.font_xxlg,
        borderWidth: 2,
        borderColor: Color.primary,
        borderRadius: Size.radius_xxlg,
        padding: Size.spacing,
    }
});

export default Profile;
