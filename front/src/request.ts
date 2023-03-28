import axios, { Method, AxiosRequestConfig } from 'axios';

export const request = async (
  method: Method | string,
  url: string,
  payload: any,
) => {
  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    data: payload,
  };
  return axios
    .request(requestConfig)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};

//Production mode
const localPrefixUrl = window.location.pathname;
//Uncomment to work and test front and put the port of the back in local
// const localPrefixUrl = "http://localhost:8080/";

export const localApiPost = async (
  path: string,
  data?: object,
  headers?: AxiosRequestConfig,
) => {
  apiPost(localPrefixUrl + path, data, headers);
};

export const apiPost = async (
  url: string,
  data?: object,
  headers?: AxiosRequestConfig,
) => {
  return axios
    .post(url, data, headers)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const localApiGet = async (
  path: string,
  options?: AxiosRequestConfig,
  // Change to personal port
) => apiGet(`${localPrefixUrl}${path}`,options);

export const apiGet = async (url: string, options?: AxiosRequestConfig) => {
  return axios
    .get(url, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};
