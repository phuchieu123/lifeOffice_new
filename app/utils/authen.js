import { getData, clearData } from './storage';

export const checkAuth = async () => {
  const jwtToken = await getJwtToken();
  if (jwtToken && jwtToken !== '') {
    //if (await checkExpireToken(jwtToken)) {
    return true;
    //}
  }
  return false;
};

export async function getJwtToken() {
  const jwtString = await getData('token');
  if (jwtString && jwtString !== '') {
    return jwtString;
  }
  return null;
}

export async function getAccessToken() {
  const accessToken = await getData('accessToken');
  if (accessToken && accessToken !== '') {
    return accessToken;
  }
  return null;
}

export async function getAppInfo() {
  const appInfoString = await getData('appInfo');
  if (appInfoString && appInfoString !== '') {
    return appInfoString;
  }
  return null;
}

export async function getClientId() {
  const appInfo = await getAppInfo();
  if (appInfo) {
    return appInfo.clientId;
  }
}

export async function getProfile() {
  return await getData('profile');
}

export function cleanAuth() {
  clearData('appInfo');
  clearData('accessToken');
  clearData('token');
  clearData('profile');
}

export async function checkExpireToken(jwtkToken) {
  if (jwtkToken.expiresIn != null) {
    if (jwtkToken.expiresIn < Date.now) {
      return true;
    }
    return false;
  }
  return false;
}
