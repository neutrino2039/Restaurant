import axios from 'axios';
import {retrieveAccessToken} from '../utilities/device';
import {stringify} from 'qs';

const serverUrl = 'http://10.0.2.2:5000';

const getAuthorizationToken = () => {
  return retrieveAccessToken();
};

const createHeaders = (method) => {
  return {
    Accept: 'application/json',
    'Content-Type': method === 'get' ? 'application/text' : 'application/json',
  };
};

const createOptions = (method, url, headers, data) => {
  let result = {
    method,
    baseURL: `${serverUrl}/api/`,
    url,
    headers,
  };
  if (method !== 'get') return {...result, data};
  if (method === 'get' && data)
    return {...result, url: `${url}?${stringify(data)}`};
  return result;
};

const callApiWithHeaders = async (headers, method, url, data) => {
  const options = createOptions(method, url, headers, data);
  return await axios(options);
};

const callApiWithoutToken = async (method, url, data) => {
  const headers = createHeaders(method);
  return await callApiWithHeaders(headers, method, url, data);
};

const callApi = async (method, url, data) => {
  const headers = {
    ...createHeaders(method),
    Authorization: `Bearer ${await getAuthorizationToken()}`,
  };
  return await callApiWithHeaders(headers, method, url, data);
};

export const get = async (url, data) => {
  return await callApi('get', url, data);
};

export const postWithoutToken = async (url, data) => {
  return await callApiWithoutToken('post', url, data);
};

export const post = async (url, data) => {
  return await callApi('post', url, data);
};

export const thunkHandler = async (asyncFunction, thunkAPI) => {
  try {
    const response = await asyncFunction;
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.errors || error?.message || 'Unexpected Error.',
    );
  }
};

export const serverImage = (imageName) => {
  return `${serverUrl}/Images/${imageName}`;
};
