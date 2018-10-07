import React, { Component } from 'react';
import { 
    ActivityIndicator,
    WebView
} from 'react-native';
import { ErrorView } from '../../common';
import { 
    Default,
    ErrorMsg 
} from '../../../../Constant';
import { Color } from '../../../style/Theme';
import style from '../../../style/Style';

/*eslint-disable no-nested-ternary */
class WebTransaction extends Component {
    static navigationOptions = {
        headerTitle: 'Hyperledger Explorer',
    };

    state = { error: '', key: 1, uri: Default.TRANSACTION_WEB_LINK }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const { uri } = this.state;
        const transactionId = params ? params.transactionId || '' : '';
        this.setState({ uri: uri + transactionId });
    }

    componentWillUnmount() {
        if (this.props.navigation.state.params.onNavigateBack) {
            this.props.navigation.state.params.onNavigateBack();
        }
    }

    onRefresh() {
        const { key } = this.state;
        this.setState({ error: '', key: key + 1 });
    }

    renderLoading() {
        return (
            <ActivityIndicator
                color={Color.primary}
                size='large'
                style={style.absoluteCenter}
            />
        );
    }

    renderError() {
        const { error } = this.state;
        return (
            <ErrorView
                onPress={this.onRefresh.bind(this)}
                error={error}
            />
        );
    }

    render() {
        const { key, uri } = this.state;
        return (
            <WebView
                onError={() => this.setState({ error: ErrorMsg.COMMON })}
                key={key}
                renderError={this.renderError.bind(this)}
                renderLoading={this.renderLoading.bind(this)}
                source={{ uri }}
                startInLoadingState
            />
        );
    }
}

export default WebTransaction;
