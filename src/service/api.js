

import axios from "axios";

const API = {}
const BASE_URL = 'http://localhost:8000';

const SERVICE_URL = {
    login: {
        url: '/login',
        method: 'POST',
    },
    signup: {
        url: '/signup',
        method: 'POST',
    },
    getKeyword: {
        url: '/get-keyword',
        method: 'POST'
    },
    addKeyword: {
        url: '/add-keyword',
        method: 'POST'
    },
    uploadImage: {
        url: '/upload-image',
        method: 'POST'
    }
}


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    }
})

for (const [key, value] of Object.entries(SERVICE_URL)) {

    API[key] = (body) => {

        return axiosInstance({
            method: value.method,
            url: value.url,
            data: value.method === 'POST' ? body : {},
        })


    }

}

export default API;