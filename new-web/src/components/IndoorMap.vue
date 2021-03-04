<template lang="">

  <div>
   
               
                <Dialog header="ข้อมูลบุคคล" v-model:visible="display" :style="{width: '50vw'}">
                    <p>{{take}} </p>
                    
                </Dialog>
    <!-- <i class="pi pi-check" @click="toggle" ></i> -->
               

                
    <div class="canvasArea">
        <canvas ref="myCanvas" width="500" height="650"  >
            Your browser does not support the HTML5 canvas tag.
            <!-- <OverlayPanel ref="op" appendTo="body" :showCloseIcon="false" id="overlay_panel" style="width: 450px">
                    <h3>OMG</h3>
                </OverlayPanel> -->
                
                </canvas> 
               
    </div>
    <div >
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
import myImage from "../../public/606layout.svg"
// import NeuralModel from './NeuralModel.vue'
import axios from 'axios';
export default {
  data() {
    return {
      floorplan: [
        {floor: 6, src: myImage,}
      ],
        posX: 0.0,
        posY: 0.0,
        responsePosition : {},
        isImageAlreadyDrawData: false,
        // interval: 0,
        userDetail:[],
        historyPosition:[
          {

          }
        ],
        display: false,
        take: ""
    }
  },
   components: {
    // NeuralModel,
  },
  // watch: {
  //     responsePosition(value){
  //       this.responsePosition 
  //     }
  // },
  // props: ['positionX', 'positionY'],
  methods: {
    toggle(event,display) {
      console.log(display);
            this.$refs.op.toggle(event);
        },
  async drawMap(floor,posX,posY) {
      
                 /* radiomap กว้าง 60 สูง 60
                    โลกจริง radomap กว้าง 1 เมตร สูง 1 เมตร
                    ดังนั้น อัตราส่วนคือ 1 : 60
                    */
                // console.log("draw");
                console.log(posX);
                console.log(posY);
                console.log(floor);
                // Box width
                
                var canvas = this.$refs.myCanvas
                var context = canvas.getContext("2d");

                // console.log(canvas);
                // console.log(typeof(canvas));
                // var bw = 500;
                // Box height
                var bh = 650;
                // Padding
                // var p = 0;
                // var isImageAlreadyDrawLocal = this.isImageAlreadyDrawData;
                var base_image;
                await make_base();
                // console.log(this.floorplan[0].src);
                 let vm = this;
                async function make_base()
                {
                  
                base_image = new Image();
                base_image.src = myImage;
                // base_image.setAttribute('crossOrigin', '');
                // base_image.crossOrigin = "Anonymous";
                var elemLeft = canvas.offsetLeft + canvas.clientLeft,
                elemTop = canvas.offsetTop + canvas.clientTop,
                elements = [];

                // Add event listener for `click` events.
               
                canvas.addEventListener('click', function(event) {
          
                    var x = event.pageX - elemLeft,
                        y = event.pageY - elemTop;
                    
                    // Collision detection between clicked offset and element.
                    elements.forEach(function(element) {
                        if (y < element.y + element.r && y > element.y - element.r 
                            && x < element.x + element.r && x > element.x - element.r) {
                            
                            
                            // vm.toggle(event,element.user);
                            vm.display = true;
                            vm.take = element.user
                           
                        }
                    });

                }, false);

                  base_image.onload = function(){
                    // if (!isImageAlreadyDrawLocal){ 
                      context.drawImage(base_image, 0, 0);
                      // var imageData = context.getImageData(0,0,500,650);
                      // base_image.setAttribute('crossOrigin', '');
                    // }
                    // if(posX != this.posX || posY != this.posY){
                      // context.putImageData(imageData, 0, 0);
                      // context.beginPath();
                      // context.arc(posX*52+70, -posY*40+bh-110, 10, 0, 2 * Math.PI, false);
                      // context.arc(150, 100, 20, 0, 2 * Math.PI, false);
                      // context.fillStyle = 'red';
                      // context.fill();
                      // context.lineWidth = 1;
                      // context.strokeStyle = '#003300';
                      // context.stroke();
                      // context.clearRect(0, 0, 500, 650);
                      // this.isImageAlreadyDraw = true;
                      
                  // }


                
                // var isToggle =false;
                
               // Add element.
                elements.push({
                    colour: '#05EFFF',
                    x: posX*52+70,
                    y: -posY*40+bh-110,
                    r: 10,
                    sAngle: 0,
                    eAngle: 2 * Math.PI,
                    counterclockwise: false,
                    user: "Somchai Kositapa",
                });
                elements.push({
                    colour: '#05EFFF',
                    x: 150,
                    y: 100,
                    r: 20,
                    sAngle: 0,
                    eAngle: 2 * Math.PI,
                    counterclockwise: false,
                    user: "Arpa Kositapa",
                });

                elements.forEach(function(element){
                    context.fillStyle = element.colour;
                    // context.fillRect(element.left, element.top, element.width, element.height);
                    context.beginPath();
                    context.arc(element.x, element.y, element.r, element.sAngle, element.eAngle, element.counterclockwise);
                    context.fill();
                      context.lineWidth = 1;
                      context.strokeStyle = '#003300';
                      context.stroke();
                });
                
                
                
                
              
                      }
                } 
                
                // this.isImageAlreadyDrawData = true;

              //   var elemLeft = canvas.offsetLeft + canvas.clientLeft,
              //   elemTop = canvas.offsetTop + canvas.clientTop,
              //   elements = [];
              //   // var isToggle =false;
                
              
              //   // Add event listener for `click` events.
              // let vm = this;
              //  canvas.addEventListener('click', function(event) {
          
              //       var x = event.pageX - elemLeft,
              //           y = event.pageY - elemTop;
                    
              //       // Collision detection between clicked offset and element.
              //       elements.forEach(function(element) {
              //           if (y < element.y + element.r && y > element.y - element.r 
              //               && x < element.x + element.r && x > element.x - element.r) {
                            
                            
              //               // vm.toggle(event,element.user);
              //               vm.display = true;
              //               vm.take = element.user
                           
              //           }
              //       });

              //   }, false);

                // // Add element.
                // elements.push({
                //     colour: '#05EFFF',
                //     x: 150,
                //     y: 100,
                //     r: 20,
                //     sAngle: 0,
                //     eAngle: 2 * Math.PI,
                //     counterclockwise: false,
                //     user: "Somchai Kositapa",
                // });

                // elements.forEach(function(element){
                //     context.fillStyle = element.colour;
                //     // context.fillRect(element.left, element.top, element.width, element.height);
                //     context.beginPath();
                //     context.arc(element.x, element.y, element.r, element.sAngle, element.eAngle, element.counterclockwise);
                //     context.fill();
                //       context.lineWidth = 1;
                //       context.strokeStyle = '#003300';
                //       context.stroke();
                // });

              
            },
            
            
            getPredictionData(){
               this.posX = this.responsePosition[0];
                  this.posY = this.responsePosition[1];
                  console.log("PosX: ",this.posX);
                  console.log("PosY: ",this.posY);
                  this.drawMap(6,this.posX,this.posY); // ต้องเรียกใช้ในนี้ ไม่สามารถเรียกใช้ที่ mounted เพราะค่าจาก NeuralModel มันจะส่งมาหลังจาก mounted lifecycle แล้ว 
                  // console.log(this.posX);
              // if(this.posX != this.responsePosition[0] || this.posY != this.responsePosition[1]){
              //     this.posX = this.responsePosition[0];
              //     this.posY = this.responsePosition[1];
              //     console.log("PosX: ",this.posX);
              //     console.log("PosY: ",this.posY);
              //     this.drawMap(6,this.posX,this.posY); // ต้องเรียกใช้ในนี้ ไม่สามารถเรียกใช้ที่ mounted เพราะค่าจาก NeuralModel มันจะส่งมาหลังจาก mounted lifecycle แล้ว 
              //     // console.log(this.posX);
              // }else{
              //   console.log('Position not changed');
              // }

            },
            fetchDataFromBackend(){
              axios
                .get('http://eb3973450244.ngrok.io')
                // .then(response => (this.info = response))
                .then(response => (this.responsePosition = response.data))
                // .then(response => (console.log(response.data)))
                .catch(error => console.log(error))
                .finally(() => this.getPredictionData())
            }
  },
  created() {
    // this.interval = setInterval(() => this.fetchDataFromBackend(), 10000);
  },
  mounted() {
    console.log('Mounted'); 
    // this.getPredictionData();
    /** Fetch ข้อมูลมาจากฝั่ง Backend ด้วย public url 
     * แบบนี้จริงอยู่ที่ไม่ Secure แต่ในอนาคตเราสามารถ deploy ลงบน cluster อย่าง kubernetes แล้วใช้ internal service ip แทนได้ 
    */
    this.fetchDataFromBackend()
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
}

</script>
<style lang="">
  
</style>