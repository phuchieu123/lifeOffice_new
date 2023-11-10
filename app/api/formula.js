import { API_SALARY_FORMULA } from "../configs/Paths";
import { serialize } from "../utils/common";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";

export const getFormula = async () => {
    try {
        const url = `${await API_SALARY_FORMULA()}`;
        const body = { method: REQUEST_METHOD.GET };
        const response = await request(url, body);
        if (response.status) return response.data
    } catch (err) { }
}
