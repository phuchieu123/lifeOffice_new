
import { API_PERSONNEL, API_REPORT_HRM_WITH_SIGNED_DATE, API_RECRUITMENT_COST_REPORT, API_ORG_ONE_DAY_REPORT, API_EMP_BY_AGE, API_REPORT_SENIORITY, API_EMP_BY_CONTRACT, API_TAKE_LEAVE, API_EMP_BY_TIME, API_REPORT_HRM_POSITION, API_OVERTIME, API_REPORT_HRM_SITUATION,API_TIMEKEEPING_PEOPLE_CHECKIN } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";

export const deleteHrm = async (ids) => {
    try {
        let url = await API_PERSONNEL();
        const newBody = {
            method: 'DELETE',
            body: JSON.stringify({ ids }),
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

export const getByIdHrm = async (id) => {

    try {
        let url = `${await API_PERSONNEL()}/${id}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
    return {}
}

export const getByCode = async (code) => {

    try {
        let url = `${await API_PERSONNEL()}?${serialize({ filter: { code } })}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data[0]
    } catch (err) { }
    return {}
}

export const getReportBySignedDate = async (query) => {

    try {
        let url = `${await API_REPORT_HRM_WITH_SIGNED_DATE()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
}

export const getReportByRecruitmentCost = async (query) => {

    try {
        let url = `${await API_RECRUITMENT_COST_REPORT()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
}

export const getReportByOrg = async (query) => {

    try {
        let url = `${await API_ORG_ONE_DAY_REPORT()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
}

export const getReportByEmployeeAge = async (query) => {

    try {
        let url = `${await API_EMP_BY_AGE()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data
    } catch (err) { }
}

export const getReportByEmployeeWord = async (query) => {

    try {
        let url = `${await API_EMP_BY_TIME()}?${serialize(query)}&type=month`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data
    } catch (err) { }
}


export const getReportSeniority = async (query) => {

    try {
        let url = `${await API_REPORT_SENIORITY()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data
    } catch (err) { }
}

export const getReportSituation = async (query) => {

    try {
        let url = `${await API_REPORT_HRM_SITUATION()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data
    } catch (err) { }
}

export const getReportPeopleCheckin = async (query) => {

    try {
        let url = `${await API_TIMEKEEPING_PEOPLE_CHECKIN()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data
    } catch (err) { }
}

export const getReportByContract = async (query) => {

    try {
        let url = `${await API_EMP_BY_CONTRACT()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response.data
    } catch (err) { }
}

export const getDayOffBoard = async (body) => {

    try {
        let url = await API_TAKE_LEAVE();
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };
        const response = await request(url, newBody);

        return response
    } catch (err) { console.log(err) }
}

export const getReportPostion = async (query) => {

    try {
        let url = `${await API_REPORT_HRM_POSITION()}?${serialize(query)}`;
        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { console.log(err) }
}

export const gotDayOffBoard = async (id, body) => {

    try {
        let url = `${await API_TAKE_LEAVE()}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
        };
        const response = await request(url, newBody);

        return response
    } catch (err) { console.log(err) }
}

export const getById = async (id) => {

    try {
        let url = `${await API_TAKE_LEAVE()}/${id}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        return response
    } catch (err) { }
    return {}
}

export const getData = async (id) => {

    try {
        let url = `${await API_TAKE_LEAVE()}/${id}`;
        const newBody = {
            method: 'GET',
        };

        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

export const getOvertime = async (body) => {

    try {
        let url = await API_OVERTIME();
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
    } catch (err) {
        console.log(err)
    }
}

export const updateOvertime = async (id, body) => {

    try {
        let url = `${await API_OVERTIME()}/${id}`;
        const newBody = {
            method: 'PUT',
            body: JSON.stringify(body),
        };

        const response = await request(url, newBody);
        return response
    } catch (err) {
        console.log(err)
    }
}

export const getByIdOvertime = async (id) => {

    try {
        let url = `${await API_OVERTIME()}/${id}`;
        const body = { 
            method: 'GET',
        };

        const response = await request(url, body);
        return response
    } catch (err) {
        console.log(err)
    }
    return {}
}