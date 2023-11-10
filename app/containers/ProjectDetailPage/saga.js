import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as constants from './constants';
import request, { fileRequest } from '../../utils/request';
import { UPLOAD_URL, API_TASK, API_TASK_CONFIG, API_DYNAMIC_FORM, UPLOAD_IMG_SINGLE } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize } from '../../utils/common';
import ToastCustom from '../../components/ToastCustom';
import moment from 'moment';
import { uploadImage } from '../../api/fileSystem';

export function* fetchProject(action) {
  const { data } = action;
  try {
    const url = `${yield API_TASK()}/${data._id}`;

    const body = {
      method: 'GET',
    };
    const response = yield call(request, url, body);

    if (response) {
      let projectsResponse = {};
      if (response.projectId) {
        const filter = serialize({ filter: { projectId: response.projectId, status: 1 } });

        projectsResponse = yield call(request, `${yield API_TASK()}?${filter}`, {
          method: 'GET',
        });
      }
      yield put(actions.getProjectSuccess({ data: response, projects: projectsResponse.data }));
    } else {
      yield put(actions.getProjectFailure());
    }
  } catch (err) {
    yield put(actions.getProjectFailure(err));
  }
}

export function* updateProject(action) {
  let { data } = action;
  let { task } = data;

  try {
    if (data.avatar) task.avatar = yield call(uploadImage, data.avatar, 'CV');

    const url = `${yield API_TASK()}/${task._id}`;

    const body = {
      method: REQUEST_METHOD.PUT,
      body: JSON.stringify(task),
    };

    const response = yield call(request, url, body);
    if (response.success) {
      yield put(actions.updateProjectSuccess(response.taskData));
    } else {
      ToastCustom({ text: response.message || 'Cập nhật thất bại', type: 'danger' });
      yield put(actions.updateProjectFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' });
    yield put(actions.updateProjectFailure(err));
  }
}

export function* updateProjectProgress(action) {
  let { data } = action;

  try {
    const url = `${yield API_TASK()}/progress/${data.taskId}`;
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };
    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.updateProjectProgressSuccess(response));
    } else {
      ToastCustom({ text: response.message || 'Cập nhật tiến độ thất bại', type: 'danger' });
      yield put(actions.updateProjectProgressFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật tiến độ thất bại', type: 'danger' });
    yield put(actions.updateProjectFailure(err));
  }
}

export function* updateTransfer(action) {
  let { data } = action;

  try {
    const url = `${yield API_TASK()}/tranfer/${data.id}`;
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };
    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.updateTransferSuccess(response));
    } else {
      yield put(actions.updateTransferFailure());
    }
  } catch (err) {
    yield put(actions.updateTransferFailure(err));
  }
}

export function* uploadFile(action) {
  let { data } = action;

  try {
    const uploadUrl = `${UPLOAD_URL}/api/files/single`;
    const formData = new FormData();
    formData.append('file', data.file);

    const body = {
      method: REQUEST_METHOD.POST,
      data: formData,
    };
    const response = yield call(fileRequest, uploadUrl, body);

    if (response.status === 200) {
      const image = response.data;
      const newFile = {
        name: data.file.name,
        fileName: data.file.name,
        size: data.file.size,
        originFile: data.file.type,
        type: data.file.type,
        taskId: data.id,
        description: '',
        url: image.url,
      };
      const updateFileUrl = `${yield API_TASK()}/file/${data.id}`;

      const newFilebody = {
        method: REQUEST_METHOD.POST,
        body: JSON.stringify(newFile),
      };
      const newFileresponse = yield call(request, updateFileUrl, newFilebody);
      yield put(actions.uploadFileSuccess(newFileresponse));
    } else {
      yield put(actions.uploadFileFailure());
    }
  } catch (err) {
    yield put(actions.uploadFileFailure(err));
  }
}

export function* fetchProjectTransfer(action) {
  const { data } = action;
  try {
    const url = `${yield API_TASK()}/tranfer/${data.projectId}?filter%5Btype%5D=${data.index}`;
    const body = {
      method: 'GET',
    };

    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.getProjectTransferSuccess(response));
    } else {
      yield put(actions.getProjectTransferFailure());
    }
  } catch (err) {
    yield put(actions.getProjectTransferFailure(err));
  }
}

export function* fetchProjectFiles(action) {
  const { data } = action;
  try {
    const url = `${yield API_TASK()}/file/${data.projectId}`;
    const body = {
      method: 'GET',
    };
    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.getProjectFilesSuccess(response));
    } else {
      yield put(actions.getProjectFilesFailure());
    }
  } catch (err) {
    yield put(actions.getProjectFilesFailure(err));
  }
}

function* fetchTemplate() {
  try {
    let configs;
    const data = yield call(request, yield API_TASK_CONFIG(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const templates = yield call(request, yield API_DYNAMIC_FORM(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (data) {
      configs = data.find((item) => item.code === 'TASKTYPE').data;
    }

    const templatesItem = templates ? templates.filter((elm) => elm.moduleCode === 'Task') : [];

    yield put(actions.getTemplateSuccess({ configs, templatesItem }));
  } catch (err) {
    yield put(actions.getTemplateFailure(err));
  }
}

export default function* projectDetailPageSaga() {
  yield takeLatest(constants.UPDATE_PROJECT, updateProject);
  yield takeLatest(constants.UPDATE_PROJECT_PROGRESS, updateProjectProgress);
  yield takeLatest(constants.UPLOAD_FILE, uploadFile);
  yield takeLatest(constants.UPDATE_TRANSFER, updateTransfer);
  yield takeLatest(constants.GET_PROJECT, fetchProject);
  yield takeLatest(constants.GET_PROJECT_FILES, fetchProjectFiles);
  yield takeLatest(constants.GET_PROJECT_TRANSFER, fetchProjectTransfer);
  yield takeLatest(constants.GET_TEMPLATE, fetchTemplate);
}
