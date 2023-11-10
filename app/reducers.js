/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
// import languageProviderReducer from 'containers/LanguageProvider/reducer';

import appReducer from './containers/App/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    global: appReducer, // If you want, you can change the name of RnApp
    ...injectedReducers,
  });

  return rootReducer;
}

// import { combineReducers } from 'redux-immutable';
