import { API_CHECK_IN_FAIL, API_FACE_CHECK_IN, API_VERIFY_TIMEKEEPING, API_TIMEKEEPING_PAYCHECK, API_TIMEKEEPING_CONFIRM } from "../configs/Paths";
import { serialize } from "../utils/common";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";

export const getPayCheckById = async (id) => {
    try {
        const url = `${await API_TIMEKEEPING_PAYCHECK()}?hrmWageId=${id}`;
        const body = { method: REQUEST_METHOD.GET };
        const response = await request(url, body);
        if (response.status) return response.data
    } catch (err) { }
}

export const onFaceCheckIn = async (data) => {
    try {
        const url = `${await API_FACE_CHECK_IN()}`;

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(data),
        };

        const response = await request(url, body);
        return response
    } catch (err) { }
    return {}
}

export const saveCheckInFail = async (data) => {
    try {
        const url = `${await API_CHECK_IN_FAIL()}`;

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(data),
        };

        const response = await request(url, body);
        return response
    } catch (err) { }
    return {}
}

export const verifyTimekeeping = async (data) => {
    try {
        const url = `${await API_VERIFY_TIMEKEEPING()}`;

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(data),
        };

        const response = await request(url, body);
        return response
    } catch (err) { }
    return {}
}

export const confirmSalary = async (data) => {
    try {
        const url = `${await API_TIMEKEEPING_CONFIRM()}`;

        const body = {
            method: 'POST',
            body: JSON.stringify(data),
        };

        const response = await request(url, body);
        return response
    } catch (err) {
        console.log(' err', err)
    }
    return null
}