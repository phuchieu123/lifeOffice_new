import { API_COUNT_SOURCE } from "../configs/Paths";
import { serialize } from "../utils/common";
import request from "../utils/request";

export const getCount = async (query) => {
    try {
        const url = `${await API_COUNT_SOURCE()}?${serialize(query)}`;

        const body = {
            method: 'GET',
        };
        const response = await request(url, body);
        return response
    } catch (err) { }
    return null
}