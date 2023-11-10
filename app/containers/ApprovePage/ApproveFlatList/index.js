import React, { memo } from 'react';
import { FlatList } from 'react-native';
import LoadingLayout from '../../../components/LoadingLayout';
import ApproveItem from './ApproveItem';

function ApproveFlatList(props) {
  const { source, isLoading, handleOpenModal, profile, onRefresh } = props;

  const checkValidUser = (item) => {
    if (item.groupInfo) {
      const approveTurn = item.groupInfo.find((d) => d.order === item.approveIndex);

      if (approveTurn && profile.userId === approveTurn.person && approveTurn.approve === 0) {
        return true;
      }
    }

    return false;
  };

  return (
    <LoadingLayout isLoading={isLoading} padder style={{ backgroundColor: '#eee', flex: 1 }}>
      <FlatList
        refreshing={false}
        onRefresh={onRefresh}
        data={source}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ApproveItem item={item} profile={profile} checkValidUser={checkValidUser} handleOpenModal={handleOpenModal} />}
      />
    </LoadingLayout>
  );
}
export default memo(ApproveFlatList);
