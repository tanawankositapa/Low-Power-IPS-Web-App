<template>
    <div class="layout-content">
        <!-- <div class="content-section implementation"> -->
            <!-- <div class="card"> -->
                
                <Button icon="pi pi-align-justify" @click="visibleLeft = true" class="p-mr-2" />
                

                <Sidebar v-model:visible="visibleLeft" :baseZIndex="1000" class="navBar">
                    <human-avatar></human-avatar>
                    <!-- <h3 class="text">Left Sidebar</h3> -->
                    <ul>

                            <span class="p-buttonset navBtn">
                                <Button label="Map" icon="pi pi-map" iconPos="left" /><br>
                            
                            </span>
                        
                    </ul>
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
    }
}
</script>
<style scoped>
    .navBar {
  background: #022F6F;
  /* color: tomato; */
  
  
}
.text {
    color: white;
}

.navBtn{
    width: 100%;
}

    
</style>

