import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectAddApproveSalaryAdvance from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  Text,
  Icon,
  Container,
  Content,
  Input,
  Item,
  Label,
} from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import moment from 'moment';
import { API_ADVANCE_REQUIRE, API_APPROVE_GROUP, API_USERS } from '../../configs/Paths';
import CustomInput from '../../components/CustomInput';
import styles from './styles';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import _ from 'lodash';
import { makeSelectClientId } from '../App/selectors';
import { MODULE } from '../../utils/constants';
import ApproveTemplate from './components/ApproveTemplate';

export function AddApproveSalaryAdvance(props) {
  useInjectReducer({ key: 'addApprovePage', reducer });
  useInjectSaga({ key: 'addApprovePage', saga });

  const { navigation, route } = props;

  const [localState, setLocalState] = useState({ date: moment() });

  const handleChange = (name, value) => {
    setLocalState({ ...localState, [name]: value });
  };

  return (<ApproveTemplate
    route={route}
    navigation={navigation}
    title="Tạm ứng"
    code={MODULE.ADVANCE_REQUIRE}
    api={API_ADVANCE_REQUIRE}
    label="Tạm ứng"
    customDislayKey={["businessOpportunities.name"]}
  />
  );
}

const mapStateToProps = createStructuredSelector({
  addApprovePage: makeSelectAddApproveSalaryAdvance(),
  clientId: makeSelectClientId(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AddApproveSalaryAdvance);
