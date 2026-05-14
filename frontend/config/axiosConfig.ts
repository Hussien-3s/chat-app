import axios from 'axios';

const API = axios.create({
    baseURL: process.env.API_LINK,
});

export default API;
