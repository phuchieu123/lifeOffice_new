// import { manipulateAsync } from "expo-image-manipulator";
import _ from 'lodash';
import moment from 'moment';
import { PermissionsAndroid, Platform } from 'react-native';
import images from '../images';
import { REQUEST_METHOD } from './constants';
import request, { requestApprove } from './request';
// import { mediaDevices } from 'react-native-webrtc';

export function parseUrl(url, query) {
  if (url == null) {
    return '';
  }
  let filter = {};
  if (query == null || query.filter == null) {
    filter = serialize({});
  } else {
    filter = serialize(query.filter);
  }

  const skip = query == null || query.skip == null ? 0 : query.skip;
  const limit = query == null || query.limit == null ? 10 : query.limit;
  if (query != null && query.sort != null) {
    return `${url}?filter=${filter}&skip=${skip}&limit=${limit}&sort=${JSON.stringify(query.sort)}`;
  }
  return `${url}?${filter}&skip=${skip}&limit=${limit}`;
}

export function serialize(obj, prefix) {
  const str = [];
  let p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p;
      const v = obj[p];
      str.push(
        v !== null && typeof v === 'object' ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
      );
    }
  }

  return str.join('&');
}

export const checkAndRequestPermission = (permissionName) => {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS[permissionName])
        .then((res) => {
          if (!res) {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS[permissionName]).then((result) => {
              if (result === PermissionsAndroid.RESULTS.GRANTED) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          } else {
            resolve(true);
          }
        })
        .catch((err) => { });
    } else {
      resolve(true);
    }
  });
};

export function getTreeFromFlatData({
  flatData,
  getKey = (node) => node.id,
  getParentKey = (node) => node.parentId,
  rootKey = '0',
}) {
  if (!flatData) {
    return [];
  }

  const childrenToParents = {};
  flatData.forEach((child) => {
    const parentKey = getParentKey(child);
    if (parentKey in childrenToParents) {
      childrenToParents[parentKey].push(child);
    } else {
      childrenToParents[parentKey] = [child];
    }
  });

  if (!(rootKey in childrenToParents)) {
    return [];
  }

  const trav = (parent) => {
    const parentKey = getKey(parent);
    if (parentKey in childrenToParents) {
      return {
        ...parent,
        children: childrenToParents[parentKey].map((child) => trav(child)),
      };
    }

    return { ...parent };
  };

  return childrenToParents[rootKey].map((child) => trav(child));
}

export function getFlatDataFromTree({ treeData, getNodeKey, ignoreCollapsed = true }) {
  if (!treeData || treeData.length < 1) {
    return [];
  }

  const flattened = [];
  walk({
    treeData,
    getNodeKey,
    ignoreCollapsed,
    callback: (nodeInfo) => {
      flattened.push(nodeInfo);
    },
  });

  return flattened;
}

export function walk({ treeData, getNodeKey, callback, ignoreCollapsed = true }) {
  if (!treeData || treeData.length < 1) {
    return;
  }

  walkDescendants({
    callback,
    getNodeKey,
    ignoreCollapsed,
    isPseudoRoot: true,
    node: { children: treeData },
    currentIndex: -1,
    path: [],
    lowerSiblingCounts: [],
  });
}

function walkDescendants({
  callback,
  getNodeKey,
  ignoreCollapsed,
  isPseudoRoot = false,
  node,
  parentNode = null,
  currentIndex,
  path = [],
  lowerSiblingCounts = [],
}) {
  // The pseudo-root is not considered in the path
  const selfPath = isPseudoRoot ? [] : [...path, getNodeKey({ node, treeIndex: currentIndex })];
  const selfInfo = isPseudoRoot
    ? null
    : {
      node,
      parentNode,
      path: selfPath,
      lowerSiblingCounts,
      treeIndex: currentIndex,
    };

  if (!isPseudoRoot) {
    const callbackResult = callback(selfInfo);

    // Cut walk short if the callback returned false
    if (callbackResult === false) {
      return false;
    }
  }

  // Return self on nodes with no children or hidden children
  if (!node.children || (node.expanded !== true && ignoreCollapsed && !isPseudoRoot)) {
    return currentIndex;
  }

  // Get all descendants
  let childIndex = currentIndex;
  const childCount = node.children.length;
  if (typeof node.children !== 'function') {
    for (let i = 0; i < childCount; i += 1) {
      childIndex = walkDescendants({
        callback,
        getNodeKey,
        ignoreCollapsed,
        node: node.children[i],
        parentNode: isPseudoRoot ? null : node,
        currentIndex: childIndex + 1,
        lowerSiblingCounts: [...lowerSiblingCounts, childCount - i - 1],
        path: selfPath,
      });

      // Cut walk short if the callback returned false
      if (childIndex === false) {
        return false;
      }
    }
  }

  return childIndex;
}

