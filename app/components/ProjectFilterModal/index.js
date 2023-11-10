/**
 *
 * ProjectFilterModal
 *
 */

import React, { useState, memo } from 'react';
import { Container, Content, List, ListItem, Radio, View, Text, Body, CheckBox, Button, Icon } from 'native-base';
import Modal from 'react-native-modal';

// import styled from 'styled-components';

function ProjectFilterModal(props) {
  const { open, handleClose, onFilterProject } = props;
  const [taskStatus, setTaskStatus] = useState({
    todo: false,
    stop: false,
    inProcess: false,
    complete: false,
  });
  const [isProject, setIsProject] = useState(true);

  const handleChangeTaskStatus = status => {
    setTaskStatus({
      ...taskStatus,
      [status]: !taskStatus[status],
    });
  };
  const handleChangeProjectType = status => {
    setIsProject(status);
  };

  const handleFilter = () => {
    onFilterProject();
  };

  return (
    <Modal isVisible={open}>
      <Container>
        <Content>
          <List>
            <ListItem itemHeader itemDivider>
              <Text>Loại công việc</Text>
            </ListItem>
            <ListItem button onPress={() => handleChangeProjectType(true)}>
              <Radio selected={isProject} />
              <Body>
                <Text>Dự án</Text>
              </Body>
            </ListItem>
            <ListItem button onPress={() => handleChangeProjectType(false)}>
              <Radio selected={!isProject} color="green" />
              <Body>
                <Text>Công việc liên quan</Text>
              </Body>
            </ListItem>
            <ListItem itemHeader itemDivider>
              <Text>Trạng thái</Text>
            </ListItem>
            <ListItem button onPress={() => handleChangeTaskStatus('todo')}>
              <CheckBox checked={taskStatus.todo} color="gray" />
              <Body>
                <Text>Chưa thực hiện</Text>
              </Body>
            </ListItem>
            <ListItem button onPress={() => handleChangeTaskStatus('inProcess')}>
              <CheckBox checked={taskStatus.inProcess} onPress={() => handleChangeTaskStatus('inProcess')} />
              <Body>
                <Text>Đang thực hiện</Text>
              </Body>
            </ListItem>
            <ListItem button onPress={() => handleChangeTaskStatus('complete')}>
              <CheckBox
                checked={taskStatus.complete}
                color="green"
                onPress={() => handleChangeTaskStatus('complete')}
              />
              <Body>
                <Text>Đã hoàn thành</Text>
              </Body>
            </ListItem>
            <ListItem button onPress={() => handleChangeTaskStatus('stop')}>
              <CheckBox checked={taskStatus.stop} color="black" onPress={() => handleChangeTaskStatus('stop')} />
              <Body>
                <Text>Đã dừng</Text>
              </Body>
            </ListItem>
          </List>
          <View padder style={{ flexDirection: 'row', marginTop: 40 }}>
            <Button block onPress={handleFilter} style={{ flex: 1 ,marginRight:5 , marginLeft:5 , borderRadius:10 }}>
            <Icon name="check" type="Feather" />
            </Button>
            <Button block onPress={handleClose} full style={{ flex: 1, marginRight:5, borderRadius:10  }} warning>
            <Icon name="close" type="AntDesign" />
            </Button>
          </View>
        </Content>
      </Container>
    </Modal>
  );
}

export default memo(ProjectFilterModal);
