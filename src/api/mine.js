// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";

export function getUserInfo(data) {
    return setaxios.post("/Member/index", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 修改头像
export function changeAvatar(data) {
    return setaxios.post("/Member/uploadimg", data,{
        header: {
            'Content-Type': 'multipart/form-data',
        }
    });
}
// 绑定卡-温馨提示
export function bindingcard(data) {
    return setaxios.post("/Card/bindingcard", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 二维码绑卡
export function qrcodeBinging(data) {
    return setaxios.post("/Card/scanbinding", {
        channel_no: store.state.channel_no,
        token: localStorage.getItem("token"),
        ...data
    });
}
// 设置
export function getSetting() {
    return setaxios.post("Personal/setting", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
    });
}