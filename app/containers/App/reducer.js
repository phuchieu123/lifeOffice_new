import { produce } from 'immer';
import * as constants from './constants';
import { cleanAuth } from '../../utils/authen';
import _ from 'lodash';
import { formatOrgs, formatRoles } from '../../utils/common';

// The initial state of the App
export const initialState = {
  hasApprove: true,
  hasDriver: true,
};

const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.MERGE_CONFIG:
        draft = mergeConfig({ draft, ...action.data })
        break;
      case constants.MERGE_DATA:
        Object.keys(action.data).forEach(key => {
          draft[key] = action.data[key]
        })
        break;
    }
  });

export default appReducer;

const mergeConfig = ({ draft, name, val }) => {
  switch (name) {
    // case 'getApproveToken':
    //   draft.hasApprove = val !== 'noApproveToken';
    //   break
    // case 'getDriverToken':
    //   draft.hasDriver = val !== 'noDriverToken';
    //   break
    case 'getUrlConfig':
      draft.appInfo = val;
      break;
    case 'getViewConfig':
      {
        const arr = Array.isArray(val) && val.map(item => {
          const result = { code: item.code }
          const editDisplay = _.get(item, 'editDisplay.type.fields.type.columns')
          if (editDisplay) result.editDisplay = _.keyBy(editDisplay, 'name')

          const listDisplay = _.get(item, 'listDisplay.type.fields.type.columns')
          if (listDisplay) result.listDisplay = _.keyBy(listDisplay, 'name')
          
          return result
        })
        draft.viewConfig = _.keyBy(arr, 'code');
      }
      break;
    case 'getTaskConfigs':
      {
        let arr = Array.isArray(val) && (val.find((e) => e.code === 'KANBAN') || {}).data;
        arr = !Array.isArray(arr) ? [] : arr
          .sort((a, b) => Number(a.index) - Number(b.index))
          .sort((a, b) => Number(a.code) - Number(b.code))
        draft.kanbanTaskConfigs = arr
      }
      break;
    case 'getCrmSource':
      {
        const result = {}
        Array.isArray(val) && val.forEach(item => result[item.code] = item.data)
        draft.crmSourceCode = result
      }
      break;
    case 'getHrmSource':
      {
        const result = {}
        Array.isArray(val) && val.forEach(item => result[item.code] = item.data)
        draft.hrmSourceCode = result
      }
      break;
    case 'getCrmStatus':
      {
        let arr = Array.isArray(val) && (val.find((e) => e.code === 'ST01') || {}).data;
        arr = !Array.isArray(arr) ? [] : arr
          .sort((a, b) => Number(a.index) - Number(b.index))
          .sort((a, b) => Number(a.code) - Number(b.code))
        draft.kanbanBosConfigs = arr
        draft.kanbanData = val;
      }
      break;
    case 'getProfile':
      draft.profile = val;
      break;
    case 'getDepartments':
      const output = [];
      formatOrgs(val, output, 0);
      draft.departments = val
      draft.departmentsLevel = output
      break;
    case 'getRoles':
      draft.userRoles = val && formatRoles(val.roles)
      break;
    case 'createSocket':
      draft.socket = val
      break;


  }
  return draft
}
