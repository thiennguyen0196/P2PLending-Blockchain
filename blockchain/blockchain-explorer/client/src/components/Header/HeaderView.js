/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import 'react-select/dist/react-select.css';

import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Select from 'react-select';
import {
  Nav, Navbar, NavbarBrand
} from 'reactstrap';
import AdminPanel from '../Panels/Admin';
import Logo from '../../static/images/Explorer_Logo.svg';
import FontAwesome from 'react-fontawesome';
import Drawer from 'material-ui/Drawer';
import NotificationPanel from '../Panels/Notifications';
import Websocket from 'react-websocket';
// import { Badge } from 'reactstrap';
import Badge from 'material-ui/Badge';
import { getNotification as getNotificationCreator } from '../../store/actions/notification/action-creators';
import { changeChannel as changeChannelCreator } from '../../store/actions/channel/action-creators';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});
class HeaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      notifyDrawer: false,
      adminDrawer: false,
      channels: [],
      notifyCount: 0,
      notifications: [],
      modalOpen: false
    }
    this.toggle = this.toggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleDrawOpen = this.handleDrawOpen.bind(this);
    this.handleDrawClose = this.handleDrawClose.bind(this);

  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleData(notification) {
    this.props.getNotification(notification);
    var notifyArr = this.state.notifications;
    notifyArr.unshift(JSON.parse(notification));
    this.setState({ notifications: notifyArr });
    this.setState({ notifyCount: this.state.notifyCount + 1 });
  }
  componentDidMount() {
    // this.props.actions.loadTrades();
    var arr = [];
    this.props.channelList.channels.forEach(element => {
      arr.push({
        value: element,
        label: element
      })
    });

    this.setState({ channels: arr });

    this.setState({ selectedOption: this.props.channel.currentChannel })

  }
  componentWillReceiveProps(nextProps) {
    // this.setState({loading:false});
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption: selectedOption.value });
    this.props.changeChannel(selectedOption.value);
  }

  handleOpen() {




    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }
  handleDrawOpen(drawer) {
    switch (drawer) {
      case "notifyDrawer":
        this.setState({ notifyDrawer: true });
        this.setState({ notifyCount: 0 });

        break;
      case "adminDrawer":
        this.setState({ adminDrawer: true });

        break;

      default:
        break;
    }
  }
  handleDrawClose(drawer) {
    switch (drawer) {
      case "notifyDrawer":
        this.setState({ notifyDrawer: false });

        break;
      case "adminDrawer":
        this.setState({ adminDrawer: false });

        break;

      default:
        break;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Navbar color="faded" light expand="md">
          <NavbarBrand> 
            <img src={Logo} className="logo" alt="Hyperledger Logo" />
          </NavbarBrand>
        </Navbar>
      </div>
    );
  }

}
function mapStateToProps(state, ownProps) {
  return {
    channelList: state.channelList.channelList,
    channel: state.channel.channel,
    notification: state.notification.notification
  }
}
const mapDispatchToProps = (dispatch) => ({
  getNotification: (notification) => dispatch(getNotificationCreator(notification)),
  changeChannel: (curChannel) => dispatch(changeChannelCreator(curChannel))
});
export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToProps))(HeaderView);
