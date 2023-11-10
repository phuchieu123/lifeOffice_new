import React, { memo, useRef } from 'react';
import { StyleSheet, View, Button, SafeAreaView, Dimensions } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import CustomHeader from '../../../components/Header';
import { addFile } from '../../../api/fileSystem';
import { API_FILE_SIGN, CLIENT_ID } from '../../../configs/Paths';
import { getData } from '../../../utils/storage';

function Sign(props) {
  const { navigation, route } = props;
  const ref = useRef();
  const { params } = route;
  const { uri, id } = params;

  const handleOK = async (signature) => {
    try {
      // console.log(signature);
      // onOK(signature);
      const clientId = await CLIENT_ID();
      const signBase64 = String(signature).replace('data:image/png;base64,', 'data:application/pdf;base64,');
      //   const sign = dataURLtoFile(signBase64, 'sign.pdf');
      //   const fileObject = {
      //     fileCopyUri: '',
      //     name: sign.name,
      //     size: sign.size,
      //     type: sign.type,
      //     uri: 'HADO/company/OutGoingDocument/432654 /duthao/H05_SRS_Tài liệu đặc tả yêu cầu_V0.5.pdf',
      //   };
      //   console.log(fileObject, 'fileObject');
      //   const upload = await addFile({ folder: 'company', clientId, path: '/', file: fileObject });
      //   console.log(upload, 'upload');
      let url = `${await API_FILE_SIGN()}`;
      const token = await getData('token_03');
      const head = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileId: id,
          fileData: signBase64,
        }),
      };

      console.log(signBase64);

      const res = await fetch(url, head);
      if (res.status === 200) navigation.goBack();
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  //Usage example:
  // var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=','hello.txt');
  // console.log(file);

  const handleConfirm = () => {
    const signature = ref.current.readSignature();
  };

  const imgWidth = Dimensions.get('screen').width;
  const imgHeight = Dimensions.get('screen').height - 100;

  const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: imgHeight,
      width: imgWidth,
      padding: 10,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
  });

  return (
    <>
      <CustomHeader navigation={navigation} title={'Ký văn bản'} />
      <SafeAreaView style={styles.container}>
        <SignatureScreen
          ref={ref}
          bgSrc={uri}
          bgWidth={imgWidth}
          bgHeight={imgHeight}
          webStyle={style}
          onOK={handleOK}
        />
        <View style={styles.row}>
          <Button title="Hoàn tác" onPress={handleClear} />
          <Button title="Xác nhận" onPress={handleConfirm} />
        </View>
      </SafeAreaView>
    </>
  );
}

export default memo(Sign);
