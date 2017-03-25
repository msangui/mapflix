import React, {Component, PropTypes} from 'react';
import {grey600, yellow800} from 'material-ui/styles/colors';
import StarFullIcon from 'material-ui/svg-icons/toggle/star';
import StarEmptyIcon from 'material-ui/svg-icons/toggle/star-border';
import IconButton from 'material-ui/IconButton';
import _ from 'lodash';

class MovieFilterStars extends Component {

  static propTypes = {
    selected: PropTypes.number,
    selectRating: PropTypes.func
  };

  static styles = {
    root: {
      padding: '5px 0 25px 0'
    },
    iconButton: {
      padding: 0,
      width: 24,
      height: 24
    }
  };

  onSelect(value) {
    this.props.selectRating(value);
  }

  render() {
    const {selected} = this.props;
    const stars = _.range(1, 10).map((value) => {
      const icon = value <= selected ? (
        <StarFullIcon color={yellow800}/>
      ) : (
        <StarEmptyIcon color={yellow800}/>
      );
      return (
        <IconButton key={`movie-filter-stars-${value}`}
                    onClick={this.onSelect.bind(this, value)}
                    style={MovieFilterStars.styles.iconButton}>
          {icon}
        </IconButton>
      )
    });

    return (
      <div className="movie-filter-stars" style={MovieFilterStars.styles.root}>
        {stars}
      </div>
    );
  }
}

export default MovieFilterStars;

