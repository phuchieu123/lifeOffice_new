/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import moment from 'moment';
import { ImageBackground, View, Text } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { compose } from 'redux';
import { Card, CardItem, Right, Button, Body, List, ListItem, Label } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../images';
import CustomMultiSelect from '../CustomMultiSelect';
import { formatNumber } from '../../utils/common';
import { createStructuredSelector } from 'reselect';
import { MODULE } from '../../utils/constants';
import { makeSelectKanbanBosConfigs, makeSelectViewConfig } from '../../containers/App/selectors';
import { connect } from 'react-redux';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native';
const GRAY_BLUR = 'rgba(52, 52, 52, 0.8)';
const convert = (string) => {
    return string.charAt().toUpperCase() + string.slice(1).toLowerCase();
}
function ItemCard(props) {
    const { kanban, kanbanOption, updateBusinessOp, openBusinessDetail, businessOp, fieldConfig } = props;

    return (
        <View style={{ height: 320, margin: 5, borderRadius: 20 }}>
            <View bordered cardBody>
                <ImageBackground
                    source={
                        businessOp.avatar
                            ? {
                                uri: businessOp.avatar,
                            }
                            : images.background
                    }
                    style={{ height: 320, width: '100%' }}
                    imageStyle={{ borderRadius: 10 }}>
                    <View style={styles.cardItemView}>
                        <Button
                            small
                            onPress={() => openBusinessDetail(businessOp)}
                            iconLeft
                            style={{
                                width: '100%',
                                // height: 35,
                                backgroundColor: GRAY_BLUR,
                                justifyContent: 'center',
                                marginBottom: 5,
                            }}>
                            <Icon name="gear" type="EvilIcons" />
                            <Text numberOfLines={1}>
                                {businessOp.name}
                            </Text>
                        </Button>
                        <View  style={{ ...styles.cardItem, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <Button transparent iconRight small>
                                <Icon active name="navicon" type="FontAwesome" style={{ color: kanban.color }} />
                            </Button>
                            <Text style={{ color: '#fff', fontSize: 14 }}>Trạng thái: </Text>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <CustomMultiSelect
                                    single
                                    items={kanbanOption}
                                    handleSelectItems={(value) =>
                                        updateBusinessOp(businessOp, value[0])
                                    }
                                    canRemove={false}
                                    selectedItems={[businessOp.kanbanStatus]}
                                    fontWeight="700"
                                    iconColor="#fff"
                                    textColor="#fff"
                                    height={30}
                                />
                            </View>
                        </View>

                        {_.get(businessOp, 'responsibilityPerson.length', 0) > 0
                            ? <View style={styles.cardItem}>
                                <Button transparent iconRight small>
                                    <Icon active name="user-circle" type="FontAwesome" style={{ color: kanban.color }} />
                                </Button>
                                <Text style={{ color: '#fff', fontSize: 14 }} >{convert(_.get(fieldConfig, 'responsibilityPerson.title')) || 'Người chịu trách nhiệm'}: </Text>
                                <Text numberOfLines={1} style={{ color: '#fff' }}>
                                    {businessOp.responsibilityPerson && businessOp.responsibilityPerson.name}
                                </Text>
                                {_.get(businessOp, 'responsibilityPerson.length') !== 1
                                    ? null
                                    // ? <Text numberOfLines={1} style={{ color: '#fff' }}>
                                    //     {_.get(businessOp, 'responsibilityPerson.length')}
                                    // </Text>
                                    : <Text numberOfLines={1} style={{ color: '#fff' }}>
                                        {_.get(businessOp, 'responsibilityPerson[0].name', '')}
                                    </Text>
                                }
                            </View>
                            : null}

                        {/* <View bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }}> */}
                        <TouchableOpacity onPress={() => openBusinessDetail(businessOp)} >
                            <View style={{ ...styles.cardItem, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                                <View>

                                    <View
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                        }}>
                                        <ProgressCircle
                                            percent={100}
                                            radius={60}
                                            borderWidth={4}
                                            color="orange"
                                            shadowColor="#999"
                                            bgColor={'#555'}
                                            outerCircleStyle={{ marginRight: 0, marginTop: 0 }}>
                                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: '#fff' }}>
                                                {[3, 4].includes(kanban.code) ? 0 : moment().diff(moment(businessOp.updatedAt), 'days')}
                                            </Text>
                                            <Text style={{ fontSize: 14, textAlign: 'center', color: '#fff' }}>ngày chưa cập nhật</Text>
                                        </ProgressCircle>
                                        <View style={{ flex: 1 }}>
                                            {businessOp.customerId && (
                                                <View style={{ paddingTop: 0 }}>
                                                    <Icon name="user" type="FontAwesome" style={{ fontSize: 20, paddingRight: 8, color: '#fff' }} />
                                                    <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16 }}>
                                                        {businessOp.customerId.name}
                                                    </Text>
                                                </View>
                                            )}

                                            <View style={styles.listItem}>
                                                <Icon
                                                    name="calendar"
                                                    type="FontAwesome"
                                                    style={{ fontSize: 20, paddingRight: 8, color: '#fff' }}
                                                />
                                                <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16 }}>
                                                    {moment(businessOp.createdAt).format('DD/MM/YYYY')}
                                                </Text>
                                            </View>
                                            {businessOp.value && businessOp.value.amount && (
                                                <View style={styles.listItem}>
                                                    <Icon
                                                        name="money"
                                                        type="FontAwesome"
                                                        style={{ fontSize: 20, paddingRight: 8, color: '#fff' }}
                                                    />
                                                    <Text numberOfLines={1} style={{ color: '#fff' }}>
                                                        {formatNumber(businessOp.value.amount)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                </View>

                            </View>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
           
        </View>
    );
}



const mapStateToProps = createStructuredSelector({
    fieldConfig: makeSelectViewConfig(MODULE.BOS),
    kanbanOption: makeSelectKanbanBosConfigs(),
    // userRoleBos: makeSelectUserRoleBos(),
});
const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ItemCard);
const styles = {
    cardItem: {
        backgroundColor: GRAY_BLUR,
        borderRadius: 0,
    },
    cardItemView: {
        flex: 1,
        padding: 5,
    },

    listItem: {
        paddingTop: 15,
        paddingBottom: 15,
    },
};
