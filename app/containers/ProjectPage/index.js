import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectProjectPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import moment from 'moment';
import { Header,} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as actions from './actions';
import ProjectCard from './components/ProjectCard';
import TextSearch from './components/TextSearch';
import ListPage from '../../components/ListPage';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import FabLayout from '../../components/CustomFab/FabLayout';
import { API_TASK, API_TASK_PROJECT } from '../../configs/Paths';
import { getFilterOr } from '../../utils/common'
import _ from 'lodash';
import SearchBox from '../../components/SearchBox';
import { makeSelectUserRole } from '../App/selectors';
import { MODULE } from '../../utils/constants';
import { DeviceEventEmitter,View } from 'react-native';
import { updateTask } from '../../api/tasks';
import { autoLogout } from '../../utils/autoLogout';

const DATE_FORMAT = 'YYYY-MM-DD';

export function ProjectPage(props) {
  useInjectReducer({ key: 'projectPage', reducer });
  useInjectSaga({ key: 'projectPage', saga });
  const DEFAULT_QUERY = {
    limit: 15,
    skip: 0,
    sort: '-createdAt',
    filter: {
      // startDate: {
      //   $gte: `${moment().startOf('month').toISOString()}`,
      //   $lte: `${moment().endOf('day').toISOString()}`,
      // },
    },

  };

  const { navigation, route, taskRole } = props;
  const { params } = route

  const [isSeaching, setIsSearching] = useState(false);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const updateEvent = DeviceEventEmitter.addListener("updateProjectSuccess", (e) => {
      handleReload()
    })

    const addEvent = DeviceEventEmitter.addListener("addProjectSuccess", (e) => {
      handleReload()
    })

    return () => {
      updateEvent.remove()
      addEvent.remove()
    };
  }, []);

  useEffect(() => {
    if (params) {
      if (_.has(params, 'kanbanStatus')) {
        const newQuery = { ...query };
        newQuery.filter.kanbanStatus = params.kanbanStatus;
        setQuery(newQuery)
      }
    }
  }, [params]);

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        autoLogout()
      }
    );

  }, []);

  const handleReload = () => setReload((e) => e + 1);
  const handleAddProject = () => navigation.navigate('AddProject');

  const handleFilter = (filter) => {
    const { organizationUnitId: selectedOrg, employeeId: selectedEmp, personnel, kanbanStatus, startDate, endDate } = filter;
    const newQuery = { ...query };
    delete newQuery.filter.organizationUnit;
    delete newQuery.filter.kanbanStatus;
    delete newQuery.filter.inCharge;
    delete newQuery.filter.$or;

    if (selectedOrg) newQuery.filter.organizationUnit = selectedOrg;
    if (kanbanStatus) newQuery.filter.kanbanStatus = kanbanStatus;



    // if ((selectedEmp) && !newQuery.filter.$or) newQuery.filter.$or = {}
    if (selectedEmp) newQuery.filter.inCharge = { $in: selectedEmp };

    if (personnel) {
      newQuery.filter.$or = {}
      newQuery.filter.$or.createdBy = [personnel];
      newQuery.filter.$or.taskManager = [personnel];
      newQuery.filter.$or.inCharge = [personnel];
      newQuery.filter.$or.join = [personnel];
      newQuery.filter.$or.support = [personnel];
    }
    if ((startDate || endDate) && !newQuery.filter.startDate) newQuery.filter.startDate = {}
    if (startDate) newQuery.filter.startDate.$gte = `${moment(startDate, DATE_FORMAT).startOf('day').toISOString()}`;
    if (endDate) newQuery.filter.startDate.$lte = `${moment(endDate, DATE_FORMAT).endOf('day').toISOString()}`;

    setQuery(newQuery);
  };

  const onSearchText = async (text) => {
    let newQuery = { ...query };
    newQuery = getFilterOr(newQuery, text, ['name'])

    setQuery(newQuery);
  };

  const customData = ({ data, loadMore }) => {
    let newData = data.filter((e) => !e.parentId);
    newData = newData.map(project => ({ ...project, totalChild: data.filter(e => e.parentId === project._id).length }))
    return newData;
  };

  const handleUpdateBusinessOp = async (businessOp, id) => {

    const _id = businessOp._id
    const body = {
      taskId: _id,
      progress: 0,
      priority: 3,
      taskStatus: id.code,
      kanbanStatus: id.type,
      // note: 'ghi chu'
    }

    updateTask(_id, body)

  };

  return (
    <View>
      {isSeaching && <SearchBox isSeaching={isSeaching} onChange={onSearchText} setIsSearching={setIsSearching} />}
      <CustomHeader
        title="Công việc"
        rightHeader={
          <RightHeader
            children={<Icon name="search" type="FontAwesome" onPress={() => setIsSearching(true)} style={{ color: '#fff', marginHorizontal: 10, fontSize: 28, }} />}
            enableFilterModal
            enableFilterOrg
            organizationUnitId={_.get(query, 'filter.organizationUnit')}
            enableFilterEmp
            employeeId={_.get(query, 'filter.inCharge')}
            enableEmployee
            personnelId={_.get(query, 'filter.$or.createdBy[0]')}
            enableDatePicker
            startDate={_.get(query, 'filter.startDate.$gte') && moment(query.filter.startDate.$gte).format(DATE_FORMAT)}
            endDate={_.get(query, 'filter.startDate.$lte') && moment(query.filter.startDate.$lte).format(DATE_FORMAT)}
            enableTaskConfig
            kanbanId={_.get(query, 'filter.kanbanStatus')}
            onSave={handleFilter}

            
          />
        }
      />
      {/* <ListPage
        query={query}
        reload={reload}
        api={API_TASK_PROJECT}
        customData={customData}
        itemComponent={({ item }) => {
          return (<ProjectCard
            project={item}
            parentId={item._id}
            updateBusinessOp={handleUpdateBusinessOp}
          />
          )
        }}
      />
      {!taskRole.POST ? null :
        <FabLayout onPress={handleAddProject}>
          <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
        </FabLayout>
      } */}
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  projectPage: makeSelectProjectPage(),
  taskRole: makeSelectUserRole(MODULE.TASK),
});

function mapDispatchToProps(dispatch) {
  return {

  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ProjectPage);
