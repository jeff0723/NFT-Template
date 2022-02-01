import { notification } from "antd";
export const openNotificationWithIcon = (type: string, message: string, description: string) => {
    switch (type) {
        case "warning":
            notification['warning']({
                message: message,
                description: description,
            });
            break;
        case "success":
            notification['success']({
                message: message,
                description: description,
            });
            break;
        case "error":
            notification['error']({
                message: message,
                description: description,
            });
            break;
        case "info":
            notification['info']({
                message: message,
                description: description,
            });
            break;
    }
};