<template>
  <div>
    <div style="text-align: right">
      <button class="toggle" @click="drawerVisible = true">
        &#8942;&#8942;&#8942; Show Menu
      </button>
    </div>
    
    
    <div class="right-drawer" :style="{ width: drawerVisible ? '25vw' : '0', paddingLeft: drawerVisible ? '10px' : '0', }">
      <div style="text-align: right; margin: 5px">
        <button class="close" @click="drawerVisible = false">&#9587;</button>
      </div>
      <h1>Menu</h1>
      <h4>Home</h4>
      <h4>About</h4>
      <h4>Stories</h4>
      <h4>Testimonials</h4>
      <h4>Contact</h4>
    </div>
    
    <div class="drawer-mask" :style="{ width: drawerVisible ? '100vw' : '0', opacity: drawerVisible ? '0.6' : '0', }" @click="drawerVisible = false"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawerVisible: false,
    };
  },
};
</script>

<style scoped>
#app {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: 400;
  color: #0ca3a3;
}

h1 {
  color: teal;
}

a {
  color: tomato;
}

.toggle {
  width: 120px;
  background: white;
  color: tomato;
  border: 0;
  padding: 5px;
  cursor: pointer;
}

.close {
  background: white;
  border: 0;
  cursor: pointer;
}

.right-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 0; /* initially */
  overflow: hidden;
  height: 100vh;
  padding-left: 0; /* initially */
  border-left: 1px solid whitesmoke;
  background: white;
  z-index: 200;
  transition: all 0.2s;
}

.drawer-mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 0; /* initially */
  height: 100vh;
  background: #000;
  opacity: 0.3;
  z-index: 199;
  transition: opacity 0.2s;
}
</style>
