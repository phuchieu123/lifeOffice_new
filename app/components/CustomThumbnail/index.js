/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * CustomThumbnail
 *
 */

import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';

import { Image} from 'react-native';
import images from '../../images';

function CustomThumbnail(props) {
  const [source, setSource] = useState(images.userImage);
  const { image } = props;
  const handleLoadFallback = () => {
    setSource(images.userImage);
  };

  useEffect(() => {
    setSource(image);
  }, []);

  return <Image onError={handleLoadFallback} {...props} source={source} style={{ width: 100, height: 100 }} />;
}

export default CustomThumbnail;
