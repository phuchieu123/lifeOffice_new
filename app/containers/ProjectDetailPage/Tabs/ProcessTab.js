import { Button, Card, CardItem, Content, Form, Icon, Input, Item, Label, Text, Textarea, View } from 'native-base';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import _ from 'lodash';
import Search from '../../../components/CustomMultiSelect/Search';
import { ToastCustom } from '../../../components/ToastCustom/FixToast';
import { MODULE, priorityData, taskStatusData } from '../../../utils/constants';
import { useInput } from '../../../utils/useInput';
import { makeSelectUserRole, makeSelectViewConfig } from '../../App/selectors';
export function ProcessTab(props) {
  const { isLoading, projects, projectDetail, onUpdateProjectProgress, isBusy, taskRole, taskConfig, navigation } = props;
  const { value: taskStatus, setValue: setTaskStatus } = useInput('');
  const { value: priority, setValue: setPriority } = useInput([]);
  const { value: progress, setValue: setProgress, bind: bindProgress } = useInput(0);
  const { value: note, setValue: setNote, bind: bindNote } = useInput('');

  const [displayProgress, setDisplayProgress] = useState(false);
  const [localStatusData, setLocalStatusData] = useState(false);

  useEffect(() => {
    const getStatusData = () => {
      return taskStatusData.map((e) => {
        return {
          ...e,
          disabled:
            e.value !== projectDetail.taskStatus &&
            ((projectDetail.taskStatus === 2 && e.value === 1) ||
              (projectDetail.taskStatus > 2 && projectDetail.taskStatus !== 5)),
        };
      });
    };

    setPriority(projectDetail.priority);
    setTaskStatus(projectDetail.taskStatus);
    setNote(projectDetail.note);
    setProgress(String(projectDetail.progress));
    setLocalStatusData(getStatusData());

    if (projectDetail.taskStatus === 2) {
      const isParent = projects.findIndex((item) => item.parentId === projectDetail._id);
      setDisplayProgress(isParent === -1);
    }
  }, [projectDetail]);

  const handleSubmit = () => {
    let update = { taskId: projectDetail._id, priority, taskStatus, note, progress };
    if (onUpdateProjectProgress(update)) {
      navigation.goBack();
      ToastCustom({ text: 'Cập nhật tiến độ thành công', type: 'success' });
    }
  };

  const handleChangeStatus = (value) => {
    if (value === 2) {
      const isParent = projects.findIndex((item) => item.parentId === projectDetail._id);
      setDisplayProgress(isParent === -1);
    }
    setTaskStatus(value);
  };
  const convert = (string) => {
    return string.charAt().toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <Content>
      <Card>
        <CardItem>
          <Form style={{ flex: 1, backgroundColor: 'white' }}>
            {!_.get(taskConfig, 'taskStatus.checkedShowForm') ? null : <Item fixedLabel >
              <Label >{convert(_.get(taskConfig, 'taskStatus.title')) || 'Trạng thái'}:</Label>
              <View style={{ flex: 1 }}>
                <Search
                  single
                  items={localStatusData}
                  handleSelectItems={(value) => handleChangeStatus(value[0])}
                  selectedItems={taskStatus ? [taskStatus] : []}
                  // onRemoveSelectedItem={() => handleChangeStatus(null)}
                  uniqueKey="value"
                  displayKey="text"
                />
              </View>
            </Item>}

            {!_.get(taskConfig, 'priority.checkedShowForm') ? null : <Item fixedLabel>
              <Label >{convert(_.get(taskConfig, 'priority.title')) || 'Độ ưu tiên'}:</Label>

              <Search
                single
                items={priorityData}
                handleSelectItems={(value) => setPriority(value[0])}
                selectedItems={priority ? [priority] : []}
                // onRemoveSelectedItem={() => setPriority(null)}
                uniqueKey="value"
                displayKey="text"
              />
            </Item>}
            {displayProgress && (
              <Item inlineLabel>
                <Label>Tiến độ</Label>
                <Input {...bindProgress} keyboardType="decimal-pad" style={{ textAlign: 'right', marginRight: 5 }} />
                <Text style={{ paddingRight: 10 }}>%</Text>
              </Item>
            )}
            <Item stackedLabel>
              <Label>Ghi chú:</Label>
              <Textarea
                {...bindNote}
                bordered
                maxLength={500}
                style={{ width: '100%', textAlign: 'left', marginBottom: 10, height: 120 }}
              />
            </Item>

            {!taskRole.POST ? null :
              <Button
                disabled={isBusy}
                block
                style={{ justifyContent: 'center', borderRadius: 5 }}
                onPress={handleSubmit}>
                <Icon name="check" type="Feather" />
              </Button>
            }

          </Form>
        </CardItem>
      </Card>
    </Content>
  );
}

const mapStateToProps = createStructuredSelector({
  taskRole: makeSelectUserRole(MODULE.TASK),
  taskConfig: makeSelectViewConfig(MODULE.TASK)
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, memo)(ProcessTab);
