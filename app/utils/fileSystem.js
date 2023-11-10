import { ActionSheet } from 'native-base';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from "rn-fetch-blob";
import { requestCamera } from '../utils/permission';
import RNFS from 'react-native-fs';
import { requestWriteExternalStorage } from "../utils/permission";

const pickupImage = async (onSave) => {
    ActionSheet.show({ options: ['Thư viện', 'Chụp ảnh', 'Đóng'], title: "Cập nhật ảnh", destructiveButtonIndex: 2 },
        async (buttonIndex) => {
            try {
                switch (buttonIndex) {
                    case 0:
                        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (e) => {
                            const { didCancel, assets } = e
                            if (!didCancel && assets) { onSave(assets[0]) }
                        })
                        break;
                    case 1:
                        const permission = await requestCamera()
                        if (permission) {
                            launchCamera({ mediaType: 'photo', includeBase64: true }, (e) => {
                                const { didCancel, assets } = e
                                if (!didCancel && assets) { onSave(assets[0]) }
                            })
                        }
                        break;
                }
            } catch (error) { }
        },
    )
};

const picupkFile = async (type = [DocumentPicker.types.allFiles]) => {
    return DocumentPicker.pick({ type })
}

const uriToBase64 = async (uri) => {
    if (uri.includes('http')) {
        return await RNFetchBlob
            .config({ fileCache: true })
            .fetch("GET", uri)       // the file is now downloaded at local storage
            .then(async resp => await resp.readFile("base64"))
    }
    else return await RNFS.readFile(uri, 'base64')
}

const downloadBase64 = async base64 => {
    await requestWriteExternalStorage()
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.DCIMDir + "/image.png";
    RNFetchBlob.fs.writeFile(path, base64, 'base64')
}

const downloadFile = async (url, name) => {
    try {
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: PictureDir + '/Download_' + name,
                description: 'Risk Report Download',
            },
        };
        config(options)
            .fetch('GET', url)
            .then((res) => {
                ToastCustom({ text: 'Tải xuống thành công!' })
            });
    } catch (erro) { console.log(erro) }
}

export {
    pickupImage,
    picupkFile,
    uriToBase64,
    downloadBase64,
    downloadFile,
}