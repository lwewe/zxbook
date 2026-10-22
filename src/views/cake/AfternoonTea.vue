<template>
  <div class="conPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'rgba(218,218,218,0.26)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="banner">
      <img class="img" :src="banner" alt="">
    </div>
    <!--    列表-->
    <div class="listBox">
     <div v-for="(item,index) in productList" :key="item.id">
       <NewProductList :listItem="item" :change="1" :index="index"></NewProductList>
     </div>
      <loading style="margin-top: 2px" v-if="isLoading"></loading>
    </div>
  </div>
</template>
<script>
import {getCakeProductList, getHotSalesList} from "@/api";
import NewProductList from "@/components/NewProductList.vue";

export default {
  components: {NewProductList},
  data(){
    return{
      banner:"",
      pageno:1,
      isScroll:false,
      productList:[],
      isLoading:false,
      loadingflag:true
    }
  },
  methods:{
    getCakeProduct(pageno = this.pageno) {
      this.isLoading = true
      getHotSalesList({
        pageno,
        pagesize:10
      }).then(res => {
        // console.log(res)
        this.isLoading = false
        this.loadingflag = false
        if(res.code==200){
          this.banner = res.data.banner.img
          if(res.data.rexiao_list.length==0){
            this.isScroll = true
            return
          }
          res.data.rexiao_list.forEach(item=>{
            this.productList.push(item)
          })
        }
      })
    },
    //滚动条事件
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // console.log(Math.ceil(scrollTop + clientHeight), scrollHeight)
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },
    onMost() {
      // console.log(this.isScroll)
      if (!this.isScroll) {
        this.pageno++
        // console.log(this.active,this.pageno)
        this.getCakeProduct(this.pageno)
      }
    }
  },
  created() {
    // this.banner = this.$route.query.banner
    this.getCakeProduct()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, false);
  },
}
</script>


<style scoped lang="less">
.conPage {
  min-height: 100vh;
  background-color: #FFDBC7;
}

.banner {
  width: 100%;
  display: flex;
}
.listBox{
  padding: 0px 10px 10px;
  margin-top: -2px;
}
</style>