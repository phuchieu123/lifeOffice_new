import { INCOMING_DOCUMENT, API_DOCUMENTARY } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";

export const getIncomingDocument = async (query) => {
    try {
        let url = `${await INCOMING_DOCUMENT()}?${serialize(query)}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (response.data) return response
    } catch { }
    return {}
}

export const add = async (body) => {
    try {
        let url = `${await API_DOCUMENTARY()}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };
        const response = await request(url, newBody);
        console.log(url, body, response);
        return response
    } catch (err) { }
    return null
}

export const update = async (id, body) => {
    try {
        let url = `${await API_DOCUMENTARY()}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}