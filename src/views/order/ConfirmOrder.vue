<template>
  <div class="location">
        <NProgress v-if="loadingflag"/>
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>-->
    <!--    地址 v-if="radio==2"-->
    <div class="addressBox">
      <div class="address" @click="changeAdress">
        <div v-if="!addrShow" style="font-size: 14px">您还没有配送地址，去新建一个</div>
        <div class="leftBox" v-else>
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div>
              <span class="userName">{{ addrShow.name }}</span>
              <span class="phone">{{ addrShow.phone }}</span>
            </div>
            <div class="addressDetail">
              {{ addrShow.province?addrShow.province.name:"" }}{{ addrShow.city?addrShow.city.name:"" }}{{addrShow.county? addrShow.county.name:"" }}{{ addrShow.addr }}
            </div>
          </div>
        </div>
        <div>
          <van-icon color="#CBCBCB" name="arrow"/>
        </div>
      </div>
    </div>
    <!--    商品信息-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="(item,index) in orderList" :key="item.id">
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img"
               :src="item.tushu_show.imageurl"
               alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{item.tushu_show.bookname}}</div>
<!--          <div class="can">哒哒哒</div>-->
          <div class="all">
            <div class="price">￥{{item.tushu_show.jiage}}</div>
            <div class="number">×{{item.quantity}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="addressBox addressBox2">
      <div class="phoneBox">
        <div class="phoneTitle">商品金额</div>
        <div class="with">
          <div class="withText" style="color:#CC4A49;font-size: 14px">￥{{Number(total).toFixed(2)}}</div>
        </div>
      </div>
      <div class="phoneBox" style="border: none">
        <div class="phoneTitle">运费</div>
        <div class="with">
          <div class="withText" style="color:#CC4A49;font-size: 14px">￥0</div>
        </div>
      </div>
    </div>
    <!--    备注-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">备注</div>
      <div class="textarea">
        <textarea v-model="remark" class="img" placeholder="有什么想对商家说的可以在这里说哦~"></textarea>
      </div>
    </div>
    <!--    支付方式-->
    <div class="addressBox addressBox2 addressBox3">
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--    支付按钮-->
    <div class="footer">
      <div class="allNumber">共{{ orderList.length }}件</div>
      <div class="rightBox">
        <div>
          <div class="all">合计:
            <span class="price">{{ changePrice1(total) }}</span>
            <span class="priceNum">.{{ changePrice2(total) }}</span>
          </div>
        </div>
        <div class="toPay" @click="toPay">去支付</div>
      </div>
    </div>
    <div class="loadingBox" v-if="isLoading">
      <loading :loadingText="0"></loading>
    </div>
    <!--    支付密码-->
    <PayPassword :isShow="isShow" @input="input" @onInput="onInput"></PayPassword>
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import PayPassword from "@/components/PayPassword.vue";
import {bookWxpay, cakeFlkpay, cakeIsPayDate, cakeIsPaySuccess, getflkList} from "@/api/account";
import {goCheckout} from "@/api/cart";

export default {
  name: "ConfirmOrder",
  components: {PayPassword, Payment},
  data() {
    return {
      cardList: [],
      orderList: [],
      addrShow: {},
      total: 0,
      result: [],
      // 支付方式选中
      checked: "",
      isShow: false,
      dataDetail: {},
      code: "",
      dkprice: "",
      wxprice: "",
      ka_ids: [],
      pass: "",
      act: "",
      otherData: {},
      openid: "",
      loadingflag: true,
      isLoading: false,
      withChecked: false,
      HomeDelivery: true,
      type: "",
      valueNumber: "",
      radio: "2",
      showDate: false,
      showTime: false,
      synthesisId: "",
      timeId: "",
      date: "",
      time: "",
      phoneNumber: "",
      disabled: false,
      dataList: [],
      radioList: [],
      isBuy: false,
      remark: "",
      code2:"",
      book:0
    }
  },
  methods: {
    getIsCard() {
      this.act = ""
      this.otherData = {}
      if (this.dataDetail.cartIds) {
        this.act = 1
        this.otherData.cartIds = this.dataDetail.cartIds
      } else {
        this.act = 2
        this.otherData.book_id = this.dataDetail.book_id
        this.otherData.quantity = this.dataDetail.quantity
      }
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // 支付
    // ///////微信登录
    onBridgeReady(params, order_no) {
      this.isLoading = false
      var that = this
      // "jsApiParameters": { //支付信息
      //   "appId": "wx05cc5223511e93c3",
      //       "timeStamp": "1710496158",
      //       "nonceStr": "qx0rpl2z6aqb492cvejftx5p4dowya4u",
      //       "package": "prepay_id=wx15174918865168a10f39f811aca3ea0000",
      //       "signType": "MD5",
      //       "paySign": "F0A17328ADD15AA9171CAEB082261A47"
      // }
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": params.appId,  //公众号名称，由商户传入
            "timeStamp": params.timeStamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            "nonceStr": params.nonceStr,  //支付签名随机串，不长于 32 位
            "package": params.package,//统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            "signType": params.signType,  //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            "paySign": params.paySign, //支付签名
          },
          function (res) {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              that.$toast('支付成功！');
              setTimeout(()=>{
                cakeIsPaySuccess({
                  order_no
                }).then(res => {
                  // that.$toast(res.msg)
                  that.getCard()
                  if (res.code == 200) {
                    //   if (this.change == 0) {
                    //     setTimeout(() => {
                    //       that.$router.go(-1)
                    //     }, 1000)
                    //   } else {
                    setTimeout(() => {
                      that.$router.replace({path: "/order", query: {tabIndex: 1}})
                    }, 1000)
                    //   }
                  }
                })
              },1000)
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              that.$toast('支付失败！');
            }
          });
    },
    input(e) {
      this.isShow = e
    },
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    judgmentPayDate() {
      this.getIsCard()
      let data = {
        address_id: this.addrShow.id,
        code: this.code,
        total: this.total,
        remark:this.remark,
        act: this.act,
        fulika: this.result.join(","),
        ...this.otherData
      }
      // console.log(data)
      // return
      cakeIsPayDate(data).then(res => {
        console.log(res)
        if (res.code == 200) {
          // 福利卡支付价格
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          this.code2 = res.data.code
          if (this.wxprice != 0) {
            //   微信支付
            // console.log("微信支付")
            // 去支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              this.isLoading = false
              return;
            }
            this.shoptoWxpay()
          } else {
            if (this.dkprice != 0) {
              // console.log("卡支付")
              this.isShow = true
              this.isLoading = false
            }
          }
        } else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },
    onInput(key) {
      this.pass = key
      if (this.pass.length == 6) {
        this.isShow = false
        this.flkpay(this.pass)
        this.pass = ""
      }
    },
    // 福利卡支付
    flkpay(pass) {
      this.getIsCard()
      let data = {
        ka_ids: this.ka_ids,
        pass,
        address_id: this.addrShow.id,
        code: this.code2,
        total: this.total,
        remark:this.remark,
        act: this.act,
        ...this.otherData
      }
      cakeFlkpay(data).then(res => {
        this.isLoading = false
        console.log(res)
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {
          this.getCard()
          setTimeout(()=>{
            cakeIsPaySuccess({
              order_no:res.data.order_no
            }).then(res => {
              this.getCard()
              if (res.code == 200) {
                setTimeout(() => {
                  this.$router.replace({path: "/order", query: {tabIndex: 1}})
                }, 1000)
              }
            })
          },1000)
        }
      })
    },
    // 支付
    toPay() {
      this.pass = ""
      // console.log(this.result, this.checked)
      if (!this.addrShow) {
        this.$toast("您还没有配送地址")
        return
      }
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      this.isLoading = true
      // if (this.result.length == 0 && this.checked != "") {
      //   // 去支付
      //   if (!this.isWeiXin()) {
      //     this.$toast("请使用微信打开进行支付")
      //     this.isLoading = false
      //     return;
      //   }
      //   this.shoptoWxpay()
      // } else {
        this.judgmentPayDate()
      // }
    },
    shoptoWxpay() {
      this.getIsCard()
      let data = {
        ka_ids: this.ka_ids,
        address_id: this.addrShow.id,
        total: this.total,
        act: this.act,
        openid: this.openid,
        code: this.code2,
        remark:this.remark,
        ...this.otherData
      }
      // this.$toast({message:data.openid,duration:0})
      bookWxpay(data).then(res => {
        if (res.code == 200) {
          this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
        }else {
          this.$toast(res.msg)
          this.isLoading = false
        }
      })
    },
    //支付end
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(",") ? price.toString().includes(".") ? price.toString().split('.')[1] : "00" : price.toString().includes(".") ? price.toString().split('.')[1] : "00"
    },
    changeAdress() {
      this.$router.push("/cakeAddressList?change=0")
    },
    // 订单详情
    getCheckout(data) {
      this.orderList = []
      goCheckout(data).then(res => {
        console.log(res, "dddddd")
        this.loadingflag = false
        if (res.code == 200) {
          this.addrShow = res.data.addr_show
          this.total = res.data.total
          this.orderList = res.data.jiesuan_list
          this.code = res.data.code
        }
      })
    },
    //   卡列表
    getCard() {
      getflkList().then(res => {
        if (res.code == 200) {
          this.cardList = res.data.card_list

          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
        }
      })
    },
  },
  created() {
    this.dataDetail = JSON.parse(this.$route.query.data)
    this.getCheckout(this.dataDetail)
    this.getCard()
    this.book = sessionStorage.getItem("book")
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.type = this.$route.query.type
    if (sessionStorage.getItem("radio")) {
      this.radio = sessionStorage.getItem("radio")
    }
    if (sessionStorage.getItem("isPhone")) {
      this.withChecked = sessionStorage.getItem("isPhone") == "false" ? false : true
    }
    if (sessionStorage.getItem("StoreName")) {
      this.dataList = JSON.parse(sessionStorage.getItem("StoreName"))
    }
    if (sessionStorage.getItem("radio")) {
      this.radioList = JSON.parse(sessionStorage.getItem("radio"))
    }
  },
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 66px;
}


