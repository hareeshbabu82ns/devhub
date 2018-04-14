const axios = require('axios');
const constants = require('./constants');

const instance = axios.create({
  baseURL: constants.API_URL,
  timeout: 1000
});

instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;

export default instance;