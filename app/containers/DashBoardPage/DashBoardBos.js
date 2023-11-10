import React, { useState, useEffect } from 'react';
import { View,Text, TouchableOpacity} from 'react-native'
import {Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_COUNT_SOURCE, API_REPORT_BOS } from '../../configs/Paths';
import { handleSearch, serialize } from '../../utils/common';
import { BOS_KANBAN_DEFAULT } from '../../utils/constants';
import LoadingLayout from '../../components/LoadingLayout';
import { navigate } from '../../RootNavigation';
import { getCount } from '../../api/bos';


export default DashBoardBos = (props) => {
  const { kanbanBosConfigs: kanbanBos, query, navigation } = props;
  const [reportBos, setReportBos] = useState({});
  const [loading, setLoading] = useState();
  const [kanbanBosConfigs, setKanbanBosConfigs] = useState()
  function split(array, n) {
    let [...arr] = array;
    let res = [];
    while (arr.length) {
      res.push(arr.splice(0, n));
    }
    return res;
  }
  useEffect(() => {
    if (Array.isArray(kanbanBos)) {
      const data = split(kanbanBos, 3)

      if (data.length > 1 && data[data.length - 1].length === 1) {
        data[data.length - 1].push(data[data.length - 2][2])
        data[data.length - 2].pop()
      }

      setKanbanBosConfigs(data)
    }
  }, [kanbanBos]);

  useEffect(() => {
    query && handleGetBos();
  }, [query]);

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        handleGetBos()
      }
    );

  }, []);

  const handleGetBos = async () => {
    const { startDate, endDate, organizationUnitId } = query
    setLoading(true)
    const newQuery = {
      limit: 1,
      skip: 0,
    };
    if (startDate) newQuery.startDate = startDate
    if (endDate) newQuery.endDate = endDate
    if (organizationUnitId) newQuery.organizationUnitId = organizationUnitId

    const res = await getCount(newQuery)
    if (res) {
      setReportBos(res)
    }
    setLoading(false)
  };

  return (
    <>
      <View style={styles.view}>
        {/* Do rounded của button */}
        {/* <Button small rounded block style={{ width: '100%', marginVertical: 2 }} onPress={handleGetBos}>
          <Text style={{ textAlign: 'center' }}>Cơ hội kinh doanh</Text>
          <Icon type='Ionicons' name='reload' style={{ position: 'absolute', right: 0, color: '#fff' }} />
        </Button> */}
        <TouchableOpacity
          small
          
          block
          style={{
            position:'relative',
            width: '100%',
            marginVertical: 2,
            borderRadius: 20,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(46, 149, 46, 1)',
            textAlign:'center'
          }}
          onPress={handleGetBos}>
          <Text
            block
            style={{
              textAlign:'center',
              color: 'white',
              marginBottom: 10,
              marginTop: 10,
              width: '100vw',
            }}>
            Cơ hội kinh doanh
          </Text>
          <Icon
            type="Ionicons"
            name="reload"
            style={{position: 'absolute', right: 10, top:12 , color: '#fff'}}
          />
        </TouchableOpacity>
      </View>
      <LoadingLayout isLoading={loading}>
        {Array.isArray(kanbanBosConfigs) && kanbanBosConfigs.length > 0 && (
          <>
            {kanbanBosConfigs.map((config, index) => {
              return <View style={styles.view} key={`CHKD_${index}`} >
                {config.map((e) => (
                  <CustomButton key={e._id} kanban={e} reportBos={reportBos} />
                ))}
              </View>
            })
            }
          </>
        )}
      </LoadingLayout>
    </>
  );
};

const CustomButton = (props) => {
  const { kanban, reportBos } = props;
  const [text, setText] = useState()
  const handleGotoPage = (params) => {
    navigate('Crm', params);
  };
  useEffect(() => {
    if (reportBos && Array.isArray(reportBos)) {
      const obj = reportBos.find((item) => item.type === kanban.type)

      if (obj && obj.count) {
        setText(obj.count)
      }
    }


  }, [kanban, reportBos])

  return (
    <Button style={styles.button} onPress={() => handleGotoPage({ kanbanId: kanban._id })}>
      <Text style={{ ...styles.textButton, color: kanban.color }}>
        {text || 0}
      </Text>
      <Text style={styles.textNote}>{kanban.name}</Text>
    </Button>
  );
};

const styles = {
  view: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  buttonView: {
    backgroundColor: 'white',
    borderRadius: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 15,
    backgroundColor: 'white',
    margin: 3,
    height: 102,
  },
  textButton: { color: 'black', marginBottom: 10, marginTop: 15, fontSize: 24, fontWeight: 'bold', textAlign:'center' },
  textNote: { color: 'black', marginBottom: 10, fontSize: 8, textAlign: 'center' },

  textNote_2: {
    color: 'black',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    margin: 3,
  },
};
