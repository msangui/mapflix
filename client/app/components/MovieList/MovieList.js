import React, {PropTypes, Component} from 'react';
import MovieItem from '../MovieItem/MovieItem';
import {GridList} from 'material-ui/GridList';
import round from 'lodash/round';
import once from 'lodash/once';


class MovieList extends Component {

  static propTypes = {
    movies: PropTypes.array,
    windowWidth: PropTypes.number
  };

  constructor() {
    super();
    this.state = {selectedTileIndex: null};
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.movies || []).reduce((prev, curr) => prev + curr._id, '') !== (this.props.movies || []).reduce((prev, curr) => prev + curr._id, '');
  }

  selectTile(tileIndex) {
    this.setState({
      selectedTileIndex: tileIndex === this.state.selectedTileIndex ? null : tileIndex
    });
  }

  render() {
    const {movies, windowWidth} = this.props;
    const {selectedTileIndex} = this.state;
    const cellHeight = 260;

    const movieList = (movies || []).map((movie, index) => (
      <MovieItem {...movie} cellHeight={cellHeight}
                 key={`${movie._id}-${index}`}
                 selected={index === selectedTileIndex}
                 selectTile={this.selectTile.bind(this, index)}/>
    ));

    return (
      <div
        className="movies--list row">
        {movieList}
      </div>
    );
  }
}

export default MovieList;
