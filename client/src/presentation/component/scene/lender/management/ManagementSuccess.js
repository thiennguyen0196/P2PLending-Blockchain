import React, { Component } from 'react';
import {
    InteractionManager,
    FlatList,
    View,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { 
    Card,
    Icon
} from 'react-native-elements';
import {
    ErrorView,
    ItemLoanSuccess,
    ItemSort,
    TextCenter
} from '../../../common';
import { onGetLoanInvestedSuccessList } from '../../../../../domain';
import DataUtils from '../../../../../utils/DataUtils';
import { sortSuccess } from '../../../../../utils/MockDataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import {
    Currency, 
    ErrorMsg, 
    Minimum
} from '../../../../../Constant';
import {
    Color,
    Size
} from '../../../../style/Theme';
import style from '../../../../style/Style';

/*eslint-disable no-param-reassign */
/*eslint-disable no-nested-ternary */
/*eslint-disable max-len */
class ManagementSuccess extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Quản Lý',
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
                        onPress={() => navigation.navigate('MyNotification', { type: 'lender' })} 
                        type='font-awesome'
                        size={Size.icon_sm}
                    />
                </View>
            ),
        };
    }

    state = { error: '', loading: false, data: null, sortList: sortSuccess, sortType: 'rate' };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ onGetData: this.onGetData.bind(this) });
        });
        this.onGetData();
    }

    onChangeSortType = (index) => {
        const { data, sortList } = this.state;
        const list = sortList;
        const type = list[index].sortType;
        list.forEach(element => {
            element.selected = false;
        });
        list[index].selected = true;
        this.setState({ 
            data: NumberUtils.sortManagementItem(data, type), 
            sortList: list, 
            sortType: type 
        });
    }

    onGetData() {
        const { sortType } = this.state;
        this.setState({ loading: true, data: null });
        onGetLoanInvestedSuccessList()
            .then(result => {
                console.log(result);
                this.setState({ loading: false });
                if (!result || !Array.isArray(result)) {
                    this.setState({ data: null, error: ErrorMsg.COMMON });
                    return;
                }
                this.setState({ 
                    error: '', 
                    data: NumberUtils.sortManagementItem(result, sortType) 
                });
            })
            .catch(error => {
                this.setState({ error: error.msg, loading: false, data: null });
                DataUtils.handleApiCatch(error, this.props.navigation);
            });
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

    renderListItem(data) {
        const loan = data ? data.loan : null;
        const transactionId = data ? (data.loan ? data.loan.txId : null) : null;
        const invest = data ? data.invest : null;
        return (
            <ItemLoanSuccess
                loan={loan || null}
                invest={invest || null}
                onPress={() => this.props.navigation.navigate('ManagementDetailSuccess', { 
                    loanContractId: loan.contractId,
                    loan: loan.info,
                    invest: invest.info,
                    investContractId: invest.contractId,
                    transactionId
                })}
            />
        );
    }

    renderLoanSuccessList() {
        const { data, sortType } = this.state;
        const { listStyle, listSingleStyle } = styles;
        return (
            <FlatList
                contentContainerStyle={data ? (data.length > 1 ? 
                    listStyle : listSingleStyle) : listSingleStyle}
                data={data} 
                extraData={sortType}
                keyExtractor={(item) => item.loan.contractId}
                numColumns={2}
                renderItem={({ item }) => this.renderListItem(item)}
            />
        );
    }

    renderSortItem(data, index) {
        return (
            <ItemSort
                iconName={data.iconName}
                iconType={data.iconType}
                onPress={() => this.onChangeSortType(index)}
                selected={data.selected}
                text={data.sortName}
            />
        );
    }

    render() {
        const { data, error, loading, sortList, sortType } = this.state;
        const baseUnitPrice = data ? (data.length > 0 ? (data[0].loan ? 
            (Number.isInteger(data[0].loan.baseUnitPrice) ? data[0].loan.baseUnitPrice 
            : Minimum.LOAN_NODE) : Minimum.LOAN_NODE) : Minimum.LOAN_NODE) : Minimum.LOAN_NODE;
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
                <Card containerStyle={style.cardFull}>
                    <TextCenter 
                        style={style.txtCaption}
                        text='Số tiền đã đầu tư thành công' 
                    />
                    <TextCenter 
                        style={style.txtHeader}
                        text={Array.isArray(data) ?
                            `${NumberUtils.addMoneySeparator((baseUnitPrice * data.length).toString())}${Currency.UNIT_VN}`
                            : '0đ'} 
                    />
                </Card>
                <Text style={style.txtTitle}>SẮP XẾP GIẢM DẦN THEO</Text>
                <Card containerStyle={style.cardFull}>
                    <FlatList
                        contentContainerStyle={style.list}
                        extraData={sortType}
                        data={sortList} 
                        horizontal
                        keyExtractor={(item) => item.sortType}
                        renderItem={({ item, index }) => this.renderSortItem(item, index)}
                    />
                </Card>
                <Text style={style.txtTitle}>
                    {`CÁC KHOẢN VAY ĐÃ ĐẦU TƯ (${data ? data.length : 0})`}
                </Text>
                {this.renderLoanSuccessList()}

                <View style={style.viewPadding} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listStyle: {
        alignSelf: 'center',
        margin: Size.spacing_xs,
    },
    listSingleStyle: {
        marginVertical: Size.spacing_xs,
        marginHorizontal: Size.spacing_xs * 2
    }
});

export default ManagementSuccess;

