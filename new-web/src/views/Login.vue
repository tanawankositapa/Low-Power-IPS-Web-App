<template lang="">
<div class="fullheight">
<div class="layout-content wrapper ">
    <div class=" implementation wrapper">
    <div class="card content">
        <div class="container">
            <div class="p-fluid">
                <form @submit.prevent="sendLoginDataToBackend">
                    <div class="p-field">
                        <span class="p-float-label">
                            <InputText id="firstname" type="text"  v-model="username" />
                            <label for="firstname">Username</label>
                        </span>
                    </div>
                    <div class="p-field">
                        <span class="p-float-label">
                            <InputText id="lastname" type="text"  v-model="password" />
                            <label for="lastname">Password</label>
                        </span>
                    </div>
                    <div class="p-field p-grid">
            <!-- <router-link :to="{ name: 'Map' }" class="navBtn" :disabled="!isLoginSucess"><Button class="p-mt-2 navBtn" label="Login" type="submit" ></Button></router-link> -->
                    <Button class="p-mt-2 navBtn" label="Login" type="submit"  ></Button>
                    </div>
                </form>
</div>

        
        </div>
    </div>
    </div>
</div>
</div>
<Dialog header="Alert!" v-model:visible="display" :modal="true" >
	Please check your username or password
</Dialog>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      isLoginSucess: false,
      display: false,
    };
  },
  methods: {
    sendLoginDataToBackend() {
      //   axios.post('http://localhost:81/lnt/public/member/car_result', {data: this.$data})
      axios
        .post("http://localhost:3000/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => (this.isLoginSucess = response.data))
        .catch((error) => console.log(error))
        .finally(() => this.checkLoginStatus());
      //         .then(function () {
      //    //do something
      // });
    },
    checkLoginStatus() {
      console.log("Login Status: ", this.isLoginSucess);
      if (this.isLoginSucess) {
        this.$router.push("/map");
        
        localStorage.setItem('Status',this.isLoginSucess)
      } else {
        this.display = true;
        // alert(localStorage.getItem('Status'))
      }
    },
  },
  created() {
    // this.interval = setInterval(() => this.sendLoginDataToBackend(), 10000);
  },
  
};
</script>
<style scoped>


.wrapper {
  height: 100%;
}
.content {
  margin-top: 150px;
  margin-left: 37%;
  margin-right: 37%;
}
.navBtn {
  margin-left: 74%;
  margin-right: 2%;
}
a {
  text-decoration: none;
}
.p-field {
  margin-top: 25px;
}
</style>