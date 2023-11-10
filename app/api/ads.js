import { API_RENDER_ADS } from "../configs/Paths";
import request from "../utils/request";

export const getAds = async () => {
    try {
        let url = `${await API_RENDER_ADS()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (response._id) return response
    } catch (err) { }
    return {}
}

export const add = async () => {
    try {
        let url = `${await API_RENDER_ADS()}`;
        const body = { method: 'POST' };
        const response = await request(url, body);
        if (response._id) return response
    } catch (err) { }
    return {}
}

export const remove = async (id) => {
    try {
        let url = `${await API_RENDER_ADS()}/${id}`;
        const body = { method: 'DELETE' };
        const response = await request(url, body);
        if (response._id) return response
    } catch (err) { }
    return {}
}