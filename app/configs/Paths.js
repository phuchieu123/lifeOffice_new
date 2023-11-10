import { CONFIG, ADMIN_URL, FACE_URL, DETECTION_URL, LIST_CONFIG } from '../../urlConfig';
import { REQUEST_METHOD } from '../utils/constants';
import { authenRequest } from '../utils/request';
import { clearData, getData, storeData } from '../utils/storage';
import { get } from 'lodash';
import _ from 'lodash';
// import { XMLHttpRequest } from 'react-native';

///////////////////////////////////////////////////////////////////////////////////////////////////////
export const getConfig = async (hostname) => {
  await clearData(`urlConfig`);
  let config = hostname[0] === '_' ? hostname.substr(1) : CONFIG;
  const {
    HOSTNAME,
    CLIENT_ID: clientId,
    _APP_URL,
    OAUTH_URL,
    NOTIFY,
    UPLOAD,
    DYNAMIC_FORM,
    APPROVE,
  } = _.get(LIST_CONFIG, config, {});
  const { useLocal } = LIST_CONFIG[config] || {};
  let hostResponse = {};

  if (hostname)
    if (!useLocal) {
      try {
       
        let host = _.get(LIST_CONFIG, `${config}.HOSTNAME`, hostname);
        host = host.split('/').pop();
        
        const hostUrl = `${ADMIN_URL}/${host}`;
        
        console.log('hostUrl', hostUrl);

        // const xhr = new XMLHttpRequest();
        // xhr.withCredentials = false;

        // xhr.onload = function() {
        //   if (xhr.status === 200) {
        //     console.log('API response:', xhr.responseText);
        //     // Xử lý phản hồi thành công ở đây nếu cần
        //   } else {
        //     console.error('Error:', xhr.statusText);
        //     // Xử lý lỗi khi trả về mã lỗi khác 200 ở đây nếu cần
        //   }
        // };
  
        // xhr.onerror = function() {
        //   console.error('Request failed');
        //   // Xử lý lỗi khi có lỗi trong quá trình gửi yêu cầu
        // };
  
        // xhr.open('GET', hostUrl, true);
        // xhr.send();
        
        hostResponse = await authenRequest(hostUrl, {
          method: REQUEST_METHOD.GET,
        });
        console.log('hostResponse', hostResponse);
        console.log(hostResponse);
      } catch (err) {
        console.log('HOST_RESPONSE_ERROR: ', err);
      }
    }

  hostResponse = {
    domain: hostResponse.domain || HOSTNAME,
    clientId: hostResponse.clientId || clientId,
    appUrl: hostResponse.appUrl || _APP_URL,
    oauthUrl: hostResponse.oauthUrl || OAUTH_URL,
    notifyUrl: hostResponse.notifyUrl || NOTIFY,
    uploadUrl: hostResponse.uploadUrl || UPLOAD,
    approveUrl: hostResponse.approveUrl || APPROVE,
    trust: hostResponse.trust,
    dynamicFormUrl: hostResponse.dynamicFormUrl || DYNAMIC_FORM,
    imageAI: hostResponse.config && hostResponse.config.imageAI,
  };

  await storeData(`urlConfig`, JSON.stringify(hostResponse));
  return hostResponse;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

export const DOMAIN_URL = async () => {
  const config = await getData('urlConfig');
  return get(config, 'domain') || get(LIST_CONFIG, `${CONFIG}.HOSTNAME`);
};

export const AUTH_URL = async () => {
  const config = await getData('urlConfig');
  return config.oauthUrl;
};

export const APP_URL = async () => {
  const config = await getData('urlConfig');
  return _.get(config, 'appUrl');
};

export const IMAGE_AI = async () => {
  const config = await getData('urlConfig');
  return _.get(config, 'imageAI');
};

export const UPLOAD_URL = async () => {
  const config = await getData('urlConfig');
  return config.uploadUrl;
};

export const APPROVE_URL = async () => {
  const config = await getData('urlConfig');
  return config.approveUrl;
};

export const CLIENT_ID = async () => {
  const config = await getData('urlConfig');
  return config.clientId;
};

export const NOTIFY_URL = async () => {
  const config = await getData('urlConfig');
  return config.notifyUrl;
};

export const DYNAMIC_FORM_URL = async () => {
  const config = await getData('urlConfig');
  return config.dynamicFormUrl;
};

export const ROLE_URL = async () => {
  // const config = await getData('urlConfig')
  // return config.dynamicUrl
  return API_ROLE_URL;
};

export const RECORD_URL = async () => {
  // const config = await getData('urlConfig')
  // return config.dynamicUrl
  return API_RECORD_URL;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

export const FACE_SERVICES = `${FACE_URL}`; // `http://192.168.1.238:5000`

export const FACE_RECONIZE_URL = `${FACE_SERVICES}/recognize`;
export const API_FACE_INSERT = `${FACE_SERVICES}/insert`;
export const API_FACE_DELETE = `${FACE_SERVICES}/delete`;
export const API_FACE_DROP = `${FACE_SERVICES}/drop`;
export const API_FACE_SHOW = `${FACE_SERVICES}/showimage`;

///////////////////////////////////////////////////////////////////////////////////////////////////////

export const API_DETECTION = `${DETECTION_URL}/detection`; // `http://192.168.1.238:5000`

///////////////////////////////////////////////////////////////////////////////////////////////////////

export const API_FILE = async () => {
  return `${await UPLOAD_URL()}/api/file-system`;
};
export const API_FILE_SIGN = async () => {
  return `${await UPLOAD_URL()}/api/file-system/save-signed-file`;
};
export const UPLOAD_IMG_SINGLE = async () => {
  return `${await UPLOAD_URL()}/api/files/single`;
};
export const UPLOAD_FILE = async () => {
  return `${await UPLOAD_URL()}/api/file-system/company`;
};
export const LISTFILE_PERSONNEL = async () => {
  return `${await UPLOAD_URL()}/api/file-system/company/Upload`;
};
export const API_DRIVER_SHARE = async () => {
  return `${await UPLOAD_URL()}/api/share`;
};

export const API_FILE_COMPANY = async () => {
  return `${await API_FILE()}/company`;
};

export const API_FILE_USERS = async () => {
  return `${await API_FILE()}/users`;
};

export const API_FILE_SHARE = async () => {
  return `${await API_FILE()}/share`;
};

export const API_FILE_DOWNLOAD = async () => {
  return `${await API_FILE()}/download/file`;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

//SendRecord
export const API_SEND_RECORD = async () => {
  return `${await RECORD_URL()}/speech2text`;
};

export const API_TASK_CONFIG = async () => `${await APP_URL()}/api/tasks/config`;
export const API_TASK_TASKS = async () => `${await APP_URL()}/api/tasks`;
export const API_TASKS_KANBAN = async () => `${await APP_URL()}/api/tasks/kanban`;

export const API_COUNT_SOURCE = async () => `${await APP_URL()}/api/business-opportunities/count-Source-Bussiness`;
export const API_COUNT_BY_KANBAN = async () => `${await APP_URL()}/api/Tasks/countByKanban`;

export const API_TASKS_PROGRESS = async () => `${await APP_URL()}/api/tasks/progress`;

export const API_SAMPLE_PROCESS = async () => `${await APP_URL()}/api/templates`;

export const API_DYNAMIC_FORM = async () => `${await DYNAMIC_FORM_URL()}/api/dynamic-forms`;

export const API_MODULE_DYNAMIC = async () => `${await APP_URL()}/api/common/module-dynamic`;

export const API_COMMENT = async () => `${await APP_URL()}/api/comment`;

export const API_PERSONNEL = async () => `${await APP_URL()}/api/hrmEmployee`;

export const API_RECRUITMENT = async () => {
  return `${await APP_URL()}/api/recruitment`;
};
export const API_APPROVE_GROUP = async () => `${await APPROVE_URL()}/api/approve-group`;

export const API_CAMPAIGN = async () => {
  return `${await APP_URL()}/api/campaign`;
};
export const API_ROLE_GROUPS = async () => {
  return `${await ROLE_URL()}/role-groups`;
};

export const API_VIEW_CONFIG = async () => {
  return `${await APP_URL()}/api/view-configs`;
};
export const API_MY_VIEW_CONFIG = async () => {
  return `${await APP_URL()}/api/view-configs/myconfig`;
};

export const API_ORIGANIZATION = async () => {
  return `${await APP_URL()}/api/organization-units`;
};

export const API_APPROVE = async () => `${await APPROVE_URL()}/api/approve-request`;
export const API_APPROVE_GROUPS = async () => `${await APPROVE_URL()}/api/approve-group`;

export const API_USERS = async () => {
  return `${await APP_URL()}/api/employees`;
};

export const API_CUSTOMER = async () => {
  return `${await APP_URL()}/api/customers`;
};

export const API_TASK = async () => {
  return `${await APP_URL()}/api/tasks`;
};

export const API_TASK_PROJECT = async () => {
  return `${await APP_URL()}/api/tasks/projects`;
};

export const API_CRM_STATUS = async () => {
  return `${await APP_URL()}/api/crm-status`;
};

export const API_ROLE_TASK = async () => {
  return `${await APP_URL()}/api/roleApp/task`;
};

export const API_ROLE_BUSINESS = async () => {
  return `${await APP_URL()}/api/roleApp/BusinessOpportunities`;
};

export const API_ROLES = async () => {
  return `${await AUTH_URL()}/roles`;
};

export const API_ROLE_CUSTOMER = async () => {
  return `${await APP_URL()}/api/roleApp/Customer`;
};

export const API_CRM_SOURCE = async () => {
  return `${await APP_URL()}/api/crm-source`;
};

export const API_BUSINESS_OPPORTUNITIES = async () => {
  return `${await APP_URL()}/api/business-opportunities`;
};

export const API_LOGS = async () => {
  return `${await APP_URL()}/api/logs`;
};

export const API_NOTIFICATION = async () => {
  return `${await APP_URL()}/api/notifications`;
};

export const API_TIMEKEEPING = async () => {
  return `${await APP_URL()}/api/timekeeping`;
};

export const API_VERIFY_TIMEKEEPING = async () => {
  return `${await APP_URL()}/api/timekeeping/verify-timekeeping`;
};

export const API_FACE_CHECK_IN = async () => {
  return `${await APP_URL()}/api/timekeeping/face-check-in`;
};

export const API_HISTORY_CHECK_IN = async () => {
  return `${await APP_URL()}/api/timekeeping/history-check-in`;
};

export const API_HISTORY_CHECK_IN1 = async () => {
  return `${await APP_URL()}/api/timekeeping/Detail`;
};

export const API_TIMEKEEPING_PAYCHECK = async () => {
  return `${await APP_URL()}/api/timekeeping/paycheck`;
};

export const API_CHECK_IN_FAIL = async () => {
  return `${await APP_URL()}/api/timekeeping/check-in-fail`;
};

export const API_TIMEKEEPING_CONFIRM = async () => {
  return `${await APP_URL()}/api/timekeeping/confirm-app`;
};

export const API_TIMEKEEPING_PEOPLE_CHECKIN = async () => {
  return `${await APP_URL()}/api/timekeeping/reportPeopleCheckin`;
};

export const API_TIMEKEEPING_TABLE = async () => {
  return `${await APP_URL()}/api/timekeepingTable`;
};

export const API_TIMEKEEPING_TABLE_HISTORY_CHECK_IN = async () => {
  return `${await APP_URL()}/api/timekeepingTable/history-check-in`;
};

export const API_SALARY_FORMULA = async () => {
  return `${await APP_URL()}/api/formula`;
};

export const API_ATTRIBUTE_LISTATTRIBUTE = async () => {
  return `${await APP_URL()}/api/attributeformula/listattribute`;
};

export const API_ATTRIBUTE_FORMULA = async () => {
  return `${await APP_URL()}/api/attributeformula/attributeformula`;
};

export const API_TAKE_LEAVE = async () => {
  return `${await APP_URL()}/api/takeleave`;
};

export const API_TAKE_LEAVE_MANAGER = async () => {
  return `${await APP_URL()}/api/takeleave-manager`;
};

export const API_HRM_SHIFT = async () => {
  return `${await APP_URL()}/api/shift`;
};

// HRM
export const API_STATUS_HRMCONFIG = async () => {
  return `${await APP_URL()}/api/hrm-status`;
};
//HRM DELETE CUSTOMER
export const API_DELTE_CUSTOMER = async () => {
  return `${await APP_URL()}/api/customers/remove-more`;
};

export const API_SOURCE_HRMCONFIG = async () => {
  return `${await APP_URL()}/api/hrm-source`;
};
export const API_READ_ALL_NOTIFICATION = async () => {
  return `${await APP_URL()}/api/notifications/updateRead`;
};
//
export const API_REPORT_TASK = async () => {
  return `${await APP_URL()}/api/report/report-taskstatus`;
};
export const API_REPORT_TASK_2 = async () => {
  return `${await APP_URL()}/api/report/tasks-status`;
};

export const API_REPORT_BOS = async () => {
  return `${await APP_URL()}/api/report/report-statistical-bussinessoppotunities`;
};

export const INCOMING_DOCUMENT = async () => {
  return `${await APP_URL()}/api/documentary/incoming-document`;
};

export const MEETING_SCHEDULE = async () => {
  return `${await APP_URL()}/api/metting-schedule`;
};

export const API_CONVERSATION = async () => {
  return `${await APP_URL()}/api/conversation`;
};
// api/conversation/message/updateEmotion/

export const API_MESSAGE_UPDATEEMOTION = async () => {
  return `${await API_CONVERSATION()}/message/updateEmotion`;
};

export const API_CHAT = async () => {
  return `${await API_CONVERSATION()}/message`;
};

export const MEETING_DEPARTENT = async () => {
  return `${await APP_URL()}/api/metting-schedule/room`;
};

// Nhóm sản phẩm
export const API_INVENTORY_CATALOG = async () => {
  return `${await APP_URL()}/api/inventory/catalog`;
};

// Loại sản phẩm
export const API_INVENTORY_TAG = async () => {
  return `${await APP_URL()}/api/inventory/tag`;
};

// sản phẩm
export const API_INVENTORY = async () => {
  return `${await APP_URL()}/api/inventory`;
};

export const API_SALE_POLICY = async () => {
  return `${await APP_URL()}/api/sales-policy`;
};

export const API_CONNECTIVE = async () => {
  return `${await APP_URL()}/api/sales-policy`;
};

export const API_CUSTOMER_LOAN_CONTRACT = async () => {
  return `${await APP_URL()}/api/loan-contract`;
};

export const API_CUSTOMER_LOAN_CONTRACT_LIST_BY_BRANCH = async () => {
  return `${await API_CUSTOMER_LOAN_CONTRACT()}/listByBranch`;
};

export const API_CUSTOMER_ACCOUNT = async () => {
  return `${await APP_URL()}/api/customer-account`;
};

export const API_CUSTOMER_ACCOUNT_LIST_BY_BRANCH = async () => {
  return `${await APP_URL()}/api/customer-account/listByBranch`;
};

export const API_CUSTOMER_CARD = async () => {
  return `${await APP_URL()}/api/card`;
};

export const API_PROFILE = async () => {
  return `${await APP_URL()}/api/employees/profile`;
};

export const API_MESSAGE_LIST_GET_ALL = async () => {
  return `${await APP_URL()}/api/employees/list-with-msg`;
};

export const API_MESSAGE_LIST = async () => {
  return `${await APP_URL()}/api/employees/list-conversation`;
};

export const API_FIELD = async () => {
  return `${await APP_URL()}/api/field`;
};

export const API_SALES_QUOTATION = async () => {
  return `${await APP_URL()}/api/sales-quotations`;
};

export const API_CONTRACT = async () => {
  return `${await APP_URL()}/api/contract`;
};

export const API_DOCUMENTARY = async () => {
  return `${await APP_URL()}/api/documentary`;
};

export const API_ADVANCE_REQUIRE = async () => {
  return `${await APP_URL()}/api/advance-require`;
};

export const API_OVERTIME = async () => {
  return `${await APP_URL()}/api/overtime`;
};

//Hợp Đồng  api/tasks/contract
export const API_TASKS_CONTRACT = async () => {
  return `${await APP_URL()}/api/tasks/contract`;
};

//api/hrmEmployee/report-hrm-count-by-org
export const API_REPORT_HRM_COUNT_BY_ORG = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-count-by-org`;
};

export const API_HRM_WAGE = async () => {
  return `${await APP_URL()}/api/hrmWage`;
};

//Dịch vụ báo giá bán hàng-api/inventory/service
export const API_INVENTORY_SERVICE = async () => {
  return `${await APP_URL()}/api/inventory/service`;
};

//xoa tin nhan
export const API_DELETE_MESSAGE = async () => {
  return `${await APP_URL()}/api/conversation/message/removeMessage`;
};

//bang luong api/attributeformula/attributeformula
export const API_ATRIBUTE_ATTRIBUTEFORMULA = async () => {
  return `${await APP_URL()}/api/attributeformula/attributeformula`;
};

export const API_RENDER_ADS = async () => {
  return `${await APP_URL()}/api/ads`;
};

export const API_REPORT_HRM_WITH_SIGNED_DATE = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-with-signed-date`;
};

export const API_RECRUITMENT_COST_REPORT = async () => {
  return `${await APP_URL()}/api/report-recruitment/report-bias-price-hrm-recruitment`;
};

export const API_ORG_ONE_DAY_REPORT = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-count-by-org-one-day`;
};

// BC theo độ tuổi
export const API_EMP_BY_AGE = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-count-by-age`;
};

// BC theo ngày làm việc
export const API_EMP_BY_TIME = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-count-by-time`;
};

// BC theo hợp đồng
export const API_EMP_BY_CONTRACT = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-contract-hrm-count-by-time`;
};

