<template>
  <div>
    <side-navbar></side-navbar>
  </div>
  <div class="layout-content">
    <div class="content-section implementation">
      <div class="card">
        <h5>ตารางแจงเวลาที่พนักงานอยู่ในพื้นที่ หน่วยเป็นชั่วโมง</h5>
        <p>แสดงเป็นกลุ่มตามแผนก</p>
        <DataTable
          :value="user.data"
          rowGroupMode="subheader"
          groupRowsBy="department"
          sortMode="single"
          sortField="department"
          :sortOrder="1"
          v-model:expandedRows="expandedRows"
          scrollable
          scrollHeight="1100px"
        >
          <!-- <Column :expander="true" ></Column> -->

          <Column field="name" header="Name"></Column>

          <!-- <Column field="status" header="Status"> -->
          <!-- <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template> -->
          <!-- </Column> -->
          <!-- <Column field="date" header="Date"></Column> -->
          <Column :expander="true" headerStyle="width: 3rem" />
          <template #groupheader="slotProps">
            <!-- <img :alt="slotProps.data.representative.name" :src="'demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" /> -->
            <span class="image-text">{{ slotProps.data.department }}</span>
          </template>
          <template #groupfooter="slotProps">
            <td colspan="0" style="text-align: left">Total People</td>
            <td>{{ calculateUserTotal(slotProps.data.department) }}</td>
          </template>
          <template #expansion="slotProps" @click="test">
            <div class="orders-subtable">
              <h5>เวลาทำงานของ {{ slotProps.data.name }}</h5>
              {{ (slotpropName = slotProps.data.name) }}
              <!-- {{oloz = basicData.indexOf(slotpropName)}} -->

              <h3 v-show="false">
                {{
                  (index = basicData.findIndex(
                    (x) => x.username === slotpropName
                  ))
                }}
              </h3>
              <!-- {{test(index)}} -->
              <Chart type="bar" :data="basicData[index]" width="700" height="300"/>
              <!-- เราจะต้องอ้างอิงด้วย slotProps.data.name ก็อาจจะให้มัน insert object เข้าไปใน basicData โดยinsert slotProps.data.name เป็น key เข้าไป -->
            </div>
          </template>
        </DataTable>
      </div>

      <div class="card">
        <h5>ตารางแสดงบุคคลที่มีการละเมิดเข้าพื้นที่หวงห้าม</h5>
        <p>แสดงบุคคลผู้ละเมิดในแต่ละพื้นที่</p>
        <DataTable
          :value="alertUser.data"
          rowGroupMode="subheader"
          groupRowsBy="areaname"
          sortMode="single"
          sortField="areaname"
          :sortOrder="1"
          scrollable
          scrollHeight="400px"
        >
          <!-- <Column field="name" header="Representative"></Column> -->
          <!-- field จะอ้างอิงไปยัง field ใน alertUser.data ได้ทันที -->
          <Column field="name" header="Name"></Column>
          <!-- <Column field="surname" header="surname"></Column> -->
          <Column field="trackerid" header="TrackerID">
            <!-- <template #body="slotProps">
                            <span :class="'customer-badge status-' + slotProps.data.status">{{slotProps.data.status}}</span>
                        </template> -->
          </Column>
          <Column field="timestamp" header="Timestamp"></Column>
          <template #groupheader="slotProps">
            <!-- <img :alt="slotProps.data.representative.name" :src="'demo/images/avatar/' + slotProps.data.representative.image" width="32" style="vertical-align: middle" /> -->
            <span class="image-text">{{ slotProps.data.areaname }}</span>
          </template>
          <template #groupfooter="slotProps">
            <td colspan="0" style="text-align: left">
              จำนวนครั้งที่มีการละเมิด
            </td>
            <td>{{ calculateAlertUserTotal(slotProps.data.areaname) }}</td>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
// import CustomerService from '../service/CustomerService';
// import data from '../../public/data/test.json'
import axios from "axios";
import SideNavbar from "../components/SideNavbar";

