import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import qs from 'qs';
import App from './App';
import MovieList from '../components/MovieList/MovieList';
import MovieFilters from '../components/MovieFilters/MovieFilters';
import {parseQueryFilters, parseQuery} from '../utils/utils';
import * as MovieActions from '../actions/movieActions';
import * as PeopleActions from '../actions/peopleActions';
import LinearProgress from 'material-ui/LinearProgress';
import Drawer from 'material-ui/Drawer';

class Movies extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    filters: PropTypes.object,
    history: PropTypes.object,
    loadingMovies: PropTypes.bool,
    loadingNames: PropTypes.bool,
    loadingOptions: PropTypes.bool,
    movies: PropTypes.array,
    people: PropTypes.array,
    windowWidth: PropTypes.number
  };

  // react lifecycle

  constructor() {
    super();
    this.state = {
      drawerOpen: false
    }
  }

  componentWillMount() {
    const {dispatch, history} = this.props;
    const {location} = history;
    const filters = parseQueryFilters(location.search);
    dispatch(MovieActions.getOptions());
    dispatch(PeopleActions.getPeopleNames(filters.cast))
  }

  componentWillReceiveProps(nextProps) {
    const {filters, loadingMovies, history, params, loadingMore, hasMore} = nextProps;
    const {location} = history;
    const queryParams = parseQuery(location.search);

    if (!_.isEqual(parseQueryFilters(location.search), filters) && !loadingMovies) {
      this.fetchMovies(Object.assign({}, nextProps, {
        params: {
          ...nextProps.params,
          page: 1
        }
      }));
      if (queryParams.refresh) {
        this.fetchPeopleNames();
      }
    } else if (_.isEqual(parseQueryFilters(location.search), filters) && loadingMore && hasMore) { // increment page and fetch
      this.fetchMovies(Object.assign({}, nextProps, {params: {
          ...params,
          page: params.page + 1
        }}
      ));
    }
  }

  // fetchers
  fetchMovies(props) {
    const {dispatch, history, params} = props;
    const {location} = history;
    const filters = parseQueryFilters(location.search);
    dispatch(MovieActions.getMovies(filters, params));
  }

  fetchPeople(partial) {
    const {dispatch} = this.props;
    dispatch(PeopleActions.getPeople(partial));
  }

  fetchPeopleNames() {
    const {dispatch} = this.props;
    const filters = parseQueryFilters(location.search);
    dispatch(PeopleActions.getPeopleNames(filters.cast))
  }

  // filters
  applyFilters(filters) {
    this.handleDrawerClose();
    this.props.history.push({
      pathname: '/',
      search: `?${qs.stringify(filters, { arrayFormat: 'repeat' , encode: false })}`
    });
  }

  // handlers
  handleDrawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});

  handleDrawerClose = () => this.setState({drawerOpen: false});

  render() {
    const {movies, filters, options, loadingOptions, loadingMore, loadingMovies, people, peopleNames, loadingNames, windowWidth} = this.props;

    const loader = (loadingMovies || loadingMore) ?
      (
        <div className="app-loader">
          <LinearProgress mode="indeterminate" />
        </div>
      ) : null;


    const filtersElement = this.state.drawerOpen && !loadingOptions ?
      (<MovieFilters people={people}
                     onInitPeople={this.fetchPeopleNames.bind(this)}
                     onPeopleSearch={this.fetchPeople.bind(this)}
                     filters={filters} options={options}
                     peopleNames={peopleNames}
                     loadingNames={loadingNames}
                     onApplyFilters={this.applyFilters.bind(this)}/>) : null;

    return (
      <App onRightIconButtonTouchTap={this.handleDrawerToggle.bind(this)}>
        <Drawer
          docked={false}
          width={300}
          openSecondary={true}
          open={this.state.drawerOpen}
          onRequestChange={(drawerOpen) => this.setState({drawerOpen})}>
          {filtersElement}
        </Drawer>
        {loader}
        <MovieList
          windowWidth={windowWidth}
          movies={movies}/>
      </App>
    );
  }
}
export default connect(state => ({
  movies: state.movies.list,
  people: state.people.list,
  peopleNames: state.people.names,
  filters: state.movies.filters,
  loadingMovies: state.movies.loadingMovies,
  loadingMore: state.movies.loadingMore,
  loadingOptions: state.movies.loadingOptions,
  loadingNames: state.people.loadingNames,
  options: state.movies.options,
  params: state.movies.params,
  windowWidth: state.window.width,
  hasMore: state.movies.hasMore
}))(Movies);
