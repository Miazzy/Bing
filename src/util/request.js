import apiList from './apiList';
import axios from 'axios';

const request = (param) => {
  let obj = param;
  if (typeof param === 'string') {
    obj = { api: param };
  }
  const { method = 'get', api, data = {} } = obj;
  data._t = param.cache ? 0 : new Date().getTime();
  let url =  apiList[api];
  if (method === 'get') {
    url += `?${Object.keys(data).map((k) => `${k}=${encodeURI(data[k])}`).join('&')}`
  }
  return axios({
    method,
    url: '' + url,
    data,
  }).then((res) => {
    res.data = res.data || {};
    if (res.data.code === 200 || res.data.result === 100) {
      return res.data;
    } else {
      throw({ data: res.data });
    }
  });
};


export default request;
