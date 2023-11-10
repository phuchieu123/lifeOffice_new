import * as Speech from 'expo-speech';

export default speak = (text) => {

    // Tts.setDefaultLanguage('en-IE');

    // Tts.speak('hello', {
    //     androidParams: {
    //         KEY_PARAM_STREAM: 'STREAM_NOTIFICATION',
    //     }
    // })

    Speech.speak(text);
}