import React, { memo } from 'react';
import { View, Icon, Badge } from 'native-base';
import CustomThumbnail from '../../../components/CustomThumbnail';
import { getAvatar } from '../../../utils/common';

function ApprovalStatusView(props) {
  const { groupInfo, approveIndex } = props;

  return groupInfo.map((item, index) => (
    < View key={item._id} style={{ flexDirection: 'row', alignItems: 'center' }}>
      {!item.person ? (
        <CustomThumbnail
          small
          style={{ borderColor: 'red', borderWidth: 2 }}
          // image={images.userImage}
          image={getAvatar(item.avatar, item.gender)}
        />
      ) : (
        <View>
          {item.approve === 1 && (
            <View style={{ flexDirection: 'row' }}>
              <CustomThumbnail
                small
                style={{ borderColor: '#7bc043', borderWidth: 2 }}
                // image={item.avatar ? { uri: item.avatar } : images.userImage}
                image={getAvatar(item.avatar, item.gender)}
              />
              <View>
                <Badge success style={{ width: 19, height: 19, position: 'absolute', top: -5, left: -10 }}>
                  <Icon name="check" type="Octicons" style={{ fontSize: 11, color: '#fff', lineHeight: 18 }} />
                </Badge>
              </View>
            </View>
          )}
          {item.approve === 2 && (
            <View style={{ flexDirection: 'row' }}>
              <CustomThumbnail
                small
                style={{ borderColor: 'red', borderWidth: 2 }}
                // image={item.avatar ? { uri: item.avatar } : images.userImage}                
                image={getAvatar(item.avatar, item.gender)}
              />
              <View>
                <Badge danger style={{ width: 19, height: 19, position: 'absolute', top: -5, left: -10 }}>
                  <Icon name="x" type="Octicons" style={{ fontSize: 11, color: '#fff', lineHeight: 18 }} />
                </Badge>
              </View>
            </View>
          )}
          {item.approve === 0 && approveIndex !== item.order && (
            <CustomThumbnail
              small
              // image={item.avatar ? { uri: item.avatar } : images.userImage}
              image={getAvatar(item.avatar, item.gender)}
            />
          )}
          {approveIndex === item.order && item.approve === 0 && (
            <View style={{ flexDirection: 'row' }}>
              <CustomThumbnail
                small
                style={{ borderColor: '#f0ad4e', borderWidth: 2 }}
                //  image={item.avatar ? { uri: item.avatar } : images.userImage} 
                image={getAvatar(item.avatar, item.gender)}
              />
              <View>
                <Badge warning style={{ width: 19, height: 19, position: 'absolute', top: -5, left: -10 }}>
                  <Icon name="hourglass-empty" type="MaterialIcons" style={{ fontSize: 9, color: '#fff', lineHeight: 18, right: 1 }} />
                </Badge>
              </View>
            </View>
          )}
        </View>
      )}
      {
        index !== groupInfo.length - 1 && (
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Icon name="md-arrow-forward" />
          </View>
        )
      }
    </View >
  ));
}

export default memo(ApprovalStatusView);
