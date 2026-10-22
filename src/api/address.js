import request from "../utils/request";

// 地址列表
// diancan/addresslist
export function getAddressList(data){
    return request.post("/diancan/addresslist" , data )
}

// 添加地址
// diancan/addressadd
export function getAddressAdd(data){
    return request.post("/diancan/addressadd" , data )
}

// 修改地址
// diancan/addressedit
export function getAddressEdit(data){
    return request.post("/diancan/addressedit" , data )
}

// 删除地址
// diancan/addressdelete
export function getAddressDelete(data){
    return request.post("/diancan/addressdelete" , data )
}