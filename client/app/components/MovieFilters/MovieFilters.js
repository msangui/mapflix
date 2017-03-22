import React, {PropTypes, Component} from 'react';
import SelectField from 'material-ui/SelectField';
import Slider from 'material-ui/Slider';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MovieFiltersCast from './MovieFilterCast/MovieFiltersCast';
import MovieFilterAwards from './MovieFilterAwards/MovieFilterAwards';
import MovieFilter from './MovieFilter/MovieFilter';
import _ from 'lodash';
import moment from 'moment';

class MovieFilters extends Component {
  static propTypes = {
    filters: PropTypes.object,
    loadingNames: PropTypes.bool,
    onApplyFilters: PropTypes.func,
    onInitPeople: PropTypes.func,
    onPeopleSearch: PropTypes.func,
    options: PropTypes.object,
    people: PropTypes.array,
    peopleNames: PropTypes.array
  };

  constructor(props) {
    super();
    this.state = {
      filters: Object.assign({
        rating: 6,
        runtime: 90,
        genres: [],
        languages: [],
        countries: [],
        cast: [],
        awards: []
      }, {
        ...props.filters,
        awards: (props.filters.awards || []).filter(award => award.split(',').length < 3)
      })
    };
  }

  // cast filters
  addCast(person) {
    const {filters} = this.state;
    this.setState({
      filters: {
        ...filters,
        cast: (filters.cast || []).concat([person])
      }
    });
  }

  removeCast(filter, person) {
    const {filters} = this.state;
    this.setState({
      filters: {
        ...filters,
        [filter]: _.without(filters.cast, person._id)
      }
    });
  }

  // awards filters
  addAward(eventType) {
    const {filters} = this.state;
    this.setState({
      filters: {
        ...filters,
        awards: (filters.awards || []).concat([eventType])
      }
    });
  }

  removeAward(eventType) {
    const {filters} = this.state;
    this.setState({
      filters: {
        ...filters,
        awards: (filters.awards || []).filter(award => !(new RegExp(eventType).test(award)))
      }
    });
  }

  toggleAward(eventType) {
    const {filters} = this.state;
    this.setState({
      filters: {
        ...filters,
        awards: (filters.awards || []).map(award => {
          const [awardEventType, winner] = award.split(',');
          if (awardEventType !== eventType) {
            return award;
          }
          return winner === 'winner' ? awardEventType : `${awardEventType},winner`;
        })
      }
    });
  }

  addFilter(filter, event, index, value) {
    const {filters} = this.state;
    this.setState({
      filters: {
        ...filters,
        [filter]: value
      }
    });
  }

  removeFilter(filter) {
    const {filters} = this.state;
    this.setState({filters: _.omit(filters, filter)});
  }

  removeFilterValue(filter, value) {
    const {filters} = this.state;
    if (!value) {
      this.removeFilter(filter);
      return;
    }
    this.setState({
      filters: {
        ...filters,
        [filter]: _.without(filters[filter], value)
      }
    });
  }

  isFilterSelected(filter) {
    const {filters} = this.state;
    const checkedFilter = filters[filter];

    return _.isArray(checkedFilter) ? !!checkedFilter.length : !!checkedFilter;
  }

  applyFilters() {
    const {onApplyFilters} = this.props;
    const {filters} = this.state;
    onApplyFilters(filters);
  }

