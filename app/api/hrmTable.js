import { API_TIMEKEEPING_TABLE } from "../configs/Paths";
import request from "../utils/request";

export const addHrmTable = async (body) => {
    try {
        let url = await API_TIMEKEEPING_TABLE();
        const newBody = {
            method: 'POST',
            body: JSON.stringify(body),
        };
        const response = await request(url, newBody);
        return response
    } catch (err) { }
    return null
}

