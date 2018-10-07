import React, { Component } from 'react';
import {
    FlatList,
    RefreshControl
} from 'react-native';
import { 
    ErrorView,
    ItemNotification 
} from '../../common';
import {
    notiBorrower, 
    notiLender 
} from '../../../../utils/MockDataUtils';
import { Color } from '../../../style/Theme';
import style from '../../../style/Style';

/*eslint-disable no-nested-ternary */
class MyNotification extends Component {
    static navigationOptions = {
        headerTitle: 'Thông Báo',
    };

    state = { data: null, error: '', loading: false };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        this.setState({ 
            data: params ? (params.type === 'lender' ? notiLender : notiBorrower) : null 
        });
    }

    onGetData() {
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
        return (
            <ItemNotification
                data={data}
            />
        );
    }

    render() {
        const { data, error, loading } = this.state;
        if (error) {
            return this.renderErrorView();
        }
        return (
            <FlatList
                contentContainerStyle={style.fullScroll}
                data={data} 
                keyExtractor={(item) => item.notiDescription}
                refreshControl={
                    <RefreshControl
                        colors={[Color.primary, Color.orange]}
                        refreshing={loading} 
                        onRefresh={this.onGetData.bind(this)}
                        tintColor={Color.primary}
                    />
                }
                renderItem={({ item }) => this.renderListItem(item)}
            />
        );
    }
}

export default MyNotification;

