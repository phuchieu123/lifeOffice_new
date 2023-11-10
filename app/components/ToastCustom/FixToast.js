import { Toast as ToastNB } from "native-base";

const  FixToast = ToastNB;

const ToastCustom = (props) => {
    try {
        FixToast.show({ textStyle: { textAlign: 'center' }, ...props });
    } catch (err) { }
}

export { FixToast, ToastCustom };

// <FixToast ref={c => { if (c) FixToast.toastInstance = c; }} />  // put inside Modal