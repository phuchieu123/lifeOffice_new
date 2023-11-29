import React, { useEffect, memo, useState, useRef, useCallback } from 'react';
import { Dimensions, ActivityIndicator, Text, View, TouchableOpacity, CameraRoll, Image } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import styles from './styles';
import { requestCamera, requestLocation } from '../../utils/permission';
import BackHeader from '../../components/Header/BackHeader';
import { Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconS from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getData } from '../../utils/storage';
import _ from 'lodash';
import ProfileModalPopup from './ProfileModalPopup';
import RenderFace from './RenderFace';
import { IN, OUT } from './constants';
import { reconize } from '../../api/faceApi';
import { onFaceCheckIn, saveCheckInFail } from '../../api/timekeeping';
import ToastCustom from '../../components/ToastCustom';
import { makeSelectProfile } from '../App/selectors';
import { getByIdHrm } from '../../api/hrmEmployee';
import { uploadImage } from '../../api/fileSystem';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Positions } from 'react-native-calendars/src/expandableCalendar';

const CheckTheFace = (props) => {
  const { navigation, profile } = props;
  // const [type, setType] = useState(Camera.Constants.Type.front);
  const [faces, setFaces] = useState([]);
  const [hasPermission, setHasPermission] = useState();
  const [visible, setVisible] = useState();
  const [employeeData, setEmployeeData] = useState({});
  const [ratio, setRatio] = useState();
  const [cameraStyle, setCameraStyle] = useState();
  const [typeCamera, setTypeCamera] =useState(true);
  const [checkin, setCheckin] = useState(IN);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const cameraRef = useRef(null);
  const [imageSource, setImageSource] =useState('')
  const location = useRef({});
  const devices = useCameraDevices();
  const device = (typeCamera ? devices.back : devices.front);




  useEffect(() => {
    (async () => {
      const cameraPermission = await requestCamera();
      const locationPermission = await requestLocation();
      const permission = cameraPermission && locationPermission;
      if (!permission) {
        navigation.goBack();
        return;
      }
      setHasPermission(permission);
    })();
  }, []);

  useEffect(() => {
        let clientLocation;
        if (hasPermission) {
          const _getLocationAsync = async () => {
            clientLocation = await Geolocation.getCurrentPosition(
              position=>{
                  const {latitude, longitude}= position.coords;
                  location.current = {latitude, longitude}
                  console.log(latitude, longitude, location.current, 'sssssssss');
              }
              // { accuracy: Geolocation.Accuracy.Highest, timeInterval: 5000, distanceInterval: 0 },
              // (loc) => (location.current = loc),
            );
          };
          _getLocationAsync();
        }
        return () => {
          if (clientLocation) clientLocation.remove();
        };
      }, [hasPermission]);

  const toggleCheckin = useCallback(() => setCheckin((e) => (e === IN ? OUT : IN)), []);

  const checkInOut = () => {
    setTypeCamera(!typeCamera)
  };

  const onFacesDetected = useCallback((e) => {
    setFaces(e.faces);
  }, []);
  console.log(111111)
  const takePicture = async () => {

    console.log(111111)
    if (!location.current || takingPhoto) return;
    let result = {}
    console.log(location.current);
    const {  latitude, longitude  } = location.current;
    console.log(111111)

    const data = {
            type: checkin,
            long: longitude,
            lat: latitude,
            isHrm: true
          };
      
  
  //   const photo = await cameraRef.current.takePhoto({
  //     qualityPrioritization: 'speed',
  // flash: 'off',
  // enableShutterSound: false
  //   })

    // const file = await cameraRef.current.takePhoto()  
    // setImageSource(file.path)
    // setTakingPhoto(!takingPhoto)  
    // console.log(file.path,'sssssssssssaaaaaa');
    //   await CameraRoll.save(`file://${file.path}`, {
    //    type: 'photo',
    // })
    console.log(111111)

    try {
      const faceImage = await cameraRef.current.takePhoto({
        base64: true, quality: 1
      });
  
      console.log(faceImage.path,'sssss');
       setImageSource(faceImage.path)
       setTakingPhoto(!takingPhoto);
      cameraRef.current.stopRecording();
      data.link = await uploadImage(faceImage.path, 'TimeKeeping');
      result = await reconize(faceImage.path);
      if (result.success) {
        data.employeeId = result.person_id;
        const employee = await getByIdHrm(result.person_id)
        if (employee._id === profile.hrmEmployeeId) {
          const tkResult = await onFaceCheckIn(data);
          console.log(tkResult, "tkResult");
          if (_.get(tkResult, 'data.data[0]')) {
            setEmployeeData({ ...employee, ...data, msg: 'Nhận diện thành công' });
            setTimeout(() => {
              setVisible(result.status)
              console.log(result.status);
            }, 500);
          } else {
            data.message = _.get(tkResult, 'message', 'Chấm công thất bại');
            result.success = false
          }
        } else {
          ToastCustom({ text: 'Thông tin nhân sự không hợp lệ', type: 'danger' });
          result.success = false
        }
      } else data.message = result.msg
    } catch (error) {
      console.log(error, "minherror");
      data.message = 'Chấm công thất bại ssssss';
      result.success = false
    }
    if (!result.success) onCheckInFail(data);
    cameraRef.current.startRecording();
    setTakingPhoto(false);
  };

  const onCheckInFail = async (data) => {
    const result = await saveCheckInFail({
      hrmEmployeeId: profile.hrmEmployeeId,
      data,
    });
    console.log(result && result.data && result.data.data && result.data.data.message, "ooo");
    ToastCustom({ text: result && result.data && result.data.data && result.data.data.message, type: 'danger' });
  };

  const onCameraReady = async () => {
    const deviceHeight = Dimensions.get('screen').height;
    const deviceWidth = Dimensions.get('screen').width;
    let height = 0,
      newRatio;
    const ratios = await cameraRef.current.getSupportedRatiosAsync();
    ratios.forEach((r) => {
      const [w, h] = r.split(':');
      const newHeight = (deviceWidth * Number(w)) / Number(h);
      if (newHeight > height) {
        height = newHeight;
        newRatio = r;
      }
    });
    const cs = {
      width: deviceWidth,
      height,
    };
    setCameraStyle(cs);
    setRatio(newRatio);
  };
  return (
    <>
      <BackHeader title="Chấm công" navigation={navigation} />
      {!takingPhoto ? (
        <View>
          {device === device ? (
            <Icon
              type="MaterialIcons"
              name="camera-rear"
              style={{
                position: 'absolute',
                color: '#fff',
                fontSize: 40,
                right: 20,
                top: 20,
                zIndex: 2,
              }}
              onPress={checkInOut}
            />
          ) : (
            <Icon
              type="MaterialIcons"
              name="camera-front"
              style={{
                position: 'absolute',
                color: '#fff',
                fontSize: 40,
                right: 20,
                top: 20,
                zIndex: 2,
              }}
              onPress={checkInOut}
            />
          )}
         {device ?  <Camera
            onCameraReady={onCameraReady}
            ratio={ratio}
            ref={cameraRef}
            // type={type}
            device={device}
            isActive={true}
            photo={true}
            style={cameraStyle || styles.camera}
            onFacesDetected={onFacesDetected}
            faceDetectorSettings={
              {
                // minDetectionInterval: 100,
                // tracking: true, 
              }
            }
          />: null}
          {faces.map((face, index) => {
            return <RenderFace key={`face_${index}`} face={face} />;
          })}
        </View>
      ):(  <>
          {imageSource !== '' ? (
            <Image
              style={{ flex: 1}}
              source={{
                uri: `file://'${imageSource}`,
              }}
            />
          ) : null}

          <View style={{position: 'absolute',
              top: 50,
              left: 10,}}>
            <TouchableOpacity
              style={{ 
                backgroundColor: '#000',
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#fff',
                width: 100,
              }}
              onPress={()=> setTakingPhoto(true)}>
                <Text style={{color: '#FFF'}}>Back</Text>
              </TouchableOpacity>
          </View>
        </>) }

      <ProfileModalPopup isVisible={visible} onPress={navigation.goBack} employee={employeeData} />

      <View style={styles.bottomButton}>
        {checkin === IN ? (
          <TouchableOpacity disabled={takingPhoto} style={styles.buttonCheckin}>
            {takingPhoto ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <TouchableOpacity  >
                <TouchableOpacity  style={{justifyContent: 'center'}} onPress={takePicture}>
                <Text style={{  textAlign: 'center', color:'white'  }} >
                  Chấm công vào
                </Text>
                </TouchableOpacity>
              
                <IconS
                  type="MaterialCommunityIcons"
                  name="rotate-3d-variant"
                  style={styles.buttonRound}
                  onPress={toggleCheckin}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled={takingPhoto} style={styles.buttonCheckin} danger>
            {takingPhoto ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <TouchableOpacity >
              <TouchableOpacity  style={{justifyContent: 'center'}} onPress={takePicture}>
                <Text style={{  textAlign: 'center', color:'white'  }} >
                  Chấm công ra
                </Text>
                </TouchableOpacity>
                <IconS
                  type="MaterialCommunityIcons"
                  name="rotate-3d-variant"
                  style={styles.buttonRound}
                  onPress={toggleCheckin}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      </View>
    </>
   
  );
};
const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile()
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(CheckTheFace);


 