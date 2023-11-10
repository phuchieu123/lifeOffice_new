import { API_CUSTOMER } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";
import { uploadImage } from "./fileSystem";

export const getById = async (id) => {
    try {
        let url = `${await API_CUSTOMER()}/${id}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (response._id) return response
    } catch (err) { }
    return {}
}

export const update = async (id, body, avatar) => {

    try {
        if (avatar) { body.avatar = await uploadImage(avatar); }
        let url = `${await API_CUSTOMER()}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
    } catch (err) {
    }
    return {}
}

export const add = async (body, avatar) => {
    try {
        if (avatar) body.avatar = await uploadImage(avatar)

        let url = `${await API_CUSTOMER()}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return {}
}