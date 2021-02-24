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
                    
                    <Column field="name" header="Name"></Column>
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
                    <template #expansion="slotProps">
                        <div class="orders-subtable">
                            <h5>Orders for {{slotProps.data.name}}</h5>
                             <h3>Vertical</h3>
                            <Chart type="bar" :data="basicData" />

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
            expandedRowGroups: null,
            basicData: {
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
				]
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
    },
    mounted() {
        // this.customerService.getCustomersMedium().then(data => this.customers = data);
        // this.interval = setInterval(() => this.printf(), 10000);
        this.fetchUserFromBackend();
        this.fetchAlertFromBackend();
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
        fetchUserFromBackend(){
              axios
                .get('http://9765d24a760f.ngrok.io/getemployee')
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
                .get('http://9765d24a760f.ngrok.io/alert')
                // .then(response => (this.info = response))
                .then(response => (this.alertUser = response.data))
                // .then(response => (console.log(response.data)))
                .catch(error => console.log(error))
                // .finally(() => this.checkUser())
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
