<template>
    <div>
        <side-navbar></side-navbar>
    </div>
    <div class="layout-content">
        
        <div class="content-section implementation">
            <div class="card">
                <h5>Subheader Grouping</h5>
                <p>Group customers by their representative.</p>
                <DataTable :value="user.data" rowGroupMode="subheader" groupRowsBy="department"
                    sortMode="single" sortField="department" :sortOrder="1" v-model:expandedRows="expandedRows" scrollable scrollHeight="400px">
                    <!-- <Column :expander="true" ></Column> -->
                    
                    <Column field="name" header="Name" ></Column>
                    <Column field="surname" header="surname"></Column>
                    <Column field="status" header="Status">
                        <!-- <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template> -->
                    </Column>
                    <Column field="date" header="Date"></Column>
                    <Column :expander="true" headerStyle="width: 3rem" />
                   <template #groupheader="slotProps">
                        <!-- <img :alt="slotProps.data.representative.name" :src="'demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" /> -->
                        <span class="image-text">{{slotProps.data.department}}</span>
                    </template>
                    <template #groupfooter="slotProps">
                        <!-- <td colspan="4" style="text-align: right">Total Customers</td> -->
                        <td>{{calculateUserTotal(slotProps.data.department)}}</td>
                    </template>
                    <template #expansion="slotProps" @click="test">
                        <div class="orders-subtable">
                            <h5>เวลาทำงานของ {{slotProps.data.name +" "+ slotProps.data.surname}}</h5>
                             <h3>Vertical</h3>
                             {{slotpropName = slotProps.data.name + slotProps.data.surname}}
                             {{test(slotpropName)}}
                            <Chart type="bar" :data="basicData.SomchaiKositapa" />

                        </div>
                    </template>
                   
                </DataTable>
            </div>
                            
            <div class="card">
                <h5>Subheader Grouping</h5>
                <p>Group customers by their representative.</p>
                <DataTable :value="alertUser.data" rowGroupMode="subheader" groupRowsBy="areaname"
                    sortMode="single" sortField="areaname" :sortOrder="1" scrollable scrollHeight="400px">
                    <!-- <Column field="name" header="Representative"></Column> -->
                    <Column field="name" header="Name"></Column>
                    <!-- <Column field="surname" header="surname"></Column> -->
                    <Column field="status" header="Status">
                        <!-- <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template> -->
                    </Column>
                    <Column field="date" header="Date"></Column>
                   <template #groupheader="slotProps">
                        <!-- <img :alt="slotProps.data.representative.name" :src="'demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" /> -->
                        <span class="image-text">{{slotProps.data.areaname}}</span>
                    </template>
                    <template #groupfooter="slotProps">
                        <!-- <td colspan="4" style="text-align: right">Total Customers</td> -->
                        <td>{{calculateAlertUserTotal(slotProps.data.areaname)}}</td>
                    </template>
                </DataTable>
            </div>

            

           
		</div>
    </div>
</template>

