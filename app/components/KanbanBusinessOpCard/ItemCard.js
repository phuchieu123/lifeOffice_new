/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import moment from 'moment';
import { ImageBackground } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { compose } from 'redux';
import { Card, CardItem, View, Text, Right, Icon, Button, Body, List, ListItem, Label } from 'native-base';
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
        <Card style={{ height: 320, marginTop: 0, borderRadius: 20 }}>
            <CardItem bordered cardBody>
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
                            rounded
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
                        <CardItem bordered style={{ ...styles.cardItem, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <Button transparent iconRight small>
                                <Icon active name="navicon" type="FontAwesome" style={{ color: kanban.color }} />
                            </Button>
                            <Text style={{ color: '#fff', fontSize: 14 }}>Trạng thái: </Text>
                            <Right style={{ flex: 1, flexDirection: 'row' }}>
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
                            </Right>
                        </CardItem>

                        {_.get(businessOp, 'responsibilityPerson.length', 0) > 0
                            ? <CardItem bordered style={styles.cardItem}>
                                <Button transparent iconRight small>
                                    <Icon active name="user-circle" type="FontAwesome" style={{ color: kanban.color }} />
                                </Button>
                                <Label style={{ color: '#fff', fontSize: 14 }} >{convert(_.get(fieldConfig, 'responsibilityPerson.title')) || 'Người chịu trách nhiệm'}: </Label>
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
                            </CardItem>
                            : null}

                        {/* <CardItem bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }}> */}
                        <TouchableOpacity onPress={() => openBusinessDetail(businessOp)} >
                            <CardItem style={{ ...styles.cardItem, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                                <Body>

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
                                        <List style={{ flex: 1 }}>
                                            {businessOp.customerId && (
                                                <ListItem style={{ paddingTop: 0 }}>
                                                    <Icon name="user" type="FontAwesome" style={{ fontSize: 20, paddingRight: 8, color: '#fff' }} />
                                                    <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16 }}>
                                                        {businessOp.customerId.name}
                                                    </Text>
                                                </ListItem>
                                            )}

                                            <ListItem style={styles.listItem}>
                                                <Icon
                                                    name="calendar"
                                                    type="FontAwesome"
                                                    style={{ fontSize: 20, paddingRight: 8, color: '#fff' }}
                                                />
                                                <Text numberOfLines={1} style={{ color: '#fff', fontSize: 16 }}>
                                                    {moment(businessOp.createdAt).format('DD/MM/YYYY')}
                                                </Text>
                                            </ListItem>
                                            {businessOp.value && businessOp.value.amount && (
                                                <ListItem style={styles.listItem}>
                                                    <Icon
                                                        name="money"
                                                        type="FontAwesome"
                                                        style={{ fontSize: 20, paddingRight: 8, color: '#fff' }}
                                                    />
                                                    <Text numberOfLines={1} style={{ color: '#fff' }}>
                                                        {formatNumber(businessOp.value.amount)}
                                                    </Text>
                                                </ListItem>
                                            )}
                                        </List>
                                    </View>

                                </Body>

                            </CardItem>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </CardItem>
        </Card>
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
