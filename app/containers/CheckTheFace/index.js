// import React, { useEffect, memo, useState, useRef, useCallback } from 'react';
// import { Dimensions } from 'react-native';
// import { Camera } from 'expo-camera';
// import * as Location from 'expo-location';
// import styles from './styles';
// import { requestCamera, requestLocation } from '../../utils/permission';
// import BackHeader from '../../components/Header/BackHeader';
// import { Icon, Text, View, Button, Spinner } from 'native-base';
// import { createStructuredSelector } from 'reselect';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
// import { getData } from '../../utils/storage';
// import _ from 'lodash';
// import ProfileModalPopup from './ProfileModalPopup';
// import RenderFace from './RenderFace';
// import { IN, OUT } from './constants';
// import { reconize } from '../../api/faceApi';
// import { onFaceCheckIn, saveCheckInFail } from '../../api/timekeeping';
// import ToastCustom from '../../components/ToastCustom';
// import { makeSelectProfile } from '../App/selectors';
// import { getByIdHrm } from '../../api/hrmEmployee';
// import { uploadImage } from '../../api/fileSystem';

// const CheckTheFace = (props) => {
//   const { navigation, profile } = props;

//   const [type, setType] = useState(Camera.Constants.Type.front);
//   const [faces, setFaces] = useState([]);
//   const [hasPermission, setHasPermission] = useState();
//   const [visible, setVisible] = useState();
//   const [employeeData, setEmployeeData] = useState({});
//   const [ratio, setRatio] = useState();
//   const [cameraStyle, setCameraStyle] = useState();
//   const [checkin, setCheckin] = useState(IN);
//   const [takingPhoto, setTakingPhoto] = useState(false);

//   const cameraRef = useRef();
//   const location = useRef({});

//   useEffect(() => {
//     (async () => {
//       const cameraPermission = await requestCamera();
//       const locationPermission = await requestLocation();
//       const permission = cameraPermission && locationPermission;
//       if (!permission) {
//         navigation.goBack();
//         return;
//       }
//       setHasPermission(permission);
//     })();
//   }, []);

//   useEffect(() => {
//     let clientLocation;
//     if (hasPermission) {
//       const _getLocationAsync = async () => {
//         clientLocation = await Location.watchPositionAsync(
//           { accuracy: Location.Accuracy.Highest, timeInterval: 5000, distanceInterval: 0 },
//           (loc) => (location.current = loc),
//         );
//       };
//       _getLocationAsync();
//     }
//     return () => {
//       if (clientLocation) clientLocation.remove();
//     };
//   }, [hasPermission]);

//   const toggleCheckin = useCallback(() => setCheckin((e) => (e === IN ? OUT : IN)), []);

//   const checkInOut = () => {
//     setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
//   };

//   const onFacesDetected = useCallback((e) => {
//     setFaces(e.faces);
//   }, []);

//   const takePicture = async () => {
//     // if (!location.current || takingPhoto) return;

//     let result = {}
//     const { coords: { latitude, longitude } } = location.current;

//     const data = {
//       type: checkin,
//       long: longitude,
//       lat: latitude,
//       isHrm: true
//     };

//     try {
//       setTakingPhoto(true);
//       const faceImage = await cameraRef.current.takePictureAsync({
//         // skipProcessing: true, 
//         base64: true, quality: 1
//       });
//       cameraRef.current.pausePreview();
//       data.link = await uploadImage(faceImage, 'TimeKeeping');
//       result = await reconize(faceImage);
//       if (result.success) {
//         data.employeeId = result.person_id;
//         const employee = await getByIdHrm(result.person_id)
//         if (employee._id === profile.hrmEmployeeId) {
//           const tkResult = await onFaceCheckIn(data);
//           console.log(tkResult, "tkResult");
//           if (_.get(tkResult, 'data.data[0]')) {
//             setEmployeeData({ ...employee, ...data, msg: 'Nhận diện thành công' });
//             setTimeout(() => {
//               setVisible(result.status)
//               console.log(result.status);
//             }, 500);
//           } else {
//             data.message = _.get(tkResult, 'message', 'Chấm công thất bại');
//             result.success = false
//           }
//         } else {
//           ToastCustom({ text: 'Thông tin nhân sự không hợp lệ', type: 'danger' });
//           result.success = false
//         }
//       } else data.message = result.msg
//     } catch (error) {
//       console.log(error, "minherror");
//       data.message = 'Chấm công thất bại';
//       result.success = false
//     }
//     if (!result.success) onCheckInFail(data);
//     cameraRef.current.resumePreview();
//     setTakingPhoto(false);
//   };

