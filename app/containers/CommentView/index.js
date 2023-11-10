/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * CommentView
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import _ from 'lodash';
import moment from 'moment';
import { Body, Icon, Left, List, ListItem, Right, Text, Thumbnail, View } from 'native-base';
import { ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { getAvatar, getUri, handleSearch, serialize } from '../../utils/common';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { navigate } from '../../RootNavigation';
import CommentInput from '../../components/CommentInput';
import LoadingLayout from '../../components/LoadingLayout';
import { API_COMMENT } from '../../configs/Paths';
import { downloadFile } from '../../utils/fileSystem';
import { deleteComment, getComments, sendComment } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectCommentView from './selectors';

export function CommentView(props) {
  useInjectReducer({ key: 'commentView', reducer });
  useInjectSaga({ key: 'commentView', saga });
  const { commentView, onGetComments, onSendComment, project, code, onSend, onDeleteComment, textMng } = props;
  const { comments, newComment, isLoading } = commentView;


  const [replyId, setReplyId] = useState('');

  useEffect(() => {
    if (project && code) onGetComments({ id: project._id, code });
  }, [project, code]);

  useEffect(() => {
    if (newComment != null) {
      onGetComments({ id: project._id, code });
      setReplyId('');
    }
  }, [newComment, code]);

  const handleSendComment = (comment) => {
    const { content, taskId, parentId, userId, image } = comment;
    onSendComment({
      content,
      id: taskId,
      code,
      parentId,
      replyUser: userId && userId._id,
      image
    });

    onSend && onSend(content)
  };


  const handleReply = (comment) => setReplyId(comment._id);

  return (
    <View>
      <CommentInput onSendComment={handleSendComment} projectId={project._id} textMng={textMng} />
      <LoadingLayout isLoading={isLoading}>
        {Array.isArray(comments) &&
          comments.map((comment) => (
            <Comments
              key={comment._id}
              comment={comment}
              handleReply={handleReply}
              replyId={replyId}
              handleSendComment={handleSendComment}
              code={code}
              project={project}
              onDeleteComment={(id) => { onDeleteComment(id) }}
              textMng={textMng}
            />
          ))}
      </LoadingLayout>
    </View>
  );
}

const Comments = ({ comment, order = 1, handleReply, replyId, code, handleSendComment, project, onDeleteComment }) => {
  const [children, setChildren] = useState([]);
  const [thumbnail, setThumbnail] = useState();
  const commentData = _.get(comment, 'image', []);

  useEffect(() => {
    const getThumnail = async () => {
      const { user } = comment || {}
      const { avatar, gender } = user || {}
      const result = await getAvatar(avatar, gender)
      setThumbnail(result)
    }

    getThumnail()
  }, [])

  const getReply = async (comment) => {
    const newQuery = {
      code,
      id: comment.id,
      parentId: comment._id,
    };

    let url = `${await API_COMMENT()}?${serialize(newQuery)}`;
    handleSearch(url, (e) => Array.isArray(e) && setChildren(e.reverse()));
  };

  const onPressImg = (uri, title) => navigate('ViewScreenImg', { uri, title });
  const onPressFile = (uri, title) => {
    downloadFile(uri, title)
  };

  return (
    <List key={`comment_${comment._id}`}>

      <ListItem avatar>
        <Left>
          {thumbnail && <Thumbnail source={thumbnail} small />}
        </Left>
        <Body>
          <Text>{comment.user.name}</Text>
          <Text note>{comment.content}</Text>
          {comment.noteTag.length ? comment.noteTag.map(i => {return <Text>
            <Text style={{ fontSize: 14, color: '#75a3cc' }}>@{i.taggerName} </Text>
            <Text note style={{ fontSize: 14 }}>{i.note} </Text>
            <Text style={{ fontSize: 14, color: '#75a3cc' }}>@{i.nameReply} </Text>
          </Text>}) : null}
          <ScrollView>
            {commentData.map((item, index) => {
              const { url, type, name } = item
              return (type && type.includes('image'))
                ? <TouchableOpacity onPress={() => onPressImg(url, name)}>
                  <ImageBackground
                    style={{ flex: 1, width: 150, height: 150, marginVertical: 5 }}
                    resizeMode="contain"
                    source={{ uri: getUri(url) }}>
                  </ImageBackground>
                </TouchableOpacity>
                : <View style={{ justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, margin: 5, top: -3 }}>
                  <TouchableOpacity onPress={() => onPressFile(url, name)}>
                    <View style={{ height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc', borderRadius: 20, padding: 0, paddingHorizontal: 15, marginLeft: 5 }}>
                      <Text numberOfLines={1} style={{ maxWidth: 200 }}>{name}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
            })}
          </ScrollView>
          {comment.totalReply && !children.length ? (
            <Text note style={{ color: '#1A0DAB' }} onPress={() => getReply(comment)}>
              Xem {comment.totalReply} trả lời...
            </Text>
          ) : null}
        </Body>
        <Right>
          <Text note>{moment(comment.createdAt).format('DD/MM/YY')}</Text>
          {order < 2 && (
            <View style={{ flexDirection: 'row' }}>
              {console.log("IDDĐ", comment._id)}
              <Icon name="reply" type="MaterialIcons" onPress={() => handleReply(comment)} style={{ marginLeft: 10 }} />
              {/* <Icon name="attachment" type="MaterialIcons" onPress={() => handleReply(comment)} style={{ marginLeft: 10 }} /> */}
              <Icon name="delete" type="MaterialIcons" onPress={() => { onDeleteComment(comment._id); }} style={{ marginLeft: 10 }} />
            </View>
          )}
        </Right>
      </ListItem>
      <View style={{ marginLeft: 56 }}>
        {children.map((child) => (
          <Comments
            key={comment._id}
            comment={child}
            order={order + 1}
            handleSendComment={handleSendComment}
            handleReply={handleReply}
            code={code}
          />
        ))}
      </View>
      {replyId === comment._id && (
        <CommentInput
          onSendComment={handleSendComment}
          parentId={comment._id}
          projectId={project._id}
          userId={comment.user}
        />
      )}
    </List>
  );
};

const mapStateToProps = createStructuredSelector({
  commentView: makeSelectCommentView(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetComments: (data) => dispatch(getComments(data)),
    onSendComment: (comment) => dispatch(sendComment(comment)),
    onDeleteComment: (data) => dispatch(deleteComment(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(CommentView);
