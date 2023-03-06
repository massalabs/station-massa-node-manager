import axios, { Method, AxiosRequestConfig } from "axios";



export const request = async (
    method: Method | string,
    url: string,
    payload: any
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
    }

//Production mode
const localPrefixUrl = window.location.pathname;
//Uncomment to work and test front and put the port of the back in local
//const localPrefixUrl = "http://localhost:57460/";

export const nodeApiPost = async (path: string, data?:{} , headers?:AxiosRequestConfig) => {
    return apiPost(path,data , headers)
}

export const localApiPost = async (path: string, data?:{} , headers?:AxiosRequestConfig) => {
    apiPost(localPrefixUrl+path,data , headers)
} 

export const apiPost = async (url: string , data?:{} , headers?:AxiosRequestConfig) => {
    return axios
        .post(url,data , headers)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
};
export const localApiGet = async (
    path: string
    // Change to personal port
) => apiGet(`${localPrefixUrl}${path}`);

export const apiGet = async (url: string  , headers?:AxiosRequestConfig) => {
    return axios
        .get(url, headers)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error(error);
        });
};
