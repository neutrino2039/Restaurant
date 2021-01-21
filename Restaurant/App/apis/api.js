import axios from 'axios';
import {retrieveAccessToken} from '../utilities/device';

// import {stringify} from 'qs';

const getAuthorizationToken = () => {
  return retrieveAccessToken();
};

const createUnsecureHeaders = () => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

const createSecureHeaders = async () => {
  return {
    ...createUnsecureHeaders(),
    Authorization: `Bearer ${await getAuthorizationToken()}`,
  };
};

const createOptions = (method, url, headers, data) => {
  let result = {
    method,
    baseURL: 'http://10.0.2.2:5000/api/',
    url,
    headers,
  };
  return {...result, data};
};

const callApiWithHeaders = async (headers, method, url, data) => {
  const options = createOptions(method, url, headers, data);
  return await axios(options);
};

const callApiWithoutAuthorization = async (method, url, data) => {
  const headers = createUnsecureHeaders();
  return await callApiWithHeaders(headers, method, url, data);
};

const callApi = async (method, url, data) => {
  const headers = await createSecureHeaders();
  return await callApiWithHeaders(headers, method, url, data);
};

export const get = async (url, data) => {
  return await callApi('get', url, data);
};

export const postWithoutAuthorization = async (url, data) => {
  return await callApiWithoutAuthorization('post', url, data);
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
