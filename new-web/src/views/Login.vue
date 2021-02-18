<template lang="">

<div class="layout-content wrapper ">
    <div class="content-section implementation wrapper">
    <div class="card content">
        <div class="container">
            <div class="p-fluid">
                <form @submit.prevent="sendLoginDataToBackend">
                    <div class="p-field">
                        <label for="firstname">Username</label>
                        <InputText id="firstname" type="text" placeholder="enter your username" v-model="username" />
                    </div>
                    <div class="p-field">
                        <label for="lastname">Password</label>
                        <InputText id="lastname" type="text" placeholder="enter your password" v-model="password" />
                    </div>
                    <div class="p-field p-grid">
            <!-- <router-link :to="{ name: 'Map' }" class="navBtn"><Button class="p-mt-2" label="Login" type="submit" ></Button></router-link> -->
            <Button class="p-mt-2 navBtn" label="Login" type="submit" ></Button>
        </div>
                </form>
</div>

        
        </div>
    </div>
    </div>
</div>

</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            username: "",
            password: "",
            isLoginSucess: false,
        }
    },
    methods: {
        sendLoginDataToBackend(){
            //   axios.post('http://localhost:81/lnt/public/member/car_result', {data: this.$data})
            axios.post('http://e6894548ed58.ngrok.io/login', {username: this.username, password: this.password})
            .then(function () {
       //do something
    });
            }
    },
    created() {
        // this.interval = setInterval(() => this.sendLoginDataToBackend(), 10000);
    },
}
</script>
<style scoped>
.wrapper{
    height: 100%;
}
.content{
    margin-top: 150px;
    margin-left: 35%;
    margin-right: 40%;
}
.navBtn{
    margin-left: 74%;
}
 a {
    text-decoration: none;
}   
</style>