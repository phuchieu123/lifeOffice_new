/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * AddApprovePage
 *
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { StyleSheet } from 'react-native';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectAddApprovePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  Text,
  Icon,
  Container,
  Right,
  ListItem,
  Left,
  Body,
  Thumbnail,
  Content,
} from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import ToastCustom from '../../components/ToastCustom';
import { MODULE } from '../../utils/constants';
import { makeSelectUserRole } from '../App/selectors';
import { autoLogout } from '../../utils/autoLogout';

export function AddApprovePage(props) {
  useInjectReducer({ key: 'addApprovePage', reducer });
  useInjectSaga({ key: 'addApprovePage', saga });

  const { navigation, hrmOverTime, caledarWorkOut, projectTask, priceCrm, contract, documentary, require } = props;

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        autoLogout()
      }
    );

  }, []);

  return (
    <Container>
      <BackHeader navigation={navigation} title="Yêu cầu phê duyệt" />
      <Content>
        {!hrmOverTime.POST ? null : <ListItem icon style={styles.listItem} onPress={() => navigation.navigate('AddApproveOverTime')}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail} />
          </Left> */}
          <Body style={styles.body}>
            <Text>Làm thêm giờ</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}

        {!caledarWorkOut.POST ? null : <ListItem icon style={styles.listItem} onPress={() => navigation.navigate('AddApproveWorkOut')}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail}/>
          </Left> */}
          <Body style={styles.body}>
            <Text>Công tác</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}

        {!projectTask.POST ? null : <ListItem icon style={styles.listItem} onPress={() => navigation.navigate('AddApproveProject')}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail} />
          </Left> */}
          <Body style={styles.body}>
            <Text>Công việc/Dự án</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}

        {!priceCrm.POST ? null : <ListItem icon style={styles.listItem} onPress={() => navigation.navigate('AddApprovePrice')}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail} />
          </Left> */}
          <Body style={styles.body}>
            <Text>Báo giá</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}


        {!contract.POST ? null : <ListItem icon style={styles.listItem} onPress={() => navigation.navigate('AddApproveContract')}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail} />
          </Left> */}
          <Body style={styles.body}>
            <Text>Hợp đồng</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}


        {!documentary.POST ? null : <ListItem icon style={styles.listItem} onPress={() => navigation.navigate('AddApproveDocumentary')}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail} />
          </Left> */}
          <Body style={styles.body}>
            <Text>Công văn</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}

        {!require.POST ? null : <ListItem icon style={styles.listItem} onPress={() => {
          // ToastCustom({ text: 'Bạn Chưa Có Quyền Truy Cập', type: 'danger' });
          navigation.navigate('AddApproveSalaryAdvance')
        }}>
          {/* <Left style={styles.left}>
            <Thumbnail style={styles.thumbnail} />
          </Left> */}
          <Body style={styles.body}>
            <Text>Tạm ứng</Text>
          </Body>
          <Right>
            <Icon name="right" type="AntDesign" />
          </Right>
        </ListItem>}
      </Content>
    </Container>
  );
}

const mapStateToProps = createStructuredSelector({
  addApprovePage: makeSelectAddApprovePage(),
  hrmOverTime: makeSelectUserRole(MODULE.HRM),
  caledarWorkOut: makeSelectUserRole(MODULE.CALENDAR),
  projectTask: makeSelectUserRole(MODULE.TASK),
  priceCrm: makeSelectUserRole(MODULE.SALES_QUOTATION),
  contract: makeSelectUserRole(MODULE.CONTRACT),
  documentary: makeSelectUserRole(MODULE.DOCUMENTARY),
  require: makeSelectUserRole(MODULE.ADVANCE_REQUIRE)



});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AddApprovePage);

const styles = StyleSheet.create({
  listItem: {
    margin: 5,
  },
  left: {
    // margin: 10,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ccc',
  },
});
