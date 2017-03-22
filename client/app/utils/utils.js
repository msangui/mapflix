import _ from 'lodash';
import qs from 'qs';

const validFilters = ['rating', 'genres', 'countries', 'languages', 'releaseYear', 'runtime', 'cast', 'awards'];
const filtersMultiple = ['genres', 'countries', 'languages', 'cast', 'awards'];

export const parseQuery = (search) => {
  return qs.parse(search.replace(/\?/, ''));
};

export const parseQueryFilters = (search) => {
  const queryParams = parseQuery(search);
  const filters = {};
  Object.keys(queryParams)
    .filter(filterKey => validFilters.indexOf(filterKey) !== -1)
    .forEach(filterKey => {
      const filterValue = filtersMultiple.indexOf(filterKey) > -1 && !_.isArray(queryParams[filterKey]) ? [queryParams[filterKey]] : queryParams[filterKey];
      return filters[filterKey] = filterValue;
    });

  return filters;
};