export const parseTreeMapData = (flat) => {
  // Create root for top-level node(s)
  const root = [];
  // Cache found parent index
  const map = {};

  flat.forEach((node) => {
    // No parentId means top level
    if (!node.parentId) {
      return root.push(node);
    }

    // Insert node as child of parent in flat array
    let parentIndex = map[node.parentId];
    if (typeof parentIndex !== 'number') {
      parentIndex = flat.findIndex((el) => el._id === node.parentId);
      map[node.parentId] = parentIndex;
    }

    if (!flat[parentIndex].children) {
      return (flat[parentIndex].children = [node]);
    }

    flat[parentIndex].children.push(node);
  });
  return root;
};

export function getLogString(oldData, newData, code, kanban, listCrmStatus) {
  const contentArr = [];
  if (String(oldData.name) !== String(newData.name)) {
    contentArr.push({ old: oldData.name, new: newData.name });
  }
  if (
    oldData.customer &&
    newData.customer &&
    String(oldData.customer.customerId) !== String(newData.customer.customerId)
  ) {
    contentArr.push({ old: oldData.customer.name, new: newData.customer.name });
  }
  if (oldData.value && newData.value && Number(oldData.value.amount) !== Number(newData.value.amount)) {
    contentArr.push({
      old: `${formatNumber(oldData.value.amount)} ${oldData.value.currencyUnit}`,
      new: `${formatNumber(newData.value.amount)} ${newData.value.currencyUnit}`,
    });
  }
  if (
    oldData.responsibilityPerson &&
    newData.responsibilityPerson &&
    String(oldData.responsibilityPerson.employeeId) !== String(newData.responsibilityPerson.employeeId)
  ) {
    contentArr.push({ old: oldData.responsibilityPerson.name, new: newData.responsibilityPerson.name });
  }
  if (
    oldData.supervisor &&
    newData.supervisor &&
    String(oldData.supervisor.employeeId) !== String(newData.supervisor.employeeId)
  ) {
    contentArr.push({ old: oldData.supervisor.name, new: newData.supervisor.name });
  }
  if (String(oldData.kanbanStatus) !== String(newData.kanbanStatus)) {

    const currentCrmStatus = listCrmStatus[listCrmStatus.findIndex((d) => String(d.code) === String(code))];
    const laneStart = [];
    const laneAdd = [];
    const laneSucces = [];
    const laneFail = [];
    currentCrmStatus.data.forEach((item) => {
      switch (item.code) {
        case 1:
          laneStart.push(item);
          break;
        case 2:
          laneAdd.push(item);
          break;

        case 3:
          laneSucces.push(item);
          break;

        case 4:
          laneFail.push(item);
          break;

        default:
          break;
      }
    });
    const sortedKanbanStatus = [...laneStart, ...laneAdd.sort((a, b) => a.index - b.index), ...laneSucces, ...laneFail];
    let old = '';
    let newKan = '';
    let oldKanban = '';

    if (kanban) {
      oldKanban = sortedKanbanStatus.find((x) => String(x.type) === String(oldData.kanbanStatus));
    } else {
      oldKanban = sortedKanbanStatus.find((x) => String(x._id) === String(oldData.kanbanStatus));
    }

    if (oldKanban) {
      old = oldKanban.name;
    } else {
      old = 'Trạng thái kanban đã xóa';
    }
    let newKanban;
    if (kanban) {
      newKanban = sortedKanbanStatus.find((x) => String(x.type) === String(newData.kanbanStatus));
    } else {
      newKanban = sortedKanbanStatus.find((x) => String(x._id) === String(newData.kanbanStatus));
    }
    if (newKanban) {
      newKan = newKanban.name;
    } else {
      newKan = 'Trạng thái kanban đã xóa';
    }
    contentArr.push({ old, new: newKan });
  }
  const content = `<div><span style="font-size: 14px;">${code === 'ST01'
    ? 'Cập nhật cơ hội kinh doanh'
    : code === 'ST03'
      ? 'Cập nhật trao đổi thỏa thuận'
      : 'Cập nhật công văn'
    }</span><ul style="margin-top: 8px">${contentArr.map((item) => {
      const str = `<li><b>${item.old}</b> thành <b>${item.new}</b></li>`;
      return str;
    })}</ul></div>`;
  return content;
}

