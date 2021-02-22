<template>
    <div class="layout-content">
        <!-- <div class="content-section implementation"> -->
            <!-- <div class="card"> -->
                
                <Button icon="pi pi-align-justify" @click="visibleLeft = true" class="p-mr-2" />
                

                <Sidebar v-model:visible="visibleLeft" :baseZIndex="1000" class="navBar">
                    <div class="invisBox">

                    </div>
                    <human-avatar></human-avatar>
                    <!-- <h3 class="text">Left Sidebar</h3> -->
                    <div class="invisBox">

                    </div>

                            
                                <router-link :to="{ name: 'Map' }" ><Button class="navBtn p-mt-2" label="Map" icon="pi pi-map" iconPos="left" /></router-link>
                                <router-link :to="{ name: 'Information' }" ><Button class="navBtn p-mt-2" label="Infomation" icon="pi pi-chart-bar" iconPos="left" /></router-link>
                                <router-link :to="{ name: 'Register' }" ><Button class="navBtn p-mt-2" label="Register" icon="pi pi-user-plus" iconPos="left" /></router-link>
                                <Button class="navBtn p-mt-2" label="Log out" icon="pi pi-sign-out" iconPos="left" @click="logoutHandle"/> 
                            <!-- ในอนาคตเราจะต้องทำบางอย่างตอน logout เราจึงให้มัน route ผ่าน onclick function ดีกว่า จะได้เขียน logic เพิ่มไปได้ภายหลัง เช่น การตั้งสภานะเป็น logout -->
                        
                    
                </Sidebar>

                
            <!-- </div> -->
        <!-- </div> -->
    </div>
</template>

<script>
import HumanAvatar from './HumanAvatar'
export default {
    data() {
        return {
            visibleLeft: false,
            
        }
    },
    components: {
        HumanAvatar,
    },
    methods: {
        logoutHandle(){
            this.$router.push("/")
        }
    },
}
</script>
<style scoped>
    .navBar {
  background: #022F6F;
  /* width: 250px; */
  /* color: tomato; */
  
  
}
.text {
    color: white;
}

.navBtn{
    width: 100%;
    background: #022F6F;
    outline-color:#022F6F ;
    /* margin-top: 10px; */
    outline:0;
}
.navSpan{
    /* margin-top: 100px; */
    /* padding-top: 100px; */
    outline:0
}
.invisBox{
    height: 50px;
}
a {
    text-decoration: none;
}   
</style>

