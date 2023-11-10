import { API_NOTIFICATION, } from "../configs/Paths";
import { serialize } from "../utils/common";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";
import { storeData } from "../utils/storage";
import { uploadImage } from "./fileSystem";
import { updateProfile as updateProfileApp } from "../utils/deviceEventEmitter";
import { getProfile } from "../utils/authen";

export const getNotifications = async (query) => {
    try {
        const profile = getProfile()
        const newQuery = { ...query }
        newQuery.filter = { ...(newQuery.filter || {}), to: profile._id }
        let url = `${await API_NOTIFICATION()}?${serialize(newQuery)}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (response.data) return response
    } catch (err) { }
}

export const updateNotifications = async (id, data) => {
    try {
        let url = `${await API_NOTIFICATION()}/${id}`;
        const body = {
            method: 'PUT',
            body: JSON.stringify(data),
        };
        const response = await request(url, body);
        if (response._id) return response
    } catch (err) { }
}