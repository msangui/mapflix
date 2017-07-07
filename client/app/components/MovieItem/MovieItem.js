import React, {PropTypes, Component} from 'react';
import {GridTile} from 'material-ui/GridList';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import classNames from 'classnames';
import {grey400, grey200, grey600, grey800, amber700, grey50, yellow500, white} from 'material-ui/styles/colors';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import {List, ListItem} from 'material-ui/List';
import Toggle from 'material-ui/Toggle';
import {Link} from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MovieAwards from '../MovieAwards/MovieAwards';
import MovieAwardIcon from '../MovieAwardIcon/MovieAwardIcon';
import Chip from 'material-ui/Chip';
import {convertHex, displayTime} from '../../utils/utils';
import LazyImage from '../LazyImage/LazyImage';

class MovieItem extends Component {
  static propTypes = {
    _id: PropTypes.string,
    awards: PropTypes.array,
    cellHeight: PropTypes.number,
    cols: PropTypes.number,
    countries: PropTypes.array,
    image: PropTypes.string,
    name: PropTypes.string,
    genres: PropTypes.array,
    languages: PropTypes.array,
    rating: PropTypes.object,
    releaseDate: PropTypes.string,
    rows: PropTypes.number,
    selectTile: PropTypes.func,
    stars: PropTypes.array
  };

  static styles = {
    movieBack: {
      backgroundColor: grey400
    },
    listItem: {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10
    },
    imdbBadge: {
      top: 0,
      right: 5
    },
    thumbOff: {
      backgroundColor: grey600,
    },
    trackOff: {
      backgroundColor: grey200,
    },
    thumbSwitched: {
      backgroundColor: grey600,
    },
    trackSwitched: {
      backgroundColor: grey200,
    },
    labelStyle: {
      color: 'red'
    },
    awardBadge: {
      borderRadius: 10,
      position: 'absolute',
      top: 5,
      left: 3
    },
    awardBadgeLabel: {
      lineHeight: '12px'
    },
    ratingBadge: {
      position: 'absolute',
      bottom: 5,
      right: 3,
      zIndex: 10,
      color: white
    }
  };

  constructor() {
    super();
    this.state = {
      more: false,
      open: false
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  toggle() {
    this.setState({
      open: !this.state.open
    })
  }

  toggleMore(event) {
    event.stopPropagation();
    this.setState({
      more: !this.state.more
    });
  }

  clickLink(event) {
    event.stopPropagation();
  }

  render() {
    const {_id, genres, stars, rating, name, image, cols = 1, rows = 1, releaseDate, runtime, cast = [], languages, awards = []} = this.props;
    const {more, open} = this.state;

    const releaseDateObject = new Date(releaseDate || Date.now());
    const releaseDateString = releaseDateObject.toISOString().split('T')[0];

    const directors = cast
      .filter(person => person.role === 'director');

    const ratingBadge = (
      <div className="movie__rating" style={MovieItem.styles.ratingBadge}>
        <StarIcon color={yellow500}/>
        <span>{rating.value}</span>
      </div>
    );

    const awardBadgeIcons = uniqBy(awards, 'eventType')
      .map((award, index) => (
        <MovieAwardIcon
          key={`movie-award-icon-${_id}-${index}`}
          size={30}
          eventType={award.eventType}
          color={find(awards, {
            eventType: award.eventType, winner: true
          }) ? amber700 : grey800} />
      ))

    const awardBadge = (
      <Chip style={MovieItem.styles.awardBadge}
            backgroundColor={convertHex(grey50, 40)}
            labelStyle={MovieItem.styles.awardBadgeLabel}>
        {awardBadgeIcons}
      </Chip>);

    const details = !more ? (
      <List>
        <ListItem
          innerDivStyle={MovieItem.styles.listItem}
          primaryText="Genres"
          secondaryText={
            <span>
              {genres.map(genre => (
                <Link to={`/?refresh=true&genres=${genre}`} key={`genre-${genre}`}>{genre}&nbsp;</Link>
              ))}
            </span>
          }
          secondaryTextLines={2}
          disabled={true}
        />
        <ListItem
          innerDivStyle={MovieItem.styles.listItem}
          primaryText="Stars"
          secondaryText={
            stars.map(star => (
              <span key={`star-${star.id}`}>
                <Link to={`/?refresh=true&cast=${star.id}`}>{star.name}</Link>&nbsp;
              </span>
            ))
          }
          secondaryTextLines={2}
          disabled={true}
        />
        <ListItem
          innerDivStyle={MovieItem.styles.listItem}
          primaryText="Directed by"
          secondaryText={
            directors.map(director => (
              <span key={`director-${director.id}`}>
                <Link to={`/?refresh=true&cast=${director.id}`}>{director.name}</Link>
              </span>
            ))
          }
          secondaryTextLines={1}
          disabled={true}
        />
        <ListItem
          innerDivStyle={MovieItem.styles.listItem}
          primaryText="Release date"
          secondaryText={(
            <span key={`release-date-${releaseDateObject.getFullYear()}`}>
                <Link to={`/?refresh=true&releaseYear=${releaseDateObject.getFullYear()}`}>{releaseDateString}</Link>
              </span>
          )}
          secondaryTextLines={1}
          disabled={true}
        />
        <ListItem hoverColor="none" rightAvatar={(
          <Link to={`https://www.imdb.com/title/${_id}`} target="_blank" style={MovieItem.styles.imdbBadge} onClick={this.clickLink}>
            <img src="/assets/imdb.png" />
          </Link>
        )}>
        </ListItem>
      </List>
    ) : (
      <List>
        <ListItem
          innerDivStyle={MovieItem.styles.listItem}
          primaryText="Runtime"
          secondaryText={displayTime(runtime)}
          secondaryTextLines={1}
          disabled={true}
        />
        <ListItem
          innerDivStyle={MovieItem.styles.listItem}
          primaryText="Languages"
          secondaryText={languages.join(', ')}
          secondaryTextLines={1}
          disabled={true}
        />
        <MovieAwards awards={awards} name={name}/>
      </List>
    );

    const detailsToggle = (
      <Toggle
        className="movie__toggle"
        toggled={more}
        onClick={this.toggleMore.bind(this)}
        thumbStyle={MovieItem.styles.thumbOff}
        trackStyle={MovieItem.styles.trackOff}
        thumbSwitchedStyle={MovieItem.styles.thumbSwitched}
        trackSwitchedStyle={MovieItem.styles.trackSwitched}
        labelStyle={MovieItem.styles.labelStyle}
      />
    );

    const movieDetails = open ? (
      <span>
        {detailsToggle}
        {details}
      </span>
    ) : null;

    return (
      <div className="movie col-xs-6 col-md-2 col-lg-1 col-lg-1-5" onClick={this.toggle.bind(this)}>
        <div className={classNames('movie--flipper', {'movie--active': open})} title={name}>
          <div className="movie__front">
            {awardBadge}
            {ratingBadge}
            <LazyImage src={image}/>
          </div>
          <div className="movie__back" style={MovieItem.styles.movieBack}>
            {movieDetails}
          </div>
        </div>
      </div>
    );
  }
}

export default MovieItem;
