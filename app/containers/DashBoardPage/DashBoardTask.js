import React, {useState, useEffect} from 'react';
import { View,Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingLayout from '../../components/LoadingLayout';
import {navigate} from '../../RootNavigation';
import {getCoutTask} from '../../api/tasks';

function split(array, n) {
  let [...arr] = array;
  let res = [];
  while (arr.length) {
    res.push(arr.splice(0, n));
  }
  return res;
}

export default DashBoardTask = props => {
  const {kanbanTaskConfigs, query, navigation} = props;
  const [reportTask, setReportTask] = useState({});
  const [loading, setLoading] = useState();
  const [configs, setConfigs] = useState([]);
  useEffect(() => {
    query && handleGetTask();
  }, [query]);

  useEffect(() => {
    if (Array.isArray(kanbanTaskConfigs)) {
      const data = split(kanbanTaskConfigs, 3);

      if (data.length > 1 && data[data.length - 1].length === 1) {
        data[data.length - 1].push(data[data.length - 2][2]);
        data[data.length - 2].pop();
      }

      setConfigs(data);
    }
  }, [kanbanTaskConfigs]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      handleGetTask();
    });
  }, []);

  const handleGetTask = async () => {
    setLoading(true);
    const {startDate, endDate, organizationUnitId, employeeId} = query;
    const newQuery = {};
    if (startDate) newQuery.startDate = startDate;
    if (endDate) newQuery.endDate = endDate;
    if (organizationUnitId) newQuery.org = organizationUnitId;
    if (employeeId) newQuery.inCharge = employeeId;
    const res = await getCoutTask(newQuery);
    if (res) {
      setReportTask(res);
    }
    setLoading(false);
  };

  return (
    <>
      <View style={styles.view}>
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
          }}
          onPress={handleGetTask}>
          <Text
            block
            style={{
              textAlign:'center',
              color: 'white',
              marginBottom: 10,
              marginTop: 10,
              width: '100vw  ',
            }}>
            Công việc
          </Text>
          <Icon
            type="Ionicons"
            name="reload"
            style={{position: 'absolute', right: 10, top:12 , color: '#fff'}}
          />
        </TouchableOpacity>
      </View>
      <LoadingLayout isLoading={loading}>
        {configs.map((config, index) => {
          return (
            <View style={styles.view} key={`CHKD_${index}`}>
              {config.map(e => (
                <CustomButton key={e._id} kanban={e} reportTask={reportTask} />
              ))}
            </View>
          );
        })}
      </LoadingLayout>
    </>
  );
};

const CustomButton = props => {
  const {kanban, reportTask} = props;
  const [text, setText] = useState(0);
  useEffect(() => {
    if (reportTask && Array.isArray(reportTask.data)) {
      const obj = reportTask.data.find(item => item.type === kanban.type);

      if (obj && obj.count) {
        setText(obj.count);
      }
    }
  }, [kanban, reportTask]);

  const handleGotoPage = params => {
    navigate('Project', params);
  };
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleGotoPage({kanbanStatus: kanban.type})}>
      <Text style={{...styles.textButton, color: kanban.color}}>
        {text || 0}
      </Text>
      <Text style={styles.textNote}>{kanban.name}</Text>
    </TouchableOpacity>
  );
};
const styles = {
  view: {
    flex: 1,
    flexDirection: 'row',
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
    height: 'auto',
    borderRadius: 15,
    backgroundColor: 'white',
    margin: 3,
    height: 100,
    paddingHorizontal: 5,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  textButton: {
    color: 'black',
    marginBottom: 10,
    marginTop: 10,
    paddingTop: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textNote: {
    color: 'black',
    marginBottom: 10,
    fontSize: 10,
    textAlign: 'center',
  },

  textNote_2: {
    color: 'black',
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    margin: 3,
  },
};
