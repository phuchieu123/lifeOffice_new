import AsyncStorage from '@react-native-async-storage/async-storage';

const KEEP = ['domain', 'username', 'urlConfig', 'ads']

export const storeData = async (itemKey, itemValue) => {
  try {
    await AsyncStorage.setItem(itemKey, itemValue);
  } catch (e) { }
};

export const getData = async itemKey => {
  try {
    const value = await AsyncStorage.getItem(itemKey);

    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value;
      }
    }
  } catch (e) { }
};

export const getAllData = async () => {
  try {
    const value = await AsyncStorage.multiGet(await AsyncStorage.getAllKeys());
    if (value !== null) {
      return value;
    }
  } catch (e) {

  }
};

export const clearData = async itemKey => {
  try {
    await AsyncStorage.removeItem(itemKey);
  } catch (e) {

  }
};

export const clearAll = async () => {
  let keys = await AsyncStorage.getAllKeys()
  keys = keys.filter(key => !KEEP.includes(key))
  await Promise.all(keys.map((async key => await clearData(key))))
};

export const clearAllData = async () => {
  const keep = [...KEEP, 'accessToken', 'token', 'approveToken', 'token_03']
  let keys = await AsyncStorage.getAllKeys()
  keys = keys.filter(key => !keep.includes(key))
  await Promise.all(keys.map(key => (async () => await clearData(key)())))
};

export const mergeData = async (itemKey, itemValue) => {
  try {
    await AsyncStorage.mergeItem(itemKey, itemValue);
  } catch (error) { }
};
