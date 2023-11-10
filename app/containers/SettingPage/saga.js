import { takeLatest, call, put } from 'redux-saga/effects';
import * as actions from './actions';
import * as constants from './constants';
import request, { authenRequest } from '../../utils/request';
import { API_PROFILE, UPLOAD_IMG_SINGLE } from '../../configs/Paths';
import ToastCustom from '../../components/ToastCustom';
import { getJwtToken } from '../../utils/authen';
import { storeData } from '../../utils/storage';
import moment from 'moment';
import { uploadImage } from '../../api/fileSystem';

export function* updateAvatar(action) {
  const { avatar } = action;
  try {
    // get profile
    const profileUrl = `${yield API_PROFILE()}`;

    const jwt = yield getJwtToken();
    const profileBody = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt.token}`,
      },
    };
    const profileResponse = yield call(authenRequest, profileUrl, profileBody);
    const upload = yield call(uploadImage, avatar, 'AVATAR')
    // update profile
    const bodySend = {
      address: profileResponse.address,
      avatar: upload,
      dob: profileResponse.dob,
      email: profileResponse.email,
      gender: profileResponse.gender,
      name: profileResponse.name,
      phoneNumber: profileResponse.phoneNumber,
    };

    const body = {
      method: 'PATCH',
      body: JSON.stringify(bodySend),
    }

    const res = yield call(request, profileUrl, body);

    if (res.success) {
      storeData('profile', JSON.stringify(res.data));
      yield put(actions.updateAvatarSuccess());
    } else {
      ToastCustom({ text: 'Cập nhật thất bại', type: 'warning' });
      yield put(actions.updateAvatarFailed());
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật thất bại', type: 'warning' });
    yield put(actions.updateAvatarFailed(err));
  }
}


export default function* settingPageSaga() {
  yield takeLatest(constants.UPDATE_AVATAR, updateAvatar);
}