.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;

  .address {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .addressIcon {
    width: 20px;
  }

  .phone {
    padding-left: 10px;
    font-size: 12px;
    color: #797979;
  }

  .addressDetail {
    font-size: 13px;
    font-weight: bold;
    margin-top: 3px;
  }

  .userName {
    font-size: 15px;
    font-weight: bold;
  }

  .leftBox {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
}

.addressBox3 {
  padding: 0px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .rightBox {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .toPay {
    background-image: linear-gradient(to right, #3AA4FA, #238EE4);
    color: white;
    border-radius: 30px;
    text-align: center;
    width: 106px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .allNumber {
    font-size: 13px;
    color: #7a7979;
  }

  .all {
    font-weight: bold;
    font-size: 15px;

    .price {
      color: #CA4240;
      font-size: 20px;
    }

    .priceNum {
      color: #CA4240;
    }
  }
}

.itemTitle {
  font-weight: bold;
  font-size: 15px;
}

.textarea {
  background-color: #F6F6F6;
  height: 94px;
  border-radius: 3px;
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
}

.textarea textarea {
  border: none;
  background-color: #fff0;
  font-size: 13px;
}

.orderInfo {
  .shopPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  .shopPriceText {
    color: #828282;
    font-size: 14px;
  }

  .price {
    font-size: 14px;
    font-weight: bold;
  }

  .price1 {
    color: #C93F3D;
  }
}

.shopInfo {
  margin-top: 15px;
  display: flex;
  align-items: flex-start;
  gap: 10px;

  .shopImg {
    width: 80px;
    height: 80px;
  }

  .nameBox {
    width: 73%;
  }

  .shopName {
    font-size: 14px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2; /* 显示两行 */
  }

  .can {
    margin-top: 7px;
    font-size: 13px;
    color: #979797;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 1; /* 显示两行 */
  }

  .all {
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
  }

  .price {
    color: #C63532;
    font-weight: bold;
    font-size: 15px;
  }

  .number {
    color: #989898;
  }
}

.loadingBox {
  width: 122px;
  position: fixed;
  top: calc(50% - 17px);
  left: calc(50% - 61px);
  background-color: rgba(50, 50, 51, .88);
  border-radius: 4px;
  height: 34px;
  line-height: 27px;
}

/deep/ .van-loading {
  color: white !important;
}

/deep/ .loadingText {
  color: #ffffff !important;
}

.phoneBox {
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding: 10px 0px;
  position: relative;

  .phoneNumber {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 70%;
  }

  .phoneTitle {
    font-weight: bold;
    white-space: nowrap;
  }

  .with {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 30%;
    justify-content: flex-end;
  }

  .withText {
    white-space: nowrap;
    font-size: 13px;
    color: #A6A6A6;
  }

  .withIcon {
    padding-top: 4px;
  }

  /deep/ .van-checkbox__icon .van-icon {
    width: 18px;
    height: 18px;
    line-height: 18px;
  }
}

.phoneInp {
  width: 70%;
}

.phoneInp input {
  width: 100%;
  border: none;
  background: none;
}

.noReapt {
  color: #D25D5B;
  border: 1px solid #D25D5B;
  display: inline-block;
  font-size: 10px;
  margin-top: 5px;
  border-radius: 2px;
  padding: 0px 5px 1px;
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
  background-color: #CA403E;
  border-radius: 50%;
  width: 25px;
  height: 25px;
}

.van-stepper__minus::after, .van-stepper__minus::before, /deep/ .van-stepper__plus::after, /deep/ .van-stepper__plus::before {
  background-color: #ffffff;
}

.totalBox {
  border-top: 1px solid #F6F6F6;
  margin-top: 10px;
  padding-top: 10px;
  text-align: end;
  font-size: 14px;
}

.priceIcon {
  color: #CB4342;
  font-size: 13px;
}

.price2 {
  color: #CB4342;
  font-size: 16px;
}

.priceNmber {
  color: #CB4342;
  font-size: 13px;
}

.phoneBox1 {
  border: none;
  border-top: 1px solid #efefef;
  margin-top: 10px;
  padding-bottom: 0px
}

.radioBox {
  color: #B0B0B0;
  display: flex;
  align-items: center;
  gap: 15px;
}

/deep/ .van-radio__label--left {
  color: #818181;
  font-size: 13px;
}

//弹窗
/deep/ .van-overlay {
  position: absolute;
  display: none;
}

/deep/ .van-popup--top {
  width: 37%;
  border-radius: 10px;
  transition: none;
  position: absolute;
}

/deep/ .van-popup {
  max-height: 570%;
}

.popup1 {
  /deep/ .van-popup--top {
    top: 37px;
    left: 82%;
    box-shadow: 0px 0px 5px -1px #0000004f;
  }

  .synthesisItem {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    font-size: 12px;
    color: #626262;
    border-top: 1px solid #F9F9F9;
  }

  .addRegion {
    color: #D25053;
  }

  .select {
    text-align: center;
    padding: 10px 0px;
    font-size: 14px;
    color: #C9283C;
  }
}
</style>