import qs from 'qs';
import { authenRequest } from '../utils/request';
import { _APP_URL, } from '../configs/Paths';
import { REQUEST_METHOD } from '../utils/constants';
import { getData, storeData, clearData } from '../utils/storage';
import _ from 'lodash'
import { APPROVE_ID, DRIVER_ID } from '../../urlConfig';

export const login = async (data) => {
    try {
        
        const hostResponse = await getData('urlConfig')
        console.log(hostResponse, data ,'ddaya')
        const { appUrl, clientId, oauthUrl, domain, approveUrl, uploadUrl } = hostResponse;
        let body = {
            headers: {
                'content-Type': 'application/x-www-form-urlencoded',
            },
            method: REQUEST_METHOD.POST,
            body: qs.stringify(data),
        };
        let url = `${oauthUrl}/oauth/token`;
        console.log('hel')
        const loginResponse = await authenRequest(url, body);
        
        console.log(loginResponse, "loginRespose");
        if (typeof loginResponse.access_token === 'string') {
            await storeData('accessToken', loginResponse.access_token);
            return loginResponse.access_token
        }
    } catch (error) {console.log(error) }
}

export const getToken = async () => {
    try {
        await clearData('token')
        const accessToken = await getData('accessToken')
        const hostResponse = await getData('urlConfig')
        const { appUrl, clientId, oauthUrl, domain, approveUrl, uploadUrl } = hostResponse;

        const tokenUrl = `${oauthUrl}/oauth/authorize?client_id=${clientId}&allowed=true&redirect_uri=${appUrl}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`;

        const accessOtion = {
            method: REQUEST_METHOD.GET,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const loginResponse = await authenRequest(tokenUrl, accessOtion);
        if (loginResponse.status === 'success') {
            await storeData('token', loginResponse.data.token);
            return loginResponse.data.token
        }
    } catch (error) { }
}


export const getApproveToken = async () => {
    try {
        await clearData('approveToken')
        const accessToken = await getData('accessToken')
        const hostResponse = await getData('urlConfig')
        const { appUrl, clientId, oauthUrl, domain, approveUrl, uploadUrl } = hostResponse;

        const authUrl = `${oauthUrl}/oauth/authorize?client_id=${APPROVE_ID}&allowed=true&redirect_uri=${approveUrl}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`

        const accessOtion = {
            method: REQUEST_METHOD.GET,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const loginResponse = await authenRequest(authUrl, accessOtion);

        if (loginResponse.status === 'success') {
            await storeData('approveToken', loginResponse.data.token);
            return loginResponse.data.token
        }
    } catch (error) { }
    return 'noApproveToken'
}

export const getDriverToken = async () => {
    try {
        await clearData('token_03')
        const accessToken = await getData('accessToken')
        const hostResponse = await getData('urlConfig')
        const { appUrl, clientId, oauthUrl, domain, approveUrl, uploadUrl } = hostResponse;

        const driverUrl = `${oauthUrl}/oauth/authorize?client_id=${DRIVER_ID}&allowed=true&redirect_uri=${uploadUrl}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`;

        const accessOtion = {
            method: REQUEST_METHOD.GET,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const loginResponse = await authenRequest(driverUrl, accessOtion);

        if (loginResponse.status === 'success') {
            await storeData('token_03', loginResponse.data.token);
            return loginResponse.data.token
        }
    } catch (error) { }
    return 'noDriverToken'
}