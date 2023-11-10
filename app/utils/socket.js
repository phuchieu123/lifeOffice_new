import io from 'socket.io-client';
import { APP_URL } from "../configs/Paths";
import { getJwtToken } from "./authen";
import _ from "lodash";
import { onSocketEvent } from './deviceEventEmitter';
import { logout } from './autoLogout';
const PUBLISH = 'publish'
const SUBCRIBE = 'subcribe'

const ON_OFFER = 'on_get_offer'
const ON_CALL = 'on_get_call'
const CALL_VIDEO = 'callVideo'



const createSocket = async () => {


    try {
        const token = await getJwtToken();
        const appUrl = await APP_URL();

        if (token) {
            const socket = io(appUrl, { query: { token: token }, transports: ['websocket', 'polling'] });
            socket.on('connect_error', err => { console.log(err.stack, 'err'); onSocketEvent('socket_error') });
            socket.on('disconnect', () => console.log('Kết nối bị ngắt'));
            socket.on('connect', () => {
                console.log('Kết nối thành công')
                socket.on(socket.id, (data) => onSocketEvent('notification', data));
                socket.on('chat', data => onSocketEvent('chat', data));
                socket.on('docUpdated', (data) => onSocketEvent('docUpdated', data));
                socket.on('newComment', (data) => onSocketEvent('newComment', data));
                socket.on('subcribe', (data) => {
                    console.log(_.get(data, 'type'));
                    onSocketEvent(_.get(data, 'type', 'subcribe'), data)
                });
                socket.emit('notification', {
                    command: 1001,
                    data: {
                        skip: 0,
                        limit: 10,
                    },
                });
            });
            socket.on('logout', (data) => {
                console.log(data, 'data', socket.id)
                if (!(data && data.sid === socket.id)) {
                    console.log("logout nè")
                    logout()
                }
            });
            console.log(socket);
            return socket
        }
    } catch (err) { }
}

export {
    createSocket, PUBLISH,
    ON_OFFER,
    ON_CALL,
    CALL_VIDEO,
} 