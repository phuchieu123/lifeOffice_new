import Toast from 'react-native-toast-message';

export default (props) => {
    try {
        Toast.show({  type: 'success', // hoặc 'error', 'info', 'warning'
        position: 'bottom', // hoặc 'top', 'center'
        text1: props.text, // Nội dung thông báo
        visibilityTime: 3000, // Thời gian hiển thị thông báo (ms)
        autoHide: true, // Tự động ẩn sau thời gian hiển thị
        topOffset: 30, // Khoảng cách từ top (nếu position là 'top')
        ...props, // Các thuộc tính khác bạn muốn truyền vào });
    });
    } catch (err) { }
}
