// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 福利卡结算-福利卡列表
export function getflkList(data) {
    return setaxios.post("Books/card", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 立即支付-计算卡是否够支付
export function cakeIsPayDate(data) {
    return setaxios.post("Books/pay_date", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 卡支付
export function cakeFlkpay(data) {
    return setaxios.post("Books/flkpay", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 微信支付
export function bookWxpay(data) {
    return setaxios.post("Books/wxpay", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}
// 支付完成后检测
export function cakeIsPaySuccess(data) {
    return setaxios.post("Books/pay_success", {
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    });
}