import axios, { Method, AxiosRequestConfig } from "axios";

const request = async (
    method: Method | string,
    url: string,
    payload: any
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

export default request;
