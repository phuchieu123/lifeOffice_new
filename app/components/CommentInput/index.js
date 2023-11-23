/**
 *
 * CommentInput
 *
 */


import React, { memo, useCallback, useState } from 'react';
import { FlatList, Keyboard, TextInput, Text, View } from 'react-native';
import { useInput } from '../../utils/useInput';
// import styled from 'styled-components';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/AntDesign';
import { createFile, uploadImage } from '../../api/fileSystem';
import { picupkFile } from '../../utils/fileSystem';

function CommentInput(props) {
  const { onSendComment, parentId, projectId, userId, textMng } = props;
  const { value: message, setValue: setMessage, bind: bindMessage } = useInput('');

  const [attachFile, setAttachFile] = useState([])

  const handleSendMessage = async () => {
    if (message !== '' || attachFile.length) {
      Keyboard.dismiss();
      const result = await Promise.all(attachFile.map(uploadImage));
      let image = attachFile.map((e, idx) => ({ name: e.name, url: result[idx], type: e.type }));
      const newComment = {
        taskId: projectId,
        parentId: parentId || null,
        type: 1,
        content: message,
        userId: userId || null,
        image: image || null,
      };
      onSendComment(newComment);
      setMessage('');
      setAttachFile([])
    }
  };

  const onDeleteFile = useCallback((index) => {
    setAttachFile(attachFile.filter((e, idx) => idx !== index))
  }, [attachFile])

  const onSendFile = () => {
    picupkFile().then(e => {
      const file = createFile(e[0])
      setAttachFile(e => [...e, file])
    })
  }

  return (
    <View>
      {textMng ? <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
        <FlatList
          horizontal
          data={attachFile}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) => <View style={{ height: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc', borderRadius: 20, padding: 0, paddingHorizontal: 15, marginLeft: 5 }}>
            <Text numberOfLines={1} style={{ maxWidth: 80 }}>{item.name}</Text>
            <IconA
              name="close"
              type="AntDesign"
              onPress={() => onDeleteFile(index)}
              style={{ padding: 0, margin: 0, paddingLeft: 5, fontSize: 20 }} />
          </View>
          }
        />
      </View> : null}
      <View padder>
        <View regular>
          <TextInput {...bindMessage} placeholder={textMng ? 'Viết ý kiến...' : ''} />
          {textMng ? <Icon name="paperclip" type='FontAwesome' onPress={onSendFile} /> : null}
          <Icon active name="send" onPress={handleSendMessage} />
        </View>
      </View>
    </View>

  );
}

export default memo(CommentInput);
