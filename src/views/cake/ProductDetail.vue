<template>
  <div class="location">
    <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#B3B3B3'"></ReturnBack>
    <div v-if="detail.id">
      <!--  轮播图-->
      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
          <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item">
            <img class="img" style="object-fit: cover"
                 :src=" item"
                 alt="">
          </van-swipe-item>
        </van-swipe>
        <div class="bannerNum">{{ onIndex }}/{{ bannerList.length }}</div>
      </div>
      <div class="shopInfo">
        <div class="priceBox">
          <div class="price">
            ￥<span>{{ changePrice1(detail.price) }}</span>.{{ changePrice2(detail.price) }}
          </div>
        </div>
        <div class="shopName">{{ detail.bookname }}</div>
        <!--      选择-->
        <div class="selectBox">
          <!--          规格-->
          <div class="specifications" :style="{border:item.id ==3?'none':''}" v-for="item in selectList" :key="item.id"
               @click="open(item.status,item.id)">
            <div class="leftBox">
              <div class="specificationsImg">
                <img class="img" :src="item.icon" alt="">
              </div>
              <div style="width: 85%;">
                <div class="specificationsText">{{ item.text }}</div>
                <!--                <div class="tip" v-if="item.id ==2">明日18:00前下单,预计04月07日(周日)18:00前发货</div>-->
              </div>
            </div>
            <div class="iconBox" v-if="item.id ==2">
              <van-icon name="arrow"/>
            </div>
          </div>
        </div>
      </div>
      <!--    商品推荐-->
      <div class="shopDetail" style="padding: 0;">
        <div class="shopDetailTextBox">
          <div class="line"></div>
          <div class="shopDetailText">商品推荐</div>
          <div class="line"></div>
        </div>
        <!--      列表-->
        <div class="listShop">
          <van-swipe indicator-color="#4BAEFE" @change="onChangeShop">
            <van-swipe-item class="swiperBox" v-for="(item,index) in Math.ceil(productList.length/6)" :key="item.id">
              <div class="shopItem" v-for="item2 in productList.slice(index*6,(index+1)*6)" :key="item.id">
                <ShopList class="shopflag" :type="1" :flag="1" :book="1" :listItem="item2"></ShopList>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!--    商品详情-->
      <div class="shopDetail">
        <div class="shopDetailTextBox">
          <div class="line"></div>
          <div class="shopDetailText">商品详情</div>
          <div class="line"></div>
        </div>
        <div class="wcontent">
          <!--          tab切换-->
          <div class="tabbarBox">
            <div @click="changeTab(item.id,index)" class="tabbarItem"
                 :class="{tabbarItem2:tabId==item.id,tabbarItem3:tabIndex==index,tabbarItem4:tabIndex2==index,}"
                 v-for="(item,index) in tabList" :key="item.id">
              <div> {{ item.text }}</div>
              <div v-if="tabId==item.id" class="linetext"></div>
            </div>
          </div>
          <div class="bookInfo" v-if="tabId==1">
            <div>
              <span>商品编号：</span>
              <span>{{ detail.id }}</span>
            </div>
            <div>
              <span>书号：</span>
              <span>{{ detail.bookisbn }}</span>
            </div>
            <div>
              <span>作者：</span>
              <span>{{ detail.author }}</span>
            </div>
            <div>
              <span>出版社：</span>
              <span>{{ detail.brandname }}</span>
            </div>
            <div>
              <span>开本：</span>
              <span>{{ detail.kaiben }}</span>
            </div>
            <div>
              <span>装帧：</span>
              <span>{{ detail.brandname }}</span>
            </div>
            <div>
              <span>中图分类：</span>
              <span>{{ detail.guanpei }}</span>
            </div>
            <div>
              <span>页数：</span>
              <span>{{ detail.bookpages }}</span>
            </div>
            <div>
              <span>包装：</span>
              <span>{{ detail.package }}</span>
            </div>
            <div>
              <span>大约重量：</span>
              <span>{{ detail.weight }}</span>
            </div>
            <div>
              <span>出版日期：</span>
              <span>{{ detail.productdate }}</span>
            </div>
          </div>
          <div class="bookInfo" v-else v-html="bookInfo"></div>
        </div>
      </div>
      <!--    底部button-->
      <div>
        <van-goods-action>
          <van-goods-action-mini-btn
              @click="toCart"
              :icon="require('../../assets/tubiao/gc.png')"
              text="购物车"
          />
          <van-goods-action-mini-btn
              @click="toKefu"
              :icon="require('../../assets/tubiao/kfz.png')"
              text="客服"
          />
          <van-goods-action-big-btn class="goCart"
                                    :class="{goCart2:detail.can_buy!=1||detail.status!=1||can_buy!=1}"
                                    text="加入购物车"
                                    @click="open('b',1)"
          />
          <van-goods-action-big-btn class="toPay"
                                    :class="{toPay2:detail.can_buy!=1||detail.status!=1||can_buy!=1}"
                                    primary
                                    text="立即购买"
                                    @click="open('c',1)"
          />
        </van-goods-action>
      </div>
      <!--    规格弹窗-->
      <div class="popupBox">
        <van-popup v-model="showAll" position="bottom">
          <div class="popup">
            <div class="close" @click="showAll=false">
              <van-icon size="18px" name="cross"/>
            </div>
            <div v-if="selectId==1">
              <div class="shopBox">
                <div class="shopImg">
                  <img style="border-radius: 5px;object-fit: cover" class="img"
                       :src="detail.imageurl"
                       alt="">
                </div>
                <div style="width: 65%;">
                  <div class="modelName">{{ modelName }}</div>
                  <div class="price">￥<span>{{ changePrice1(detail.price) }}</span>.{{ changePrice2(detail.price) }}
                  </div>
                </div>
              </div>
              <div>
                <!--                <div class="titleBox">-->
                <!--                  <div class="title">规格</div>-->
                <!--                  <div class="speBox">-->
                <!--                    <div class="spe" :class="{spe1:item.id==modelId}" @click="changemodelId('规格',item)"-->
                <!--                         v-for="item in model"-->
                <!--                         :key="item.id">{{ item.name }}-->
                <!--                    </div>-->
                <!--                  </div>-->
                <!--                </div>-->
                <div class="titleBox valueNumber">
                  <div class="title">数量</div>
                  <div class="speBox">
                    <van-stepper :max="detail.stocknum" @change="changeNum" v-model="valueNumber"/>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectId==2">
              <div class="addressTitle">{{ addList.length > 0 ? '选择收货地址' : '暂无可配送地址' }}</div>
              <div class="address">
                <van-address-list
                    v-model="chosenAddressId"
                    @edit="editAddress"
                    @select="changeDefault"
                    :list="addList"
                />
                <!--                :disabled-list="disabledList"-->
                <!--                disabled-text="以下地址超出配送范围"-->
                <!--                "can_ship": "1", //是否支持商户自配送 1-支持,0-不支持-->
                <!--                "can_same": "0", //是否支持快递配送 1-支持,0-不支持-->
              </div>
            </div>
            <!--          按钮-->
            <div class="footer">
              <div class="button" v-if="status=='a'">
                <div class="resetting" @click="resetting">加入购物车</div>
                <div class="resetting complete" @click="toConfirmOrder">立即订购</div>
              </div>
              <div class="button" v-if="status=='b'">
                <div class="resetting" style="width: 100%;" @click="resetting">加入购物车</div>
              </div>
              <div class="button" v-if="status=='c'">
                <div class="resetting complete" style="width: 100%;" @click="toConfirmOrder">立即订购</div>
              </div>
              <div class="button" v-if="status=='d'">
                <div class="resetting complete" @click="addNewAddress"
                     style="width: 100%;">添加新地址
                </div>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script>
