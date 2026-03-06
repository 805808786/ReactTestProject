import axios from 'axios';

const request = axios.create({
  baseURL: 'https://test-api.yicall.com',
  timeout: 10000,
});

export default request;
