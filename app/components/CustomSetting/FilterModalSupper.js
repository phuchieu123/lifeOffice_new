import { Button, Icon, List, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { launchCamera } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { delete_face, insert, showFaceImage } from '../../api/faceApi';
import { IMAGE_AI } from '../../configs/Paths';
import { makeSelectKanbanTaskConfigs } from '../../containers/App/selectors';
import { getAvatar } from '../../utils/common';
import { requestCamera } from '../../utils/permission';
import AvatarInput from '../CustomInput/AvatarInput';
import LoadingButton from '../LoadingButton';
import { FixToast, ToastCustom } from '../ToastCustom/FixToast';

const FilterModalSupper = (props) => {
    const {
        isVisible,
        onClose,
        localData,
        navigation,
        onSave
    } = props;

    const [insertingFace, setInsertingFace] = useState()
    const [avatar, setAvatar] = useState()
    const [asset, setAsset] = useState()
    const ava = (avatar && avatar.uri) || (asset && asset.uri)
    const [uri, setUri] = useState(getAvatar(ava, localData.gender))

    const pickupImage = async () => {
        const permission = await requestCamera()
        if (permission) {
            setInsertingFace(true)
            launchCamera({ mediaType: 'photo', includeBase64: true }, async (e) => {
                const { didCancel, assets } = e

                try {
                    if (!didCancel) {
                        const result = await insert(assets[0], localData._id)
                        if (result.status) {
                            ToastCustom({ text: result.msg, type: 'success' })
                            setAsset(assets[0])
                            setUri({ uri: assets[0].uri })
                        }
                        else {
                            ToastCustom({ text: result.msg, type: 'danger' })
                            // ToastCustom({ text: _.get(result, 'msg', 'Cập nhật thất bại'), type: 'danger' })
                        }
                    }
                } catch (err) { }
                setInsertingFace(false)
            })

        }

    }

    const deleteImage = async () => {
        setInsertingFace(true)
        const result = await delete_face(localData._id)
        if (result) {
            setUri(10)
            ToastCustom({ text: 'Xoá thành công', type: 'success' })
        } else {
            ToastCustom({ text: 'Xóa thất bại', type: 'danger' })
        }
        setInsertingFace(false)
    }

    useEffect(() => {
        faceImage()
    }, [])

    const faceImage = async () => {
        const imageAI = await IMAGE_AI()
        setInsertingFace(true)
        const result = await showFaceImage(localData._id)
        result['path_image'] ? setUri({ uri: `${imageAI}/${result['path_image']}` }) : null
        // if (result) {
        //     ToastCustom({ text: 'Xoá thành công', type: 'success' })
        // } else {
        //     ToastCustom({ text: 'Xóa thất bại', type: 'danger' })
        // }
        setInsertingFace(false)
    }

    return (
        <Modal isVisible={isVisible} style={{ height: 'auto' }}>
            <FixToast ref={c => { if (c) FixToast.toastInstance = c; }} />

            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
                <AvatarInput source={uri} type='detail' loading={insertingFace} />
                <List>
                    <View>
                        <View padder style={{ flexDirection: 'row', marginTop: 10 }}>
                            <LoadingButton isBusy={insertingFace} block onPress={() => pickupImage()} full style={{ flex: 1, borderRadius: 10, marginRight: 5, backgroundColor: '#009900' }} warning>
                                <Text>
                                    Thêm ảnh nhận diện
                                </Text>
                            </LoadingButton>
                        </View>
                        <View padder style={{ flexDirection: 'row' }}>
                            <LoadingButton isBusy={insertingFace} block onPress={deleteImage} full style={{ flex: 1, borderRadius: 10, marginRight: 5, backgroundColor: '#CC0000' }} warning>
                                <Text>
                                    Xóa ảnh nhận diện
                                </Text>
                            </LoadingButton>
                        </View>
                    </View>

                </List>
                <View padder style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>

                    <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5, }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>

        </Modal >

    );
};

const mapStateToProps = createStructuredSelector({
    kanbanTaskConfigs: makeSelectKanbanTaskConfigs()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(FilterModalSupper);
