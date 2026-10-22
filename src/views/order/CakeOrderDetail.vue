<template>
  <div class="location">
        <NProgress v-if="loadingflag"/>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#CCCCCC'"></ReturnBack>
    <!--    地址-->
    <div class="addressBox" v-if="orderShow">
      <div class="address">
        <div class="leftBox">
          <div class="addressIcon">
            <img class="img" src="../../assets/tubiao/dd.png" alt="">
          </div>
          <div>
            <div>
              <span class="userName">{{ orderShow.name }}</span>
              <span class="phone">{{ orderShow.phone }}</span>
            </div>
            <div class="addressDetail">
              {{ orderShow.province }}{{ orderShow.city }}{{ orderShow.area }}{{ orderShow.address }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <!--    商品信息-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">商品信息</div>
      <div class="shopInfo" v-for="item in orderList" :key="item.id">
        <!--                    {{key}}-->
        <div class="shopImg">
          <img style="border-radius: 5px;" class="img"
               :src="item.img"
               alt="">
        </div>
        <div class="nameBox">
          <div class="shopName">{{ item.name }}</div>
          <!--          <div class="can">6英寸</div>-->
          <div class="all">
            <div class="price">￥{{ item.xj_jiage }}</div>
            <div class="number">×{{ item.quantity }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--    订单明细-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单明细</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">商品金额</div>
          <div class="price">￥{{orderShow.havepay}}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">运 费</div>
          <div class="price">￥0</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">合计</div>
          <div class="price price1">￥{{orderShow.havepay}}</div>
        </div>
      </div>
    </div>
    <!--    订单信息-->
    <div class="addressBox addressBox2">
      <div class="itemTitle">订单信息</div>
      <div class="orderInfo">
        <div class="shopPrice">
          <div class="shopPriceText">订单状态</div>
          <div class="price" v-if="orderShow.state==0">待发货</div>
          <div class="price" v-if="orderShow.state==1">待发货</div>
          <div class="price" v-if="orderShow.state==2">已发货</div>
          <div class="price" v-if="orderShow.state==3">处理中</div>
          <div class="price" v-if="orderShow.state==4">已取消</div>
          <div class="price" v-if="orderShow.state==5">己完成</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">订单号</div>
          <div class="price">{{orderShow.ordersn}}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">下单时间</div>
          <div class="price">{{ timestampToTime(orderShow.add_time) }}</div>
        </div>
        <div class="shopPrice" v-if="orderShow.fuli">
          <div class="shopPriceText">支付方式</div>
          <div class="price"
               v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length==JSON.parse(orderShow.fuli).length">
            微信
          </div>
          <div class="price"
               v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length>0&&JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length!=JSON.parse(orderShow.fuli).length">
            微信和福利卡
          </div>
          <div class="price" v-if="JSON.parse(orderShow.fuli).filter(item=>item.id=='wx').length==0">福利卡</div>
        </div>
      </div>
    </div>
    <!--    快递信息-->
    <div class="addressBox addressBox2" v-if="orderShow.packages">
      <div class="itemTitle">快递信息</div>
      <div class="orderInfo" v-for="items in orderShow.packages" :key="items.id">
        <div class="shopPrice">
          <div class="shopPriceText">快递</div>
          <div class="price">{{items.delivery_name}}</div>
        </div>
        <div class="shopPrice">
          <div class="shopPriceText">快递单号</div>
          <div class="price">{{items.delivery_no}}</div>
        </div>
      </div>
    </div>
    <div class="service" @click="toKefu">
      <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
      <div class="serviceBox">
        <img class="img" src="../../assets/kf.png" alt="">
      </div>
    </div>
    <!--    footer-->
    <!--    <div class="button">-->
    <!--      <div class="cancel">删除订单</div>-->
    <!--&lt;!&ndash;      <div class="cancel">在线客服</div>&ndash;&gt;-->
    <!--      <div class="cancel toPay">再来一单</div>-->
    <!--      &lt;!&ndash;      <div class="cancel toPay xing">再来一单</div>&ndash;&gt;-->
    <!--    </div>-->
  </div>
</template>
<script>
import Payment from "@/components/Payment.vue";
import {getOderdetail} from "@/api/service";

export default {
  components: {Payment},
  data() {
    return {
      cardList: [],
      addrShow: {},
      order: {},
      orderShow: {},
      expressList: {},
      express: "",
      loadingflag: true,
      child: [],
      child_flag: "",
      isHeight: false,
      orderList: []
    }
  },
  methods: {
    toKefu() {
      window.location.href = localStorage.getItem("kefu")
    },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    getDetail(id) {
      this.child = []
      getOderdetail({
        id
      }).then(res => {
        this.loadingflag = false
        // console.log(res)
        if (res.code == 200) {
          this.orderShow = res.data.order_show
          this.orderList = res.data.orderinfo_list
          if (res.data.order_show.child) {
            res.data.order_show.child.forEach(item => {
              this.child.push({
                ...item,
                isHeight: false
              })
            })
          }
          // this.child = res.data.order_show.child
          this.child_flag = res.data.order_show.child_flag
          this.expressList = res.data.express_list
          this.addrShow = res.data.address
          if (this.orderShow.express_id) {
            this.express = res.data.express.filter(item => item.id == this.orderShow.express_id)[0].name
          }
        }
      })
    }
  },
  created() {
    this.getDetail(this.$route.query.id)
  }
}
</script>
<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 63px;
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
  position: relative;
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
    width: 77px;
    height: 77px;
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

//客服
.service {
  background-color: white;
  color: #5b5a5a;
  font-size: 13px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin-top: 10px;

  .serviceBox {
    width: 18px;
    padding-top: 1px;
  }
}

.unfold {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  gap: 5px;
  margin-top: 10px;
  position: absolute;
  bottom: 6px;
  right: 6px;
}

.unfoldHeight {
  height: 110px;
  overflow: hidden;
}

//footer
.button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 15px;
  justify-content: flex-end;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 89px;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
  }

  .toPay {
    color: white;
    background-image: linear-gradient(to right, #F55756, #DC0807);
    border: 1px solid #ED3036;
  }

  .xing {
    background-color: #0E6941;
    border: 1px solid #0E6941;
  }
}
</style>