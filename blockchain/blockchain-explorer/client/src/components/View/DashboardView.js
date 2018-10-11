/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import ChartStats from '../Charts/ChartStats';
import PeerGraph from '../Charts/PeerGraph';
import TimelineStream from '../Lists/TimelineStream';
import OrgPieChart from '../Charts/OrgPieChart';
import { Card, Row, Col, CardBody } from 'reactstrap';
import { headerCount as getCountHeaderCreator } from '../../store/actions/header/action-creators';
import { getTxByOrg as getTxByOrgCreator } from '../../store/actions/charts/action-creators';
import FontAwesome from 'react-fontawesome';
import { FormHelperText } from 'material-ui';
import Typography from 'material-ui/Typography';
import moment from 'moment-timezone';

class DashboardView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
		}
	}

  componentWillReceiveProps(nextProps) {
	if (nextProps && nextProps.countHeader && nextProps.countHeader.countHeader){
		var latestBlock = nextProps.countHeader.countHeader.latestBlock;

		if (latestBlock > this.props.countHeader.countHeader.latestBlock){
			console.log("New Block", latestBlock);
			
			fetch(`/api/blockAndTxList/channel1/${latestBlock}`)
				.then((response) => response.json())
				.then((result) => {
					var arr = this.state.notifications;
					console.log('latestBlock', result);
					const notify = {
						'title': 'Block ' + result.rows[0].blocknum + ' Added',
						'type': 'block',
						'time': result.rows[0].createdt,
						'txcount': result.rows[0].txcount,
						'datahash': result.rows[0].datahash
					};
					arr.unshift(notify);
      				this.setState({ notifications: arr });	
				})			
		}
	}
  
    if (Object.keys(nextProps.notification).length !== 0 && this.props.notification !== nextProps.notification) {
      var arr = this.state.notifications;
      arr.unshift(nextProps.notification);
      this.setState({ notifications: arr });
    }
    if (nextProps.channel.currentChannel !== this.props.channel.currentChannel)
      this.props.getTxByOrg(nextProps.channel.currentChannel);
  }

  componentDidMount() {
    setInterval(() => {
      this.props.getTxByOrg(this.props.channel.currentChannel);
    }, 60000);

    let arr = [];

    for (let i = 0; i < 3; i++) {
      if (this.props.blockList !== undefined) {
        const block = this.props.blockList[i];
        const notify = {
          'title': 'Block ' + block.blocknum + ' Added',
          'type': 'block',
          'time': block.createdt,
          'txcount': block.txcount,
          'datahash': block.datahash
        };
        arr.push(notify);
      }
	}
  
	this.setState({ 
		notifications: arr
	});
  }
  
  render() {
    return (
      <div className="dashboard" style={styles.containerStyle}>

        <div className="dash-stats" >
          <Row style={styles.rowStyle}>
            <Card className="count-card dark-card">
              <CardBody>
                <h1>{this.props.countHeader.countHeader.latestBlock}</h1>
                <h4> <FontAwesome name="cube" /> Blocks</h4>
              </CardBody>
            </Card>

            <Card className="count-card light-card" >
              <CardBody>
                <h1>{this.props.countHeader.countHeader.txCount}</h1>
                <h4><FontAwesome name="list-alt" /> Transactions</h4>
              </CardBody>
            </Card>

            <Card className="count-card dark-card" >
              <CardBody>
                <h1>8</h1>
                <h4><FontAwesome name="users" />Nodes</h4>
              </CardBody>
            </Card>

            <Card className="count-card light-card" >
              <CardBody>
                <h1>3</h1>
                <h4><FontAwesome name="handshake-o" />Chaincodes</h4>
              </CardBody>
            </Card>
          </Row>
        </div>

        <Row style={styles.rowStyle}>
          <TimelineStream style={{width: '620px'}}
            notifications={this.state.notifications} />   
            <div style={{width: '5px'}} />
          <ChartStats />
        </Row>
      </div>
    );
  }
}

const styles = {
  rowStyle: {
    display: 'flex',
    marginTop: '15px',
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'row',
  }
};

const mapDispatchToProps = (dispatch) => ({
  getCountHeader: (curChannel) => dispatch(getCountHeaderCreator(curChannel)),
  getTxByOrg: (curChannel) => dispatch(getTxByOrgCreator(curChannel))
});
const mapStateToProps = state => ({
  countHeader: state.countHeader,
  txByOrg: state.txByOrg.txByOrg,
  channel: state.channel.channel,
  notification: state.notification.notification,
  peerList: state.peerList.peerList
});
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DashboardView);
