import { API_COUNT_BY_KANBAN, API_COUNT_SOURCE, API_TASK, API_TASKS_PROGRESS, API_TASK_PROJECT } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";
import { uploadImage } from "./fileSystem";

export const getById = async (id) => {
    try {
        const url = `${await API_TASK_PROJECT()}/${id}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch { }
    return null
}

export const getTaskById = async (id) => {
    try {
        const url = `${await API_TASK()}/${id}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch { }
    return null
}

export const get = async (query) => {
    try {
        const url = `${await API_TASK()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) {
    }
    return null
}

export const add = async (body, avatar) => {
    try {
        if (avatar) body.avatar = await uploadImage(avatar, 'CV')

        let url = `${await API_TASK()}`;
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

export const update = async (id, body, avatar) => {
    try {
        if (avatar) body.avatar = await uploadImage(avatar);

        let url = `${await API_TASK()}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}


export const getCoutTask = async (query) => {
    try {
        const url = `${await API_COUNT_BY_KANBAN()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
    return null
}


export const updateTask = async (id, body) => {
    try {

        let url = `${await API_TASKS_PROGRESS()}/${id}`;

        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);

        return response
    } catch (err) { }
    return null
}