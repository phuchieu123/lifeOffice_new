import { CLIENT_ID, NOTIFY_URL } from 'configs/Paths';
import { getProfile } from '../utils/authen';
import { authenRequest } from '../utils/request';

const login = async (fcmToken) => {
    const profile = await getProfile();
    const notifyUrl = await NOTIFY_URL();
    const clientId = await CLIENT_ID();
    const registerFcmUrl = `${notifyUrl}/api/register-fcm-token`;
    const fcmData = {
        // group: organizationUnit,
        userId: profile.userId,
        token: fcmToken,
        clientId,
    };
    const fcmBody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fcmData),
    };
    const registerFcmResponse = await authenRequest(registerFcmUrl, fcmBody);
}

const logout = async (fcmToken) => {
    const profile = await getProfile();
    const notifyUrl = await NOTIFY_URL();
    const clientId = await CLIENT_ID();
    const registerFcmUrl = `${notifyUrl}/api/logout-fcm-token`;
    const fcmData = {
        // group: organizationUnit,
        userId: profile.userId,
        token: fcmToken,
        clientId,
    };
    const fcmBody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fcmData),
    };
    const registerFcmResponse = await authenRequest(registerFcmUrl, fcmBody);
}

export {
    login,
    logout,
}