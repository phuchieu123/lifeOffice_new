import { API_CRM_SOURCE, API_CRM_STATUS, API_MY_VIEW_CONFIG, API_ORIGANIZATION, API_ROLES, API_SOURCE_HRMCONFIG, API_TASK_CONFIG } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";
import { getData } from "../utils/storage";
import { uploadImage } from "./fileSystem";

export const getRoles = async () => {
    try {
        let profile = await getData('profile')
        const { userId } = profile
        let url = `${await API_ROLES()}/${userId}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (response._id) return response
    } catch (err) { }
}

export const getViewConfig = async () => {
    try {
        let url = `${await API_MY_VIEW_CONFIG()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
}


export const getTaskConfigs = async () => {
    try {
        let url = `${await API_TASK_CONFIG()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
}

export const getCrmStatus = async () => {
    try {
        let url = `${await API_CRM_STATUS()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
}

export const getCrmSource = async () => {
    try {
        let url = `${await API_CRM_SOURCE()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
}

export const getHrmSource = async () => {
    try {
        let url = `${await API_SOURCE_HRMCONFIG()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
}

export const getDepartments = async () => {
    try {
        let url = `${await API_ORIGANIZATION()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        if (Array.isArray(response)) return response
    } catch (err) { }
}