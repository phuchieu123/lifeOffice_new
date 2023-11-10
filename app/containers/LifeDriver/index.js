// import React, { useState, useEffect } from 'react';
// import { View, Tab, TabHeading, Tabs, Text  } from 'native-base';
// import CustomHeader from '../../components/Header';
// import { API_FILE_COMPANY, API_FILE_SHARE, API_FILE_USERS, } from '../../configs/Paths';
// import RenderPage from './components/RenderPage';
// import _ from 'lodash';

// export default function LifeDriver() {
//     return (
//         <View>
//             <CustomHeader title='Kho dữ liệu' />
//             <Tabs>
//                 <Tab heading={<TabHeading><Text>Công ty</Text></TabHeading>}>
//                     <RenderPage api={API_FILE_COMPANY} folder="company" allowAdd allowShare />
//                 </Tab>
//                 <Tab heading={<TabHeading><Text>Của tôi</Text></TabHeading>}>
//                     <RenderPage api={API_FILE_USERS} folder="users" allowAdd allowShare />
//                 </Tab>
//                 <Tab heading={<TabHeading><Text>Chia sẻ</Text></TabHeading>}>
//                     <RenderPage api={API_FILE_SHARE} folder="share" allowShare />
//                 </Tab>
//             </Tabs>
//         </View >
//     )
// }

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomHeader from '../../components/Header';
import RenderPage from './components/RenderPage';
import { API_FILE_COMPANY, API_FILE_SHARE, API_FILE_USERS, } from '../../configs/Paths';
import _ from 'lodash';

export default function LifeDriver() {
    const [activeTab, setActiveTab] = useState('company'); // Để theo dõi tab đang được chọn

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title='Kho dữ liệu' />

            <View style={{ flexDirection: 'row', backgroundColor: "rgba(46, 149, 46, 1)",borderTopWidth: 1, borderTopColor:"#666666" }}>
                <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center', padding: 10 }}
                    onPress={() => setActiveTab('company')}
                >
                    <Text style={styles.text}>Công ty</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center', padding: 10 }}
                    onPress={() => setActiveTab('users')}
                >
                    <Text style={styles.text}>Của tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center', padding: 10 }}
                    onPress={() => setActiveTab('share')}
                >
                    <Text style={styles.text}>Chia sẻ</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'company' && (
                <RenderPage api={API_FILE_COMPANY} folder="company" allowAdd allowShare />
            )}

            {activeTab === 'users' && (
                <RenderPage api={API_FILE_USERS} folder="users" allowAdd allowShare />
            )}

            {activeTab === 'share' && (
                <RenderPage api={API_FILE_SHARE} folder="share" allowShare />
            )}
        </View>
    );
}

const styles ={
    text:{
        color:'white' 
    }
}