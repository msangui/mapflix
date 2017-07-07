import React, {PropTypes, Component} from 'react';
import debounce from 'lodash/debounce';
import ReactDOM from 'react-dom';
import {isElementInViewport} from '../../utils/utils';

class LazyImage extends Component {
  static propTypes = {
    onLoad: PropTypes.func,
    src: PropTypes.string
  };

  constructor() {
    super();
    this.state = {
      visible: false
    };
    this.checkVisibility = () => {
      const element = ReactDOM.findDOMNode(this);
      return isElementInViewport(element, window, document);
    };

    this.onScroll = debounce(() => {
      const visible = this.checkVisibility();
      if (visible) {
        window.removeEventListener('scroll', this.onScroll, false);
      }
      this.setState({
        visible
      });
    }, 150);
  }

  componentDidMount() {
    const visible = this.checkVisibility(this);
    if (!visible) {
      window.addEventListener('scroll',  this.onScroll, false);
    }
    this.setState({
      visible
    });
  }

  render() {
    return this.state.visible ? (
      <img src={this.props.src} onLoad={this.props.onLoad}/>
    ) : (
      <div />
    );
  }
}

export default LazyImage;
