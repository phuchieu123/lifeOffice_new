
import _ from "lodash";
import { API_FACE_DELETE, API_FACE_DROP, API_FACE_INSERT, API_FACE_SHOW, CLIENT_ID, FACE_RECONIZE_URL } from "../configs/Paths";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";


const insert = async (image, id) => {
    let msg = 'Có lỗi xảy ra'
    try {
        let base64 = image.base64
        // const res = await getFaces(image)
        // if (res.length === 1) base64 = res[0].base64
        const url = API_FACE_INSERT;
        const clientId = await CLIENT_ID()
        const body = {
            method: 'POST',
            body: JSON.stringify({
                data: [base64],
                person_id: [id],
                table_name: `_${clientId}`,
            })
        };
        console.log({
            data: [base64],
            person_id: [id],
            table_name: `_${clientId}`,
        }, url);
        let result = await request(url, body);
        console.log(result, "result");
        return result;
    } catch (error) {
        console.log(error, 'error');
    }
}

const reconize = async (image) => {
    let result = {}
    try {
        let base64 = image.base64
        // const res = await getFaces(image)
        // if (res.length > 0) base64 = res[0].base64
        const url = FACE_RECONIZE_URL;
        const clientId = await CLIENT_ID()
        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify({
                data: [base64],
                table_name: `_${clientId}`,
            }),
        };

        result = await request(url, body);
        console.log(result);
        if (!result) result = {}
        if (_.get(result, 'msg.type')) result.person_id = _.get(result, 'msg.type')
        if (result && typeof result.msg !== 'string') delete result.msg

        if (!result.person_id || result.person_id === 'unkown person') {
            result.msg = result.msg || 'Không nhận diện được danh tính'
        } else if (result.person_id === 'fake_face') {
            result.msg = result.msg || 'Bạn vi phạm quy định chấm công'
        } else if (result.person_id === 'no_face') {
            result.msg = result.msg || 'Không có khuôn mặt'
        } else {
            result.success = true
        }
    } catch (error) {
        console.log(error, "llll");
        result = { msg: 'Nhận diện thất bại' }
    }
    if (!result.success && !result.msg) result.msg = 'Nhận diện thất bại'
    return result
}

const delete_face = async (id) => {
    try {
        const url = `${API_FACE_DELETE}`;
        const clientId = await CLIENT_ID()
        const body = {
            method: 'POST',
            body: JSON.stringify({
                person_id: [id],
                table_name: `_${clientId}`,
            })
        };
        let result = await request(url, body);
        return result
    } catch (error) { }
    return false
}

const drop = async () => {
    try {
        const url = `${API_FACE_DROP}`;
        const clientId = await CLIENT_ID()
        const body = {
            method: 'POST',
            body: JSON.stringify({
                table_name: `_${clientId}`,
            })
        };
        let result = await request(url, body);
        // if (result && result.msg && typeof result.msg !== 'string') result.msg = ''
        return result
    } catch (error) { }
    return {
        status: false,
        msg: 'Có lỗi xảy ra'
    }
}

const showFaceImage = async (id) => {
    try {
        const url = `${API_FACE_SHOW}`;
        const clientId = await CLIENT_ID()
        const body = {
            method: 'POST',
            body: JSON.stringify({
                person_id: [id],
                table_name: `_${clientId}`,
            })
        };
        let result = await request(url, body);
        return result
    } catch (error) {
    }
}

export {
    delete_face,
    drop, insert,
    reconize, showFaceImage
};
