import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as constants from './constants';
import * as actions from './actions';
import request, { fileRequest } from '../../utils/request';
import { API_LOGS, UPLOAD_URL, API_BUSINESS_OPPORTUNITIES, API_CUSTOMER, API_SALES_QUOTATION } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize, getLogString } from '../../utils/common';
import { getProfile } from '../../utils/authen';
import { makeSelectKanbanData } from '../App/selectors';
import ToastCustom from '../../components/ToastCustom';
export function* fetchBusinessOp(action) {
  const { data } = action;
  try {
    const url = `${yield API_BUSINESS_OPPORTUNITIES()}/${data._id}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getBusinessOpportunitySuccess(response));
  } catch (err) {
    yield put(actions.getBusinessOpportunityFailure(err));
  }
}

export function* createBusinessOp(action) {
  const { data } = action;
  try {
    // if (data.avatar) {
    //   const uploadFileUrl = `${UPLOAD_URL}/api/files/single`;
    //   const formData = new FormData();
    //   formData.append('file', data.avatar);

    //   const fileBody = {
    //     method: REQUEST_METHOD.POST,
    //     data: formData,
    //   };
    //   const fileResponse = yield call(fileRequest, uploadFileUrl, fileBody);
    //   if (fileResponse.status === 200) {
    //     data.businessOp.avatar = fileResponse.data.url;
    //   }
    // }
    const url = `${yield API_BUSINESS_OPPORTUNITIES()}`;
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data.businessOp),
    };
    const response = yield call(request, url, body);
    if (response.success) {
      ToastCustom({ text: 'Cập nhật CHKD thành công', type: 'success' });
      yield put(actions.createBusinessOpportunitySuccess(response));
    } else {
      ToastCustom({ text: response.message || 'Thêm mới CHKD thất bại', type: 'danger' });
      yield put(actions.createBusinessOpportunityFailure(response));
    }
  } catch (err) {
    ToastCustom({ text: 'Thêm mới CHKD thất bại', type: 'danger' });
    yield put(actions.createBusinessOpportunityFailure(err));
  }
}

export function* updateBusinessOp(action) {
  const { data } = action;

  try {
    const businessOpUrl = `${yield API_BUSINESS_OPPORTUNITIES()}/${data.businessOp._id}`;
    const businessOp = yield call(request, businessOpUrl, {
      method: REQUEST_METHOD.GET,
    });
    // if (data.avatar) {
    //   const uploadFileUrl = `${UPLOAD_URL}/api/files/single`;
    //   const formData = new FormData();
    //   formData.append('file', data.avatar);
    //   const fileBody = {
    //     method: REQUEST_METHOD.POST,
    //     data: formData,
    //   };
    //   const fileResponse = yield call(fileRequest, uploadFileUrl, fileBody);
    //   if (fileResponse.status === 200) {
    //     data.businessOp.avatar = fileResponse.data.url;
    //   }
    // }
    const url = `${yield API_BUSINESS_OPPORTUNITIES()}/${data.businessOp._id}`;
    const body = {
      method: REQUEST_METHOD.PUT,
      body: JSON.stringify(data.businessOp),
    };
    const updateResponse = yield call(request, url, body);
    if (updateResponse.success) {
      const profile = yield getProfile();
      const employee = {
        employeeId: profile._id,
        name: profile.name,
      };
      const kanbanData = yield select(makeSelectKanbanData());
      const newLog = {
        content: getLogString(businessOp, data.businessOp, 'ST01', null, kanbanData),
        employee,
        model: 'BusinessOpportunities',
        type: 'update',
        objectId: data.businessOp._id,
      };
      const logBody = {
        method: REQUEST_METHOD.POST,
        body: JSON.stringify(newLog),
      };

      yield call(request, `${yield API_LOGS()}`, logBody);
      ToastCustom({ text: 'Cập nhật CHKD thành công', type: 'success' });
      yield put(actions.updateBusinessOpportunitySuccess(updateResponse));
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật CHKD thất bại', type: 'success' });
    yield put(actions.updateBusinessOpportunityFailure(err));
  }
}

export function* createCustomer(action) {
  const { data } = action;
  try {
    const url = `${yield API_CUSTOMER()}`;
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };
    const response = yield call(request, url, body);
    if (response.status === 1) {
      yield put(actions.createCustomerSuccess(response.data));
      ToastCustom({ text: 'Thêm mới khách hàng thành công', type: 'success' });
    } else if (response.status === 0) {
      yield put(actions.createCustomerFailure(response));
    }
  } catch (err) {
    yield put(actions.createCustomerFailure(err));
  }
}

export function* fetchBusinessOpportunityLogs(action) {
  const { query } = action;

  try {
    const url = `${yield API_LOGS()}?${serialize(query)}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getBusinessOpportunityLogsSuccess(response.data));
  } catch (err) {
    yield put(actions.getBusinessOpportunityLogsFailure(err));
  }
}

export function* createLog(action) {
  const { data } = action;
  try {
    const url = `${yield API_LOGS()}`;
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };

    const response = yield call(request, url, body);
    yield put(actions.createLogSuccess(response));
  } catch (err) {
    yield put(actions.createLogFailure(err));
  }
}



export function* createSalleLog(action) {
  const { data } = action;
  try {
    const url = `${yield API_SALES_QUOTATION()}`;
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };

    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.salleLogSuccess(response));
      ToastCustom({ text: 'Thêm mới thành công', type: 'success' });
    }
    else {
      ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' });
      yield put(actions.salleLogFailure(err));
    }
  } catch (err) {
  }

}






export function* getStockSaga(action) {
  try {
    const { productType, productGroup } = action.data;
    const filter = serialize({
      filter: {
        productType,
        productGroup,
      },
    });

    const url = `${yield API_INVENTORY()}?${filter}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    const res = yield call(request, url, body);

    if (res) {
      yield put(actions.getStockSuccess(res));
    } else {
      yield put(actions.getStockFailure(res));
    }
  } catch (error) {
    yield put(actions.getStockFailure(error));
  }
}


// Individual exports for testing
export default function* businessOpDetailPageSaga() {
  yield takeLatest(constants.GET_BUSINESS_OPPORTUNITY, fetchBusinessOp);
  yield takeLatest(constants.CREATE_BUSINESS_OPPORTUNITY, createBusinessOp);
  yield takeLatest(constants.UPDATE_BUSINESS_OPPORTUNITY, updateBusinessOp);
  yield takeLatest(constants.CREATE_CUSTOMER, createCustomer);
  yield takeLatest(constants.CREATE_LOG, createLog);
  yield takeLatest(constants.GET_STOCK, getStockSaga);
  yield takeLatest(constants.GET_BUSINESS_OPPORTUNITY_LOGS, fetchBusinessOpportunityLogs);
  yield takeLatest(constants.SALLE_LOG, createSalleLog);

}
