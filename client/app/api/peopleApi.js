import request from './request';
import * as API from '../constants/Api';

const get = (partial) => {
  return request.get(API.API_URL + API.API_PEOPLE_URL, {partial});
};
const getNames = (ids) => {
  return request.get(API.API_URL + API.API_PEOPLE_URL + API.API_PEOPLE_NAMES_URL, {ids});
};

export default {
  get,
  getNames
};
