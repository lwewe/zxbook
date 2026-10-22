<template>
  <div class="address">
    <div class="title">请选择地址</div>
    <div class="choose">
      <div class="chooseItem" @click="change">{{ province ? province : '请选择' }}</div>
      <div class="chooseItem" v-if="city">{{ city ? city : '请选择' }}</div>
      <div class="chooseItem" v-if="county">{{ county ? county : '请选择' }}</div>
    </div>
    <!--    地区列表-->
    <div class="addressList">
      <div class="addrssItem" v-for="item in addressList" :key="item.id"
           @click="chanegAddress(item.id,item.name,item.type,item)">
        <div :class="{success:selectId==item.id}">{{ item.name }}</div>
        <div class="success" v-if="selectId==item.id">
          <van-icon name="success"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


import {getBookCity, getBookCounty, getBookScprovince} from "@/api/bookAddress";

export default {
  name: "Address",
  data() {
    return {
      selectId: null,
      addressList: [],
      province: "",
      city: "",
      county: "",
      allAddress: "",
      province_id: "",
      city_id: "",
      county_id: "",
      town_id: "",
    }
  },
  methods: {
    change() {
      this.province = ""
      this.city = ""
      this.county = ""
      this.getScprovinceList()
    },
    close() {
      this.$emit("chanegTown", false)
      this.allAddress = this.province + " " + this.city + " " + this.county
      let dataId = {
        province_id: this.province_id,
        city_id: this.city_id,
        county_id: this.county_id,
      }
      this.$emit("getAddress", this.allAddress, dataId)
    },
    chanegAddress(id, name, type,item) {
      console.log(item)
      if (type == "province") {
        this.province = name
        //   获取市
        this.province_id = id
        this.getSccityList(this.province_id)
      } else if (type == "city") {
        this.city = name
        this.city_id = id
        // 获取区
        this.getSccountyList(this.city_id)
      } else if (type == "county") {
        this.county = name
        this.county_id = id
        this.close()
      }
    },
    //   省
    getScprovinceList() {
      this.addressList = []
      getBookScprovince().then(res => {
        if (res.code == 200) {

              res.data.province_list.forEach(item=>{
                this.addressList.push({
                  ...item,
                  type:"province"
                })
              })
          if (!this.addressList) {
            this.close()
          }
        }
      })
    },
    //   市
    getSccityList(province_id) {
      this.addressList = []
      getBookCity({
        province_id
      }).then(res => {
        if (res.code == 200) {
          res.data.city_list.forEach(item=>{
            this.addressList.push({
              ...item,
              type:"city"
            })
          })
          if (!this.addressList) {
            this.close()
          }
        }
      })
    },
    //   区
    getSccountyList(city_id) {
      this.addressList = []
      getBookCounty({
        city_id
      }).then(res => {
        if (res.code == 200) {
          res.data.city_list.forEach(item=>{
            this.addressList.push({
              ...item,
              type:"county"
            })
          })
          if (!this.addressList) {
            this.close()
          }
        }
      })
    },
  },
  created() {
    this.getScprovinceList()
  }
}
</script>

<style scoped lang="less">
.address {
  padding: 10px;
}

.title {
  text-align: center;
}

.choose {
  padding: 5px 0px 10px;
  border-bottom: 1px solid #F6F6F6;
  display: flex;
  align-items: center;
  //justify-content: space-around;
  gap: 5px;

  .chooseItem {
    border-bottom: 2px solid #3392FE;
    padding: 15px 0px;
    color: #ADADAD;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 20%;
    text-align: center;
  }

  .screen {
    width: 40%;
  }
}

.addressList {
  margin-top: 10px;
  font-size: 15px;

  .addrssItem {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .success {
    color: #3392FE;
  }
}
</style>