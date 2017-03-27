import qs from 'qs';
import isArray from 'lodash/isArray';
import toNumber from 'lodash/toNumber';
import round from 'lodash/round';

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
      const filterValue = filtersMultiple.indexOf(filterKey) > -1 && !isArray(queryParams[filterKey]) ? [queryParams[filterKey]] : queryParams[filterKey];
      return filters[filterKey] = filterValue;
    });

  return filters;
};

export const convertHex = (hex, opacity) => {
  const cleanHex = hex.replace('#','');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity/100})`;
};

export const displayTime = (timeInMinutes) => {
  const time = ((timeInMinutes / 60) + '').split('.');
  let minutes = '';
  let hours = '0';

  if (time[0] !== '0') {
    hours = `${time[0]}h `;
  }
  if (time.length > 1) {
    minutes = `${round(toNumber('0.' + time[1])*60)}m`;
  }

  return `${hours}${minutes}`;
}