export default {
  data() {
    return {
      user: null,
      alertUser: null,
      workTime: null,
      expandedRowGroups: null,
      slotpropName: "",
      basicData: [
        // {
        // username: "",
        // labels: [],
        // datasets: [
        // 	{
        // 		label: 'My First dataset',
        // 		backgroundColor: '#42A5F5',
        // 		data: [28, 48, 40, 19, 86, 27, 90]
        // 	},
        // 	{
        // 		label: 'My Second dataset',
        // 		backgroundColor: '#FFA726',
        // 		data: [28, 48, 40, 19, 86, 27, 90]
        // 	}
        // ]
        // }
        // {
        //     username: "Tana Kositapa",
        //     labels: [],
        //     datasets: [
        //         {
        //             label: 'Time in each area in hour(s)',
        //             backgroundColor: '#42A5F5',
        //             data: []
        //         },
        //     ]
        // },
        // {
        //     username: "Somchai Kositapa",
        //     labels: [],
        //     datasets: [
        //         {
        //             label: 'Time in each area in hour(s)',
        //             backgroundColor: '#42A5F5',
        //             data: []
        //         },
        //     ]
        // }
      ],
      expandedRows: [],
    };
  },
  components: {
    SideNavbar,
  },
  customerService: null,
  mounted() {
    // this.customerService = new CustomerService();
    this.fetchUserFromBackend();
    this.interval = setInterval(() => this.fetchUserFromBackend(), 10000);
    this.fetchAlertFromBackend();
    this.interval = setInterval(() => this.fetchAlertFromBackend(), 10000);
    this.fetchWorkTimeFromBackend();
    this.interval = setInterval(() => this.fetchWorkTimeFromBackend(), 10000);
  },
  created() {
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
        // console.log("Test Object: ",this.alertUser.data);
        // console.log("Test Array: ",this.alertUser.data[0]);
        // console.log("name: ",name);
        for (var alert in this.alertUser.data) {
          // console.log("yolo: ",name);
          // console.log("alert: ",alert);
          console.log("nameee: ", this.alertUser.data[alert].areaname);
          if (this.alertUser.data[alert].areaname === areaname) {
            total++;
          }
        }
      }

      return total;
    },
    insertData() {
      console.log("Test: ", this.workTime.data);
      for (var label in this.workTime.data) {
        console.log("Testist: ", this.workTime.data[label]._id.name);
        var index = this.basicData.findIndex(
          (x) => x.username === this.workTime.data[label]._id.name
        );
        console.log("Inde ", index);
        if (index == -1) {
          this.basicData.push({
            username: this.workTime.data[label]._id.name,
            labels: [],
            datasets: [
              {
                label: "Time in each area in hour(s)",
                backgroundColor: "#42A5F5",
                data: [],
              },
            ],
          });
        }
      }
      console.log("Work time dataset: ", this.basicData);
      this.insertLabel();
    },
    insertLabel() {
      // index = basicData.findIndex(x => x.username === slotpropName)
      // console.log("this work: ",this.workTime.data);
      var index;
      for (var label in this.workTime.data) {
        //   console.log("this work: ",this.workTime.data[label]._id.name) //somchai
        // console.log("this work: ",this.workTime.data[label]);
        //   var index = this.workTime.data.findIndex(x => x._id.name === "Somchai Kositapa")
        index = this.basicData.findIndex(
          (x) => x.username === this.workTime.data[label]._id.name
        );
        //   var index = this.workTime.data.findIndex(x => x.username === this.workTime.data[label]._id.name)
        // if(this.workTime.data[label]._id.name)
        //   console.log("Index: ",index);
        //   console.log("User: ",this.workTime.data[label]._id.name);
        //   console.log("Labels: ", this.workTime.data[label]._id.areaname);

        if (
          this.basicData[index].labels.indexOf(
            this.workTime.data[label]._id.areaname
          ) == -1
        ) {
          console.log("Labelseee: ", this.workTime.data[label]._id.areaname);
          // this.basicData[1].labels.push(this.workTime.data[label]._id.areaname)
          this.basicData[index].labels.push(
            this.workTime.data[label]._id.areaname
          );
        }
        // console.log("gg", this.basicData[index].datasets[0].label);
        this.basicData[index].datasets[0].data.push(
          (this.workTime.data[label].total / 3600) 
        );
        // console.log("oo ",this.basicData[index].datasets[0].data);
        // this.basicData[index].datasets.push({label: 'Dataset',backgroundColor: '#42A5F5',
        //             data: []})
        // this.basicData.datasets.data.push(this.workTime.data[label].total/60)
        // console.log("Ho ",this.basicData.datasets[0].label);
      }

      //   this.basicData.push({})
      //   this.workTime.data[label].total
      //   console.log("OLO", this.basicData.labels);
    },
    test(objectKey) {
      // alert("OMG");
      console.log(objectKey);
      // this.basicData.push()
    },
    fetchUserFromBackend() {
      axios
        .get("http://localhost:3000/getemployee")
        // .then(response => (this.info = response))
        .then((response) => (this.user = response.data))
        // .then(response => (console.log(response.data)))
        .catch((error) => console.log(error));
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
    fetchAlertFromBackend() {
      axios
        .get("http://localhost:3000/alert")
        // .then(response => (this.info = response))
        .then((response) => (this.alertUser = response.data))
        // .then(response => (console.log(response.data)))
        .catch((error) => console.log(error));
      // .finally(() => this.checkUser())
    },
    fetchWorkTimeFromBackend() {
      axios
        .get("http://localhost:3000/worktime")
        // .then(response => (this.info = response))
        .then((response) => (this.workTime = response.data))
        // .then(response => (console.log(response.data)))
        .catch((error) => console.log(error))
        // .finally(() => console.log("Worktime: ", this.workTime.data));
        // .finally(() => this.insertLabel());
        .finally(() => this.insertData());
    },
  },
};
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
    margin-right: 0.25rem;
  }
}
.image-text {
  vertical-align: middle;
}
img {
  vertical-align: middle;
}
</style>
