import React, { Component } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text
} from 'react-native';
import { 
    ItemPayment,
    TextCenter
} from '../../common';
import { 
    banks,
    eWallets 
} from '../../../../utils/MockDataUtils';
import { ErrorMsg } from '../../../../Constant';
import { 
    Color, 
    Size 
} from '../../../style/Theme';
import style from '../../../style/Style';

class Gateway extends Component {
    static navigationOptions = {
        headerTitle: 'Chọn Cổng Thanh Toán',
    };

    state = { 
        action: null, 
        bankList: banks, 
        contractId: null,
        data: null, 
        eWalletList: eWallets,
        error: '',
        money: null
    };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params);
        if (!params) {
            this.setState({ error: ErrorMsg.COMMON });
        } else {
            this.setState({ 
                action: params.action || null,
                contractId: params.contractId || null,
                data: params.data || null,
                money: params.money || null
            });
        }
    }

    onNavigateTop() {
        this.props.navigation.state.params.onNavigateTop();
    }

    renderListItem(item) {
        const { action, contractId, data, error, money } = this.state;
        return (
            <ItemPayment
                onPress={() => {
                    if (error === '') {
                        console.log(action, contractId, data, error, money);
                        this.props.navigation.navigate('PaymentLink', {
                            action,
                            contractId,
                            data,
                            item,
                            money,
                            onNavigateTop: this.onNavigateTop.bind(this)
                        });
                    }
                }}
                source={item.img}
            />
        );
    }

    renderError() {
        const { error } = this.state;
        if (error) {
            return (
                <TextCenter 
                    style={styles.txtErrorStyle}
                    text={error}
                />
            );
        }
    }

    render() {
        const { action, bankList, eWalletList } = this.state;
        const { listStyle } = styles;
        return (
            <ScrollView>
                <Text style={style.txtTitle}>VÍ ĐIỆN TỬ</Text>
                <FlatList
                    contentContainerStyle={listStyle}
                    extraData={action}
                    data={eWalletList}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => this.renderListItem(item)}
                />

                <Text style={style.txtTitle}>THẺ NỘI ĐỊA</Text>
                <FlatList
                    contentContainerStyle={listStyle}
                    extraData={action}
                    data={bankList}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => this.renderListItem(item)}
                />
                {this.renderError()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    listStyle: {
        marginHorizontal: Size.spacing_xs,
        marginVertical: 0,
        padding: 0
    },
    txtErrorStyle: {
        color: Color.red,
        margin: Size.spacing
    }
});

export default Gateway;
