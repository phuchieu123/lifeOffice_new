import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import _ from 'lodash';
import Swiper from 'react-native-swiper';
import { VideoVipBanner } from './VideoVipBanner';
import { Icon, View } from 'native-base';
import { Image, Linking, TouchableOpacity } from 'react-native';
import { navigate } from '../../RootNavigation';
import { getData } from '../../utils/storage';
import images from '../../images';
import theme from '../../utils/customTheme'
import { getAds } from '../../api/ads';

const ADS = [
    // {
    //     uri: require('../../VideoAds/OFFICEMRP.mp4'),
    //     type: 'video',
    //     link: ''
    // },
    {
        uri: images.banner1,
        type: 'anhbannerLf1',
        link: ''

    },
    {
        uri: images.banner3,
        type: 'anhbannerLf2',
        link: ''

    },
]

export function RenderBanner(props) {
    const { viewStyle = {} } = props

    const [ads, setAds] = useState([]);
    const [shouldShow, setShouldShow] = useState();
    const shouldShowRef = useRef()
    useEffect(() => {
        getAds()

        getData('ads').then(e => {
            let show = (!e || e === 'show')
            if (!show !== !shouldShowRef.current) {
                shouldShowRef.current = show
                setShouldShow(show)
            }
        })

        return () => {
        }
    }, [])

    return (
        <>
            {!(shouldShow && ads.length) ? null :
                <View style={{ backgroundColor: 'white', ...viewStyle }}>
                    <Icon onPress={() => setShouldShow(!shouldShow)} type='Octicons' name='x' style={{ position: 'absolute', right: 10, top: 10, zIndex: 1000 }} />
                    <Swiper
                        showsPagination={true}
                        loop={true}
                        automaticallyAdjustContentInsets={true}
                        dot={<View style={styles.dot} />}
                        activeDot={<View style={styles.dotActive} />}
                    >
                        {ads.map((image, index) => {
                            return (
                                <TouchableOpacity key={`ads${index}`} style={{ width: '100%', height: '100%' }} onPress={() => navigate('LifetekTab')}>
                                    {image.type !== 'video'
                                        ? <Image source={image.uri} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                        : <VideoVipBanner uri={image.uri} style={{ borderRadius: 20 }} />
                                    }
                                </TouchableOpacity>
                            )
                        })}
                    </Swiper>
                </View>

            }
        </>
    );
}

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
    return {
    };
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(RenderBanner);

const styles = {
    dot: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    dotActive: {
        backgroundColor: theme.brandPrimary,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    }
}