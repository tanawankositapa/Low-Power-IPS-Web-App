<template lang="">
    <div>
        <side-navbar></side-navbar>
    </div>
    <div class="layout-content wrapper ">
    <div class="content-section implementation wrapper">
    <div class="card content">
        <h3>ลงทะเบียนบุคคลใหม่</h3>
        <!-- dummy tag สำหรับการคำนวณ name = tempname+" "+surname เพราะไม่สามารถไป + กันใน data ได้-->
        <h3 v-show=false>{{name = tempname+" "+surname}}</h3>
        
        <form @submit.prevent="sendRegisterDataToBackend">
        <div class="p-field p-grid">
            <label for="firstname3" class="p-col-fixed" style="width:100px">ชื่อ</label>
            <div class="p-col">
                <InputText id="firstname3" type="text" v-model="tempname"/>
            </div>
        </div>
        <div class="p-field p-grid">
            <label for="lastname3" class="p-col-fixed" style="width:100px">นามสกุล</label>
            <div class="p-col">
                <InputText id="lastname3" type="text" v-model="surname" />
            </div>
        </div>
        <!-- <div class="p-formgroup-inline">
            <div class="p-field-radiobutton">
                <RadioButton id="employee" name="city2" value="true" v-model="isemployee" />
                <label for="employee">พนักงานในบริษัท</label>
            </div>
            <div class="p-field-radiobutton">
                <RadioButton id="outsource" name="city3" value="false" v-model="isemployee" />
                <label for="outsource">บุคคลภายนอก</label>
            </div>
        </div> -->
        <div class="p-field p-grid">
            <label for="firstname3" class="p-col-fixed" style="width:100px">แผนก</label>
            <div class="p-col">
                <InputText id="firstname3" type="text" v-model="department" />
            </div>
        </div>
        <!-- <div class="p-field p-grid">
            <label for="lastname3" class="p-col-fixed" style="width:100px">บริษัท</label>
            <div class="p-col">
                <InputText id="lastname3" type="text" v-model="company"/>
            </div>
        </div> -->
        <div class="p-field p-grid">
            <label for="lastname3" class="p-col-fixed" style="width:100px">หมายเลขอุปกรณ์</label>
            <div class="p-col">
                <InputText id="lastname3" type="text" v-model="trackerid" />
            </div>
        </div>
        <div class="p-field p-grid">
            <label for="lastname3" class="p-col-fixed" style="width:100px">MAC Address</label>
            <div class="p-col">
                <InputText id="lastname3" type="text" v-model="macaddress" />
            </div>
        </div>
        <Button class="p-mt-2 navBtn" label="Register" type="submit"  ></Button>
        </form>
    </div>
    </div>
    </div>
</template>
<script>
/** ระบบนี้เป็นการลงทะเบียนสำหรับพนักงานที่จะใช้ tracker เท่านั้น สำหรับเจ้าหน้าที่ monitor จะไม่มีระบบลงทะเบียนให้
 * เนื่องจากระบบ monitor จะให้เจ้าหน้าที่บางคนใช้เท่านั้น หากมีระบบลงทะเบียน ก็อาจจะมีพนักงานคนอื่นแอบมาลงทะเบียน เพื่อเข้าใช้งานเว็บได้
 * เราจึงจะใช้ programmer หรือ admin ในการสร้าง username และ password ให้ ถ้าพนักงานคนอื่นไม่รู้ ก็ไม่สามารถใช้งานเว็บได้แน่นอน
 * 
 */
import SideNavbar from '../components/SideNavbar.vue';
import axios from 'axios';
export default {
    data() {
        return {
            tempname: "",
            surname: "",
            name: "",
            isemployee: false,
            department: "",
            company: "",
            trackerid: "",
            macaddress: "",
        }
    },
    components: {
        SideNavbar
    },
    methods: {
        sendRegisterDataToBackend(){
            axios.post('http://a704fa885753.ngrok.io/register', {data: this.$data})
            // axios.post('http://81ffb0a9aeec.ngrok.io/register', {username: this.username, password: this.password})
            .then(response => (this.isLoginSucess = response.data))
            .catch(error => console.log(error))
            // .finally(() => this.checkLoginStatus())
    //         .then(function () {
    //    //do something
    // });
            
            },
            checkLoginStatus(){
                console.log("Login Status: ",this.isLoginSucess);
                if(this.isLoginSucess){
                    this.$router.push('/map');
                }else{
                    this.display = true;
                }
            }
    },
}
</script>
<style scoped>
    .wrapper{
    height: 100%;
}
.content{
    margin-top: 30px;
    margin-left: 36%;
    margin-right: 37%;
}
.navBtn{
    margin-left: 65%;
}
</style>