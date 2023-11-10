/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * CustomThumbnail
 *
 */

import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';

import { Thumbnail } from 'native-base';
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

  return <Thumbnail onError={handleLoadFallback} {...props} source={source} />;
}

export default CustomThumbnail;
