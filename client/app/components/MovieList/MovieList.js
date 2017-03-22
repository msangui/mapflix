import React, {PropTypes, Component} from 'react';
import MovieItem from '../MovieItem/MovieItem';
import {GridList} from 'material-ui/GridList';
import _ from 'lodash';

class MovieList extends Component {

  static propTypes = {
    movies: PropTypes.array,
    windowWidth: PropTypes.number
  };

  constructor() {
    super();
    this.state = {selectedTileIndex: null}
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
      <MovieItem {...movie} cellHeight={cellHeight} key={movie._id}
                 selected={index === selectedTileIndex}
                 selectTile={this.selectTile.bind(this, index)}/>
    ));
    const cols = _.ceil((windowWidth / 188));

    return (
      <GridList
        className="movies--list"
        cellHeight={cellHeight} cols={cols}>
        {movieList}
      </GridList>
    );
  }
}

export default MovieList;
