import React, {PropTypes, Component} from 'react';
import Oscar from '../../SvgIcons/oscar';
import Bafta from '../../SvgIcons/bafta';
import GoldenGlobe from '../../SvgIcons/GoldenGlobe';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class MovieAwardIcon extends Component {
  static propTypes = {
    color: PropTypes.string,
    eventType: PropTypes.string,
    size: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const {eventType, size, color} = this.props;

    return ((eventType) => {
        switch (eventType) {
          case 'ev0000003':
            return (
              <Oscar color={color}
                     viewBox="-30 -50 200 500"
                     style={{width: (15 * size) / 50, height: size}}
                     preserveAspectRatio="xMinYMin meet"/>
            );
          case 'ev0000292':
            return (
              <GoldenGlobe color={color}
                           viewBox="0 -20 144 360"
                           style={{width: (15 * size) / 50, height: size}}
                           preserveAspectRatio="xMinYMin meet"/>
            );
          case 'ev0000123':
            return (
              <Bafta color={color}
                     viewBox="0 -120 500 500"
                     style={{width: (32 * size) / 50, height: size}}
                     preserveAspectRatio="xMinYMin meet"/>
            );
        }
      }
    )(eventType);
  }
}

export default MovieAwardIcon;


