import React, {PropTypes, Component} from 'react';
import {GridTile} from 'material-ui/GridList';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import classNames from 'classnames';
import {grey400, grey200, grey600, grey800, amber700, grey50, yellow500} from 'material-ui/styles/colors';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {List, ListItem} from 'material-ui/List';
import moment from 'moment';
import Toggle from 'material-ui/Toggle';
import {Link} from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MovieAwards from '../MovieAwards/MovieAwards';
import MovieAwardIcon from '../MovieAwardIcon/MovieAwardIcon';
import Chip from 'material-ui/Chip';
import {convertHex} from '../../utils/utils';

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

  render() {
    const {_id, genres, stars, rating, name, image, cols = 1, rows = 1, releaseDate, runtime, cast = [], languages, awards = []} = this.props;
    const {more, open} = this.state;

    const title = !open ? (
      <div className="movie__title">
        <div className="movie__rating">
          <StarIcon color={yellow500}/>
          <span>{rating.value}</span>
        </div>
      </div>
    ) : null;

    const animatedTitle = (
      <ReactCSSTransitionGroup
        transitionName="title"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {title}
      </ReactCSSTransitionGroup>
    );

    const directors = cast
      .filter(person => person.role === 'director');

    const style = {
      back: {
        backgroundColor: grey400
      },
      listItem: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10
      },
      firstListItem: {
        paddingTop: 0
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
        color: 'red',
      },
    };
    const primaryList = !more ? (
      <List>
        <ListItem
          innerDivStyle={style.listItem}
          primaryText="Genres"
          secondaryText={
            genres.map(genre => (
              <span key={`genre-${genre}`}>
                <Link to={`/?refresh=true&genres=${genre}`}>{genre}</Link>&nbsp;
              </span>
            ))
          }
          secondaryTextLines={2}
          disabled={true}
        />
        <ListItem
          innerDivStyle={style.listItem}
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
          innerDivStyle={style.listItem}
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
          innerDivStyle={style.listItem}
          primaryText="Release date"
          secondaryText={(
            <span key={`release-date-${moment(releaseDate).format('YYYY')}`}>
                <Link to={`/?refresh=true&releaseYear=${moment(releaseDate).format('YYYY')}`}>{moment(releaseDate).format('YYYY-MM-DD')}</Link>
              </span>
          )}
          secondaryTextLines={1}
          disabled={true}
        />
      </List>
    ) : null;
    const secondaryList = more ? (
      <List>
        <ListItem
          innerDivStyle={style.listItem}
          primaryText="Runtime"
          secondaryText={runtime}
          secondaryTextLines={1}
          disabled={true}
        />
        <ListItem
          innerDivStyle={style.listItem}
          primaryText="Languages"
          secondaryText={languages.join(', ')}
          secondaryTextLines={1}
          disabled={true}
        />
        <MovieAwards awards={awards} name={name}/>
      </List>
    ) : null;

    const movieDetails = open ? (
      <span>
        <Toggle
          className="movie__toggle"
          toggled={more}
          onClick={this.toggleMore.bind(this)}
          thumbStyle={style.thumbOff}
          trackStyle={style.trackOff}
          thumbSwitchedStyle={style.thumbSwitched}
          trackSwitchedStyle={style.trackSwitched}
          labelStyle={style.labelStyle}
        />
        <ReactCSSTransitionGroup
          transitionName="list"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {primaryList}
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup
          transitionName="list-2"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {secondaryList}
        </ReactCSSTransitionGroup>
      </span>
    ) : null;

    const awardBadge = (<Chip style={{borderRadius: 10, position: 'absolute', top: 5, left: 3}}
                              backgroundColor={convertHex(grey50, 40)}
                              labelStyle={{lineHeight: '12px'}}>
      {
        _.uniqBy(_.uniqBy(awards, 'eventType')
          .map((award, index) => (
            <MovieAwardIcon key={`movie-award-icon-${_id}-${index}`}
                            size={30}
                            eventType={award.eventType}
                            color={_.find(awards, {
                              eventType: award.eventType, winner: true
                            }) ? amber700 : grey800} />
          )))
      }
    </Chip>);

    return (
      <GridTile className="movie"
                cols={cols}
                title={animatedTitle}
                rows={rows}
                titleBackground="none"
                onClick={this.toggle.bind(this)}>

        <div className={classNames('movie--flipper', {'movie--active': open})} title={name}>
          <div className="movie__front">
            {awardBadge}
            <img src={image}/>
          </div>
          <div className="movie__back" style={style.back}>
            {movieDetails}
          </div>
        </div>
      </GridTile>
    );
  }
}

export default MovieItem;
