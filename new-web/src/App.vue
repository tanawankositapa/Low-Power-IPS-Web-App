<template>
  <div class="main">
    <div class="sider">
      <side-navbar></side-navbar>
      <!-- <ul id="side">
        <li>
          <a href="#" >Room 606</a>
        </li>
      </ul> -->
    </div>
    <div class="content">
      <!-- <indoor-map :position-x="this.responsePosition[0]" :position-y="this.responsePosition[1]"></indoor-map> -->
      <indoor-map></indoor-map>
      <!-- {{this.responsePosition[0]}} -->
    </div>
  </div>
</template>

<script>
import IndoorMap from './components/IndoorMap.vue';
/** อย่าตั้งชื่อ component ให้มันซ้ำกับ component ของ primevue ไม่งั้นมันจะขึ้น error ว่า Maximum call stack size exceeded เช่น ตอนแรกเราตั้งชื่อ component ว่า SideBar 
 * ซ
*/
import SideNavbar from './components/SideNavbar.vue';
// import axios from 'axios';
export default {
  
  components: {
    IndoorMap,
    SideNavbar,
  },
  data() {
    return {
      // responsePosition : {},
    };
  },
  methods: {
    // setPosition(){
    //   console.log("Proxy",this.responsePosition);
    // }
  },
  mounted() {
    // axios
    //   .get('http://9f0868618c86.ngrok.io')
    //   // .then(response => (this.info = response))
    //   .then(response => (this.responsePosition = response.data))
    //   // .then(response => (console.log(response.data)))
    //   .catch(error => console.log(error))
    //   .finally(() => console.log(this.responsePosition))
  },
};
</script>

<style lang="scss">
@import "./App.scss";
</style>
