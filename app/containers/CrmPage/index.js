import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Swiper from 'react-native-swiper';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectCrmPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Container, Header, Icon } from 'native-base';
import { makeSelectKanbanBosConfigs } from '../App/selectors';
import {
  deleteBusinessOpportunity,
  updateBusinessOpportunity,
  getBusinessOpportunity,
  getBusinessOpportunities,
  cleanup,
} from './actions';
import moment from 'moment';
import LoadingLayout from '../../components/LoadingLayout';
import { KANBAN_CODE } from '../../utils/constants';
import KanbanPage from './KanbanPage';
import CustomHeader from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import { getFilterOr } from '../../utils/common';
import RightHeader from '../../components/CustomFilter/RightHeader';
import _ from 'lodash'
import { DeviceEventEmitter } from 'react-native'
const DATE_FORMAT = 'YYYY-MM-DD';

export function CrmPage(props) {
  useInjectReducer({ key: 'crmPage', reducer });
  useInjectSaga({ key: 'crmPage', saga });

  const DEFAULT_QUERY = {
    filter: {
      // createdAt: {
      //   $gte: `${moment().startOf('month').toISOString()}`,
      //   $lte: `${moment().endOf('day').toISOString()}`,
      // },
    },
    limit: 15,
    sort: '-updatedAt',
    skip: 0

  };

  const { crmPage, onCleanup, route, navigation, kanbanBosConfig } = props;
  const { isLoading } = crmPage;
  const { params = {} } = route;
  const { kanbanId } = params;
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [isSeaching, setIsSearching] = useState(false);
  const [kanbanIndex, setKanbanIndex] = useState(0);
  const [kanbanOption, setKanbanOption] = useState([]);
  const [reload, setReload] = useState(0);

  const swiper = useRef();
  const swiperIndex = useRef(0);

  useEffect(() => {
    return () => onCleanup();
  }, []);

  useEffect(() => {
    if (kanbanId && kanbanBosConfig.length) {
      const found = kanbanBosConfig.findIndex((e) => e._id === kanbanId);
      if (found > -1) {
        setKanbanIndex(found);
        setKanbanOption(null);
      }
    }
    setTimeout(() => {
      setKanbanOption(kanbanBosConfig);

    }, 100)
  }, [kanbanBosConfig, kanbanId]);

  const handleFilter = (filter) => {
    const { organizationUnitId: selectedOrg, employeeId: selectedEmp, kanbanStatus, startDate, endDate } = filter;
    const newQuery = { ...query };

    delete newQuery.filter.organizationUnit;
    delete newQuery.filter.employeeId;
    delete newQuery.filter.kanbanStatus;

    if (selectedOrg) newQuery.filter.organizationUnitId = selectedOrg;
    if (selectedEmp) newQuery.filter.employeeId = selectedEmp;
    if (kanbanStatus) newQuery.filter.kanbanStatus = kanbanStatus;

    if ((startDate || endDate) && !newQuery.filter.createdAt) newQuery.filter.createdAt = {}
    // if (startDate) newQuery.filter.startDate = `${startDate}`;
    // if (endDate) newQuery.filter.endDate = `${endDate}`;
    if (startDate) newQuery.filter.createdAt.$gte = `${moment(startDate, DATE_FORMAT).startOf('day').toISOString()}`;
    if (endDate) newQuery.filter.createdAt.$lte = `${moment(endDate, DATE_FORMAT).endOf('day').toISOString()}`;

    setQuery(newQuery);
  }

  const onChangeText = (text) => {
    const newQuery = getFilterOr(query, text, ['name'])
    setQuery(newQuery);
  }


  useEffect(() => {
    const addEvent = DeviceEventEmitter.addListener("onUpdateCrm", (e) => {
      handleReload()
    })
    const addEventReload = DeviceEventEmitter.addListener("onUpdateCrm", (e) => {
      handleReload()
    })
    return () => {
      addEvent.remove()
      addEventReload.remove()
    }
  }, [])



  const handleReload = () => {
    setReload(e => e + 1)
  }

  return (
    <Container>
      {isSeaching && <SearchBox isSeaching={isSeaching} onChange={onChangeText} setIsSearching={setIsSearching} />}
      <CustomHeader
        title="Cơ hội kinh doanh"
        rightHeader={
          <RightHeader
            children={<Icon name="search" type="FontAwesome" onPress={() => setIsSearching(true)} style={{ color: '#fff', marginHorizontal: 10 }} />}
            enableFilterModal
            enableFilterOrg
            organizationUnitId={query.filter.organizationUnitId}
            enableFilterEmp
            employeeId={query.filter.employeeId}
            enableDatePicker
            startDate={_.get(query, 'filter.createdAt.$gte') && moment(query.filter.createdAt.$gte).format(DATE_FORMAT)}
            endDate={_.get(query, 'filter.createdAt.$lte') && moment(query.filter.createdAt.$lte).format(DATE_FORMAT)}
            onSave={handleFilter}
          />
        }
      />

      <LoadingLayout isLoading={isLoading}>
        {Array.isArray(kanbanOption) ?
          <Swiper index={kanbanIndex} showsPagination={false} loop={false}>
            {kanbanOption.map((item, index) => {
              return (

                <KanbanPage
                  reload={reload}
                  key={item._id}
                  kanbanId={item._id}
                  kanban={item}
                  query={query}
                  route={route}
                />
              )
            }
            )}
          </Swiper>
          : null}

        {(Array.isArray(kanbanOption) && kanbanOption.length) ? <FabLayout>
          <Icon type="Entypo" name="plus" style={{ color: '#fff' }} onPress={() => navigation.navigate('BusinessOpDetail', { kanban: kanbanOption[0], onCreateSuccess: handleReload })} />
        </FabLayout> : null}
      </LoadingLayout>
      {/* <CustomFooter activePage="Crm" /> */}
    </Container>
  );
}


const mapStateToProps = createStructuredSelector({
  crmPage: makeSelectCrmPage(),
  kanbanBosConfig: makeSelectKanbanBosConfigs(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetBusinessOps: (query) => dispatch(getBusinessOpportunities(query)),
    onGetBusinessOp: (data) => dispatch(getBusinessOpportunity(data)),
    onUpdateBusinessOp: (data) => dispatch(updateBusinessOpportunity(data)),
    onDelteBusinessOp: (data) => dispatch(deleteBusinessOpportunity(data)),
    onCleanup: () => dispatch(cleanup()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CrmPage);
