import { API_FILE, CLIENT_ID, UPLOAD_IMG_SINGLE, API_DRIVER_SHARE, UPLOAD_FILE } from "../configs/Paths";
import { removeVietnameseTones, serialize } from "../utils/common";
import { FOLDER, REQUEST_METHOD } from "../utils/constants";
import request, { checkStatus, fet } from "../utils/request";
import ToastCustom from "../components/ToastCustom";
import { getProfile } from "../utils/authen";
import moment from "moment";
import { getData } from "../utils/storage";
import RNFetchBlob from 'rn-fetch-blob';
import { requestWriteExternalStorage } from "../utils/permission";
import { Platform } from "react-native";
import _ from 'lodash'

const createFile = (file, preName = 'file') => {
    const { uri, name } = file
    const names = name ? name.split('.') : uri.split('/').pop().split('.')
    const filename = `${preName}_${moment().unix()}${names[0]}.${names[1]}`
    const type = ['jpg'].includes(names[1]) ? `image/${names[1]}` : `${file.type}`
    return { name: filename, filename, type, data: uri, uri }
}

const uploadImage = async (img, preName = 'KH') => {
    const formData = new FormData();
    formData.append('file', (_.has(img, 'name') && _.has(img, 'filename')) ? img : createFile(img, preName));

    let url = `${await UPLOAD_IMG_SINGLE()}`;
    const uploadBody = {
        method: 'POST',
        body: typeof formData === 'string' ? img : formData,
    }

    const upload = await fet(url, uploadBody);

    if (typeof callback === 'function') return callback({ response: upload, url: upload.url, file })
    return upload.url;
}

const getFile = async (folder, query) => {
    try {
        let url = `${await API_FILE()}/${folder}?${serialize(query)}`;
        const body = {
            method: REQUEST_METHOD.GET,
        };
        const response = await request(url, body);
        return response
    } catch { }
    return null
}

const addFile = async ({ folder, path, file, code, mid, fname, childTaskId }) => {
    try {
        const profile = await getProfile()
        const clientId = await CLIENT_ID()

        let fullPath = `${clientId}/${folder}${path}`
        if (folder === FOLDER.USERS) fullPath = `${clientId}/${folder}/${profile.username}${path}`

        let parentPath = fullPath.split('/')
        parentPath.pop()
        parentPath.pop()
        parentPath = parentPath.join('/') + '/'

        const newData = {
            data: {
                filterPath: '',
                updatedAt: moment().toISOString(),
                createdAt: moment().toISOString(),
                fullPath,
                name: folder,
                parentPath,
                isFile: false,
                clientId,
                status: 1,
                isApprove: false,
                public: 0,
                permissions: [],
                users: [],
            },
        }

        const name = removeVietnameseTones(file.name)
        const newFile = {
            ...file,
            name,
            fileName: name,
        }
        const form = new FormData();
        form.append('uploadFiles', newFile);
        form.append('path', path);
        form.append('action', 'save');
        form.append('data', JSON.stringify(newData.data));

        let url = `${await API_FILE()}/${folder}/Upload?clientId=${clientId}`;
        if (code) url += `&code=${code}`
        if (mid) url += `&mid=${mid}`
        if (fname) url += `&fname=${fname}`
        if (childTaskId) url += `&childTaskId=${childTaskId}`
        const token = await getData('token_03')
        const head = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            body: form,
        };

        const res = await fetch(url, head);
        return res
    } catch (err) { }
}

const addFolder = async ({ folder, path, name }) => {
    const profile = await getProfile()
    const clientId = await CLIENT_ID()
    try {
        let fullPath = `${clientId}/${folder}${path}`
        if (folder === FOLDER.USERS) fullPath = `${clientId}/${folder}/${profile.username}${path}`

        let parentPath = fullPath.split('/')
        parentPath.pop()
        parentPath.pop()
        parentPath = parentPath.join('/') + '/'

        const newData = {
            action: "create",
            data: [{
                canEdit: true,
                dateCreated: moment().toISOString(),
                nameRoot: "",
                clientId,
                createdAt: moment().toISOString(),
                filterPath: '',
                fullPath,
                isApprove: false,
                isFile: false,
                name: name,
                code: folder,
                parentPath,
                permissions: [],
                public: 0,
                status: 1,
                updatedAt: moment().toISOString(),
                users: [],
                username: profile.username,
                _id: profile._id
            }],
            name,
            path
        }
        const newBody = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(newData),
        };

        const url = `${await API_FILE()}/${folder}?${serialize({ clientId })}`
        const response = await request(url, newBody);
        if (response.files) return response
    } catch (err) { }
}

const downloadFile = async (url, name = 'download') => {
    console.log("startDownload", url);
    const download = async () => {
        try {
            const { config, fs } = RNFetchBlob;
            let DownloadDir = fs.dirs.DownloadDir;
            let options = {
                fileCache: true,
                addAndroidDownloads: {
                    mediaScannable: true,
                    mime: 'image/*',
                    useDownloadManager: true,
                    notification: true,
                    path: DownloadDir + '/Download/' + name,
                    description: 'Risk Report Download',
                },
            };
            config(options).fetch('GET', url).then((res) => {
                console.log(res, "downloadResponse");
                if (Platform.OS === "ios") {
                    RNFetchBlob.ios.openDocument(res.data);
                }
                ToastCustom({ text: 'Tải xuống thành công', type: 'success' })
            });
        } catch (err) {
            console.log(err, "dowload error");
        }
    }

    if (Platform.OS === 'ios') download()
    else {
        const granted = await requestWriteExternalStorage()
        if (granted) download();
    }
}

const shareFile = async (id, data) => {
    try {
        let url = `${await API_DRIVER_SHARE()}/${id}`;
        const body = {
            method: REQUEST_METHOD.PUT,
            body: JSON.stringify(
                data
            )
        };
        const response = await request(url, body);
        // console.log('~ response', response)
        return response
    } catch { }
    return false
}

const rename = async (data, newName) => {
    try {
        const { name, parentPath } = data
        const clientId = await CLIENT_ID()
        let url = `${await UPLOAD_FILE()}?${serialize({ clientId })}`;

        const newData = {
            action: "rename",
            data: [data],
            name,
            newName,
            path: parentPath
        }

        const body = {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(newData)
        };
        const response = await request(url, body);
        if (response.files) return response
    } catch (err) { }
}

export {
    createFile,
    uploadImage,
    addFolder,
    addFile,
    rename,
    getFile,
    downloadFile,
    shareFile,
}