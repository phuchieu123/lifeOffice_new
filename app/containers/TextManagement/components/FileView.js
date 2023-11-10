import React, { useEffect, useState, memo } from 'react';
import { DeviceEventEmitter, FlatList, Platform, ScrollView } from 'react-native';
import { Body, Icon, Left, ListItem, Right, Text, View, ActionSheet } from 'native-base';
import { downloadFile, getFile } from '../../../api/fileSystem';
import { navigate } from '../../../RootNavigation';
import moment from 'moment';
import { API_FILE, UPLOAD_FILE } from '../../../configs/Paths';
import { TouchableOpacity } from 'react-native';
import { makeSelectClientId } from '../../../containers/App/selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DATE_FORMAT } from '../../../utils/constants';
import ToastCustom from '../../../components/ToastCustom';
import { serialize } from '../../../utils/common';
import request from "../../../utils/request";

const FileView = (props) => {
  const { visible, id, code, clientId, navigation } = props;
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(0)
  useEffect(() => {
    code && id && getData();
  }, [id, code]);

  const handleReload = () => setReload(reload + 1)
  useEffect(() => {
    getData()
  }, [data])

  const getData = async () => {
    const res = await getFile('company', {
      clientId,
      code,
      id,
    });
    setData(res.filter((e) => e.isFile));
  };

  useEffect(() => {
    const addEvent = DeviceEventEmitter.addListener('handleAddFile', (e) => {
      handleReload();
    });
    return () => {
      addEvent.remove();
    };
  }, []);

  const download = async (item) => {
    try {
      const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`;
      const title = item.name;

      downloadFile(uri, title);
    } catch (error) { }
  };

  const toWatch = async (item) => {
    const DOCS = ['.pdf', '.mp4', '.docx', '.xlsx', '.txt', '.xls', '.doc'];
    const IMGS = ['.jpg', '.png', '.jpeg', '.PNG'];
    try {
      if (DOCS.includes(item.type)) {
        const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`;
        console.log('🚀 ~ toWatch ~ uri', uri);
        const title = item.name;
        navigate('PDFViewer', {
          uri: uri,
          title: title,
        });
        // ToastCustom({ text: <View>
        //     <Text style={{fontWeight: 'bold'}}>Không có bản xem trước</Text>
        //     <Text>Vui lòng tải về để mở file!</Text>
        // </View>, type: 'warning' })
      }
      if (IMGS.includes(item.type)) {
        const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`;
        const title = item.name;
        navigate('ViewScreenImg', {
          uri: uri,
          title: title,
        });
      }
    } catch (error) { }
  };

  const toSign = async (item) => {
    try {
      const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`;
      (item.type === '.pdf') ?
        navigate('Sign', {
          uri: uri,
        }) : null;
    } catch (error) { }
  };

  const remove = async (item) => {
    try {
      const filter = {
        clientId: clientId,
        code: code,
        id: item._id,
      };
      const newData = {
        id: item._id
      }
      let url = `${await API_FILE()}/company?${serialize(filter)}`;
      const body = {
        method: 'DELETE',
        body: JSON.stringify(newData),
      };
      const response = await request(url, body);
      handleReload()
    } catch (err) { }
    return {};
  };

  return !visible ? null : (
    <ScrollView nestedScrollEnabled={true}>
      {data.map((item) => {
        const { name } = item;
        const OPTIONS = ['Xem', 'Ký', 'Tải xuống', 'Xóa']
        const selectonItemPress = async () => {
          ActionSheet.show(
            {
              options: OPTIONS,
            },
            async (buttonIndex) => {
              switch (buttonIndex) {
                case 0:
                  toWatch(item);
                  break;
                case 1:
                  toSign(item);
                  break;
                case 2:
                  download(item);
                  break;
                case 3:
                  remove(item);
                  break;
              }
            },
          );
        };
        return (
          <ListItem>
            <View style={{ flexDirection: 'row' }}>
              <Text>
                <Text style={{ fontSize: 14, color: '#75a3cc' }}> {name} </Text>
              </Text>
              <Icon onPress={selectonItemPress} name="dots-three-vertical" type="Entypo" />
            </View>
          </ListItem>
        );
      })}
    </ScrollView>
  );
};

const mapStateToProps = createStructuredSelector({
  clientId: makeSelectClientId(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FileView);
