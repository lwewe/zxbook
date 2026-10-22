// 个人中心
import setaxios from "@/utils/setaxios";
import store from "@/store";
// 首页
export function getBookIndex(data) {
    return setaxios.post("Books/index", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 分类
export function getBookClassify(data) {
    return setaxios.post("Books/classify", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 分类产品
export function getCakeProductList(data) {
    return setaxios.post("Cake/product", {
        channel_no:store.state.channel_no,
        cid:sessionStorage.getItem("cityId"),
        ...data
    });
}
// 图书精选
export function getHotSalesList(data) {
    return setaxios.post("Books/hotSales", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 热销榜单
export function getWinnowList(data) {
    return setaxios.post("Books/jingxuan", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 新书上市
export function getNewBookList(data) {
    return setaxios.post("Books/newBook", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 首页推荐/分类产品
export function getIndexBookList(data) {
    return setaxios.post("Books/goods", {
        channel_no:store.state.channel_no,
        ...data
    });
}
//分类列表
export function getClassifyList() {
    return setaxios.post("/Classify/index", {
        channel_no:store.state.channel_no
    });
}
//图书列表
export function getBookClassifyList(data) {
    return setaxios.post("Books/lists", {
        channel_no:store.state.channel_no,
        ...data
    });
}