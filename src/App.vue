<template>
  <div id="app">
<!--    <keep-alive >-->
<!--      <router-view v-if="$route.meta.keepAlive"></router-view>-->
<!--    </keep-alive>-->
<!--    <router-view v-if="!$route.meta.keepAlive"></router-view>-->
    <router-view></router-view>
  </div>
</template>

<script>
import {getopenid} from "@/api/login";
import {getCityList} from "@/api/city";

export default {
  name: 'App',
  data() {
    return {
      wxCode: "",
      openid: "",
    }
  },
  methods: {
    getOpenId(code) {
      getopenid({
        code
      }).then(res => {
        this.aaaaaa = res
        if (res.code == 200) {
          this.openid = res.data.openid
          localStorage.setItem("openid", this.openid)
          window.history.go(-1)
        }
      })
    },
    // ///////微信登录
    getUrl() {
      let userAgent = navigator.userAgent;
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        sessionStorage.setItem("originUrl", location.href); // 用于ios分享
      }
      this.getBaseInfos();
    },

    // 编码函数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数

      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },

    getBaseInfos() {
      if (this.isWeiXin()) {
        const code = this.getUrlParam("code"); // 截取路径中的code
        if (code == null || code === "") {
          let url = "";
          let userAgent = navigator.userAgent;
          if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
            url = sessionStorage.getItem("originUrl");
          } else {
            url = window.location.href;
          }
          window.location.href =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05cc5223511e93c3&redirect_uri=" +
              encodeURIComponent(url) +
              "&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect";
          // window.close();
        }
        if (code != "" && code != null) {
          this.wxCode = code;
          // window.history.go(-1)
          this.getOpenId(code)
        }
      } else {
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
    // ///////微信登录\
    getCity(cityName){
      getCityList({
        apikey:this.$store.state.appkey
      }).then(res=>{
        // console.log(res);
        if(res.code==200){
          let id = res.data.filter(item=>cityName.includes(item.cityName))[0].cityId
          sessionStorage.setItem("targetId",id)
        }
      })
    },
  },
  created() {
    window.localStorage.setItem('scanUrl', location.href.split('#')[0])
    if (!localStorage.getItem("openid")) {
      this.getUrl()
    }
    this.$store.dispatch("getUserInfoAction")
    if (this.$route.query.token) {
      // console.log(this.$route.query.token)
      this.$store.commit("settoken",this.$route.query.token)
      localStorage.setItem("token", this.$route.query.token)
    }
    // localStorage.setItem("token", "decf5e8e95138a3cf454532efa747c4082469a9be62669d8c8148f298dde9718")
    if (this.$route.query.book) {
      sessionStorage.setItem("book", this.$route.query.book)
    //   sessionStorage.setItem("cake",1)
    }
    if (this.$route.query.cityName) {
      sessionStorage.setItem("cityName", this.$route.query.cityName)
      this.getCity(this.$route.query.cityName)
    //   sessionStorage.setItem("cake",1)
    }
    if (this.$route.query.longitude) {
      sessionStorage.setItem("longitude", this.$route.query.longitude)
      sessionStorage.setItem("latitude", this.$route.query.latitude)
    //   sessionStorage.setItem("cake",1)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.content {
  display: flex;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.van-dialog {
  border-radius: 20px !important;
}

.van-button__text {
  font-size: 13px !important;
}

/* .content{
  display: flex;
  flex-direction: column;
} */
</style>
