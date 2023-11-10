import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Icon, Button, Toast, View, Text, Spinner } from 'native-base';
import { FlatList } from 'react-native';
import makeSelectCrmPage from './selectors';
import { updateBusinessOpportunity, cleanup } from './actions';
import ItemCard from '../../components/KanbanBusinessOpCard/ItemCard';
import { handleSearch, serialize } from '../../utils/common';
import { navigate } from '../../RootNavigation';
import { API_BUSINESS_OPPORTUNITIES } from '../../configs/Paths';
import ListPage from '../../components/ListPage';

function KanbanPage(props) {
  const { onUpdateBusinessOp, kanbanId, query, kanban, crmPage, reload, navigation } = props;
  const { updateBusinessOpSuccess } = crmPage;
  const [kanbanQuery, setKanbanQuery] = useState();

  useEffect(() => {
    if (kanbanId) {
      const newQuery = {
        ...query,
        filter: {
          ...query.filter || {},
          kanbanStatus: kanbanId,
        },
        sort: '-updatedAt'
      };

      setKanbanQuery(newQuery);
    }
  }, [query, kanbanId]);






  useEffect(() => {
    if (updateBusinessOpSuccess === true || updateBusinessOpSuccess === false) {

    }
  }, [updateBusinessOpSuccess]);

  const handleReload = () => {
    setReload(e => e + 1)
  };

  const handleUpdateBusinessOp = async (businessOp, id) => {
    if (kanban != businessOp.kanbanStatus) {
      const updateBusiness = { ...businessOp, kanbanStatus: id };
      onUpdateBusinessOp(updateBusiness);
    }
  };

  const handeOpenBusinessOp = (selected) => {
    navigate('BusinessOpDetail', {
      businessOp: selected,
      onGoBack: handleReload,
      kanban: kanban
    });
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column', paddingTop: 3, paddingBottom: 0 }} padder>
      <Button
        iconLeft
        small
        block
        full
        style={{ backgroundColor: kanban.color, borderRadius: 20, marginBottom: 3 }}
      // onPress={() => handleCreateBusinessOp(kanban)}
      >
        {/* <Icon name="plus" type="FontAwesome" /> */}
        <Text numberOfLines={1}>{kanban.name}</Text>
      </Button>
      <ListPage
        reload={reload}
        query={kanbanQuery}
        api={API_BUSINESS_OPPORTUNITIES}
        itemComponent={({ item }) => {

          // console.log('itemKanban', item)
          return (

            <ItemCard
              kanban={kanban}
              updateBusinessOp={handleUpdateBusinessOp}
              openBusinessDetail={handeOpenBusinessOp}
              businessOp={item}
              navigation={navigation}
            />
          )
        }}
      />
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  crmPage: makeSelectCrmPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateBusinessOp: (data) => dispatch(updateBusinessOpportunity(data)),
    onCleanup: () => dispatch(cleanup()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(KanbanPage);
