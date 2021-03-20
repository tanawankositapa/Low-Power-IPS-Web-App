<template lang="">
  <div>
    <Dialog
      header="ข้อมูลบุคคล"
      v-model:visible="display"
      :style="{ width: '30vw' }"
    >
      <p>คุณ {{ name }}</p>
      <p v-show="!isDepartmentNull">แผนก {{ department }}</p>
      <p v-show="!isCompanyNull">บริษัท {{ company }}</p>
      <!-- <p>{{value8.code}}</p> -->
      <p>ตำแหน่ง {{ testTime }} นาทีที่ผ่านมา</p>
      <!-- <p>{{ checkElements() }}</p> -->
    </Dialog>
    <!-- <i class="pi pi-check" @click="toggle" ></i> -->
    <!-- <p >{{drawHistoryRoute()}}</p> -->
    <div class="p-field p-col-12 p-md-4">
      <span class="p-float-label ">
        <div class="p-d-inline p-mr-2">
          <Dropdown
            id="dropdown"
            v-model="value8"
            :options="timeOptionsForDropdown"
            optionLabel="time"
            placeholder="ประวัติตำแหน่ง"
          />
        </div>
        <!-- <label for="dropdown">ประวัติตำแหน่ง</label> -->
        <div class="p-d-inline">
          <MultiSelect
            v-model="value10"
            :options="userOptionsForDropdown"
            optionLabel="name"
            placeholder="เลือกบุคคล"
            :filter="true"
            class="multiselect-custom"
          >
          </MultiSelect>
        </div>
        <div class="p-d-inline">
          <h5>แสดงเส้นทาง</h5>
          <SelectButton
            id="selectButton"
            v-model="isShowRoute"
            :options="optionsForSelectButton"
          />
          <!-- <label for="selectButton">g</label> -->
        </div>
      </span>

      <span class="p-float-label">
        <!-- <RadioButton name="city" value="showRoute" v-model="isShowRoute" /> -->
        <!-- <Dropdown
          id="dropdown"
          v-model="value9"
          :options="userOptionsForDropdown"
          optionLabel="name"
          @click="drawHistoryRoute"
        />
        <label for="dropdown">เลือกบุคคล</label> -->
        <!-- <Listbox v-model="value9" :options="userOptionsForDropdown" :multiple="true" :filter="true" optionLabel="name" listStyle="max-height:250px" style="width:15rem" filterPlaceholder="เลือกบุคคล">
          
        </Listbox> -->
      </span>
    </div>

    <div class="canvasArea">
      <canvas ref="myCanvas" width="500" height="650">
        Your browser does not support the HTML5 canvas tag.
        <!-- <OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" id="overlay_panel" style="width: 450px">
                    <h3>OMG</h3>
                </OverlayPanel> -->
      </canvas>
    </div>
    <div>
      <!-- <neural-model @prediction-data="getPredictionData"></neural-model> -->
      <!-- {{this.positionX}}
      {{this.positionY}} -->
      <!-- {{this.getPredictionData()}} -->
    </div>
    <!-- <div>
      <img :src="require('../assets/images/606layout.svg')">
      </div>    -->
  </div>
