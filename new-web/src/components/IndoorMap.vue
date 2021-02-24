<template lang="">
  <div>
    <div class="canvasArea">
        <canvas ref="myCanvas" width="500" height="650"  >
            Your browser does not support the HTML5 canvas tag.</canvas>
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
    drawMap(floor,posX,posY) {
      
                 /* radiomap กว้าง 60 สูง 60
                    โลกจริง radomap กว้าง 1 เมตร สูง 1 เมตร
                    ดังนั้น อัตราส่วนคือ 1 : 60
                    */
                // console.log("draw");
                // console.log(posX);
                // console.log(posY);
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
                make_base();
                // console.log(this.floorplan[0].src);
                
                function make_base()
                {
                  
                base_image = new Image();
                base_image.src = myImage;
                // base_image.setAttribute('crossOrigin', '');
                // base_image.crossOrigin = "Anonymous";
                
                  base_image.onload = function(){
                    // if (!isImageAlreadyDrawLocal){ 
                      context.drawImage(base_image, 0, 0);
                      // var imageData = context.getImageData(0,0,500,650);
                      // base_image.setAttribute('crossOrigin', '');
                    // }
                    // if(posX != this.posX || posY != this.posY){
                      // context.putImageData(imageData, 0, 0);
                      context.beginPath();
                      context.arc(posX*52+70, -posY*40+bh-110, 10, 0, 2 * Math.PI, false);
                      context.fillStyle = 'red';
                      context.fill();
                      context.lineWidth = 1;
                      context.strokeStyle = '#003300';
                      context.stroke();
                      // context.clearRect(0, 0, 500, 650);
                      // this.isImageAlreadyDraw = true;
                      
                  // }
                      }
                  
                } 
                this.isImageAlreadyDrawData = true;

            },
            // getPredictionData(position){
            //     this.posX = position[0];
            //     this.posY = position[1];
            //     console.log("PosX: ",this.posX);
            //     console.log("PosY: ",this.posY);
            //     this.drawMap(6,this.posX,this.posY); // ต้องเรียกใช้ในนี้ ไม่สามารถเรียกใช้ที่ mounted เพราะค่าจาก NeuralModel มันจะส่งมาหลังจาก mounted lifecycle แล้ว 
            //     // console.log(this.posX);
            // },
            
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
                .get('http://e97f47d932f8.ngrok.io')
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