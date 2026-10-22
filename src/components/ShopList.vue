<template>
  <!--  :ref="'ShopList'+index"-->
  <div @click="toDetail" ref="ShopList" v-if="listItem">
    <div class="listItem" style="position: relative">
      <div class="imgMax2 shopImg">
        <div class="imgBox" :style="{height:type==1?'105px':''}">
          <img class="img imgMax" :src="listItem.imageurl" alt="">
        </div>
      </div>
      <div class="shopInfo">
        <!--        <div class="label" v-if="listItem.pinpai&&flag==1">{{ listItem.pinpai.name }}</div>-->
        <!--        <div class="label" style="background-color:#fff0;height: 17px;" v-else></div>-->
        <div class="title" :class="{title2:type==1}">{{ listItem.bookname }}</div>
        <div class="priceBox">
          <div class="price" v-if="listItem.xinghao">
            ￥<span>{{ changePrice1(listItem.xinghao[0].price) }}</span>.{{ changePrice2(listItem.xinghao[0].price) }}
          </div>
          <div class="price" v-else>
            ￥<span>{{ changePrice1(listItem.jiage) }}</span>.{{ changePrice2(listItem.jiage) }}
          </div>
          <!--          <div class="plus">-->
          <!--            <van-icon name="plus"/>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShopList",
  props: {
    listItem: [Array, Number, Object, String],
    index: [Number, String],
    flag: [Number, String],
    type: [Number, String],
    book: [Number, String],
  },
  data() {
    return {}
  },
  methods: {
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    toDetail() {
      if(this.book == 1){
        this.$router.replace({path: "/productDetail", query: {id: this.listItem.id}})
        this.$router.go(0)
      }else {
        this.$router.push({path: "/productDetail", query: {id: this.listItem.id}})
      }
    }
  },
  created() {

  },
  mounted() {
    // setTimeout(() => {
    //   // console.log(this.$refs.ShopList.offsetHeight)
    //   this.$emit("ShopList", this.$refs.ShopList.offsetHeight)
    // }, 200)
  },
}
</script>

<style scoped lang="less">
.listItem {
  width: 100%;
  background-color: white;
  border-radius: 10px;
  margin-top: 10px;
}

.shopImg {
  border-bottom-right-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}

.imgMax {
  width: 100%;
}

.imgMax2 {
  border-radius: 10px;
  //height: 164px;
  overflow: hidden;
  //display: flex;
  //align-items: center;
  //justify-content: center;
}

.imgBox {
  //width: 90%;
  margin: auto;
  display: flex;
  width: 100%;
}

.plus {
  color: white;
  background-color: #CA403E;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  text-align: center;
  font-size: 14px;
  line-height: 13px;
  padding: 5px;
}

.priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 13px;
}

.shopInfo {
  padding: 10px;
}

.price {
  color: #CA4240;
  white-space: nowrap;
}

.price span {
  font-size: 16px;
}

.label {
  color: #dc5654;
  background-color: #FEEDE3;
  text-align: center;
  white-space: nowrap;
  padding: 0px 6px 1px;
  font-weight: bold;
  display: inline-block;
  font-size: 10px;
  max-width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
}

.title {
  font-size: 13px;
  color: #313131;
  padding-top: 3px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2; /* 显示两行 */
}

.title2 {
  -webkit-line-clamp: 1; /* 显示两行 */
}
</style>