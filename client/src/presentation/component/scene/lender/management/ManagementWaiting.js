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
    ItemLoanWaiting,
    ItemSort
} from '../../../common';
import { onGetLoanInvestedWaitingList } from '../../../../../domain';
import DataUtils from '../../../../../utils/DataUtils';
import { sortWaiting } from '../../../../../utils/MockDataUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import { 
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
class ManagementWaiting extends Component {
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

    state = { error: '', loading: false, loan: null, sortList: sortWaiting, sortType: 'rate' };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ onGetData: this.onGetData.bind(this) });
        });
        this.onGetData();
    }

    onChangeSortType = (index) => {
        const { loan, sortList } = this.state;
        const list = sortList;
        const type = list[index].sortType;
        list.forEach(element => {
            element.selected = false;
        });
        list[index].selected = true;
        this.setState({ 
            loan: NumberUtils.sortInvestItem(loan, type), 
            sortList: list, 
            sortType: type 
        });
    }

    onGetData() {
        const { sortType } = this.state;
        this.setState({ loading: true, loan: null });
        onGetLoanInvestedWaitingList()
            .then(result => {
                console.log(result);
                this.setState({ loading: false });
                if (!result.data ||
                    !result.data.loan || 
                    !Array.isArray(result.data.loan)) {
                        this.setState({ loan: null, error: ErrorMsg.COMMON });
                    return;
                }
                this.setState({ 
                    error: '', 
                    loan: NumberUtils.sortInvestItem(result.data.loan, sortType) 
                });
            })
            .catch(error => {
                this.setState({ error: error.msg, loading: false, loan: null });
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
        const loanContractId = data.contractId || null;
        const transactionId = data ? data.txId : null;
        const investedMoney = data ? (Number.isInteger(data.investedNotes) ? 
            (Number.isInteger(data.baseUnitPrice) ? (data.investedNotes * data.baseUnitPrice) 
            : (data.investedNotes * Minimum.LOAN_NODE)) : 0) : 0;
        return (
            <ItemLoanWaiting
                data={data.info || null}
                investedMoney={investedMoney}
                onPress={() => this.props.navigation.navigate('ManagementDetailWaiting', { 
                    loanContractId,
                    loan: data.info || null, 
                    investedMoney,
                    transactionId
                 })}
            />
        );
    }

    renderLoanWaitingList() {
        const { loan, sortType } = this.state;
        const { listStyle, listSingleStyle } = styles;
        return (
            <FlatList
                contentContainerStyle={loan ? (loan.length > 1 ? 
                    listStyle : listSingleStyle) : listSingleStyle}
                data={loan} 
                extraData={sortType}
                keyExtractor={(item) => item.contractId}
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
        const { error, loading, loan, sortList, sortType } = this.state;
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
                    {`CÁC KHOẢN VAY ĐÃ ĐẦU TƯ (${loan ? loan.length : 0})`}
                </Text>
                {this.renderLoanWaitingList()}

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

export default ManagementWaiting;

