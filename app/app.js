import { NativeBaseProvider, extendTheme } from 'native-base';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import App from './containers/App';
import theme from './utils/customTheme';
import createReducer from './reducers';

const initialState = {};

// unstable_enableLogBox()
// YellowBox.ignoreWarnings([""]);
// LogBox.ignoreAllLogs(true)
const store = configureStore(createReducer, initialState);
const customTheme = extendTheme(theme);
function AppRoot() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
          <App />
      </NativeBaseProvider>
    </Provider>
  );
}

export default AppRoot;