<script>
// import CustomerService from '../service/CustomerService';
// import data from '../../public/data/test.json'
import axios from 'axios';
import SideNavbar from '../components/SideNavbar';
export default {
    data() {
        return {
            user: null,
            alertUser: null,
            workTime:null,
            expandedRowGroups: null,
            slotpropName: "",
            basicData: {
                // username: "",
				// labels: [],
				// datasets: [
				// 	{
				// 		label: 'My First dataset',
				// 		backgroundColor: '#42A5F5',
				// 		data: []
				// 	},
				// 	{
				// 		label: 'My Second dataset',
				// 		backgroundColor: '#FFA726',
				// 		data: [28, 48, 40, 19, 86, 27, 90]
				// 	}
				// ]
                SomchaiKositapa:{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                
                    datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: '#42A5F5',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: 'My Second dataset',
                        backgroundColor: '#FFA726',
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]}
			},
            expandedRows: [],
        }
    },
    components:{
        SideNavbar
    },
    customerService: null,
    created() {
        // this.customerService = new CustomerService();
        this.fetchUserFromBackend();
        this.interval = setInterval(() => this.fetchUserFromBackend(), 10000);
        this.fetchAlertFromBackend();
        this.interval = setInterval(() => this.fetchAlertFromBackend(), 10000);
        this.fetchWorkTimeFromBackend();
        this.interval = setInterval(() => this.fetchWorkTimeFromBackend(), 10000);
    },
    mounted() {
        // this.customerService.getCustomersMedium().then(data => this.customers = data);
        // this.interval = setInterval(() => this.printf(), 10000);
        this.fetchUserFromBackend();
        this.fetchAlertFromBackend();
        this.fetchWorkTimeFromBackend();
    },
    methods: {
        // onRowGroupExpand(event) {
        //     // this.$toast.add({severity: 'info', summary: 'Row Group Expanded', detail: 'Value: ' + event.data, life: 3000});
        // },
        // onRowGroupCollapse(event) {
        //     // this.$toast.add({severity: 'success', summary: 'Row Group Collapsed', detail: 'Value: ' + event.data, life: 3000});
        // },
        calculateUserTotal(name) {
            let total = 0;
            // console.log("name: ",name);
            if (this.user) {
                // console.log("name: ",name);
                for (var use in this.user.data) {
                    // console.log("yolo: ",name);
                    // console.log("namqe: ",use);
                    // console.log("nameee: ",this.user.data[use].department);
                    if (this.user.data[use].department === name) {
                        total++;
                    }
                }
            }

            return total;
        },
        calculateAlertUserTotal(areaname) {
            let total = 0;
            // console.log("name: ",name);
            if (this.alertUser) {
                // console.log("name: ",name);
                for (var alert in this.alertUser.data) {
                    // console.log("yolo: ",name);
                    // console.log("namqe: ",use);
                    // console.log("nameee: ",this.user.data[use].department);
                    if (this.alertUser.data[alert].department === areaname) {
                        total++;
                    }
                }
            }

            return total;
        },
        insertLabel(){
          for(var label in this.workTime.data){
              if(this.basicData.labels.indexOf(this.workTime.data[label]._id.areaname) == -1){
                    // console.log("Labels: ", this.workTime.data[label]._id.areaname);
                    this.basicData.labels.push(this.workTime.data[label]._id.areaname)
                }
                // this.basicData.datasets.data.push(this.workTime.data[label].total/60)
                // console.log("Ho ",this.basicData.datasets[0].label);
          }  
          this.workTime.data[label]._id.name
          this.basicData.push({})
        //   this.workTime.data[label].total
        //   console.log("OLO", this.basicData.labels);
        },
        test(objectKey){
            // alert("OMG");
            console.log(objectKey);
            // this.basicData.push()
        },
        fetchUserFromBackend(){
              axios
                .get('http://15ff031dccaf.ngrok.io/getemployee')
                // .then(response => (this.info = response))
                .then(response => (this.user = response.data))
                // .then(response => (console.log(response.data)))
                .catch(error => console.log(error))
                // .finally(() => this.checkUser())
            },
        // checkUser(){
        //     // console.log("User is here: ",this.user[0].name);
        //     for(var i in this.user){
        //         console.log("Name: ",this.user[i].department);
        //     }
        //     // console.log("Type of User is here: ",typeof(this.user));
        //     console.log("Type of User is here: ",this.user.data);
        // },
        // printf(){
        //     console.log("Type of data: ",this.customers);
        // }
        fetchAlertFromBackend(){
              axios
                .get('http://15ff031dccaf.ngrok.io/alert')
                // .then(response => (this.info = response))
                .then(response => (this.alertUser = response.data))
                // .then(response => (console.log(response.data)))
                .catch(error => console.log(error))
                // .finally(() => this.checkUser())
            },
        fetchWorkTimeFromBackend(){
              axios
                .get('http://15ff031dccaf.ngrok.io/worktime')
                // .then(response => (this.info = response))
                .then(response => (this.workTime = response.data))
                // .then(response => (console.log(response.data)))
                .catch(error => console.log(error))
                // .finally(() => console.log("Worktime: ", this.workTime.data));
                .finally(() => this.insertLabel());
            },
    }
}
</script>


<style lang="scss" scoped>
.p-rowgroup-footer td {
    font-weight: 700;
}

::v-deep(.p-rowgroup-header) {
    span {
        font-weight: 700;
    }

    .p-row-toggler {
        vertical-align: middle;
        margin-right: .25rem;
    }
}
.image-text {
    vertical-align: middle;
}
img {
    vertical-align: middle;
}
</style>
