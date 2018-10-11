/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { 
    Card, 
    Row, 
    Col, 
    CardBody 
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import moment from 'moment-timezone';

import { headerCount as getCountHeaderCreator } from '../../store/actions/header/action-creators';
import { getTxByOrg as getTxByOrgCreator } from '../../store/actions/charts/action-creators';

class UserView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setInterval(() => {
            this.props.getTxByOrg(this.props.channel.currentChannel);
        }, 3000);

        if(this.props.txId){
            this.props.getTransactionInfo(this.props.channel.currentChannel, this.props.txId);
        }
    }
    render() {
        const date = new Date(this.props.transaction.createdt);
        const dateString = moment(date).tz(moment.tz.guess()).format("DD-MM-YYYY hh:mm:ss A");

        return (
            <div style={styles.containerStyle}>
                <h3 style={styles.titleStyle}>Network information</h3>
            
                <Row style={styles.rowStyle}>
                    <Card className="count-card dark-card" style={styles.cardStyle}>
                        <CardBody>
                            <h1>{this.props.countHeader.countHeader.latestBlock}</h1>
                            <h4><FontAwesome name="cube" />Blocks</h4>
                        </CardBody>
                    </Card>

                    <Card className="count-card light-card" style={styles.cardStyle}>
                        <CardBody>
                            <h1>{this.props.countHeader.countHeader.txCount}</h1>
                            <h4><FontAwesome name="list-alt" /> Transactions</h4>
                        </CardBody>
                    </Card>
                    
                    <Card className="count-card dark-card" style={styles.cardStyle}>
                        <CardBody>
                            <h1>8</h1>
                            <h4><FontAwesome name="users" />Nodes</h4>
                        </CardBody>
                    </Card>

                    <Card className="count-card light-card" style={styles.cardStyle}>
                        <CardBody>
                            <h1>3</h1>
                            <h4><FontAwesome name="handshake-o" />Chaincodes</h4>
                        </CardBody>
                    </Card>
                </Row>

                <h3 style={styles.titleStyle}>Transaction details</h3>

                {this.props.transaction.read_set ?
                    (<div style={styles.txContainerStyle}>
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Field</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/*Block Id*/}
                                <tr>
                                    <td>Block id</td>
                                    <td><span style={styles.valueStyle}>
                                        {this.props.transaction.blockid} 
                                    </span></td>
                                </tr>
                            {/*Network*/}
                                <tr>
                                    <td>Network</td>
                                    <td><span style={styles.valueStyle}>
                                        {this.props.transaction.chaincodename} 
                                    </span></td>
                                </tr>
                            {/*Timestamp*/}
                                <tr>
                                <td>Timestamp</td>
                                    <td><span style={styles.valueStyle}>
                                        {dateString} 
                                    </span></td>
                                </tr>
                            {/*Tx Id*/}
                                <tr>
                                    <td>Transaction id</td>
                                    <td><span style={styles.valueStyle}>
                                        {this.props.transaction.txhash.slice(0, 16) + " - " 
                                        + this.props.transaction.txhash.slice(16, 32) + " - "
                                        + this.props.transaction.txhash.slice(32, 48) + " - "
                                        + this.props.transaction.txhash.slice(32, 48)} 
                                    </span></td>
                                </tr>
                            {/*Tx type*/}
                                <tr>
                                    <td>Transaction type</td>
                                    <td><span style={styles.valueStyle}>
                                        {this.props.transaction.fcType} 
                                    </span></td>
                                </tr>
                            {/*Tx status*/}
                                <tr>
                                    <td>Transaction status</td>
                                    <td><span style={styles.valueStyle}>
                                        Success 
                                    </span></td>
                                </tr>
                            {/*Tx Read set*/}
                                <tr>
                                    <td>Tx Data Read set</td>
                                    <td><span style={styles.valueStyle}>
                                        {JSON.stringify(this.props.transaction.read_set).replace(/(.{20})/g, '$1 ').trim()}
                                    </span></td>
                                </tr>
                            {/*Tx Write set*/}
                                <tr>
                                    <td>Tx Data Write set</td>
                                    <td><span style={styles.valueStyle}>
                                        {JSON.stringify(this.props.transaction.write_set).replace(/(.{20})/g, '$1 ').trim()}
                                    </span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>)
                    :(<div>
                    </div>)}
            </div>   
        );
    }
}

const styles = {
    containerStyle:{
        marginTop: '15px',
    },
    rowStyle: {
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'row',
    },
    cardStyle: {
        marginBottom: '7px'
    },
    titleStyle: {
        marginLeft: '7px'
    },
    txContainerStyle:{
        display: 'flex',
        marginLeft: '17px',
        marginRight: '17px',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row'
    },
    valueStyle: {
        display: 'inline-block'
    }
};

const mapDispatchToProps = (dispatch) => ({
    getCountHeader: (curChannel) => dispatch(getCountHeaderCreator(curChannel)),
    getTxByOrg: (curChannel) => dispatch(getTxByOrgCreator(curChannel))
});
const mapStateToProps = state => ({
    countHeader: state.countHeader,
    txByOrg: state.txByOrg.txByOrg,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(UserView);

