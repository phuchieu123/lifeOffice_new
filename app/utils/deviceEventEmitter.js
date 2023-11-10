import { DeviceEventEmitter } from 'react-native';
import { storeData } from './storage';

export const onLogin = () => {
    DeviceEventEmitter.emit('loginEvent', true)
}

export const onLogout = () => {
    DeviceEventEmitter.emit('loginEvent', false)
}

export const updateProfile = (profile) => {
    storeData('profile', JSON.stringify(profile))
    DeviceEventEmitter.emit('updateProfile', profile)
}

export const onSocketEvent = (name, data) => {
    DeviceEventEmitter.emit(name, data)
}