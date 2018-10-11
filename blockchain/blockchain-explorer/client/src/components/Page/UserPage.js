import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import { blockList } from '../../store/actions/block/action-creators';
import { latestBlock } from '../../store/actions/latestBlock/action-creators';
import { transactionInfo } from '../../store/actions/transaction/action-creators';
import { headerCount } from '../../store/actions/header/action-creators';
import {
	getBlockList,
	getChannelSelector,
	getTransaction,
} from '../../store/selectors/selectors'

import UserView from './../View/UserView'


class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countHeader: { countHeader: this.props.getHeaderCount() }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.countHeader) !== JSON.stringify(this.props.countHeader)) {
            this.setState({ countHeader: nextProps.countHeader });
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.props.getHeaderCount(this.props.channel.currentChannel);
            this.props.getLatestBlock(this.props.channel.currentChannel, 0);
        }, 3000)
    }

    render() {
        return (
            <div>
                <UserView
                    txId = {this.props.txId} 
                    channel = {this.props.channel} 
                    transaction = {this.props.transaction}
                    blockList = {this.props.blockList} 
                    getTransactionInfo = {this.props.getTransactionInfo} 
                />
            </div>
        );
    }

}

export default connect((state) => ({
    blockList: getBlockList(state),
    channel: getChannelSelector(state),
    transaction: getTransaction(state),
}), {
    getBlockList: blockList,
    getHeaderCount: headerCount,
    getLatestBlock: latestBlock,
    getTransactionInfo: transactionInfo,
})(UserPage);
