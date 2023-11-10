import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Container, Icon, View } from 'native-base';
import ProjectCard from './components/ProjectCard';
import BackHeader from '../../components/Header/BackHeader';
import ListPage from '../../components/ListPage';
import { API_TASK } from '../../configs/Paths';
import FabLayout from '../../components/CustomFab/FabLayout';
import { MODULE } from '../../utils/constants';
import { makeSelectUserRole } from '../App/selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get } from '../../api/tasks';
import { BackHandler, DeviceEventEmitter } from 'react-native';

const ChildProjectPage = (props) => {
  const { route, navigation, taskRole } = props;
  const { project, parentId } = route.params;

  const [reload, setReload] = useState(0);

  const customData = async ({ data, loadMore }) => {

    let _idCs = data.map((e) => e._id);
    const queryCustom = { filter: { parentId: { $in: _idCs } } }
    const reponse = await get(queryCustom)
    data = data.map(project => ({ ...project, totalChild: reponse.data.filter(e => e.parentId === project._id).length }))

    return data;
  };
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
    const backHandlerListener = BackHandler.addEventListener('hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      }
    );
    return () => {
      backHandlerListener.remove();
    }

  }, []);
  const handleReload = () => setReload((e) => e + 1);
  // const openAddProject = () => navigate('AddProject', { project, parentId });
  const handleAddProject = () => navigation.navigate('AddProject', { parentId });
  return (
    <Container>
      <BackHeader navigation={navigation} title={project.name} />

      <ListPage
        query={{ filter: { parentId } }}
        reload={reload}
        api={API_TASK}
        customData={customData}
        itemComponent={({ item }) => {
          return (<ProjectCard
            project={item}
            parentId={item._id}

          />
          )
        }}
      />
      {!taskRole.POST ? null : <FabLayout onPress={handleAddProject}>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
      </FabLayout>}
    </Container>
  );
};



const mapStateToProps = createStructuredSelector({

  taskRole: makeSelectUserRole(MODULE.TASK),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ChildProjectPage);

