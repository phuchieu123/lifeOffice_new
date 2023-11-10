import { MEETING_SCHEDULE } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";
import { uploadImage } from "./fileSystem";

export const get = async (id) => {
    try {
        let url = `${await MEETING_SCHEDULE()}/${id}`;
        const newBody = {
            method: 'GET',
        };

        const response = await request(url, newBody);
        if (response._id) return response
    } catch (err) { }
    return {}
}

export const add = async (body) => {
    try {
        let url = await MEETING_SCHEDULE();
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
        // if (response.data) {
        //     return response
        // } else {
        //     return response.message
        // }
    } catch (err) { }
}

export const update = async (id, body) => {
    try {
        let url = `${await MEETING_SCHEDULE()}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        if (response._id) return response
    } catch (err) { }
}