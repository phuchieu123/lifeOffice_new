import React from 'react';
import { View, TouchableOpacity, Linking, PermissionsAndroid, Platform, } from 'react-native';
import { Container, Icon } from 'native-base';
// import Pdf from 'react-native-pdf';
import BackHeader from '../../components/Header/BackHeader';
import styles from './styles';
import { scale } from 'react-native-size-matters';
import { downloadFile } from '../../api/fileSystem';
export default PDFViewer = (props) => {
  const { route, navigation } = props;
  const { params } = route;
  const { uri, title } = params;

  return (
    <Container>
      <BackHeader title={title || 'PDF Viewer'} navigation={navigation} />
      <View style={styles.container}>
        {/* <Pdf
          scale={0.9}
          source={{ uri }}
          onLoadComplete={(numberOfPages, filePath) => { }}
          onPageChanged={(page, numberOfPages) => { }}
          onError={(error) => { }}
          onPressLink={(uri) => { }}
          style={styles.pdf}
        /> */}
      </View>

      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => downloadFile(uri, title)}>
          <Icon active type="MaterialCommunityIcons" name="download" style={{ fontSize: 16, transform: [{ scale: scale(3) }], color: '#008000' }} />
        </TouchableOpacity>
      </View>

    </Container>
  );
};
