<template>
  <div class="location">
    <NProgress v-if="loadingflag" />
    <!--    <div class="model" v-if="isShow"></div>-->
    <!--    头部-->
    <div class="topBox" style="padding: 0px;" ref="topBox1">
      <div class="topPage">
        <!--      <div class="title">悦享聚汇</div>-->
        <div class="searchBox">
          <div>
            <!--      地址-->
            <City @getCity="getCity" :type="1"></City>
          </div>
          <div class="searchValue" @click="toOther('/productList?index=1')">
            <van-search background="#fff0" placeholder="搜索你喜欢的东西" v-model="searchValue" />
          </div>
          <div class="customer" @click="toCustomer">
            <img class="img" src="../assets/kf.png" alt="">
          </div>
        </div>
      </div>
      <!--  banner-->
      <div class="banner">
        <div style="padding: 0 10px;">
          <van-swipe :autoplay="3000" indicator-color="white" @change="onChange">
            <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.img" @click="toBanner(item)">
              <img class="img" :src="item.img" alt="">
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>
    <div class="topBox" ref="topBox">
      <!--      <button @click="clear">清除所有缓存</button>-->
      <!--      分类-->
      <div class="sortBox">
        <div class="sortTop sortCenter">
          <div class="sortItem" v-for="item in sortList" :key="item.title" @click="toSort(item)">
            <div class="iconImg">
              <img class="img" :src="item.img" alt="">
            </div>
            <div class="sortText">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <!--      甄选-->
      <div class="flexBox">
        <div class="toHome">
          <div style=" position: relative;margin-top: 3px" v-for="(item,index) in funList" :key="item.id"
            @click="toNext(item.path)">
            <img class="img imgTitle" :src="item.img" alt="">
            <div class="xtitle">
              <div class="hotTitle">{{ item.title }}</div>
              <div class="hotXtitle">{{ item.xtitle }}</div>
              <div class="tosee" :class="'cl' + index"><span>去看看</span></div>
            </div>
          </div>
        </div>
      </div>
      <!--      限时抢购-->
      <div class="sortBox panicBuying">
        <div class="panicTop" @click="toOther('/goodBooks')">
          <div class="topImg">

            <img class="img" src="../assets/tushu/top.png" alt=""></img>
          </div>
          <div style="width: 100%;">
            <div class="downtimeBack">
              <div class="panicImg">
                图书精选
              </div>
              <!-- <div style="color: #A8C2D6;font-size: 12px">|</div> -->
              <div class="text">好书抢先看</div>
            </div>
          </div>
          <!--          <div class="more" @click="toOther('/goodBooks')">进入频道</div>-->
        </div>
        <div style="padding: 0 10px;">
          <div class="birthdayBox">
            <div class="birthday" :style="'width:' + flashSale.length * 111 + 'px;'">
              <div class="listItem" style="position: relative;" @click="toDetail(item.id)" v-for="item in flashSale"
                :key="item.id">
                <div class="imgMax shopImg">
                  <div class="imgBox">
                    <img class="img" :src="item.imageurl" alt="">
                  </div>
                </div>
                <div class="shopInfo">
                  <div class="textInfo">{{ item.bookname }}</div>
                  <div class="hotText">
                    <div class="price" style="font-size: 10px" v-if="item.jiage">￥<span style="font-size: 12px">{{
                      changePrice1(item.jiage)
                    }}</span>.{{ changePrice2(item.jiage) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--    tab切换-->
    <div class="tabbar" :class="{ tabbar2: show }" ref="topScroll" v-if="tabList.length > 1">
      <div v-if="isLoading" class="isTab" :style="'width:' + tabList.length * 90 + 'px;'"></div>
      <!--      :style="'width:'+ tabList.length*80+'px;'"-->
      <div class="tabbarBox">
        <div class="tabItem" v-for="(item, index) in tabList" :key="index" @click="changeTab(item.id, index)">
          <div class="tabTop " :class="{ tabTop2: active == item.id }">{{ item.title }}</div>
          <div class="tabBottom" :class="{ tabBottom2: active == item.id }">{{ item.xtitle }}</div>
        </div>
      </div>
    </div>
    <!--    列表-->
    <div class="listMax" :style="{ minHeight: isHeight ? 'calc(100vh - 110px)' : '' }" :class="{ fixedHeight: show }">
      <div class="listBox">
        <NewShopList :flag="1" :shopSwiper="shopSwiper" :shopList="shopList" v-if="shopList.length > 0" :active="active"
          :swiperHeight="swiperHeight" @input="input"></NewShopList>
        <!--        </div>-->
        <loading style="margin-top: 2px" v-if="isLoading"></loading>
      </div>
    </div>

    <!--  tabbar-->
    <NavigationTab :active="0"></NavigationTab>
  </div>
</template>
<script>
import NavigationTab from "@/components/NavigationTab.vue";
import City from "@/components/City.vue";
import ShopList from "@/components/ShopList.vue";
import NewShopList from "@/components/NewShopList.vue";
import { getBookIndex, getHotSalesList, getIndexBookList, getNewBookList, getWinnowList } from "@/api";

export default {
  name: "IndexView",
  computed: {
    FlashSale() {
      return FlashSale
    }
  },
  components: {
    NewShopList,
    ShopList,
    City,
    NavigationTab
  },
  data() {
    return {
      searchValue: "",
      bannerList: [],
      sortList: [],
      backColor: "",
      funList: [],
      active: 0,
      tabList: [],
      shopSwiper: [],
      itemHeight: 0,
      swiperHeight: 0,
      flashSale: [],
      shopList: [],
      pageno: 1,
      isScroll: false,
      timer: null,
      leftList: [],
      rightList: [],
      isHeight: false,
      isFixed: false,
      kefu: localStorage.getItem("kefu"),
      timeDowm: 1800,
      countdown: "",
      loadingflag: true,
      isLoading: false,
      show: false,
      timer2: null,
      isTab: false,
      isShow: true,
    }
  },
  methods: {
    //头部fixed定位
    showSearch() {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > (this.$refs.topBox.getBoundingClientRect().height + this.$refs.topBox1.getBoundingClientRect().height)) {   // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.show = true;
      } else {
        this.show = false;
      }
    },
    clear() {
      localStorage.clear()
      sessionStorage.clear()
      this.$store.commit("settoken", "")
    },
    toBanner(item) {
      // console.log(item)
      window.location.href = item.url
    },
    toSort(item) {
      // console.log(item)
      if (item.url.startsWith("http") || item.url.startsWith("https")) {
        window.location.href = item.url
      } else {
        this.$router.push(item.url)
      }
    },
    toClass(item) {
      // "http://yxfmm.bjyxfl.com/cake2/#/orderfood"
      window.location.href = item.url + "?token=" + localStorage.getItem("token") + "&cityName=" + sessionStorage.getItem("cityName") + "&longitude=" + sessionStorage.getItem("longitude") + "&latitude=" + sessionStorage.getItem("latitude")
    },
    getadver() {
      let time = parseInt(new Date().getTime() / 1000) + '';
      // this.timeDowm = Number(this.orderDetail.expiretime) - time
      const countdownInterval = setInterval(() => {
        const minutes = Math.floor(this.timeDowm / 60);
        const seconds = this.timeDowm % 60;
        this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeDowm--;
        if (this.timeDowm <= 0) {
          clearInterval(countdownInterval);
          // 倒计时结束后的操作
          this.timeDowm = 1800
          this.getadver()
        }
        localStorage.setItem("timeDowm", this.timeDowm)
      }, 1000);
    },
    toCustomer() {
      window.location.href = this.kefu
    },
    toDetail(id) {
      // if (flag == 1) {
      this.$router.push({ path: "/productDetail", query: { id } })
      // }
      // if (this.flag == 2) {
      //   window.location.href = `http://yxfmm.bjyxfl.com/film/#/couponsdetail?id=` + this.listItem.id
      // }
    },
    input(e) {
      // this.shopList  = e
      // console.log(this.shopList,"3333333333333333333")
    },
    // 价格处理
    changePrice1(price) {
      return price.toString().includes(".") ? price.toString().split('.')[0] : price
    },
    changePrice2(price) {
      return price.toString().includes(".") ? Number(price).toFixed(2).toString().split('.')[1] : "00"
    },
    changeTab(id, index) {
      this.isHeight = true
      this.isScroll = false
      this.shopList = []
      this.pageno = 1
      this.active = id
      this.isTab = true
      document.documentElement.scrollTop += this.$refs.topScroll.getBoundingClientRect().top + 5
      this.getHot()
      this.timer2 = null
      if ((index + 1) >= 3) {
        this.$refs.topScroll.scrollLeft = 60 * (index + 1)
      } else {
        this.$refs.topScroll.scrollLeft = 0
      }
    },
    toNext(path) {
      this.$router.push(path)
    },
    onChange(index) {
      this.backColor = this.bannerList[index].yanse1 + ',' + this.bannerList[index].yanse2
      // if(this.$refs.bannerBox){
      //   setTimeout(() => {
      //     this.swiperHeight = (this.$refs.bannerBox.offsetWidth * 1.64).toFixed(0)
      //   }, 10)
      // }
    },
    ShopList(a) {
      this.itemHeight = a
    },
    getIndex() {
      getBookIndex().then(res => {
        // console.log(res)
        this.tabList = [
          {
            id: "0",
            img: "",
            title: "好书推荐",
            xtitle: "悦享热销",
          }
        ]
        this.funList = []
        if (res.code == 200) {
          this.bannerList = res.data.nav
          this.sortList = res.data.syclass
          res.data.tuclass.forEach(item => {
            if (item.id == 19) {
              item.path = "/hitList"
            } else if (item.id == 20) {
              item.path = "/newBook"
            }
          })
          this.funList = res.data.tuclass
          res.data.fenlei.forEach(item => {
            this.tabList.push(item)
          })
          this.active = this.tabList[0].id
          this.getHot()
        }
      })
    },
    getHot(type = this.active, pageno = this.pageno) {
      if (this.isTab) {
        this.shopList = []
      }
      this.isLoading = true
      getIndexBookList({
        type,
        pageno,
        pagesize: 10
      }).then(res => {
        this.isLoading = false
        setTimeout(() => {
          this.loadingflag = false
        }, 500)
        if (res.code == 200) {
          if (res.data.book_list.length == 0) {
            this.isScroll = true
            return
          }
          res.data.book_list.forEach(item => {
            this.shopList.push(item)
          })
          this.isTab = false
          // if(this.$refs.bannerBox){
          //   setTimeout(() => {
          //     this.swiperHeight = (this.$refs.bannerBox.getBoundingClientRect().height).toFixed(0)
          //   }, 200)
          // }
        }
      })
    },
    getCity(e) {
      this.isShow = false
    },
    toOther(path) {
      this.$router.push(path)
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight && !this.isTab) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        this.getHot()
      }
    },
    getCakeProduct() {
      getWinnowList({
        pageno: 1,
        pagesize: 10
      }).then(res => {
        if (res.code == 200) {
          this.flashSale = res.data.jingxuan_list
        }
      })
    },
  },
  created() {
    this.getIndex()
    this.getCakeProduct()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('scroll', this.showSearch);
    // setTimeout(() => {
    //   this.swiperHeight = (this.$refs.bannerBox.offsetWidth * 1.64 - this.itemHeight).toFixed(0)
    // }, 300)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
    window.removeEventListener('scroll', this.showSearch, false);
  },
}
</script>

