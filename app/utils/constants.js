export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const LIFFETEK = {
  website: 'www.lifetek.vn',
}
export const rtcPeerConnection = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    }, {
      urls: 'stun:stun1.l.google.com:19302',
    }, {
      urls: 'stun:stun2.l.google.com:19302',
    }

  ],
}
export const priorityData = [
  { text: 'Rất cao', value: 1 },
  { text: 'Cao', value: 2 },
  { text: 'Trung bình', value: 3 },
  { text: 'Thấp', value: 4 },
  { text: 'Rất thấp', value: 5 },
];

export const taskStatusData = [
  { text: 'Chưa thực hiện', value: 1 },
  { text: 'Đang thực hiện', value: 2 },
  { text: 'Hoàn thành', value: 3 },
  { text: 'Đóng', value: 4 },
  { text: 'Tạm dừng', value: 5 },
  { text: 'Không thực hiện', value: 6 },
];

export const taskKanbanData = [
  { code: 1, key: 'newTask' },
  { code: 2, key: 'doing' },
  { code: 3, key: 'success' },
  { code: 4, key: 'failed' },
  { code: 5, key: 'pause' },
  { code: 6, key: 'notDo' },
];

export const REQUEST_METHOD = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

export const imagePickerOptions = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export const DEVICE_PERMISSIONS = {
  READ_EXTERNAL_STORAGE: 'READ_EXTERNAL_STORAGE',
  WRITE_EXTERNAL_STORAGE: 'WRITE_EXTERNAL_STORAGE',
};

export const KANBAN_CODE = {
  BUSINESS_OPPORTUNITY: 'ST01',
};

export const DATE_FORMAT = {
  TIME: 'HH:mm',
  DATE: 'DD/MM/YYYY',
  DATE_TIME: 'DD/MM/YYYY HH:mm',
  DATETIME_FORMAT: 'MM/DD/YYYY HH:mm',
};

export const PRODUCT_GROUP = [
  { code: '00001', name: 'Cho vay', name_en: 'loan' },
  { code: '00002', name: 'Huy động', name_en: 'customerAccount' },
  { code: '00003', name: 'Thẻ', name_en: 'card' },
  { code: '00004', name: 'Giao dịch', name_en: 'transaction' },
];

export const BOS_KANBAN_DEFAULT = [
  { code: '1', name: 'CHKD mới', key: 'newTask' },
  { code: '2', name: 'CHKD đang thực hiện', key: 'doing' },
  { code: '3', name: 'CHKD hoàn thành', key: 'success' },
  { code: '4', name: 'CHKD thất bại', key: 'failed' },
];


export const provincialColumns = [{ name: 'Khu vực phía Bắc' }, { name: 'Khu vực phía Nam' }];

export const taskStageArr = [
  { name: 'Giai đoạn thông tin thị trường, chốt chủ trương' },
  { name: 'Giai đoạn tiền dự án' },
  { name: 'Dự Án GĐ Đang Thi Công' },
  { name: 'Dự Án GĐ Chuẩn Bị Thi Công' },
  { name: 'Dự Án Giai Đoạn Nghiệm Thu' },
  { name: 'Dự Án Giai Đoạn Thu Hồi Công Nợ' },
];

export const NOTIFICATION_STATUS = [
  // { _id: 0, name: 'Tất cả' },
  { _id: 1, name: 'Chưa đọc' },
  { _id: 2, name: 'Đã đọc' }
]

export const MODULE = {
  TASK: 'Task',                             // Công việc
  BOS: 'BusinessOpportunities',             // CHKD
  SALES_QUOTATION: 'SalesQuotation',        // Báo giá
  CONTRACT: 'Contract',                     //Hợp đồng
  DOCUMENTARY: 'Documentary',               // công văn
  ADVANCE_REQUIRE: 'AdvanceRequire',        //Tạm ứng
  TAKE_LEAVE: 'TakeLeave',                  //Nghỉ phép
  HRMOVERTIME: 'HrmOverTime',               // thời gian OT
  CALENDAR: 'Calendar',                     // Lịch
  CUSTOMER: 'Customer',                      //Khách hàng
  INCOMINGDOCUMENT: 'inComingDocument', // Công văn đến
  OUTGOINGDOCUMENT: 'outGoingDocument', // Công văn đi
  HRM: 'hrm',                            //adminstack
  FILEMANAGER: 'file-manager',             //LIFEDRIVER
  HRMTIMEKEEPINGTABLE: 'HrmTimekeepingTable', //Chấm công
}

export const GENDER = [
  {
    _id: 'male',
    name: 'Nam',
  },
  {
    _id: 'female',
    name: 'Nữ',
  },
]

export const FOLDER = {
  COMPANY: 'company',
  USERS: 'users',
  SHARE: 'share'
}
