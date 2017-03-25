import React, {Component, PropTypes} from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {grey600, red300} from 'material-ui/styles/colors';
import {convertHex} from '../../utils/utils';

class Loader extends Component {

  static propTypes = {
    loading: PropTypes.bool
  };

  static styles = {
    root: {
      position: 'fixed',
      width: '100%',
      height: 'calc(100% - 64px)',
      top: 64,
      left: 0,
      backgroundColor: convertHex(grey600, 70),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10
    },
    refreshIndicator: {
      position: 'relative'
    }
  };

  render() {
    const {loading} = this.props;
    return (
      <div className="loader" style={Loader.styles.root}>
        <RefreshIndicator
          size={50}
          top={0}
          left={0}
          loadingColor={red300}
          style={Loader.styles.refreshIndicator}
          status={loading ? 'loading' : 'hide'}
        />
      </div>
    );
  }
}

export default Loader;