<style scoped lang="less">
.location {
  padding-bottom: 50px;
  background-color: #F6F6F6;
  min-height: 100vh;
}

/deep/ .van-swipe__indicator {
  display: none;
}

.topBox {
  padding: 0px 10px 5px;
  overflow: hidden;

  //头部
  .topPage {
    //padding: 0px 15px;


    .title {
      text-align: center;
      color: white;
      font-size: 14px;
    }

    .address {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .searchBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      padding: 0px 20px;
      background-color: transparent;
    }


    .searchValue {
      width: 80%;
    }

    .van-search {
      padding-bottom: 6px;
      padding-top: 6px;
    }

    .van-search .van-cell {
      background-color: transparent;
    }

    .van-search__content {
      background-color: #ffffff;
      border-radius: 30px;
    }

    /deep/ .van-field__control {
      color: #92716D;
    }

    .customer {
      width: 23px;
    }
  }

  .banner {
    width: 100%;
    box-sizing: border-box;
  }

  .sortBox {
    border-radius: 10px;
    background-color: #fff;
    padding: 15px 7px;
    margin-top: 10px;

    .sortTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px 0px;
      //width: 87%;
      //margin: auto;

      .iconBox {
        width: 50px;
        width: 74%;
        margin: auto;
      }

      .sortText {
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        margin-top: 1px;
      }
    }

    .sortCenter {
      flex-wrap: wrap;
      color: #212226;
      width: 100%;

      .sortItem {
        width: 20%;
      }

      .iconImg {
        width: 52px;
        width: 75.4%;
        margin: auto;
      }
    }
  }

  .panicBuying {
    width: 100%;
    //height: 128px;
    background-size: 100% 100%;
    box-sizing: border-box;
    margin-top: 10px;
    // background-color: transparent;
    background: linear-gradient(180deg, #fbe8c2, #f8f4eb);
    padding: 0px 0px 4px 0;
    overflow: hidden;

    .panicTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // background-image: linear-gradient(to bottom, #F5EAEA, #F6F6F6);
      padding: 10px 10px 0px 25px;
      position: relative;

      .topImg {
        width: 16px;
        position: absolute;
        top: 10px;
        left: 9px;
      }

      .downtimeBack {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
      }

      .downtime {
        display: flex;
        align-items: center;
        font-size: 12px;
        gap: 3px;
        color: #DE1616;
        margin-top: -5px;
      }

      .time {
        color: white;
        background-color: #DE1616;
        border-radius: 5px;
        padding: 2px;
        width: 15px;
        height: 14px;
        line-height: 14px;
        text-align: center;
      }

      .panicImg {
        //width: 67px;
        font-weight: bold;
        font-size: 15px;
      }

      .text {
        font-size: 12px;
        color: #595858;
      }

      .more {
        //display: flex;
        //align-items: center;
        //gap: 5px;
        font-size: 10px;
        background-color: #3EA5FF;
        padding: 2px;
        width: 58px;
        text-align: center;
        border-radius: 30px;
        color: #EEF4FB;
      }
    }

    .birthdayBox {
      overflow-x: auto;
      overflow-y: hidden;
      margin-top: 5px;
      //background-color: white;
      border-radius: 10px;

      .birthday {
        display: flex;
        gap: 6px;
        padding: 3px 0px 5px;

        .listItem {
          width: 100%;
          padding-bottom: 5px;
          background-color: #fff;
          padding: 7px 1px 3px;
          border-radius: 5px;

          .textInfo {
            font-size: 12px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 2;
            /* 显示两行 */
            margin-top: 5px;
          }

          .hotText {
            color: #F0585E;
            border-radius: 30px;
            //text-align: center;
            font-size: 12px;
            //width: 70%;
            margin: auto;
            position: relative;
            z-index: 2;
            padding: 2px 0px;
            margin-top: 4px;
          }

          .title {
            font-size: 12px;
            font-weight: bold;
            color: #313131;
            padding-top: 3px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -webkit-line-clamp: 2;
            /* 显示两行 */
          }

          .shopInfo {
            padding: 0px 6px;
          }


          .oprice {
            font-size: 10px;
            color: #A1A1A1;
            text-decoration: line-through;
          }
        }
      }
    }


    .birthdayBox::-webkit-scrollbar {
      display: none
    }
  }

  .flexBox {
    width: 100%;
    margin-top: 7px;

    .toHome {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
  }
}

