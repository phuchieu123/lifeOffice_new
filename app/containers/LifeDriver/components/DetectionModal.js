import Search from '../../../components/CustomMultiSelect/Search';
import { FixToast, ToastCustom } from '../../../components/ToastCustom/FixToast';
import { Body, Button, Icon, List, ListItem, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { uriToBase64 } from '../../../utils/fileSystem';
import { detection } from '../../../api/detection';
import ImageInput from '../../../components/CustomInput/ImageInput';
import CustomeList from '../../../components/ListPage/List';
import LoadingButton from '../../../components/LoadingButton';
import { API_FILE } from '../../../configs/Paths';
import { DETECTION_OPTIONS } from '../../../utils/detection';

const DetectionModal = (props) => {
    const {
        item,
        isVisible,
        onClose, onSave,
    } = props;

    const [image, setImage] = useState();
    const [showResult, setShowResult] = useState();
    const [detectionData, setDetectionData] = useState();
    const [selectedType, setSelectedType] = useState([DETECTION_OPTIONS[0].name]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            if (item) {
                const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
                setImage({ uri })
            }
        })()
    }, [item])

    useEffect(()=>{
        setLoading(false)
    },[isVisible])

    const onTextExtraction = async (type) => {
        if (image.base64) {
            const result = await detection(type, image.base64)
            setDetectionData(result)
        } else if (image.uri) {
            const base64 = await uriToBase64(image.uri)
            const result = await detection(type, base64)
            setDetectionData(result)
        }
    }

    const handleSave = async () => {
        if (selectedType.length === 0) {
            ToastCustom({ text: 'Bạn chưa chọn loại trích xuất', type: 'warning' });
            setLoading(false)
            return
        }
        await onTextExtraction(selectedType[0])
        setShowResult(true)
        setLoading(false)
    };


    return (
        <Modal isVisible={isVisible} style={{ height: 'auto' }}>
            <FixToast ref={c => { if (c) FixToast.toastInstance = c; }} />
            <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                <List>

                    <ListItem itemHeader itemDivider style={{ borderRadius: 10 }}>
                        <Text>Loại</Text>
                    </ListItem>
                    <ListItem>
                        <Search
                            single
                            items={DETECTION_OPTIONS}
                            selectedItems={selectedType}
                            handleSelectItems={setSelectedType}
                            uniqueKey='name'
                            displayKey='title'
                            buttonStyles={{ height: 'auto' }}
                        />
                    </ListItem>
                    <ListItem style={{ height: 220 }}>
                        <ImageInput source={image} onSave={setImage} />
                    </ListItem>
                    {showResult &&
                        <>
                            <ListItem itemHeader itemDivider>
                                <Text>Kết quả</Text>
                            </ListItem>
                            <CustomeList
                                isLoading={loading}
                                style={{ height: 220, flex: null }}
                                uniqueKey='key'
                                data={detectionData}
                                itemComponent={({ item }) => {
                                    const [a = '', b = ''] = item.name.split('/')
                                    const title = a.trim()
                                    const note = b.trim()

                                    return <ListItem>
                                        <View style={{ flexDirection: 'column' }}>
                                            <Text>{title}:</Text>
                                            <Text note>{note}</Text>
                                        </View>
                                        <Body>
                                            <Text style={{ textAlign: 'right' }}>{item.value}</Text>
                                        </Body>
                                    </ListItem>
                                }}
                            />
                        </>
                    }
                </List>
                <View padder style={{ flexDirection: 'row' }}>
                    <LoadingButton block handlePress={handleSave} isBusy={loading} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                        <Icon name="check" type="Feather" />
                    </LoadingButton>
                    <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>

        </Modal >
    );
};

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DetectionModal);
