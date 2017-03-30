import React, {PropTypes, Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MovieIcon from 'material-ui/svg-icons/av/movie';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {red700} from 'material-ui/styles/colors';


class Header extends Component {
  static propTypes = {
    onLeftIconButtonTouchTap: PropTypes.func,
    onRightIconButtonTouchTap: PropTypes.func
  };

  static styles = {
    root: {
      backgroundColor: red700,
      position: 'fixed',
      fontFamily: "'Russo One', sans-serif",
      fontSize: 18
    }
  };

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
      <AppBar title="Mapflix"
              style={Header.styles.root}
              onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap.bind(this)}
              onRightIconButtonTouchTap={this.onRightIconButtonTouchTap.bind(this)}
              iconElementRight={<IconButton><SearchIcon /></IconButton>}
              iconElementLeft={<IconButton style={{fontSize: 24}}><MovieIcon /></IconButton>} />
    );
  }
}

export default Header;
