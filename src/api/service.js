import setaxios from "@/utils/setaxios";
import store from "@/store";


// 获取logo
export function getLogo() {
    return setaxios.post("/Login/index", {
        channel_no:store.state.channel_no,
        
        
    });
}

// 列表图
export function getBannerList(data) {
    return setaxios.post("/Catering/banner", {
        channel_no:store.state.channel_no,
        ...data
    });
}
// 底部信息/点餐提示/公告
export function getdbtext(data) {
    return setaxios.post("/Catering/dbtext", {
        channel_no:store.state.channel_no,
        
        ...data
    });
}

// 温馨提示 / 购买须知 / 友情提示
// hCatering/single
export function getsingle(data) {
    return setaxios.post("/Catering/single", {
        channel_no:store.state.channel_no,
        ...data
    });
}

// 获取收藏列表
export function getCollect(data){
    return setaxios.post("Catering/collect",{
        channel_no:store.state.channel_no,
        ...data
    })
}

// 收藏/取消收藏店铺
export function getAddCollect(data){
    return setaxios.post("catering/addcollect",{
        channel_no:store.state.channel_no,
        ...data
    })
}


// 获取当前登录人的手机号
// /Member/index
export function getPhone(data){
    return setaxios.post("/Member/index",{
        channel_no:store.state.channel_no,
        ...data
    })
}




// 订单详细页图书订单详情
// Catering/order
export function getOderdetail(data){
    return setaxios.post("Bookorder/show",{
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    })
}

// 订单列表
export function getOderList(data){
    return setaxios.post("Bookorder/order",{
        channel_no:store.state.channel_no,
        token:localStorage.getItem("token"),
        ...data
    })
}