.imgTitle {
  border-radius: 10px;
}

.plus {
  color: white;
  background-color: #CA403E;
  border-radius: 50%;
  width: 13px;
  height: 13px;
  font-size: 12px;
  text-align: center;
  line-height: 13px;
  padding: 1px;
}

.priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.price {
  color: #CA4240;
  font-size: 14px;
  white-space: nowrap;
}

.price span {
  font-size: 15px;
}

.tabbar {
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 6px 15px;
  position: relative;
  box-sizing: border-box;

  .tabbarBox {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .tabItem {
    width: 100%;
  }

  .tabTop {
    //font-weight: bold;
    text-align: center;
    font-size: 15px;
  }

  .tabBottom {
    font-size: 12px;
    color: #A8A8A8;
    text-align: center;
    margin-top: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .tabTop2 {
    color: #115EA3;
  }

  .tabBottom2 {
    padding: 2px 3px 3px;
    width: 100%;
    margin: auto;
    margin-top: 5px;
    background-color: #3EA5FF;
    color: #F1F8FF;
    border-radius: 30px;
  }
}

.tabbar2 {
  position: fixed;
  top: -5px;
  left: 0;
  z-index: 99;
  width: 100%;
}


.listMax {
  padding: 0px 10px;
  padding-bottom: 10px;

  .bannerBox {
    width: 48%;
    margin-top: 10px;
  }

  .listBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    //gap: 6px;
    width: 100%;
    align-items: flex-start;
  }

  .listItem {
    width: 48.9%;
    background-color: white;
    border-radius: 10px;
  }
}

.shopImg {
  border-bottom-right-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
}

.imgMax {
  // width: 85%;
  //height: 103px;
  overflow: hidden;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  border-radius: 10px;
  margin: auto;
  max-height: 100px;
  //height: 51px;
}

.imgMax2 {
  //height: 164px;
}

//.van-swipe {
//  border-radius: 10px;
//}

.shopList {
  width: 48.9%;
  //width: 100%;
  margin-top: 10px;
}

.listBox2 {
  margin-top: -39px;
}

.imgBox {
  width: 100%;
  margin: auto;
}

.leftBox {
  display: flex;
  justify-content: space-between;
  //gap: 10px;
  margin-top: -10px;
}

.bannerImg {
  width: 100%;

  img {
    border-radius: 10px;
  }
}

.tabbar::-webkit-scrollbar {
  display: none
}

.fixedHeight {
  padding-top: 50px;
}

.isTab {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.model {
  background-color: transparent;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
}

.xtitle {
  position: absolute;
  left: 16px;
  top: 11px;

  .hotTitle {
    font-size: 14px;
  }

  .hotXtitle {
    color: #D37D58;
    font-size: 10px;
    padding-top: 3px;
    padding-left: 13px;
  }


    .tosee span {
    margin-top: 8px;
    padding: 4px 8px 2px 8px;
    display: inline-block;
    color: #ffffff;
    font-size: 12px;
    border-radius: 50px;
    background-color: #FE7C3A;
    text-align: center;
    line-height: 14px;
  }

  .tosee.cl0 span {
    background-color: #45C4FF;
  }

  .hotXtitle {
    color: #D37D58;
    font-size: 12px;
    padding-top: 3px;
    // padding-left: 13px;
  }

  .cl0 {
    color: #45C4FF !important;
  }

  .cl1 {
    color: #FE7C3A !important;
  }
  
}
</style>