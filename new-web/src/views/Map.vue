<template lang="">
<div class="sider">
      <side-navbar></side-navbar>
    </div>
    <div class="content">
      <!-- <indoor-map :position-x="this.responsePosition[0]" :position-y="this.responsePosition[1]"></indoor-map> -->
      <indoor-map></indoor-map>
      <!-- {{this.responsePosition[0]}} -->
    </div>
    
</template>
<script>
/** อย่าตั้งชื่อ component ให้มันซ้ำกับ component ของ primevue ไม่งั้นมันจะขึ้น error ว่า Maximum call stack size exceeded เช่น ตอนแรกเราตั้งชื่อ component ว่า SideBar 
 * ซ
*/
import SideNavbar from '../components/SideNavbar.vue';
import IndoorMap from '../components/IndoorMap.vue';

export default {
    components: {
    IndoorMap,
    SideNavbar
  },
}
</script>
<style lang="">
    
</style>