import ShopList from "@/components/ShopList.vue";
import {addCart, dgseladdress, getBookDetail, getCakeDetails} from "@/api/detail";
import {getBookAddress, mrbookaddress, mrscaddress} from "@/api/bookAddress";
import {getCakeProductList} from "@/api";

export default {
  name: "ProductDetail",
  components: {ShopList},
  data() {
    return {
      tabId: 1,
      tabIndex: 1,
      tabIndex2: -1,
      tabList: [
        {
          id: 1,
          text: "图书信息",
        }, {
          id: 2,
          text: "图书简介",
        }, {
          id: 3,
          text: "作者简介",
        }, {
          id: 4,
          text: "图书目录",
        },
      ],
      bannerList: [],
      onIndex: 1,
      price: 111.65,
      stock: 0,
      keshou: 1,
      selectList: [
        {
          id: 1,
          icon: require("../../assets/tubiao/gg.png"),
          text: "规格：法国国家自然博物馆犊皮纸博物画",
          status: "a"
        },
        {
          id: 2,
          icon: require("../../assets/tubiao/dz.png"),
          text: "请选择配送地址",
          status: "d"
        },
        {
          id: 3,
          icon: require("../../assets/tubiao/gj.png"),
          text: "库存: 3"
          // （节假日可能延缓发货）
        },
      ],
      showAll: false,
      isHave: false,
      value: "",
      status: null,
      selectId: 2,
      chosenAddressId: '',
      list: [],
      detail: {},
      modelList: [],
      //1-规格 2-重量 3-颜色 4-型号
      model: [
        {
          id: 1,
          name: "法国国家自然博物馆犊皮纸博物画"
        }
      ],
      weightList: [],
      colourList: [],
      Specifications: [],
      modelId: 1,
      modelName: "法国国家自然博物馆犊皮纸博物画",
      modelPrice: "2512558",
      modelTastes: "",
      address_id: "",
      loadingflag: true,
      swiper: null,
      valueNumber: 1,
      addList: [],
      disabledList: [],
      can_buy: "",
      productList: [],
      bookInfo: ""
    }
  },
  methods: {
    changeTab(id, index) {
      this.tabId = id
      this.tabIndex = index + 1
      this.tabIndex2 = index - 1
      // console.log(this.tabIndex)
      if (id == 1) {
        // this.bookInfo = this.detail.conent
      } else if (id == 2) {
        this.bookInfo = this.detail.conent
      } else if (id == 3) {
        this.bookInfo = this.detail.authordesc ? this.detail.authordesc : this.detail.author
      } else if (id == 4) {
        this.bookInfo = this.detail.catlog
      }
    },
    changeNum(e) {
      this.getDgseladdress(this.modelId)
    },
    onChangeShop() {

    },
    toCart() {
      this.$router.push("/shopCart")
    },
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    // 修改默认地址
    changeDefault(e) {
      this.selectList[1].text = e.name + e.tel
      this.address_id = e.id
      mrbookaddress({
        id: this.address_id
      }).then(res => {
        // this.$toast(res.data)
        this.showAll = false
        if (res.code == 200) {
          this.getDgseladdress(this.modelId)
        }
      })
    },
    // 加入购物车
    // 加入购物车
    resetting() {
      addCart({
        quantity: Number(this.valueNumber),	//是	num	数量
        book_id:this.detail.id
      }).then(res => {
        this.$toast(res.msg)

        if (res.code == 200) {
          this.showAll = false
        }
      })
    },
    editAddress(e) {
      this.$router.push({path: "/cakeExitAdress", query: {id: e.id}})
    },
    changemodelId(type, item) {
      //1-规格 2-重量 3-颜色 4-型号
      // if (type == "规格") {
      this.modelId = item.id
      this.modelName = item.name
      this.modelPrice = item.price
      this.can_buy = item.can_buy
      this.modelTastes = item.tastes || ""
      this.selectList[0].text = this.modelName
      this.getDgseladdress(this.modelId)
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    onChange(index) {
      this.onIndex = index + 1
    },
    open(status, id) {
      // if(this.detail.can_buy!=1||this.detail.status!=1||this.can_buy!=1){
      //   this.$toast("该商品不可购买")
      //   return;
      // }
      if (status == 'a') {
        return
      }
      if (id == 3) {
        return
      }
      if (id == 2 && !localStorage.getItem("token")) {
        if (this.isWeiXin()) {
          this.$router.push("/quickLogin")
        } else {
          this.$router.push("/login")
        }
        return;
      }
      this.selectId = id
      this.showAll = true
      this.status = status
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    toConfirmOrder() {
      var data = {
        act: 2,
        quantity: Number(this.valueNumber),	//是	num	数量
        book_id:this.detail.id
      }
      this.$router.push({path: "/confirmOrder", query: {data: JSON.stringify(data)}})
    },
    addNewAddress() {
      this.$router.push("/cakeExitAdress")
    },
    getDgseladdress() {
      this.addList = []
      this.disabledList = []
      getBookAddress().then(res => {
        // console.log(res, "[[")
        //1-规格 2-重量 3-颜色 4-型号
        var list = {}
        if (res.data.address_list.length > 0) {
          res.data.address_list.forEach(item => {
            list = {
              id: item.id,
              name: (item.province ? item.province.name : '') + " " + (item.city ? item.city.name : '') + " " + (item.county ? item.county.name : ''),
              tel: item.addr,
              address: item.name + " " + item.phone,
              is_default: item.is_default
            }
            // if (item.can_same == 1 || item.can_ship == 1) {
            this.addList.push(list)
            // } else {
            //   this.disabledList.push(list)
            // }
          })
          if (this.addList.filter(item => item.is_default == 1).length > 0) {
            this.chosenAddressId = this.addList.filter(item => item.is_default == 1)[0].id
            this.selectList[1].text = this.addList.filter(item => item.is_default == 1)[0].name + " " + this.addList.filter(item => item.is_default == 1)[0].tel
          }
        }
      })
    },
    getCakeDetail(id) {
      var token = ""
      if (localStorage.getItem("token")) {
        token = localStorage.getItem("token")
      } else {
        token = ""
      }
      getBookDetail({
        id, token
      }).then(res => {
            // console.log(res)
            this.loadingflag = false
            if (res.code == 200) {
              this.detail = res.data.tushu
              if(res.data.addr_show){
                this.address_id = res.data.addr_show.id
              }
              this.productList = res.data.book_list
              this.bannerList.push(this.detail.imageurl)
              // this.model = this.detail.gueige
              // if (this.model.length > 0) {
              //   this.modelId = this.model[0].id
              //   this.modelName = this.model[0].name
              //   this.modelPrice = this.model[0].price
              //   this.modelTastes = this.model[0].tastes || ""
              //   this.can_buy = this.model[0].can_buy
              // }
              if (token) {
                this.getDgseladdress()
              }
              // this.selectList[0].text = this.modelName ? this.modelName : this.detail.bookname
              this.selectList[0].text = this.detail.bookname
              this.selectList[2].text = "库存: " + this.detail.stocknum
            } else if (res.code == -1) {
              localStorage.removeItem("token")
              this.getCakeDetail(this.$route.query.id)
            }
          }
      )
    }
  },
  created() {
    this.getCakeDetail(this.$route.query.id)
  }
  ,
  mounted() {
  }
}
</script>

<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding-bottom: 60px;
  box-sizing: border-box;
}

/deep/ .van-swipe__indicator {
  display: none;
}

.banner {
  position: relative;
}

.bannerNum {
  background-color: #CCCCCC;
  border-radius: 30px;
  color: white;
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 43px;
  text-align: center;
  padding: 2px 0px;
}

.shopInfo {
  background-color: white;
  margin-top: -5px;
  padding: 15px 15px 5px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;

  .priceBox {
    display: flex;
    gap: 15px;

    .label {
      color: #dc5654;
      background-color: #FEEDE3;
      text-align: center;
      white-space: nowrap;
      padding: 1px 6px;
      font-weight: bold;
      display: flex;
      font-size: 13px;
      align-items: center;
    }

    .price {
      color: #CA4543;
      font-weight: bold;
    }

    .price span {
      font-size: 20px;
    }
  }

  .shopName {
    font-weight: bold;
    line-height: 22px;
    margin-top: 5px;
    font-size: 15px;
  }

  .selectBox {
    margin-top: 5px;
  }

  .specifications {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0px;
    border-bottom: 1px solid rgba(241, 241, 241, 0.43);

    .specificationsImg {
      width: 24px;
      height: 24px;
    }

    .leftBox {
      display: flex;
      //align-items: center;
      gap: 5px;
      width: 90%;
    }

    .specificationsText {
      font-size: 13px;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .iconBox {
      color: #D4D4D4;
      margin-top: 6px;
    }
  }
}

.shopDetail {
  //background-color: white;
  padding: 10px 0px;
  margin-top: 10px;

  .shopDetailTextBox {
    padding: 7px 0px 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    .line {
      border: 1px solid #E3E3E3;
      width: 50px;
    }

    .shopDetailText {
      font-size: 12px;
      color: #939393;
    }
  }
}

.van-button--large {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
}

.van-goods-action {
  padding-right: 10px;
}

.van-goods-action-mini-btn__icon {
  width: 24px;
  height: 24px;
}

.goCart {
  border-bottom-left-radius: 30px;
  border-top-left-radius: 30px;
  background-color: transparent;
  border: 1px solid #4C9EDA;
  color: #4C9EDA;
  border-right: none;
}

.toPay {
  border-bottom-right-radius: 30px;
  border-top-right-radius: 30px;
  background-image: linear-gradient(to right, #3BA5FB, #208BE2);
  background-color: #208BE2;
  border: 1px solid #208BE2;
  border-left: none;
}

//.goCart2 {
//  background-image: linear-gradient(to right, #fff0, #fff0);
//  background-color: #cccccc;
//  border: 1px solid #cccccc;
//}
//
//.toPay2 {
//  background-image: linear-gradient(to right, #fff0, #fff0);
//  background-color: #8d8d8d;
//  border: 1px solid #8d8d8d;
//}

.popupBox {
  .van-popup--bottom {
    background-color: #FFFFFF !important;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    max-height: 70vh;
  }

  .close {
    position: absolute;
    top: 13px;
    right: 13px;
  }

  .popup {
    padding: 15px;
  }

  .footer {
    margin: auto;
    margin-top: 25px;
    box-sizing: border-box;
    width: 98%;
  }

  .button {
    display: flex;
    align-items: center;
    border-radius: 30px;
    overflow: hidden;
    border: 1px solid #4C9EDA;
  }

  .resetting {
    color: #4C9EDA;
    padding: 10px;
    box-sizing: border-box;
    width: 50%;
    text-align: center;
    overflow: hidden;
    background-color: transparent;
    //border-radius: 30px;
  }

  .complete {
    background-image: linear-gradient(to right, #3CA6FC, #208BE1);
    color: white;
  }

  .shopBox {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .shopImg {
    width: 98px;
    height: 98px;
  }

  .price {
    color: #CA4543;
    font-weight: bold;
    font-size: 13px;
    margin-top: 5px;
  }

  .price span {
    font-size: 18px;
  }

  .title {
    font-size: 15px;
    color: #737373;
  }

  .titleBox {
    margin-top: 15px;
  }

  .speBox {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .spe {
    color: #6c6c6c;
    border: 1px solid #c2c2c2;
    background-color: #fafafaab;
    border-radius: 30px;
    text-align: center;
    padding: 3px 10px;
    font-size: 13px;
    //font-weight: bold;
  }

  .spe1 {
    background-color: #F5FAFF;
    color: #3993D6;
    border: 1px solid #91C3E8;
  }

  .number {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .addressTitle {
    text-align: center;
    font-weight: bold;
  }

  .van-button--large {
    display: none;
  }

  .van-address-list {
    padding: 0;
  }

  .van-address-item__name {
    font-weight: bold;
    //color: #1F1F1F;
  }

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    border-color: #4BAEFE;
    background-color: #4BAEFE;
  }

  .address {
    margin-top: 15px;
  }
}

.wcontent {
  /deep/ img {
    width: 100%;
  }

  .tabbarBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #838383;
    font-size: 15px;
    position: relative;
    z-index: 10;

    .linetext {
      background-color: #1F7DC1;
      width: 12px;
      height: 3px;
      border-radius: 30px;
      margin: auto;
      margin-top: -5px;
    }

    .tabbarItem {
      //border-radius: 8px;
      width: 30%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: #F0F0F0;
    }

    .tabbarItem2 {
      border-radius: 8px;
      background-color: white;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      color: #4C97CC;
    }

    .tabbarItem3 {
      border-bottom-left-radius: 8px;
    }

    .tabbarItem4 {
      border-bottom-right-radius: 8px;
    }
  }

  .bookInfo {
    color: #757575;
    font-size: 14px;
    background-color: white;
    padding: 20px 20px 15px;
    margin-top: -10px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.modelName {
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 15px;
}

.bannerImg {
  //height: 356px !important;
}

.xTitle {
  font-size: 12px;
  color: #AFAFAF;
  margin-top: 5px;
}

.tip {
  font-size: 10px;
  color: #B2B2B2;
  margin-top: 5px;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listShop {
  background-color: white;
  padding-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;

  /deep/ .van-swipe__indicator {
    display: initial;
    border-radius: 0px;
    width: 25px;
    height: 3px;
    background-color: #E5E5E5;
    margin: 0;
  }

  /deep/ .van-swipe__indicators {
    bottom: 0px;
    border-radius: 30px;
    overflow: hidden;
  }
}

.valueNumber {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/deep/ .van-stepper__input {
  background-color: rgba(242, 243, 245, 0);
  font-size: 16px;
}

/deep/ .van-stepper__minus {
  background-color: rgba(242, 243, 245, 0);
  border-radius: 50%;
  border: 1px solid #b0b0b0;
  width: 25px;
  height: 25px;
}

/deep/ .van-stepper__plus {
  background-color: #3EA8FE;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after, .van-stepper__minus::before, /deep/ .van-stepper__plus::after, /deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.distrubtion {
  background-color: white;
  padding: 13px;
  font-size: 13px;
  line-height: 23px;
}

.shopItem {
  width: 31.4%;
}

.swiperBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
  gap: 0px 10px;
}

/deep/ .van-goods-action {
  z-index: 1000;
}

.tableBox {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.bookInfo div {
  padding: 3px 0px;
}
</style>