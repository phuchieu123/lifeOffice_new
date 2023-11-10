import { API_PROFILE, API_USERS } from "../configs/Paths";
import { serialize } from "../utils/common";
import { REQUEST_METHOD } from "../utils/constants";
import request from "../utils/request";
import { storeData } from "../utils/storage";
import { uploadImage } from "./fileSystem";
import { updateProfile as updateProfileApp } from "../utils/deviceEventEmitter";

export const getProfile = async () => {
    try {
        let url = `${await API_PROFILE()}`;
        const body = { method: 'GET' };
        const response = await request(url, body);

        if (response._id) {
            await storeData('profile', JSON.stringify(response))
            return response
        }
    } catch (err) { }
}

export const getUserByIds = async (ids) => {
    try {
        const query = {
            filter: {
                userId: { $in: ids }
            }
        }

        let userUrl = await API_USERS()
        userUrl = `${userUrl}?${serialize(query)}`

        const users = await request(userUrl, { method: REQUEST_METHOD.GET });
        return users.data
    } catch (err) { }
}

export const updateProfile = async (data) => {
    try {
        let url = `${await API_PROFILE()}`;
        const body = {
            method: REQUEST_METHOD.PATCH,
            body: JSON.stringify(data),
        };
        const response = await request(url, body);
        if (response.success) {
            updateProfileApp(response.data)
            return response
        }
    } catch (err) { }
}

export const updateUser = async (id, data) => {
    try {
        let url = `${await API_USERS()}/${id}`;
        const body = {
            method: REQUEST_METHOD.PUT,
            body: JSON.stringify(data),
        };
        const response = await request(url, body);
        return response
    } catch { }
}

export const updateAvatar = async (img) => {
    try {
        const profile = await getProfile()
        const avatar = await uploadImage(img, 'AVATAR')

        const bodySend = {
            avatar,
            address: profile.address,
            dob: profile.dob,
            email: profile.email,
            gender: profile.gender,
            name: profile.name,
            phoneNumber: profile.phoneNumber,
        };
        const result = await updateProfile(bodySend)
        updateProfileApp({ ...profile, avatar })
        return result
    } catch (err) { }
}