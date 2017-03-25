import React, {PropTypes, Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MovieIcon from 'material-ui/svg-icons/av/movie';
import FilterIcon from 'material-ui/svg-icons/device/dvr';
import {red700} from 'material-ui/styles/colors';


class Header extends Component {
  static propTypes = {
    onLeftIconButtonTouchTap: PropTypes.func,
    onRightIconButtonTouchTap: PropTypes.func
  }

  onLeftIconButtonTouchTap() {
    const {onLeftIconButtonTouchTap} = this.props;

    if (onLeftIconButtonTouchTap) {
      onLeftIconButtonTouchTap();
    }
  }

  onRightIconButtonTouchTap() {
    const {onRightIconButtonTouchTap} = this.props;

    if (onRightIconButtonTouchTap) {
      onRightIconButtonTouchTap();
    }
  }

  render() {
    return (
      <AppBar title="MapFlix"
              style={{backgroundColor: red700, position: 'fixed'}}
              onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap.bind(this)}
              onRightIconButtonTouchTap={this.onRightIconButtonTouchTap.bind(this)}
              iconElementRight={<IconButton><FilterIcon /></IconButton>}
              iconElementLeft={<IconButton><MovieIcon /></IconButton>} />
    );
  }
}

export default Header;
