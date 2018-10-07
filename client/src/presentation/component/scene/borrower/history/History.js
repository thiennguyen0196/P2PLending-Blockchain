import React, { Component } from 'react';
import {
    Dimensions,
    FlatList,
    InteractionManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
    ErrorView,
    ItemLoanHistory,
    ImageCenter,
    SliderAd
} from '../../../common';
import { onGetHistory } from '../../../../../domain';
import DataUtils from '../../../../../utils/DataUtils';
import { 
    Color, 
    Size
} from '../../../../style/Theme';
import { ErrorMsg } from '../../../../../Constant';
import style from '../../../../style/Style';

class History extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Lịch sử',
            headerRight: (
                <View style={style.alignRow}>
                    <Icon
                        color={Color.white}
                        containerStyle={style.iconHeader}
                        component={TouchableOpacity}
                        name='refresh'
                        onPress={params.onGetData} 
                        type='font-awesome'
                        size={Size.icon_sm}
                    />
                    <Icon
                        color={Color.white}
                        containerStyle={style.iconHeader}
                        component={TouchableOpacity}
                        name='bell-o'
                        onPress={() => navigation.navigate('MyNotification', { type: 'borrower' })} 
                        type='font-awesome'
                        size={Size.icon_sm}
                    />
                </View>
            ),
        };
    }

    state = { 
        error: '', 
        loading: false, 
        loanClean: null, 
        loanFail: null
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ onGetData: this.onGetData.bind(this) });
        });
        this.onGetData();
    }

    onGetData() {
        this.setState({ loading: true, loanClean: null, loanFail: null });
        onGetHistory()
            .then(result => {
                console.log(result);
                this.setState({ loading: false });
                if (!result || !Array.isArray(result) || result.length !== 2) {
                    this.setState({ error: ErrorMsg.COMMON, loanClean: null, loanFail: null });
                    return;
                }
                this.setState({ 
                    error: '', 
                    loanClean: result[0] ? result[0].loan : null, 
                    loanFail: result[1] ? result[1].loan : null 
                });
            })
            .catch(error => {
                this.setState({ 
                    error: error.msg, 
                    loading: false, 
                    loanClean: null, 
                    loanFail: null 
                });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
    }

    renderEmptyItem() {
        return (
            <ImageCenter
                /*eslint-disable global-require */
                source={require('../../../../img/empty.png')}
                style={styles.imgStyle}
            />
        );
    }

    renderErrorView() {
        const { error, loading } = this.state;
        return (
            <ErrorView
                onPress={this.onGetData.bind(this)}
                error={error}
                loading={loading}
            />
        );
    }

    renderListItemClean(data) {
        return (
            <ItemLoanHistory
                loan={data || null}
                onPress={() => this.props.navigation.navigate('HistoryDetailClean', { 
                    loan: data || null,
                    loanContractId: data ? data.contractId || null : null,
                    transactionId: data ? data.txId || null : null,
                })}
            />
        );
    }

    renderListItemFail(data) {
        return (
            <ItemLoanHistory
                fail
                loan={data || null}
                onPress={() => this.props.navigation.navigate('HistoryDetailFail', { 
                    loan: data || null,
                    loanContractId: data ? data.contractId || null : null,
                    transactionId: data ? data.txId || null : null,
                })}
            />
        );
    }

    render() {
        const { error, loanClean, loanFail, loading } = this.state;
        const { listStyle } = styles;
        if (error) {
            return this.renderErrorView();
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
                <SliderAd />
                <Text style={style.txtTitle}>
                    {`CÁC KHOẢN VAY ĐÃ TRẢ THÀNH CÔNG (${loanClean ? loanClean.length : 0})`}
                </Text>
                <FlatList
                    data={loanClean} 
                    horizontal
                    keyExtractor={(item) => item.contractId}
                    ListEmptyComponent={this.renderEmptyItem.bind(this)}
                    renderItem={({ item }) => this.renderListItemClean(item)}
                    refreshing={loading}
                    style={listStyle}
                />

                <Text style={style.txtTitle}>
                    {`CÁC KHOẢN VAY THẤT BẠI (${loanFail ? loanFail.length : 0})`}
                </Text>
                <FlatList
                    data={loanFail} 
                    horizontal
                    keyExtractor={(item) => item.contractId}
                    ListEmptyComponent={this.renderEmptyItem.bind(this)}
                    renderItem={({ item }) => this.renderListItemFail(item)}
                    refreshing={loading}
                    style={listStyle}
                />

                <View style={style.viewPadding} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listStyle: {
        marginHorizontal: Size.spacing_xs,
        marginVertical: 0
    },
    imgStyle: {
        height: Dimensions.get('window').width / 4
    }
});

export default History;
