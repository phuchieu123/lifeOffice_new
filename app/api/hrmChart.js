import { API_HRMEMPLOYEE_REPORT_SINGED } from "../configs/Paths";
import request from "../utils/request";

export const getHrmEmplyReportSinged = async () => {
    try {
        let url = `${await API_HRMEMPLOYEE_REPORT_SINGED()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);
        return response
    } catch (err) { }

}