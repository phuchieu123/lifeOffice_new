import _ from "lodash";
import { onLogout } from "./deviceEventEmitter";
import { auth } from "./firebase";
import { clearAll } from "./storage";

const timer = 900000;
export const autoLogout = _.debounce(() => {
    logout();
}, timer)

export const logout = async () => {
    await clearAll()
    onLogout()
    auth.signOut()
}