// BC theo chức vụ
export const API_REPORT_HRM_POSITION = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-position`;
};

// BC chấm công
export const API_REPORT_TIMEKEEPING = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-hrm-timekeeping-count-by-time`;
};

// BC theo thâm niên
export const API_REPORT_SENIORITY = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-seniority`;
};

// BC tình hình nhân sự
export const API_REPORT_HRM_SITUATION = async () => {
  return `${await APP_URL()}/api/hrmEmployee/report-by-kanban-name-in-year`;
};

export const API_COMMON = `${APP_URL}/api/common`;

// api/app/approve-request api cout approve
export const API_COUNT_APPROVE = async () => {
  return `${await APPROVE_URL()}/api/app/approve-request`;
};

//api cout message /api/conversation/message/unreadConversation
export const API_CONVERSATION_MESSAGE = async () => {
  return `${await APP_URL()}/api/conversation/message/unreadConversation`;
};

//Text management
export const API_INCOMMING_DOCUMENT = async () => {
  return `${await APP_URL()}/api/incommingdocument`;
};

export const API_OUTGOING_DOCUMENT = async () => {
  return `${await APP_URL()}/api/outgoingdocument`;
};

export const API_DOCUMENT_HISTORY = async () => {
  return `${await APP_URL()}/api/document-history`;
};

export const API_INCOMMING_DOC_PROCESS = async () => {
  return `${await APP_URL()}/api/incommingdocument/processors`;
};

export const API_OUTGOING_DOC_PROCESS = async () => {
  return `${await APP_URL()}/api/outgoingdocument/processors`;
};

export const API_INCOMMING_DOC_COMPLETE = async () => {
  return `${await APP_URL()}/api/incommingdocument/set-complete`;
};

export const API_OUTGOING_DOC_COMPLETE = async () => {
  return `${await APP_URL()}/api/outgoingdocument/set-complete`;
};
