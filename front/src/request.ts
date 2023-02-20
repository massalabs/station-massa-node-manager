import axios, { Method, AxiosRequestConfig } from "axios";

export const request = async (
    method: Method | string,
    url: string,
    payload: any,
): Promise<any> => {
    const request_config: AxiosRequestConfig = {
        method,
        url,
        data: payload,
    };
    return new Promise((resolve, reject) => {
        axios
            .request(request_config)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const localApiGet = async (
    path: string,
): Promise<any> => apiGet(`${window.location.pathname}${path}`)

export const apiGet = async (
    url: string,
): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
