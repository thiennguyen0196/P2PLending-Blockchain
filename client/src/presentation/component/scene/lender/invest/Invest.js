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
    ItemInvest,
    ItemSort,
    TextCenter
} from '../../../common';
import { onGetLoanWaitingList } from '../../../../../domain';
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
class Invest extends Component {
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: 'Đầu Tư',
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

    state = { 
        error: '', 
        intervalId: null, 
        loading: false, 
        loan: null, 
        loanNum: Math.floor(Math.random() * 100) + 100, 
        sortList: sortWaiting, 
        sortType: sortWaiting[0].sortType 
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.navigation.setParams({ onGetData: this.onGetData.bind(this) });
            const intervalId = setInterval(this.onGenerateInterval.bind(this), 5000);
            this.setState({ intervalId });
        });
        this.onGetData();
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
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
        onGetLoanWaitingList()
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

    onGenerateInterval() {
        const { loanNum } = this.state;
        let nextLoanNum;
        if (loanNum < 400) {
            const seed = Math.floor(Math.random() * 5);
            nextLoanNum = loanNum + seed;
        } else {
            nextLoanNum = Math.floor(Math.random() * 100) + 300;
        }
        this.setState({ loanNum: nextLoanNum });
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
        const investedMoney = data ? (Number.isInteger(data.investedNotes) ? 
            (Number.isInteger(data.baseUnitPrice) ? (data.investedNotes * data.baseUnitPrice) 
            : (data.investedNotes * Minimum.LOAN_NODE)) : 0) : 0;
        return (
            <ItemInvest
                data={data.info || null}
                investedMoney={investedMoney}
                onPress={() => this.props.navigation.navigate('InvestDetail', { 
                    loanContractId,
                    loan: data || null, 
                    investedMoney,
                    onNavigateTop: this.onGetData.bind(this),
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
        const { error, loan, loanNum, loading, sortList, sortType } = this.state;
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
                        text='Tổng cộng đơn vay có trong hệ thống' 
                    />
                    <View style={styles.loanNumStyle}>
                        <Text style={style.txtHeader}>
                            {loanNum}
                        </Text>
                        <Icon
                            color={Color.primary}
                            name='swap-vert'
                            type='material'
                            size={Size.icon}
                        />
                    </View>
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
                    {`CÁC KHOẢN VAY HIỆN CÓ (${loan ? loan.length : 0})`}
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
    },
    loanNumStyle: {
        alignSelf: 'center',
        flexDirection: 'row',
    }
});

export default Invest;
