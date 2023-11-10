import { API_DELETE_MESSAGE, API_MESSAGE_UPDATEEMOTION } from "../configs/Paths";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";

export const updateIcon = async (id, data) => {
    try {
        let url = `${await API_MESSAGE_UPDATEEMOTION()}/${id}`;
        const body = {
            method: REQUEST_METHOD.PUT,
            body: JSON.stringify(data),
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
}


export const deleteMesseger = async (id) => {
    try {
        let url = `${await API_DELETE_MESSAGE()}/${id}`;
        const body = {
            method: REQUEST_METHOD.DELETE,
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
}
