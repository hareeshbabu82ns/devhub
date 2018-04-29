const axios = require('axios');
const constants = require('./constants');

export const axiosAPI = axios.create({
  baseURL: constants.API_URL,
  timeout: 3000
});

axiosAPI.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

export const axiosGQL = axios.create({
  baseURL: constants.GRAPHQL_URL,
  timeout: 3000
});

axiosGQL.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
