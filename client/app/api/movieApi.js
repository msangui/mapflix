import request from './request';
import * as API from '../constants/Api';

const defaultParams = {sortBy: 'releaseDate', sortDirection: 'desc'};

const get = (params = {}) => {
  return request.get(API.API_URL + API.API_MOVIE_URL, Object.assign({}, defaultParams, params));
};

const options = () => {
  return request.get(API.API_URL + API.API_MOVIE_URL + API.API_MOVIE_OPTIONS_URL);
};

export default {
  get,
  options
};
