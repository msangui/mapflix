import React, {Component, PropTypes} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import Header from '../components/Header/Header';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as WindowActions from '../actions/windowActions';

injectTapEventPlugin();

class App extends Component {
  static propTypes =  {
    children: PropTypes.any,
    onLeftIconButtonTouchTap: PropTypes.func,
    onRightIconButtonTouchTap: PropTypes.func
  };

  constructor() {
    super();
    this.changeSize = _.debounce((window, props) => {
      props.dispatch(WindowActions.changeSize({width: window.innerWidth, height: window.innerHeight}));
    }, 250);
    this.scrolledBottom = _.debounce((window, document, props) => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        props.dispatch(WindowActions.scrolledBottom());
      }
    }, 250);
  }

  componentWillMount() {
    if (window) {
      window.addEventListener('resize', () => {
        this.changeSize(window, this.props);
      });

      window.addEventListener('scroll', () => {
        this.scrolledBottom(window, document, this.props);
      });
    }
  }

  render() {
    return (
      <MuiThemeProvider muitheme={getMuiTheme(darkBaseTheme)}>
        <div className="container">
          <Header onLeftIconButtonTouchTap={this.props.onLeftIconButtonTouchTap} onRightIconButtonTouchTap={this.props.onRightIconButtonTouchTap}/>
          <article className="content">
            {this.props.children}
          </article>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect()(App);

