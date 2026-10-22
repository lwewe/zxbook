<template>
  <div class="pageMax">
    <div>
      <div v-for="item in orderList" :key="item.id">
        <!--蛋糕-->
        <div class="listItem2" @click="toDetail(item.id)">
          <div class="orderNo">
            <div class="orderNum orderTime">订单号:{{item.ordersn}}</div>
            <!--    订单状态-->
            <div>
<!--              //0-已支付 1-推送成功 2-已发货 3-处理中 4-已取消 5-己完成-->
              <div class="otherType" v-if="item.state==0">待发货</div>
              <div class="otherType" v-if="item.state==1">待发货</div>
              <div class="otherType" v-if="item.state==2">已发货</div>
              <div class="otherType" v-if="item.state==3">处理中</div>
              <div class="otherType" v-if="item.state==4">已取消</div>
              <div class="otherType" v-if="item.state==5">己完成</div>
            </div>
          </div>
          <!--      影片-->
          <div class="filmBox"  v-for="item2 in item.info_list" :key="item.id">
            <div class="film">
              <div class="filmImg cardImg">
                <img class="img" :src="item2.img" alt="">
              </div>
              <div class="rightBox">
                <div class="filmName">{{item2.name}}</div>
                <!--              <div class="startTime textBox" style="margin-top: 0px">6英寸</div>-->
              </div>
            </div>
          </div>
          <!--      价格-->
          <div class="priceBox">
            <div>共{{item.info_list.length}}件商品</div>
            <div>
              总计: <span class="priceNum"><span style="font-size: 12px">￥</span>{{item.havepay}}</span><span
                class="first">元</span>
            </div>
          </div>
          <!--          <div class="button">-->
          <!--            <div class="cancel">删除订单</div>-->
          <!--            &lt;!&ndash;          <div class="cancel toPay">去支付</div>&ndash;&gt;-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderList",
  props: ['orderList'],
  data() {
    return {
      // orderList:[]
    }
  },
  methods: {
    toDetail(id) {
      this.$router.push({path:"/cakeOrderDetail",query:{id}})
    },
    toCouponDetail() {
      this.$router.push("/couPonOrderDetail")
    },
    tomoveOrder(id, pf) {
      this.$router.push({path: "/orderDetail", query: {id, pf}})
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
  },
  created() {
    // console.log(this.orderList)
  }
}
</script>

<style scoped lang="less">
.pageMax {
  padding: 1px 10px 15px;
}

.listItem {
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  overflow: hidden;

  .endTime {
    background-color: #FEF9E6;
    color: #EF494C;
    text-align: center;
    font-weight: bold;
    padding: 10px 0px;
  }

  .orderInfo {
    padding: 10px 15px;

    .orderTop {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .topLeft {
        display: flex;
        align-items: center;
        gap: 5px;

        .pack {
          border: 1px solid #F2696E;
          white-space: nowrap;
          color: #F2696E;
          padding: 0px 3px 1px;
          font-size: 10px;
          border-radius: 2px;
          font-weight: bold;
        }

        .shopName {
          //font-weight: bold;
          font-size: 14px;
        }
      }

      .orderStatus {
        font-size: 13px;
        color: #959595;
      }
    }

    .orderCenter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      border-bottom: 1px dotted #EBEBEB;
      padding-bottom: 5px;

      .centerLeft {
        display: flex;
        align-items: center;
        gap: 8px;

        .shopImg {
          width: 77px;
          height: 77px;
        }

        .textRight {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .shopName {
          //font-weight: bold;
          font-size: 14px;
        }

        .shopInfo {
          font-size: 10px;
          color: #646464;
        }
      }

      .fullMoney {
        font-size: 10px;
        text-align: center;
        font-weight: bold;
      }

      .fullMoney span {
        font-size: 17px;
      }

      .piece {
        font-size: 10px;
        color: #767676;
        padding-top: 3px;
      }
    }

    .centerBottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;

      .time {
        font-size: 10px;
      }

      .button {
        display: flex;
        align-items: center;
        gap: 10px;

        .cancel {
          color: #949393;
          border-radius: 30px;
          border: 1px solid #949393;
          text-align: center;
          width: 85px;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
        }

        .toPay {
          color: white;
          background-color: #ED3036;
          border: 1px solid #ED3036;
        }
      }
    }
  }
}

.listItem2 {
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px 18px 10px;
  //订单号
  .orderNo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .orderNum {
      font-size: 12px;
      color: #878787;
      font-weight: bold;
    }

    .time {
      font-size: 13px;
      font-weight: bold;
      color: #EE3F45;
      white-space: nowrap;
    }

    .otherType {
      font-size: 14px;
      font-weight: bold;
      color: #B6B6B6;
    }
  }

  //  影片
  .filmBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;

    .film {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;

      .filmImg {
        width: 77px;
        height: 77px;
        border-radius: 3px;
        overflow: hidden;
      }

      .rightBox {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 65%;
        margin-top: -10px;
      }

      .filmName {
        font-size: 14px;
        font-weight: bold;
        margin-top: -10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2; /* 显示两行 */
      }

      .startTime {
        font-size: 12px;
        color: #818080;
      }

      .seat {
        //display: flex;
        //align-items: center;
        //gap: 4px;
        font-size: 12px;
        color: #818080;
        white-space: nowrap;
        margin-left: -4px;
      }

      .seat span {
        padding-left: 4px;
      }
    }

    .btnBox {
      min-width: 56px;
    }

    .btnno {
      background-color: #ED3036 !important;
      border-radius: 30px !important;
      width: 100%;
      height: 28px !important;
      line-height: 27px !important;
      margin-top: 10px;
      font-size: 12px;
      white-space: nowrap;
      padding: 0;
    }
  }

  //  价格
  .priceBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #818080;
    margin-top: 8px;

    .priceNum {
      color: #EF4E53;
      font-weight: bold;
      font-size: 17px;
    }

    .first {
      color: #EF4E53;
      font-weight: bold;
    }
  }
}

.button {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
  width: 100%;
  border-top: 1px solid #F6F6F6;
  padding-top: 8px;
  margin-top: 5px;

  .cancel {
    color: #949393;
    border-radius: 30px;
    border: 1px solid #949393;
    text-align: center;
    width: 70px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
  }

  .toPay {
    color: white;
    background-color: #ED3036;
    border: 1px solid #ED3036;
  }
}
</style>