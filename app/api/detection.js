import { API_DETECTION } from "../configs/Paths";
import request from "../utils/request";
import _ from "lodash";
import { DIC } from "../utils/detection";


export const detection = async (type, base64) => {
    try {
        const url = API_DETECTION;
        const body = {
            method: 'POST',
            body: JSON.stringify({
                data: {
                    type,
                    images: [base64],
                }
            })
        };
        let result = await request(url, body);
        const dic = _.invert(DIC[type])
        result = Object.keys(result.data).map(key => {
            return {
                key,
                name: dic[key],
                value: result.data[key],
            }
        })
        return result
    } catch (error) { }
}