export function formatNumber(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formartDate(date, formatType) {
  return moment(date).format(formatType);
}

export const handleSearch = async (url, setState, rest = {}) => {
  const { includeContentType, getResponse } = rest

  const body = {
    method: REQUEST_METHOD.GET,
  }

  await request(url, body, !includeContentType)
    .then((responseJson) => {
      getResponse && getResponse(responseJson)
      if (responseJson.data) {
        setState(responseJson.data);
      } else if (responseJson) {
        setState(responseJson);
      } else {
        setState([]);
      }
    })
    .catch((err) => {
      console.log('handleSearch', err)
      setState([]);
    });
};

export const handleSearchAprove = async (url, setState, getRes) => {
  await requestApprove(url, {
    method: REQUEST_METHOD.GET,
  })
    .then((responseJson) => {
      getRes && getRes(responseJson)
      if (responseJson.data) {
        setState(responseJson.data);
      } else if (responseJson) {
        setState(responseJson);
      } else {
        setState([]);
      }
    })
    .catch((e) => {
      setState([]);
    });
};

export const getYearList = () => {
  let data = [];
  for (let i = moment().year(); i > 2009; i--) {
    data.push(`${i}`);
  }
  return data;
};

export const getUri = (uri) => {
  return `${uri}?allowDefault=true`
}

export const getAvatar = (avatar, gender) => {
  let uri = avatar
  let defaultAvatar = images.defaultAvatar || images.userWhite || images.userImage || images.user
  // // if (convertGender(gender) === 2) defaultAvatar = images.userFemaleWhite
  return uri ? { uri: getUri(uri) } : defaultAvatar
}

export function convertGender(gender) {
  if (gender === 'female' || gender === 'f') return 2
  if (gender === 'male' || gender === 'm') return 1
  return 0;
}

export function convertGenderToText(gender) {
  if (gender === 'female' || gender === 'f') return 'Nữ'
  if (gender === 'male' || gender === 'm') return 'Nam'
  return '';
}

const padStart = (n, str) => {
  let newStr = str;
  for (let i = 0; i < n; i += 1) {
    newStr = '    ' + newStr;
  }
  return newStr;
};

export const formatOrgs = (orgs, output, level) => {
  if (!Array.isArray(orgs)) return []
  orgs.forEach((o) => {
    output.push({
      _id: o._id,
      name: padStart(level, o.name),
      path: o.path,
      parent: o.parent,
      topParent: (orgs.find(e => e._id === o.parent) || {}).topParent || o._id,
      hasChild: (Array.isArray(o.child) && o.child.length) ? true : false,
      level,
    });
    if (o.child && o.child.length) {
      formatOrgs(o.child, output, level + 1);
    }
  });
};

export const mergeArray = (a, b, key) => _.values(_.merge(_.keyBy(a, key), _.keyBy(b, key)));

export const formatDisplayKey = (arr, keys) => {
  const name = keys.join();

  return arr.map((item) => ({
    ...item,
    [name]: keys
      .map((key) => _.get(item, key))
      .filter((e) => e)
      .join(' - '),
  }));
};

export const getFilterOr = (query, text, arr) => {
  const newQuery = { ...query || {} }

  if (!_.has(newQuery, 'filter')) newQuery.filter = {}
  delete newQuery.filter.$or
  if (text && Array.isArray(arr) && arr.length) {
    newQuery.filter.$or = arr.map(code => ({
      [code]: {
        $regex: text.trim(),
        $options: 'gi',
      }
    }))
  }

  return newQuery
}

export const createNewMessage = (msg) => {
  return {
    _id: msg.id,
    employee: [
      {
        _id: msg.userId,
        avatar: msg.avatar,
        name: msg.name,
      },
    ],
    join: msg.join,
    message: {
      conversation: msg.content,
      user: msg.userId,
    },
    name: msg.name,
    type: msg.type,
    updatedAt: moment(),
  }
}

export const getListById = (item, arr) => {
  let id = []
  if (item.length) {
    const child = arr.filter(e => item[0]._id === e.parent)
    id = [...id, ...child.map(e => e._id)]

    const sameParent = arr.filter(e => item[0].parent === e.parent)
    id = [...id, ...sameParent.map(e => e._id)]

    const getParent = (currentId) => {
      const found = arr.find(e => e._id === currentId)
      if (found) {
        const parent = arr.filter(e => e.parent === found.parent)
        return [...parent.map(e => e._id), ...getParent(found.parent)]
      }
      return []
    }

    id = [...id, ...getParent(item[0].parent)]
  }
  return id
}

export const formatRoles = (roles) => {
  let result = {}
  try {
    roles.forEach(role => {
      const { codeModleFunction, methods } = role
      result[codeModleFunction] = {}
      methods.map(method => {
        result[codeModleFunction][method.name] = method.allow
      })
    })
  } catch (error) { }
  return result
}

export const checkedRequireForm = (configs, data, updateList = []) => {
  if (!configs) return {}

  let firstMessage
  const errorList = {}
  let isValid

  Object.keys(configs).map(key => {
    const config = configs[key]
    if (config.checkedShowForm && config.checkedRequireForm && (!updateList || key in updateList)) {
      let valid = true
      const value = _.get(data, key)
      if (!value) valid = false
      else if (Array.isArray(value) && !value.length) valid = false
      if (!valid) {
        const msg = `Không được để trống ${config.title}`
        firstMessage = firstMessage || msg
        errorList[key] = true
      }
    }
  })

  isValid = !Object.keys(errorList).length ? true : false
  return { isValid, errorList, firstMessage }
}

export function removeVietnameseTones(str) {
  if (!str || typeof str !== 'string') return str;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  return str;
}


export const resizeImg = async (photo) => {
  // const { uri } = photo
  // const manipResult = await manipulateAsync(
  //   uri,
  //   [{
  //     resize: {
  //       height: 900,
  //       width: 1200,
  //     }
  //   }],
  //   {},
  // );
  // return manipResult;
};

export const getFaceImage = async (photo, data) => {
  const positive = e => { return e > 0 ? e : 1 }

  const { uri } = photo
  const { bounds } = data;
  const { origin, size } = bounds;

  const startHeight = origin.y - 100
  const lenghtHeight = size.height + 200

  const startWidth = origin.x - 100
  const lenghtWidth = size.width + 200

  const height = startHeight + lenghtHeight > 800 ? 800 - startHeight : lenghtHeight
  const width = startWidth + lenghtWidth > 1200 ? 1200 - startWidth : lenghtWidth

  // const manipResult = await manipulateAsync(
  //   uri,
  //   [{
  //     crop: {
  //       height,
  //       width,
  //       originY: positive(startHeight),
  //       originX: positive(startWidth),
  //     }
  //   }],
  //   { base64: true },
  // );
  return manipResult;
};

// export const getStream = async (isFront) => {
//   try {
//     let videoSourceId;

//     const sourceInfos = await mediaDevices.enumerateDevices()
//     for (let i = 0; i < sourceInfos.length; i++) {
//       const sourceInfo = sourceInfos[i];
//       if (
//         sourceInfo.kind == 'videoinput' &&
//         sourceInfo.facing == (isFront ? 'front' : 'environment')
//       ) {
//         videoSourceId = sourceInfo.deviceId;
//       }
//     }

//     const stream = await mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: {
//           mandatory: {
//             minWidth: 500, // Provide your own width, height and frame rate here
//             minHeight: 300,
//             minFrameRate: 30,
//           },
//           facingMode: isFront ? 'user' : 'environment',
//           optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
//         },
//       })

//     return stream
//   } catch (error) { }
// }

export const convertLabel = (string) => {
  return string && (string.charAt().toUpperCase() + string.slice(1).toLowerCase()) || '';
}

export const handleShowNotice = () => {
  ToastCustom({ text: 'Bạn Chưa Có Quyền Truy Cập', type: 'danger' });
};


//convert money
export const currencyFormat = (num) => {
  return num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'VND'
}

export const randomRgb = () => {
  const red = Math.floor((Math.random() * 256));
  const green = Math.floor((Math.random() * 256));
  const blue = Math.floor((Math.random() * 256));

  return `rgb(${red}, ${green}, ${blue})`;
};