import { API_APPROVE, API_COUNT_APPROVE, APP_URL, CLIENT_ID } from "../configs/Paths";
import { serialize } from "../utils/common";
import { REQUEST_METHOD } from "../utils/constants";
import request, { requestApprove } from "../utils/request";
import { getUserByIds } from "./employees";
import qs from 'qs';

export const getById = async (id) => {
    try {
        let url = `${await API_APPROVE()}/${id}`;
        const body = { method: 'GET' };
        let approve = await requestApprove(url, body);
        console.log(approve, "approve", url);
        let users = approve.groupInfo.map((employee) => employee.person)
        users = await getUserByIds(users)

        approve.groupInfo = approve.groupInfo.map((employee, index) => {
            const found = users.find(e => e.userId === employee.person) || {}

            return {
                ...employee,
                name: found.name,
                avatar: found.avatar,
                gender: found.gender,
                order: Number.isInteger(employee.order) ? employee.order : index
            }
        });

        return approve
    } catch (err) { }
    return {}
}

export const getDataApprove = async (params) => {
    try {
        let url = await API_APPROVE();
        if (params) url = `${url}?${serialize(params)}`
        const body = { method: 'GET' };
        const res = await requestApprove(`${url}`, body);
        return res;
    } catch (error) { }
};

export const update = async (id, data) => {
    try {
        const approUrl = await API_APPROVE();
        const formData = new FormData();
        const clientId = await CLIENT_ID()
        formData.append('approveCommand', data.approveCommand);
        formData.append('clientId', data.clientId);
        formData.append('reason', data.reason);
        const response = await requestApprove(`${approUrl}/${id}`, {
            method: REQUEST_METHOD.PATCH,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify(data),
        });
        console.log(approUrl, clientId, id);
        return response
    } catch (error) {
        console.log(error);
    }
};





export const getCoutApprove = async () => {
    try {
        const appUrl = await APP_URL();
        let url = `${await API_COUNT_APPROVE()}?appUrl=${appUrl}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        return response
    } catch (err) {

    }
    return {}
}
