import { API_CONVERSATION, API_CONVERSATION_MESSAGE } from "../configs/Paths";
import request from "../utils/request";

export const getMessage = async () => {
    try {
        let url = `${await API_CONVERSATION_MESSAGE()}`;
        console.log(':( ~ url', url)

        const body = { method: 'GET' };
        const response = await request(url, body);
        console.log(':( ~ response', response)
        return response
    } catch (err) {
        console.log('err', err)
    }
    return {}
}

export const getMessageCoutAll = async () => {
    try {
        let url = `${await API_CONVERSATION()}`;
        console.log(':( ~ url', url)

        const body = { method: 'GET' };
        const response = await request(url, body);
        console.log(':( ~ response', response)
        return response
    } catch (err) {
        console.log('err', err)
    }
    return {}
}