//   const onCheckInFail = async (data) => {
//     const result = await saveCheckInFail({
//       hrmEmployeeId: profile.hrmEmployeeId,
//       data,
//     });
//     console.log(result && result.data && result.data.data && result.data.data.message, "ooo");
//     ToastCustom({ text: result && result.data && result.data.data && result.data.data.message, type: 'danger' });
//   };

//   const onCameraReady = async () => {
//     const deviceHeight = Dimensions.get('screen').height;
//     const deviceWidth = Dimensions.get('screen').width;
//     let height = 0,
//       newRatio;
//     const ratios = await cameraRef.current.getSupportedRatiosAsync();
//     ratios.forEach((r) => {
//       const [w, h] = r.split(':');
//       const newHeight = (deviceWidth * Number(w)) / Number(h);
//       if (newHeight > height) {
//         height = newHeight;
//         newRatio = r;
//       }
//     });
//     const cs = {
//       width: deviceWidth,
//       height,
//     };
//     setCameraStyle(cs);
//     setRatio(newRatio);
//   };
//   return (
//     <>
//       <BackHeader title="Chấm công" navigation={navigation} />
//       {hasPermission && (
//         <View>
//           {type === Camera.Constants.Type.back ? (
//             <Icon
//               type="MaterialIcons"
//               name="camera-rear"
//               style={{
//                 position: 'absolute',
//                 color: '#fff',
//                 fontSize: 40,
//                 right: 20,
//                 top: 20,
//                 zIndex: 2,
//               }}
//               onPress={checkInOut}
//             />
//           ) : (
//             <Icon
//               type="MaterialIcons"
//               name="camera-front"
//               style={{
//                 position: 'absolute',
//                 color: '#fff',
//                 fontSize: 40,
//                 right: 20,
//                 top: 20,
//                 zIndex: 2,
//               }}
//               onPress={checkInOut}
//             />
//           )}
//           <Camera
//             onCameraReady={onCameraReady}
//             ratio={ratio}
//             ref={cameraRef}
//             type={type}
//             style={cameraStyle || styles.camera}
//             onFacesDetected={onFacesDetected}
//             faceDetectorSettings={
//               {
//                 // minDetectionInterval: 100,
//                 // tracking: true,
//               }
//             }
//           />
//           {faces.map((face, index) => {
//             return <RenderFace key={`face_${index}`} face={face} />;
//           })}
//         </View>
//       )}

//       <ProfileModalPopup isVisible={visible} onPress={navigation.goBack} employee={employeeData} />

//       <View style={styles.bottomButton}>
//         {checkin === IN ? (
//           <Button disabled={takingPhoto} style={styles.buttonCheckin}>
//             {takingPhoto ? (
//               <Spinner color="#fff" />
//             ) : (
//               <>
//                 <Text style={{ flex: 1, textAlign: 'right' }} onPress={takePicture}>
//                   Chấm công vào
//                 </Text>
//                 <Icon
//                   type="MaterialCommunityIcons"
//                   name="rotate-3d-variant"
//                   style={styles.buttonRound}
//                   onPress={toggleCheckin}
//                 />
//               </>
//             )}
//           </Button>
//         ) : (
//           <Button disabled={takingPhoto} style={styles.buttonCheckin} danger>
//             {takingPhoto ? (
//               <Spinner color="#fff" style={{}} />
//             ) : (
//               <>
//                 <Text style={{ flex: 1, textAlign: 'right' }} onPress={takePicture}>
//                   Chấm công ra
//                 </Text>
//                 <Icon
//                   type="MaterialCommunityIcons"
//                   name="rotate-3d-variant"
//                   style={styles.buttonRound}
//                   onPress={toggleCheckin}
//                 />
//               </>
//             )}
//           </Button>
//         )}
//       </View>
//     </>
//   );
// };
// const mapStateToProps = createStructuredSelector({
//   profile: makeSelectProfile()
// });

// function mapDispatchToProps(dispatch) {
//   return {};
// }

// const withConnect = connect(mapStateToProps, mapDispatchToProps);

// export default compose(withConnect, memo)(CheckTheFace);
