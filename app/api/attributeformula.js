import { API_ATTRIBUTE_FORMULA } from "../configs/Paths";
import { serialize } from "../utils/common";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";

export const getAttributeFormulaById = async (id) => {
    try {
        const url = `${await API_ATTRIBUTE_FORMULA()}?formulaId=${id}`;
        const body = { method: REQUEST_METHOD.GET };
        const response = await request(url, body);
        if (response.status) return response.data
    } catch (err) { }
}
