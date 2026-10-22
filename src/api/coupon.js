// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 品牌列表
export function getCouPonList(data) {
    return setaxios.post("Coupons/index", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        // token:localStorage.getItem("token"),
        ...data
    });
}
// 品牌详细页
export function getCouPonDetail(data) {
    return setaxios.post("Coupons/brand", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        // token:localStorage.getItem("token"),
        ...data
    });
}
// 商品详细页
export function getCouPonShopDetail(data) {
    return setaxios.post("Coupons/detail", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        // token:localStorage.getItem("token"),
        ...data
    });
}