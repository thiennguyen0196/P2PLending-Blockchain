/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Typography from 'material-ui/Typography';
import {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import moment from 'moment-timezone';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 42,
    position: 'relative',
  },
  card: {
    height: 250,
    width: 1215,
    margin: 20,
    textAlign: 'left',
    display: 'inline-block',
  },
  title: {
    fontSize: 16,
    color: theme.palette.text.secondary,
    position: 'absolute',
    left: 40,
    top: 60
  },
  content: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    position: 'absolute',
    left: 40,
    top: 70
  }
});

class TransactionView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: false });
  }

  render() {
    const { classes } = this.props;
    if (this.props.transaction.read_set === undefined) {
      return (
        <div>
          <DialogTitle>Transaction Detail</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p className="loading-wheel"> <FontAwesome name="circle-o-notch" size="3x" spin /></p>
            </DialogContentText>
          </DialogContent>
        </div>
      );
    } else {
      const date = new Date(this.props.transaction.createdt);
      const dateString = moment(date).tz(moment.tz.guess()).format("DD-MM-YYYY hh:mm:ss A");


      return (
        <div>
          <DialogTitle>Transaction Detail</DialogTitle>
          <DialogContent>
            <div style={styles2.txContainerStyle}>
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
                          <td><span style={styles2.valueStyle}>
                              {this.props.transaction.blockid} 
                          </span></td>
                      </tr>
                  {/*Network*/}
                      <tr>
                          <td>Network</td>
                          <td><span style={styles2.valueStyle}>
                              {this.props.transaction.chaincodename} 
                          </span></td>
                      </tr>
                  {/*Timestamp*/}
                      <tr>
                      <td>Timestamp</td>
                          <td><span style={styles2.valueStyle}>
                              {dateString} 
                          </span></td>
                      </tr>
                  {/*Tx Id*/}
                      <tr>
                          <td>Transaction id</td>
                          <td><span style={styles2.valueStyle}>
                              {this.props.transaction.txhash.slice(0, 16) + " - " 
                              + this.props.transaction.txhash.slice(16, 32) + " - "
                              + this.props.transaction.txhash.slice(32, 48) + " - "
                              + this.props.transaction.txhash.slice(32, 48)} 
                          </span></td>
                      </tr>
                  {/*Tx type*/}
                      <tr>
                          <td>Transaction type</td>
                          <td><span style={styles2.valueStyle}>
                              {this.props.transaction.fcType} 
                          </span></td>
                      </tr>
                  {/*Tx status*/}
                      <tr>
                          <td>Transaction status</td>
                          <td><span style={styles2.valueStyle}>
                              Success 
                          </span></td>
                      </tr>
                  {/*Tx Read set*/}
                      <tr>
                          <td>Tx Data Read set</td>
                          <td><span style={styles2.valueStyle}>
                              {JSON.stringify(this.props.transaction.read_set).replace(/(.{20})/g, '$1 ').trim()}
                          </span></td>
                      </tr>
                  {/*Tx Write set*/}
                      <tr>
                          <td>Tx Data Write set</td>
                          <td><span style={styles2.valueStyle}>
                              {JSON.stringify(this.props.transaction.write_set).replace(/(.{20})/g, '$1 ').trim()}
                          </span></td>
                      </tr>
                  </tbody>
              </table>
          </div>
          </DialogContent>
        </div>
      );
    }
  }
}
const styles2 = {
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
}

TransactionView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionView);
