export const CONFIG = 'default'
// export const CONFIG = 'maw'
// export const CONFIG = 'staging'

const BASE = 'https://administrator.lifetek.vn.vn'
const BASE_ADMIN = `http://192.168.0.88`
// const BASE_ADMIN = `https://admin.lifetek.vn`

export const ADMIN_URL = `${BASE_ADMIN}:10201/oauth/infor`;

export const FACE_URL = `${BASE}:8082`
export const DETECTION_URL = `${BASE}:298`
export const API_ROLE_URL = 'https://administrator.lifetek.vn.vn:201'
export const API_RECORD_URL = 'https://administrator.lifetek.vn.vn:227'

export const DRIVER_ID = `03_Driver`
export const APPROVE_ID = `10_ApproveSystem`

export const LIST_CONFIG = {
  default: {
    // HOSTNAME: 'qlkh.ievn.com.vn',
    // HOSTNAME: `ievn.lifetek.vn`,
    // HOSTNAME: 'quanlytoanha.mpm.vn',
    // HOSTNAME: 'quanlytoanhatest.lifetek.vn',
    // HOSTNAME: 'internal.lifetek.vn',
    // HOSTNAME: 'stagingerp.lifetek.vn',
  },
  hado: {
    HOSTNAME: `hado.lifetek.vn`,
    CLIENT_ID: `HADO`,
    _APP_URL: `${BASE}:520`,
    OAUTH_URL: `${BASE}:501`,
    APPROVE: `${BASE}:510`,
    UPLOAD: `${BASE}:503`,
    DYNAMIC_FORM: `${BASE}:519`,
    useLocal: true,
  },
  ievn: {
    HOSTNAME: `ievn.lifetek.vn`,
    _APP_URL: `${BASE}:255`,
    OAUTH_URL: `${BASE}:201`,
    APPROVE: `${BASE}:210`,
    CLIENT_ID: `IEVN`,
    UPLOAD: `${BASE}:203`,
    DYNAMIC_FORM: `${BASE}:219`,
    useLocal: true,
  },
  stagingerp: {
    HOSTNAME: `stagingerp.lifetek.vn`,
    CLIENT_ID: `20_CRM`,
    _APP_URL: `${BASE}:220`,
    OAUTH_URL: `${BASE}:201`,
    UPLOAD: `${BASE}:203`,
    NOTIFY: `${BASE}:208`,
    APPROVE: `${BASE}:210`,
    DYNAMIC_FORM: `${BASE}:219`,
    useLocal: true,
  },
  maw: {
    HOSTNAME: 'maw.lifetek.vn',
    CLIENT_ID: 'maw',
    OAUTH_URL: `${BASE}:201`,
    _APP_URL: `${BASE}:234`,
    APPROVE: `${BASE}:210`,
    DYNAMIC_FORM: `${BASE}:219`,
    UPLOAD: `${BASE}:203`,
    // NOTIFY: `${BASE}:234`,
    useLocal: true,
  },
  internal: {
    HOSTNAME: 'internal.lifetek.vn',
    CLIENT_ID: '2090App',
    OAUTH_URL: `${BASE}:201`,
    _APP_URL: `${BASE}:290`,
    APPROVE: `${BASE}:202`,
    DYNAMIC_FORM: `${BASE}:209`,
    UPLOAD: `${BASE}:203`,
    NOTIFY: `${BASE}:208`,
    useLocal: true,
  },

}