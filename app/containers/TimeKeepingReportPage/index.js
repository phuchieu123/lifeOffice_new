import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  Body,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Right,
  Text
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingReportPage from './selectors';
import styles from './styles';

const TimeKeepingReportPage = (props) => {
  useInjectReducer({ key: 'timeKeepingReportPage', reducer });
  useInjectSaga({ key: 'timeKeepingReportPage', saga });

  const { navigation } = props;

  return (
    <Container>
      <BackHeader title="Báo cáo chấm công" navigation={navigation} />
      <Content style={styles.content}>
        <Content style={styles.content}>
          <List>
            <ListItem onPress={() => navigation.navigate('TimeKeepingChart')}>
              <Body>
                <Text>Báo cáo nhân sự</Text>
              </Body>
              <Right>
                <Icon name="chevron-right" type="Entypo" />
              </Right>
            </ListItem>
            <ListItem onPress={() => navigation.navigate('EquipmentChart')}>
              <Body>
                <Text>Thiết bị</Text>
              </Body>
              <Right>
                <Icon name="chevron-right" type="Entypo" />
              </Right>
            </ListItem>
            <ListItem onPress={() => navigation.navigate('LateEarlyChart')}>
              <Body>
                <Text>Chấm công trễ sớm</Text>
              </Body>
              <Right>
                <Icon name="chevron-right" type="Entypo" />
              </Right>
            </ListItem>
            <ListItem onPress={() => navigation.navigate('NoTimeKeepingChart')}>
              <Body>
                <Text>Không chấm công</Text>
              </Body>
              <Right>
                <Icon name="chevron-right" type="Entypo" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Content>
    </Container>
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingReportPage: makeSelectTimeKeepingReportPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TimeKeepingReportPage);
