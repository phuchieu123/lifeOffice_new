import { cleanAuth, getJwtToken, getAccessToken } from './authen';
import * as RootNavigation from '../RootNavigation';
import { getData } from './storage';
import _ from 'lodash'
import { onLogout } from '../utils/deviceEventEmitter';
import ToastCustom from '../components/ToastCustom';

export const fet = async (url, options) => {

  try {
    return fetch(url, options)
      .then(checkStatus)
      .then(res => res.json()).catch(err => console.log(err,'vao day ne'));
  } catch (err) {
    console.log(111122, err);
  }
};

export function checkStatus(response) {
  const status = _.get(response, 'respInfo.status') || _.get(response, 'status');
  if (status === 401) {
    ToastCustom({ text: 'Phiên đăng nhập hết hạn', type: 'warning' })
    onLogout()
  }

  // if (status >= 200 && status < 300) {
  //   if (status === 204 || status === 205) {
  //     return null;
  //   }
  //   return response;
  // }
  return response;
}

export function authenRequest(url, options) {
  console.log('66666 voo day ');
  return fet(url, options);
}

export async function fileRequest(url, options) {
  const token = await getJwtToken();
  if (token) {
    const newHeaders = Object.assign(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      options.headers,
    );
    options.headers = newHeaders;

    return fet(url, options);
  }
  return null;
}

export default async function request(url, options, removeContentType = false) {
  const token = await getJwtToken();
  if (token) {
    const newHeaders = Object.assign(
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      options.headers,
    );
    options.headers = newHeaders;
    if (removeContentType) {
      delete options.headers['Content-Type'];
    }

    return fet(url, options);
  }
  return null;
}

export async function requestApprove(url, options) {
  const token = await getData('approveToken')
  const newHeaders = Object.assign(
    {
      Authorization: `Bearer ${token}`,
    },
    options.headers,
  );
  options.headers = newHeaders;

  return fet(url, options)
}