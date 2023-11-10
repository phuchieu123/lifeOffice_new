import { Button, Text, View } from 'native-base';
import React, { useState } from 'react';

import ListPage from '../../components/ListPage';
import { API_TASKS_KANBAN } from '../../configs/Paths';

export default SmallJob = (props) => {
    const [projects, setProjects] = useState(false);
    const [reload, setReload] = useState(0);
    const customData = ({ data, loadMore }) => {
        setProjects((e) => (loadMore ? [...e, ...data] : [...data]));
        const newData = data.filter((e) => !e.parentId);
        return newData;
    };
    return (
        <>
            <View>
                {/* <Button small rounded block style={{ width: '100%', marginVertical: 2, marginBottom: 5 }}>
                    <Text style={{ textAlign: 'center' }}>Công việc con</Text>
                </Button> */}
                <ListPage
                    query={{ isSmallest: true }}
                    reload={reload}
                    api={API_TASKS_KANBAN}
                    customData={customData}
                    itemComponent={({ item }) => (

                        <Button small rounded block style={{ marginVertical: 2, marginBottom: 5 }}>
                            <Text style={{ textAlign: 'center' }}>{item.name}</Text>
                        </Button>


                        // <Card style={{ borderRadius: 20, top: 0, flex: 1, backgroundColor: 'red' }}>
                        //     <CardItem cardBody >
                        //         <Body>
                        //             <Text style={{ flex: 1, fontSize: 10 }} numberOfLines={2}>
                        //                 {item.name}
                        //             </Text>
                        //             <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}>
                        //                 <ImageBackground
                        //                     source={
                        //                         item.avatar
                        //                             ? {
                        //                                 uri: item.avatar,
                        //                             }
                        //                             : images.background
                        //                     }
                        //                     style={{ height: 200, width: '100%', flex: 1, }}
                        //                     imageStyle={{ borderRadius: 10 }}
                        //                 >
                        //                     <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}>
                        //                         <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>

                        //                             <Button
                        //                                 style={{
                        //                                     backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        //                                     height: 'auto',
                        //                                     marginBottom: 4,
                        //                                     marginLeft: 4,
                        //                                 }}
                        //                                 rounded
                        //                                 small
                        //                                 iconLeft
                        //                                 inconRight
                        //                             >
                        //                                 <Icon type="FontAwesome" name="bars" />

                        //                             </Button>


                        //                             <Button
                        //                                 style={{
                        //                                     backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        //                                     height: 'auto',
                        //                                     marginBottom: 4,
                        //                                     marginLeft: 4,
                        //                                 }}
                        //                                 rounded
                        //                                 small
                        //                                 iconLeft
                        //                                 inconRight
                        //                             >
                        //                                 <Icon type="FontAwesome" name="gears" />
                        //                                 <Text style={{ flex: 1, fontSize: 10 }} numberOfLines={2}>
                        //                                     {item.name}
                        //                                 </Text>
                        //                             </Button>
                        //                         </View>

                        //                     </View>
                        //                 </ImageBackground>
                        //             </TouchableOpacity>
                        //         </Body>
                        //     </CardItem>
                        // </Card>

                    )}
                />
            </View>
        </>
    );
};

const styles = {
    view: {
        flex: 1,
        flexDirection: 'row',
    },
};