</template>
<script>
import myImage from "../../public/606layout.svg";
// import NeuralModel from './NeuralModel.vue'
import axios from "axios";
export default {
  data() {
    return {
      floorplan: [{ floor: 6, src: myImage }],
      posX: 0.0,
      posY: 0.0,
      responsePosition: {},
      isImageAlreadyDrawData: false,
      // interval: 0,
      userDetail: [],
      historyPosition: [],
      display: false,
      name: "",
      department: "",
      company: "",
      testTime: 0,
      isCompanyNull: false,
      isDepartmentNull: false,
      value8: null,
      value10: [],
      isShowRoute: "Off",
      optionsForSelectButton: ["Off", "On"],
      timeOptionsForDropdown: [
        { time: "ล้างข้อมูล", code: "0" },
        { time: "ตำแหน่งย้อนหลัง 30 นาที", code: "30" },
        { time: "ตำแหน่งย้อนหลัง 1 ชั่วโมง", code: "60" },
        { time: "ตำแหน่งย้อนหลัง 1 ชั่วโมง 30 นาที", code: "90" },
        // { time: "ตำแหน่งอยู่ไม่นาน ตำนานตลอดไป", code: "infinite" },
      ],
      userOptionsForDropdown: [],
      positionUnderThirtyMin: [],
      positionUnderOneHour: [],
      positionUnderOneHourAndHalf: [],
      elements: [],
      arrayOfCircle: [],
      olements: [
        {
          x: 2,
          y: 3,
        },
        {
          x: 4,
          y: 4.9,
        },
        {
          x: 5,
          y: 16,
        },
      ],
      currentElements: [],
      globalArrayOfColor:[],
    };
  },
  computed: {
    lengthOfValue10() {
      if (this.value10 != null) {
        return this.value10.length;
      }
    },
    valueOfValue8() {
      if (this.value8 != null) {
        return this.value8.code;
      }
    },
    lengthOfElement() {
      if (this.elements != null) {
        return this.elements.length;
      }
    },
    lengthOfCircle() {
      if (this.arrayOfCircle != null) {
        return this.arrayOfCircle.length;
      }
    },
    nameOfResponsePosition() {
      if (this.responsePosition != {}) {
        return this.responsePosition.name;
      }
    },
  },
  components: {
    // NeuralModel,
  },
  watch: {
    // whenever question changes, this function will run
    value10: function () {
      // this.answer = 'Waiting for you to stop typing...'
      /**เมื่อมีการเพิ่ม ลด user ที่ต้องการแสดง มันจะ push circle วาด history ใหม่ */
      this.elements = [];
      this.arrayOfCircle = [];

      this.drawHistoryRoute();
    },
    value8: function () {
      // this.answer = 'Waiting for you to stop typing...'
      this.elements = [];
      this.arrayOfCircle = [];
      console.log("This element: ", this.elements);
      this.drawHistoryRoute();
    },
    nameOfResponsePosition(newVal) {
      // alert(newVal);
      console.log(newVal);
    },
    responsePosition(newVal) {
      // console.log("newVal",newVal);
      this.currentElements = [];
      this.getPredictionData();
    },
    async isShowRoute(newVal) {
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      var i;
      let vm = this;
      // if (parseInt(newVal) < parseInt(oldVal)) {

      // }
      async function reDrawmap() {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        vm.initMap();
      }
      async function clearMap() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // vm.initMap();
      }
      // alert(newVal);
      if (newVal == "On") {
        // alert(newVal);
        this.checkElements();
      }
      if (newVal == "Off") {
        // this.clearData();
        clearMap();
        await reDrawmap();
        setTimeout(() => {
          console.log(vm.arrayOfCircle);
          for (i = 0; i < vm.arrayOfCircle.length; i++) {
            console.log("Test Color: ",vm.arrayOfCircle[i].color);
            context.beginPath();
            context.arc(vm.arrayOfCircle[i].x,vm.arrayOfCircle[i].y,vm.arrayOfCircle[i].r,0, Math.PI * 2)
            // context.fill(vm.arrayOfCircle[i], "nonzero");
            context.fillStyle =vm.arrayOfCircle[i].color;
            context.fill();
            // context.stroke(vm.arrayOfCircle[i], "nonzero");
            // context.closePath();
          }
        }, 300);
        this.checkElements();
        // this.drawHistoryRoute();
      }
    },
    async lengthOfValue10(newVal, oldVal) {
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      let vm = this;
      // alert(`yes, computed property changed: ${newVal}`)
      // console.log("newval: ",parseInt(newVal));
      // console.log("oldval: ",parseInt(oldVal));
      console.log("This element: ", this.elements);
      // if (parseInt(newVal) < parseInt(oldVal)) {
      //  alert("Uncheck");
      if (this.value10 != null) {
        // console.log("lenght ", this.value10.length);
        // this.clearData();
        // this.historyPosition = [];

        /**1.หาว่าคนไหนที่หายไป โดยเทียบกับ useroptionfordropdown
         * แล้วไปลบจุดของ user ที่หายไป
         * 2. ตรวจสอบว่าเหลือ user คนไหนบ้างใน value10 แล้ว clear map แล้ววาดใหม่เท่าที่เหลือ
         * */
        await clearMap();
        await reDrawmap();
        this.currentElements = [];
        this.getPredictionData();
        async function reDrawmap() {
          // context.clearRect(0, 0, canvas.width, canvas.height);
          vm.initMap();
        }
        async function clearMap() {
          context.clearRect(0, 0, canvas.width, canvas.height);
          // vm.initMap();
        }
        // for (var index in this.userOptionsForDropdown) {
        //   var index2 = this.value10.findIndex(
        //     (x) => x.name === this.userOptionsForDropdown[index].name
        //   );
        //   if (index2 == -1) {
        //     console.log(
        //       "This name is not in value10: ",
        //       this.userOptionsForDropdown[index].name
        //     );
        //   }
        // }

        // this.drawHistoryRoute();
      }
      // }
    },
    valueOfValue8(newVal) {
      // alert(`yes, computed property changed: ${newVal}`)
      //  console.log("OLM ",typeof(newVal));
      if (newVal == "0") {
        this.clearData();
      }
    },
    lengthOfElement(newVal) {
      // alert(newVal);
      console.log("length of Element: ", newVal);
    },
    async lengthOfCircle(newVal, oldVal) {
      console.log("length of circle: ", newVal);
      var i;
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      let vm = this;
      // for (i = vm.arrayOfCircle.length - 1; i >= 0; --i) {
      //       // console.log("Test circle: ", vm.arrayOfCircle[i]);
      //       // console.log("length of Circle: ", vm.arrayOfCircle.length);
      //       // if (context.isPointInPath(vm.arrayOfCircle[i], x, y, "nonzero")) {
      //         vm.arrayOfCircle.splice(i, 1);
      //       // }
      //     }
      // if (parseInt(newVal) < parseInt(oldVal)) {
      await clearMap();
      await reDrawmap();
      setTimeout(() => {
        for (i = 0; i < vm.arrayOfCircle.length; i++) {
         console.log("Test Color: ",vm.arrayOfCircle[i].color);
            context.beginPath();
            context.arc(vm.arrayOfCircle[i].x,vm.arrayOfCircle[i].y,vm.arrayOfCircle[i].r,0, Math.PI * 2)
            // context.fill(vm.arrayOfCircle[i], "nonzero");
            context.fillStyle =vm.arrayOfCircle[i].color;
            context.fill();
            // context.stroke(vm.arrayOfCircle[i], "nonzero");
            // context.closePath();
        }
      }, 100);
      this.checkElements();
      // }
      async function reDrawmap() {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        vm.initMap();
      }
      async function clearMap() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // vm.initMap();
      }
    },
  },
  // watch: {
  //     responsePosition(value){
  //       this.responsePosition
  //     }
  // },
  // props: ['positionX', 'positionY'],
  methods: {
    toggle(event, display) {
      console.log(display);
      this.$refs.op.toggle(event);
    },
    // Circle(x, y, radius) {
    //   // var c = new Path2D();
    //   var canvas = this.$refs.myCanvas;
    //   var c = canvas.getContext("2d");
      
    //   c.arc(x, y, radius, 0, Math.PI * 2);
    //   // c.addPath(c);
    //   // c.closePath();
    //   return c;
    // },
    clearData() {
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      // console.log("Before: ", this.elements);
      this.elements = [];
      // console.log("After: ", this.elements);
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.value8 = null;
      this.value10 = null;
      this.initMap();
      this.currentElements = [];
    },
    insertUserOption() {
      var code = 0;

      this.historyPosition.forEach((element) => {
        var index = this.userOptionsForDropdown.findIndex(
          (x) => x.name === element.name
        );
        if (index == -1) {
          this.userOptionsForDropdown.push({
            name: element.name,
            code: code,
          });
          code = code + 1;
        }
      });

      // console.log("Test: ", this.userOptionsForDropdown);
    },
    drawLineWithArrows(x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd) {
      var canvas = this.$refs.myCanvas;
      var ctx = canvas.getContext("2d");
      var dx = x1 - x0;
      var dy = y1 - y0;
      var angle = Math.atan2(dy, dx);
      var length = Math.sqrt(dx * dx + dy * dy);
      //
      ctx.translate(x0, y0);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(length, 0);
      if (arrowStart) {
        ctx.moveTo(aLength, -aWidth);
        ctx.lineTo(0, 0);
        ctx.lineTo(aLength, aWidth);
      }
      if (arrowEnd) {
        ctx.moveTo(length - aLength, -aWidth);
        ctx.lineTo(length, 0);
        ctx.lineTo(length - aLength, aWidth);
      }
      //
      ctx.stroke();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    checkElements() {
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      // alert("WTF");
      // console.log("Test Element: ",this.elements);
      var objectLength = Object.keys(this.elements).length - 1;
      for (var index in this.elements) {
        index = parseInt(index);
        if (index < objectLength) {
          // console.log("Testis: ",index);
          // console.log("Test Element: ", this.elements[index].past);
          // console.log("Test Element: ", this.elements[index]);
          // console.log("Oblength: ",objectLength);
          // console.log("Index: ",typeof(index));
          var currentPast,
            nextPast,
            currentX,
            currentY,
            nextX,
            nextY,
            currentUser,
            nextUser;
          currentPast = this.elements[index].past;
          nextPast = this.elements[index + 1].past;
          currentX = this.elements[index].x;
          nextX = this.elements[index + 1].x;
          currentY = this.elements[index].y;
          nextY = this.elements[index + 1].y;
          currentUser = this.elements[index].user;
          nextUser = this.elements[index + 1].user;
          // console.log("CurrentContext: ", context);
          // console.log("CurrentPast: ", currentPast);
          // console.log("NextPast: ", nextPast);
          // console.log("CurrentX: ", currentX);
          // console.log("NextX: ", nextX);
          // console.log("CurrentY: ", currentY);
          // console.log("NextY: ", nextY);
          if (currentX != nextX || currentY != nextY) {
            // this.canvas_arrow(context,currentX,currentY,nextX,nextY)
            // this.drawLineWithArrows(currentX,currentY,nextX,nextY,5,8,false,true);
            if (currentUser == nextUser) {
              /**reverse logic */
              this.drawLineWithArrows(
                nextX,
                nextY,
                currentX,
                currentY,
                5,
                8,
                false,
                true
              );
              // console.log("Prepare for chaos");
            }
          }
        }
      }
    },
    drawHistoryRoute() {
      // alert('click', this.value8.code)
      // alert('click', this.value9.code)
      // console.log("What is this: ",this.lengthOfValue10);
      // console.log('click', this.value9);
      // console.log('click', this.value10);
      // console.log(this.historyPosition);
      let vm = this;
      var bh = 650;
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      
      // var colorArray = [];

      if (this.value10 != {}) {
        // console.log("this value10: ", this.value10);
        if (this.value10 != null) {
          var objectLength = Object.keys(this.value10).length;
          // console.log("ob length ", objectLength);
          for (var index1 in this.value10) {
            console.log("value10 len ",objectLength);
            console.log("global len ",this.globalArrayOfColor.length);
           if(this.globalArrayOfColor.length < objectLength){
              var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            // colorArray.push(randomColor);
            this.globalArrayOfColor.push(randomColor);
            // console.log("index1: ",index1);
            console.log("color array: ", this.globalArrayOfColor);
           }
          }
        }
        if (this.historyPosition != null) {
          var objectLength1 = Object.keys(this.historyPosition).length;
          // console.log("ob length ", objectLength);
        }
        for (var index in this.value10) {
          for (var index0 in this.historyPosition) {
            if (this.historyPosition[index0].name)
              if (
                this.historyPosition[index0].name == this.value10[index].name
              ) {
                // console.log("testname outside history: ",this.historyPosition[index0].name);
                //   console.log("testname outside value10: ",this.value10[index].name);
                // console.log("testname history: ",this.historyPosition[index0].name);
                // console.log("testname value10: ",this.value10[index].name);

                if (this.value8 != null) {
                  if (this.value8.code == "30") {
                    if (this.historyPosition[index0].past <= 30) {
                      // this.name = vm.responsePosition.name;
                      // console.log("Name:",vm.responsePosition.name);
                      console.log("index0: ", parseInt(index0));
                      console.log("objectlength: ", objectLength1 - 1);
                      // if (parseInt(index0) == objectLength1 - 1) {
                      //   // if(this.historyPosition[index0].name = this.historyPosition[index0+1].name)
                      //   console.log("HHHHHHHHHHHHHHH");
                      // }
                      this.elements.push({
                        // colour: "#55BDCA",
                        // colour: "#" + randomColor,
                        colour: this.globalArrayOfColor[index],
                        x: this.historyPosition[index0].xy[0] * 52 + 70,
                        y: -this.historyPosition[index0].xy[1] * 40 + bh - 110,
                        r: 10,
                        sAngle: 0,
                        eAngle: 2 * Math.PI,
                        counterclockwise: false,
                        user: vm.historyPosition[index0].name,
                        department: vm.responsePosition.department,
                        company: vm.responsePosition.company,
                        past: this.historyPosition[index0].past,
                      });
                    }
                  }
                  if (this.value8.code == "60") {
                    if (this.historyPosition[index0].past <= 60) {
                      this.name = vm.responsePosition.name;
                      this.elements.push({
                        // colour: "#96FFFF",
                        // colour: "#" + randomColor,
                        colour: this.globalArrayOfColor[index],
                        x: this.historyPosition[index0].xy[0] * 52 + 70,
                        y: -this.historyPosition[index0].xy[1] * 40 + bh - 110,
                        r: 10,
                        sAngle: 0,
                        eAngle: 2 * Math.PI,
                        counterclockwise: false,
                        user: vm.historyPosition[index0].name,
                        department: vm.responsePosition.department,
                        company: vm.responsePosition.company,
                        past: this.historyPosition[index0].past,
                      });
                    }
                  }
                  if (this.value8.code == "90") {
                    if (this.historyPosition[index0].past <= 90) {
                      this.name = vm.responsePosition.name;
                      this.elements.push({
                        // colour: "#C8EFE9",
                        // colour: "#" + randomColor,
                        colour: this.globalArrayOfColor[index],
                        x: this.historyPosition[index0].xy[0] * 52 + 70,
                        y: -this.historyPosition[index0].xy[1] * 40 + bh - 110,
                        r: 10,
                        sAngle: 0,
                        eAngle: 2 * Math.PI,
                        counterclockwise: false,
                        user: vm.historyPosition[index0].name,
                        department: vm.responsePosition.department,
                        company: vm.responsePosition.company,
                        past: this.historyPosition[index0].past,
                      });
                    }
                  }
                  // if (this.value8.code == "0") {
                  //   console.log("Before: ",this.elements);
                  //   this.elements = [];
                  //   console.log("After: ",this.elements);
                  //   context.clearRect(0, 0, canvas.width, canvas.height);
                  //   this.value8 = null;
                  //   this.value10 = [];
                  //   vm.initMap();
                  // }
                  // if (this.value8.code == "infinite") {
                  //   // if (this.historyPosition[index0].past <= 90){
                  //   this.elements.push({
                  //     colour: "#6b3d0d",
                  //     x: this.historyPosition[index0].xy[0] * 52 + 70,
                  //     y: -this.historyPosition[index0].xy[1] * 40 + bh - 110,
                  //     r: 10,
                  //     sAngle: 0,
                  //     eAngle: 2 * Math.PI,
                  //     counterclockwise: false,
                  //     user: vm.responsePosition.name,
                  //     department: vm.responsePosition.department,
                  //     company: vm.responsePosition.company,
                  //     past: this.historyPosition[index0].past,
                  //   });
                  //   // }
                  // }
                }
              }
          } //end of for
        }
      }

      context.moveTo(vm.posX * 52 + 70, -vm.posY * 40 + bh - 110);
      var index10 = 0;
      context.beginPath();
      vm.elements.forEach(function (element) {
        context.beginPath();
        // console.log("Index: ", index10);
        // vm.arrayOfCircle.push(vm.Circle(element.x, element.y, element.r));
        vm.arrayOfCircle.push({x:element.x, y:element.y, r:element.r,color:element.colour});
        // context.fillStyle = element.colour;
        console.log("Circle color: ", element.colour);
        // context.fill(vm.arrayOfCircle[index10], "nonzero");
        
        // console.log("array of circle: ",vm.arrayOfCircle[index10]);
        // context.lineWidth = 1;
        // context.strokeStyle = "#003300";
        // context.stroke(vm.arrayOfCircle[index10], "nonzero");
        // // if(tempX != element.x){
        // console.log("Circle: ", vm.arrayOfCircle[index10]);
        // console.log("length of Circle: ", vm.arrayOfCircle.length);
        // context.fillRect(element.left, element.top, element.width, element.height);
        // context.beginPath();
        // context.arc(
        //   element.x,
        //   element.y,
        //   element.r,
        //   element.sAngle,
        //   element.eAngle,
        //   element.counterclockwise
        // );
        // // context.clip();
        // context.fill();
        // context.lineWidth = 1;
        // context.strokeStyle = "#003300";
        // context.stroke();
        index10 = index10 + 1;
      });
      // var tempX,tempY ;

      /**วาดเส้นอย่างเดียว *Outdated* */
      // context.beginPath();
      // vm.elements.forEach((element) => {
      //   console.log(element);
      //   // console.log("elementalX: ",element.x);
      //   //   console.log("elementalY: ",element.y);

      //   context.lineTo(element.x, element.y);
      // });
      // context.stroke();
      var elemLeft = canvas.offsetLeft + canvas.clientLeft,
        elemTop = canvas.offsetTop + canvas.clientTop;
      canvas.addEventListener(
        "click",
        function (event) {
          var x = event.pageX - elemLeft,
            y = event.pageY - elemTop;

          // for (i = vm.arrayOfCircle.length - 1; i >= 0; --i) {
          //   console.log("Test circle: ", vm.arrayOfCircle[i]);
          //   console.log("length of Circle: ", vm.arrayOfCircle.length);
          //   if (context.isPointInPath(vm.arrayOfCircle[i], x, y, "nonzero")) {
          //     vm.arrayOfCircle.splice(i, 1);
          //   }
          // }
          // context.clearRect(0, 0, canvas.width, canvas.height);
          // for (i = 0; i < vm.arrayOfCircle.length; i++) {
          //   context.fill(vm.arrayOfCircle[i], "nonzero");
          //   context.stroke(vm.arrayOfCircle[i], "nonzero");
          // }
          // Collision detection between clicked offset and element.
          vm.elements.forEach(function (element) {
            if (
              y < element.y + element.r &&
              y > element.y - element.r &&
              x < element.x + element.r &&
              x > element.x - element.r
            ) {
              // vm.toggle(event,element.user);
              vm.display = true;
              vm.name = element.user;
              vm.department = element.department;
              vm.company = element.company;
              vm.testTime = element.past;
              if (element.company == "") {
                vm.isCompanyNull = true;
              }
              if (element.department == "") {
                vm.isDepartmentNull = true;
              }
            }
          });
        },
        false
      );
      // this.value9 = null;
    },
    initMap() {
      var canvas = this.$refs.myCanvas;
      var context = canvas.getContext("2d");
      var base_image;
      base_image = new Image();
      base_image.src = myImage;
      base_image.onload = function () {
        context.drawImage(base_image, 0, 0);
      };
    },
    drawMap(floor, posX, posY) {
      let vm = this;
      /* radiomap กว้าง 60 สูง 60
                    โลกจริง radomap กว้าง 1 เมตร สูง 1 เมตร
                    ดังนั้น อัตราส่วนคือ 1 : 60
                    */
      // console.log("draw");
      // console.log(posX);
      // console.log(posY);
      // console.log(floor);
      // Box width

      var canvas = this.$refs.myCanvas;
      // console.log("canvas: ", canvas);
      var context = canvas.getContext("2d");

      // console.log(canvas);
      // console.log(typeof(canvas));
      // var bw = 500;
      // Box height
      var bh = 650;
      // Padding
      // var p = 0;
      // var isImageAlreadyDrawLocal = this.isImageAlreadyDrawData;
      // var base_image;
      make_base();
      // console.log(this.floorplan[0].src);

      function make_base() {
        var elemLeft = canvas.offsetLeft + canvas.clientLeft,
          elemTop = canvas.offsetTop + canvas.clientTop;
        // elements = [];

        // Add event listener for `click` events.

        canvas.addEventListener(
          "click",
          function (event) {
            var x = event.pageX - elemLeft,
              y = event.pageY - elemTop;

            // Collision detection between clicked offset and element.
            vm.currentElements.forEach(function (element) {
              if (
                y < element.y + element.r &&
                y > element.y - element.r &&
                x < element.x + element.r &&
                x > element.x - element.r
              ) {
                // vm.toggle(event,element.user);
                vm.display = true;
                vm.name = element.user;
                vm.department = element.department;
                vm.company = element.company;
                vm.testTime = element.past;
                if (element.company == "") {
                  vm.isCompanyNull = true;
                }
                if (element.department == "") {
                  vm.isDepartmentNull = true;
                }
              }
            });
          },
          false
        );

        // console.log(index);
        // console.log("VM ELEMENT: ", vm.currentElements);
        // console.log("Current Name: ", vm.currentElements[0].user);
        // console.log("Value Name: ", vm.value10.length == 0);
        //

        /***************************************************** */
        // for (var index in vm.value10) {
        //   if (vm.value10[index].name != null) {
        //     // แยก user แต่ละคนออก
        //     if (vm.responsePosition.name == vm.value10[index].name) {
        //       if (vm.currentElements.length == 0) {
        //         vm.currentElements.push({
        //           colour: "#05EFFF",
        //           x: posX * 52 + 70,
        //           y: -posY * 40 + bh - 110,
        //           r: 10,
        //           sAngle: 0,
        //           eAngle: 2 * Math.PI,
        //           counterclockwise: false,
        //           user: vm.responsePosition.name,
        //           department: vm.responsePosition.department,
        //           company: vm.responsePosition.company,
        //         });
        //       }
        //     }
        //   }
        // }

        // console.log("oMG: ",vm.responsePosition.name);
        // console.log("Oeq: ",vm.responsePosition);
        // elements.push({
        //     colour: '#05EFFF',
        //     x: 150,
        //     y: 100,
        //     r: 20,
        //     sAngle: 0,
        //     eAngle: 2 * Math.PI,
        //     counterclockwise: false,
        //     user: "Arpa Kositapa",
        // });
        
        /******************************************************** */
        // vm.currentElements.forEach(function (element) {
        //   context.fillStyle = element.colour;
        //   // context.fillRect(element.left, element.top, element.width, element.height);
        //   context.beginPath();
        //   context.arc(
        //     element.x,
        //     element.y,
        //     element.r,
        //     element.sAngle,
        //     element.eAngle,
        //     element.counterclockwise
        //   );
        //   context.fill();
        //   context.lineWidth = 1;
        //   context.strokeStyle = "#003300";
        //   context.stroke();
        // });

        // }
      }
    },

    getPredictionData() {
      var bh = 650;
      // console.log("Response: ",this.responsePosition);
      this.posX = this.responsePosition.ypred[0];
      this.posY = this.responsePosition.ypred[1];
      console.log("PosX: ", this.posX);
      console.log("PosY: ", this.posY);
      // console.log("Current Ele: ", this.currentElements == []);
      if (this.currentElements == []) {
        this.currentElements.push({
          colour: "#05EFFF",
          x: this.posX * 52 + 70,
          y: -this.posY * 40 + bh - 110,
          r: 10,
          sAngle: 0,
          eAngle: 2 * Math.PI,
          counterclockwise: false,
          user: this.responsePosition.name,
          department: this.responsePosition.department,
          company: this.responsePosition.company,
        });
      }
      this.drawMap(6, this.posX, this.posY); // ต้องเรียกใช้ในนี้ ไม่สามารถเรียกใช้ที่ mounted เพราะค่าจาก NeuralModel มันจะส่งมาหลังจาก mounted lifecycle แล้ว
    },
    fetchDataFromBackend() {
      axios
        .get("http://6a185c926e69.ngrok.io")
        // .then(response => (this.info = response))
        .then((response) => (this.responsePosition = response.data.data))
        // .then(response => (console.log("OMG",response.data.data)))
        .catch((error) => console.log(error))
        .finally(() => this.getPredictionData());
    },
    fetchHistoryFromBackend() {
      axios
        .get("http://6a185c926e69.ngrok.io/historyroute")
        // .then(response => (this.info = response))
        .then((response) => (this.historyPosition = response.data.data))
        // .then(response => (console.log("OMG",response.data.data)))
        .catch((error) => console.log(error))
        // .finally(() => console.log(this.historyPosition))
        .finally(() => this.insertUserOption());
    },
  },
  created() {
    // this.interval = setInterval(() => this.fetchDataFromBackend(), 10000);
  },
  mounted() {
    console.log("Mounted");
    this.initMap();
    this.fetchDataFromBackend();
    this.interval = setInterval(() => this.fetchDataFromBackend(), 10000);
    // setTimeout(() => {
    //   if(readyToBreak){
    //     console.log("ppp");
    //     return
    //   }else{
    //     console.log("Yolo");
    //   }
    // }, 3000);
    // this.getPredictionData();
    /** Fetch ข้อมูลมาจากฝั่ง Backend ด้วย public url
     * แบบนี้จริงอยู่ที่ไม่ Secure แต่ในอนาคตเราสามารถ deploy ลงบน cluster อย่าง kubernetes แล้วใช้ internal service ip แทนได้
     */
    this.fetchDataFromBackend();
    this.fetchHistoryFromBackend();
  },
  updated() {
    this.fetchDataFromBackend();
    this.fetchHistoryFromBackend();
  },
  // updated() {
  //   axios
  //     .get('http://02b8cc589b7f.ngrok.io')
  //     // .then(response => (this.info = response))
  //     .then(response => (this.responsePosition = response.data))
  //     // .then(response => (console.log(response.data)))
  //     .catch(error => console.log(error))
  //     .finally(() => this.getPredictionData())
  // },
};
</script>
<style lang="scss" scoped></style>
