// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { ActionSheet, Icon, Item, Text, View, Alert, Container, Button } from 'native-base';
// import { connect } from 'react-redux';
// import { createStructuredSelector } from 'reselect';
// import { MODULE, REQUEST_METHOD } from '../../utils/constants';
// import Permissions from 'react-native-permissions';

// import {
//     makeSelectUserRole,
// } from '../App/selectors';

// import { Image } from 'react-native-svg';
// import BackHeader from '../../components/Header/BackHeader';
// // import PdfScanner from '@woonivers/react-native-document-scanner';
// import { ImageBackground, StyleSheet, TouchableOpacity, } from 'react-native';
// import _ from 'lodash';
// import styles from './styles';
// import { addFile } from '../../api/fileSystem';
// import ToastCustom from '../../components/ToastCustom';
// // import CustomCrop from "react-native-perspective-image-cropper";

// export function ScannerPage(props) {
//     const { navigation } = props
//     const [data, setData] = useState()
//     const [allowed, setAllowed] = useState(false)
//     const [code, setCode] = useState()

//     const pdfScannerElement = useRef(null)
//     const [reload, setReload] = useState(0)
//     const [localData, setLocalData] = useState({})
//     const [localDataCrop, setLocalDataCrop] = useState({})
//     const [hendalPress, setHendalPress] = useState()
//     const handleReload = () => setReload(reload + 1)

//     useEffect(() => {
//         if (data && data !== 'undefined') {
//             console.log('datalog', data)

//             setLocalData({
//                 imageWidth: data.width,
//                 imageHeight: data.height,
//                 initialImage: data.initialImage,
//                 rectangleCoordinates: {
//                     topLeft: { x: 10, y: 10 },
//                     topRight: { x: 10, y: 10 },
//                     bottomRight: { x: 10, y: 10 },
//                     bottomLeft: { x: 10, y: 10 }
//                 }
//             });
//         }
//     }, [data])

//     const defaultBody = {
//         method: REQUEST_METHOD.POST,
//         body: {
//             action: "read",
//             data: [],
//             path: "/",
//             showHiddenItems: false,
//         },
//     }
//     const [body, setBody] = useState(defaultBody)

//     useEffect(() => {
//         async function requestCamera() {
//             const result = await Permissions.request(Platform.OS === "android" ? "android.permission.CAMERA" : "ios.permission.CAMERA")
//             if (result === "granted") setAllowed(true)
//         }
//         requestCamera()
//     }, [])

//     const handleAdd = async () => {
//         try {
//             await addFile({ folder: 'company', clientId: '20_CRM', path: body.body.path, file: { uri: data.croppedImage, name: code, type: 'image/jpeg' }, name: 'Image', fileName: 'Image' })
//             handleReload()
//             navigation.goBack();
//             ToastCustom({ text: 'Tải file thành công', type: 'success' })
//         } catch (err) {
//             console.log('err', err)
//             ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
//         }

//     }

//     const updateImage = (image, newCoordinates) => {
//         setLocalDataCrop({
//             image,
//             rectangleCoordinates: newCoordinates
//         });
//     }

//     const crop = () => {
//         ref.current.crop()
//     }

//     const handleOnPress = () => {
//         pdfScannerElement.current.capture()
//     }

//     if (!allowed) {
//         return (<View style={styless.permissions}>
//             <Text>Cần cấp quyền cho máy ảnh</Text>
//         </View>)
//     }

//     if (_.get(data, 'croppedImage')) {
//         return (
//             <>
// <BackHeader title='Quay Lại' navigation={navigation} />
//                 <CustomCrop
//                     updateImage={updateImage.bind(updateImage)}
//                     rectangleCoordinates={localData.rectangleCoordinates}
//                     initialImage={data && localData.initialImage ? localData.initialImage : null}
//                     height={data && localData.imageHeight ? localData.imageHeight : null}
//                     width={data && localData.imageWidth ? localData.imageWidth : null}
//                     ref={crop}
//                     overlayColor="rgba(18,190,210, 1)"
//                     overlayStrokeColor="rgba(20,190,210, 1)"
//                     handlerColor="rgba(20,150,160, 1)"
//                     enablePanStrict={false}
//                 />
//                 <View style={styles.bottomButton}>
//                     <Button onPress={handleAdd} style={styles.buttonCheckin} >
//                         <>
//                             <Text style={{ flex: 1, textAlign: 'right' }} >Uploading File</Text>
//                             <Icon type="MaterialCommunityIcons" name="rotate-3d-variant" style={styles.buttonRound} />
//                         </>
//                     </Button>
//                 </View>
//             </>
//         )
//     }

