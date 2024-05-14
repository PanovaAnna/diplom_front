import axios from "axios";

const API_URL = process.env.API_URL+'/api/v1/'

export const $api = axios.create({
    baseURL: API_URL
})

