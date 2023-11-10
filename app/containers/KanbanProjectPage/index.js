/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * KanbanProjectPage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import makeSelectKanbanProjectPage from './selectors';

import { Container, Content, Text } from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import KanbanProjectCard from '../../components/KanbanProjectCard';
import LoadingLayout from '../../components/LoadingLayout';
import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
export function KanbanProjectPage(props) {
  useInjectReducer({ key: 'kanbanProjectPage', reducer });
  useInjectSaga({ key: 'kanbanProjectPage', saga });

  const { navigation, route, onGetProject, onUpdateTask, onCleanup, kanbanProjectPage } = props;
  const { kanbanData, kanbanOption, updateProjectSuccess, isLoading } = kanbanProjectPage;

  const [query, setQuery] = useState({});
  const [item, setItem] = useState({});

  useEffect(() => {
    const { project: item } = route.params;

    if (!item || !item._id) {
      navigation.goBack();
    } else {
      setItem(item);
      const query = {
        skip: 0,
        filter: {
          projectId: item._id,
          status: 1,
        },
      };
      onGetProject(query);
      setQuery(query);
    }
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    if (kanbanData != null) {
    }
  }, [kanbanData]);

  useEffect(() => {
    if (updateProjectSuccess === true) {
      onGetProject(query);
      ToastCustom({ text: 'Cập nhật CHKD thành công', type: 'success' });
    } else if (updateProjectSuccess === false) {
      ToastCustom({ text: 'Cập nhật CHKD thất bại', type: 'danger' });
    }
  }, [updateProjectSuccess]);

  const handleCreateTask = task => {
    navigation.push('AddProject', { task, onGoBack: handleReload });
  };
  const handleUpdateTask = (task, kanban) => {
    const updateTask = { ...task, kanbanCode: kanban };
    onUpdateTask(updateTask);
  };
  const handleOpenTaskDetails = task => {
    navigation.navigate('ProjectDetail', { project: task, onGoBack: handleReload });
  };

  const handleReload = () => {
    onGetProject(query);
  };

  const handleGoBack = () => {
    const { onGoBack } = route.params;
    navigation.goBack();

    if (onGoBack) {
      onGoBack();
    }
  };

  return (
    <Container>
      <BackHeader navigation={navigation} onGoBack={handleGoBack} title={item.name} />
      <LoadingLayout isLoading={isLoading}>
        <Content padder>
          {/* <Card>
            <CardItem cardBody>
              <Picker
                mode="dropdown"
                // iosHeader="Loại công việc"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined, height: 40 }}>
                {kanbanOption &&
                  kanbanOption.map(kanban => {
                    return <Picker.Item key={kanban._id} label={kanban.name} value={kanban._id} />;
                  })}
              </Picker>
            </CardItem>
          </Card> */}
          {kanbanData.length > 0 ? (
            <Content horizontal>
              {kanbanData.map(data => (
                <KanbanProjectCard
                  handleUpdateTask={handleUpdateTask}
                  handleCreateTask={handleCreateTask}
                  handleOpenTaskDetails={handleOpenTaskDetails}
                  kanbanOption={kanbanOption}
                  item={data}
                />
              ))}
            </Content>
          ) : (
            <Text>Khong co du lieu</Text>
          )}
        </Content>
      </LoadingLayout>
    </Container>
  );
}

const mapStateToProps = createStructuredSelector({
  kanbanProjectPage: makeSelectKanbanProjectPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetProject: data => dispatch(actions.getProject(data)),
    onUpdateTask: data => dispatch(actions.updateProject(data)),
    onCleanup: data => dispatch(actions.cleanup()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(KanbanProjectPage);