//     return (

//         <Container>
//             <BackHeader title='Quét tài liệu'
//                 navigation={navigation} />
//             {/* <React.Fragment>
//                 <PdfScanner
//                     ref={pdfScannerElement}
//                     style={styless.scanner}
//                     onPictureTaken={setData}
//                     overlayColor="rgba(255,130,0, 0.7)"
//                     enableTorch={false}
//                     quality={0.5}
//                     detectionCountBeforeCapture={10}
//                     detectionRefreshRateInMS={100}
//                 /> 
//                 <TouchableOpacity onPress={handleOnPress} style={styless.button}>
//                     <Text style={styless.buttonText}>Chụp ảnh</Text>
//                 </TouchableOpacity>
//             </React.Fragment> */}

//         </Container>
//     )

// }

// export default connect(
//     createStructuredSelector({
//         filemanagerRole: makeSelectUserRole(MODULE.FILEMANAGER),
//     }),
// )(ScannerPage);
// const styless = StyleSheet.create({
//     scanner: {
//         flex: 1,
//         aspectRatio: undefined
//     },
//     button: {
//         alignSelf: "center",
//         position: "absolute",
//         bottom: 32,
//     },
//     buttonText: {
//         backgroundColor: "rgba(245, 252, 255, 0.7)",
//         fontSize: 32,
//     },
//     preview: {
//         flex: 1,
//         height: '100%',
//         width: "100%",
//         resizeMode: "contain",


//     },
//     permissions: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center"
//     }
// })


import React, { useRef, useState, useEffect } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from "react-native"
import Permissions from 'react-native-permissions';
// import PDFScanner from "@woonivers/react-native-document-scanner"
import { Container, Icon } from "native-base";
import BackHeader from "../../components/Header/BackHeader";

export default function ScannerPage(props) {
    const { navigation } = props;
    const pdfScannerElement = useRef(null)
    const [data, setData] = useState({})
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
        async function requestCamera() {
            const result = await Permissions.request(Platform.OS === "android" ? "android.permission.CAMERA" : "ios.permission.CAMERA")
            if (result === "granted") setAllowed(true)
        }
        requestCamera()
    }, [])

    function handleOnPressRetry() {
        setData({})
    }
    function handleOnPress() {
        pdfScannerElement.current.capture()
    }
    if (!allowed) {
        return (<View style={styles.permissions}>
            <Text>Cần cấp quyền cho máy ảnh</Text>
        </View>)
    }
    if (data.croppedImage) {
        console.log("data", data)
        return (
            <React.Fragment>
                <BackHeader
                    title='Quay lại'
                    navigation={navigation}
                    rightHeader={
                        <Icon name="check" type="Feather" style={{ fontSize: 26, color: '#fff'}} onPress={() => {console.log(data), navigation.goBack()}} />
                    } />
                <Image source={{ uri: data.croppedImage }} style={styles.preview} />
                <TouchableOpacity onPress={handleOnPressRetry} style={styles.button}>
                    <Icon name="x-circle" type="Feather" style={{ fontSize: 50, color: '#fff' }} />
                </TouchableOpacity>
            </React.Fragment>
        )
    }
    return (
        <Container>
            <BackHeader title='Quét tài liệu' navigation={navigation} />
            <React.Fragment>
                {/* <PDFScanner
                    ref={pdfScannerElement}
                    style={styles.scanner}
                    onPictureTaken={setData}
                    overlayColor="rgba(255,130,0, 0.7)"
                    enableTorch={false}
                    quality={0.5}
                    detectionCountBeforeCapture={5}
                    detectionRefreshRateInMS={50}
                /> */}
                <TouchableOpacity onPress={handleOnPress} style={styles.button}>
                    <Icon name="circle" type="FontAwesome" style={{ fontSize: 70, color: '#fff' }} />
                </TouchableOpacity>
            </React.Fragment>
        </Container>

    )
}

const styles = StyleSheet.create({
    scanner: {
        flex: 1,
        aspectRatio: undefined
    },
    button: {
        alignSelf: "center",
        position: "absolute",
        bottom: 32,
    },
    buttonText: {
        backgroundColor: "rgba(245, 252, 255, 0.7)",
        fontSize: 32,
    },
    preview: {
        flex: 1,
        width: "100%",
        resizeMode: "cover",
    },
    permissions: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})