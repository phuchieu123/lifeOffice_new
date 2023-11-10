import { API_HRM_WAGE } from "../configs/Paths";
import request from "../utils/request";

export const addHrmWage = async (body) => {
    try {
        let url = await API_HRM_WAGE();
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}