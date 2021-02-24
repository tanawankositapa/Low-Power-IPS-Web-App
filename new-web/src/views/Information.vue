<template>
    <div class="layout-content">
        
        <div class="content-section implementation">
            <div class="card">
                <h5>Subheader Grouping</h5>
                <p>Group customers by their representative.</p>
                <DataTable :value="user.data" rowGroupMode="subheader" groupRowsBy="department"
                    sortMode="single" sortField="department" :sortOrder="1" scrollable scrollHeight="400px">
                    <!-- <Column field="name" header="Representative"></Column> -->
                    <Column field="name" header="Name"></Column>
                    <Column field="surname" header="surname"></Column>
                    <Column field="status" header="Status">
                        <!-- <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template> -->
                    </Column>
                    <Column field="date" header="Date"></Column>
                   <template #groupheader="slotProps">
                        <!-- <img :alt="slotProps.data.representative.name" :src="'demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" /> -->
                        <span class="image-text">{{slotProps.data.department}}</span>
                    </template>
                    <template #groupfooter="slotProps">
                        <!-- <td colspan="4" style="text-align: right">Total Customers</td> -->
                        <td>{{calculateCustomerTotal(slotProps.data.department)}}</td>
                    </template>
                </DataTable>
            </div>

            <!-- <div class="card">
                <h5>Expandable Row Groups</h5>
                <p>Group customers by their representative.</p>
                <DataTable :value="customers.data" rowGroupMode="subheader" groupRowsBy="department"
                    sortMode="single" sortField="department" :sortOrder="1"
                    :expandableRowGroups="true" v-model:expandedRowGroups="expandedRowGroups"
                    @rowgroupExpand="onRowGroupExpand" @rowgroupCollapse="onRowGroupCollapse">
                    <Column field="representative.name" header="Representative"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="country" header="Country">
                        <template #body="slotProps">
                            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="20" />
                            <span class="image-text">{{slotProps.data.country.name}}</span>
                        </template>
                    </Column>
                    <Column field="company" header="Company"></Column>
                    <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template>
                    </Column>
                    <Column field="date" header="Date"></Column>
                    <template #groupheader="slotProps">
                        <img :alt="slotProps.data.representative.name" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="20" style="vertical-align: middle" />
                        <span class="image-text">{{slotProps.data.representative.name}}</span>
                    </template>
                    <template #groupfooter="slotProps">
                        <td colspan="4" style="text-align: right">Total Customers</td>
                        <td>{{calculateCustomerTotal(slotProps.data.representative.name)}}</td>
                    </template>
                </DataTable>
            </div>

            <div class="card">
                <h5>RowSpan Grouping</h5>
                <DataTable :value="customers.data" rowGroupMode="rowspan"  groupRowsBy="representative.name"
                    sortMode="single" sortField="representative.name" :sortOrder="1">
                    <Column header="#" headerStyle="width:3em">
                        <template #body="slotProps">
                            {{slotProps.index}}
                        </template>
                    </Column>
                    <Column field="representative.name" header="Representative">
                        <template #body="slotProps">
                            <img :alt="slotProps.data.representative.name" src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="20" style="vertical-align: middle" />
                            <span class="image-text">{{slotProps.data.representative.name}}</span>
                        </template>
                    </Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="country" header="Country">
                        
                    </Column>
                    <Column field="company" header="Company"></Column>
                    <Column field="status" header="Status">
                        <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template>
                    </Column>
                    <Column field="date" header="Date"></Column>
                </DataTable>
            </div> -->
		</div>
    </div>
</template>

<script>
// import CustomerService from '../service/CustomerService';
import data from '../../public/data/test.json'
import axios from 'axios';
export default {
    data() {
        return {
            user: data,
            expandedRowGroups: null
        }
    },
    customerService: null,
    created() {
        // this.customerService = new CustomerService();
        this.fetchDataFromBackend();
        this.interval = setInterval(() => this.fetchDataFromBackend(), 10000);
    },
    mounted() {
        // this.customerService.getCustomersMedium().then(data => this.customers = data);
        // this.interval = setInterval(() => this.printf(), 10000);
        this.fetchDataFromBackend();
    },
    methods: {
        // onRowGroupExpand(event) {
        //     // this.$toast.add({severity: 'info', summary: 'Row Group Expanded', detail: 'Value: ' + event.data, life: 3000});
        // },
        // onRowGroupCollapse(event) {
        //     // this.$toast.add({severity: 'success', summary: 'Row Group Collapsed', detail: 'Value: ' + event.data, life: 3000});
        // },
        calculateCustomerTotal(name) {
            let total = 0;
            console.log("name: ",name);
            if (this.user) {
                console.log("name: ",name);
                for (var use in this.user.data) {
                    console.log("yolo: ",name);
                    console.log("namqe: ",use);
                    console.log("nameee: ",this.user.data[use].department);
                    if (this.user.data[use].department === name) {
                        total++;
                    }
                }
            }

            return total;
        },
        fetchDataFromBackend(){
              axios
                .get('http://9765d24a760f.ngrok.io/getemployee')
                // .then(response => (this.info = response))
                .then(response => (this.user = response.data))
                // .then(response => (console.log(response.data)))
                .catch(error => console.log(error))
                .finally(() => this.checkUser())
            },
        checkUser(){
            // console.log("User is here: ",this.user[0].name);
            for(var i in this.user){
                console.log("Name: ",this.user[i].department);
            }
            // console.log("Type of User is here: ",typeof(this.user));
            console.log("Type of User is here: ",this.user.data);
        },
        // printf(){
        //     console.log("Type of data: ",this.customers);
        // }

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
