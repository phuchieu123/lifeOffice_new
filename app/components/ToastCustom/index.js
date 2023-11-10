import { Toast } from 'native-base';

export default (props) => {
    try {
        Toast.show({ textStyle: { textAlign: 'center' }, ...props });
    } catch (err) { }
}