  render() {
    const {options = {}, people, onPeopleSearch, peopleNames, loadingNames} = this.props;
    const {filters} = this.state;


    // filters
    const genres = (options.genres || []).map((genre, index) => (
      <MenuItem value={genre} primaryText={genre} key={`genre-${index}`}/>
    ));

    const languages = (options.languages || []).map((language, index) => (
      <MenuItem value={language} primaryText={language} key={`language-${index}`}/>
    ));

    const countries = (options.countries || []).map((country, index) => (
      <MenuItem value={country} primaryText={country} key={`country-${index}`}/>
    ));

    const years = _.range(moment().format('YYYY'), 1900).map(year => (
      <MenuItem value={year} primaryText={year} key={`year-${year}`}/>
    ));

    // map out people names for chips
    const selectedPeople = (filters.cast || [])
      .map(personId => Object.assign({}, _.find(peopleNames, {_id: personId}), {
        toString() {
          return this.name;
        }
      }));

    const filterOptions =  {
      ratingSlider: {
        min: 1,
        max: 9,
        step: 1
      },
      runtimeSlider: {
        min: 0,
        max: 300,
        step: 25
      },
      selectField: {
        fullWidth: true
      }
    };

    if (loadingNames) {
      return null;
    }

    return (
      <div className="movie-filters">
        <MovieFilter
          className="movie-filter--slider"
          filterType="rating"
          selected={this.isFilterSelected.bind(this)('rating')}
          onRemove={this.removeFilter.bind(this)}>
          <label>Rating - {filters.rating}</label>
          <Slider
            {...filterOptions.ratingSlider}
            value={_.toNumber(filters.rating)}
            onChange={this.addFilter.bind(this, 'rating', null)}
          />
        </MovieFilter>
        <MovieFilter
          className="movie-filter--slider"
          filterType="runtime"
          selected={this.isFilterSelected.bind(this)('runtime')}
          onRemove={this.removeFilter.bind(this)}>
          <label>Runtime - {filters.runtime}</label>
          <Slider
            {...filterOptions.runtimeSlider}
            value={_.toNumber(filters.runtime)}
            onChange={this.addFilter.bind(this, 'runtime', null)}
          />
        </MovieFilter>
        <MovieFilter filterType="releaseYear"
                     selected={this.isFilterSelected.bind(this)('releaseYear')}
                     onRemove={this.removeFilter.bind(this)}>
          <SelectField
            {...filterOptions.selectField}
            floatingLabelText="Release Year"
            value={_.toNumber(filters.releaseYear)}
            maxHeight={200}
            onChange={this.addFilter.bind(this, 'releaseYear')}>
            {years}
          </SelectField>
        </MovieFilter>
        <MovieFilter filterType="genres"
                     selected={this.isFilterSelected.bind(this)('genres')}
                     values={filters.genres}
                     onRemove={this.removeFilterValue.bind(this)}>
          <SelectField
            {...filterOptions.selectField}
            floatingLabelText="Genres"
            multiple={true}
            value={filters.genres}
            onChange={this.addFilter.bind(this, 'genres')}>
            {genres}
          </SelectField>
        </MovieFilter>
        <MovieFilter filterType="languages"
                     selected={this.isFilterSelected.bind(this)('languages')}
                     values={filters.languages}
                     onRemove={this.removeFilterValue.bind(this)}>
          <SelectField
            {...filterOptions.selectField}
            floatingLabelText="Languages"
            multiple={true}
            value={filters.languages}
            onChange={this.addFilter.bind(this, 'languages')}>
            {languages}
          </SelectField>
        </MovieFilter>
        <MovieFilter filterType="countries"
                     selected={this.isFilterSelected.bind(this)('countries')}
                     values={filters.countries}
                     onRemove={this.removeFilterValue.bind(this)}>
          <SelectField
            {...filterOptions.selectField}
            floatingLabelText="Countries"
            multiple={true}
            value={filters.countries}
            onChange={this.addFilter.bind(this, 'countries')}>
            {countries}
          </SelectField>
        </MovieFilter>
        <MovieFilter filterType="cast"
                     selected={this.isFilterSelected.bind(this)('cast')}
                     values={selectedPeople}
                     onRemove={this.removeCast.bind(this)}>
          <MovieFiltersCast onSearch={onPeopleSearch}
                            people={people}
                            onSelect={this.addCast.bind(this)}/>
        </MovieFilter>
        <MovieFilterAwards selectedAwards={filters.awards}
                           removeAward={this.removeAward.bind(this)}
                           selectAward={this.addAward.bind(this)}
                           toggleAward={this.toggleAward.bind(this)}/>
        <div style={{marginTop: 15, marginBottom: 15, paddingRight: '1rem'}}>
          <RaisedButton label="Apply" primary={true} fullWidth={true}
                        onClick={this.applyFilters.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default MovieFilters;
