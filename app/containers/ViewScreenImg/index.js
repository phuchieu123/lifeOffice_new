import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Linking, ScrollView, Dimensions, PermissionsAndroid, Platform, } from 'react-native';
import { Container, Icon } from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
// import ButtonDownload from '../../images/ButtonDownload.svg';
import ImageZoom from 'react-native-image-pan-zoom';
import styles from './styles';
import { scale } from 'react-native-size-matters';
import { downloadFile } from '../../api/fileSystem';
const ViewScreenImg = (props) => {
  const { route, navigation } = props;
  const { params } = route;
  const { uri, title } = params;
  const [height, setHeight] = useState(0);
  const width = Dimensions.get('window').width;

  const historyDownload = (url, name) => {
    if (Platform.OS === 'ios') {
      downloadFile(url, name);
    } else {
      try {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage title',
            message: 'storage_permission',
          },
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            downloadFile(url, name);
          } else {
            Alert.alert('storage_permission');

          }
        });
      } catch (err) { }
    }
  }
  useEffect(() => {
    if (uri) {
      Image.getSize(uri, (w, h) => {
        setHeight((h * width) / w);
      });
    }
  }, [uri]);
  return (
    <Container>
      <BackHeader title={title || 'IMG Viewer'} navigation={navigation} />
      <ImageZoom cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={width}
        imageHeight={height}
      >
        <View style={styles.pdf}>
          <Image source={{ uri }} style={{ width, height }} />
        </View>
      </ImageZoom>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // historyDownload(uri, title)
            downloadFile(uri, title);
          }}>
          {/* <ButtonDownload /> */}
          <Icon active type="MaterialCommunityIcons" name="download" style={{ fontSize: 16, transform: [{ scale: scale(3) }], color: '#008000' }} />
        </TouchableOpacity>
      </View>

    </Container>
  );
};
export default ViewScreenImg;