<template lang="">
    <div>
    </div>
</template>
<script>
const tfjs = require("@tensorflow/tfjs");
export default {

    data() {
        return {
            model: "",
            testDataset: [
                    [-48,-61,-65,-67,-68,-82],

            ],
            prediction: "",
            ypred: "",
        }
    },
    methods: {
        async predictModel(){
            ///  เดี๋ยวฟังก์ชั่นนี้จะต้องรับค่า json rssi มาจาก backend connector
            const model = await tfjs.loadLayersModel('https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/model/model.json');
            this.model = model
            const prediction = model.predict(tfjs.tensor(this.testDataset),{batchSize: 32})
            const ypred = prediction.dataSync()
            this.prediction = prediction
            this.ypred = ypred
            // console.log("Prediction:", this.ypred); // จต้องส่งค่านี้ไปให้ indoor map
            // this.predictionData();
            this.$emit('prediction-data',this.ypred)
        },
        // predictionData(){
        //     this.$emit('prediction-data',this.ypred)
        // }
    },
    emits: ['prediction-data'],
    mounted() {
        this.predictModel();
        
    },
}
</script>
<style lang="">
    
</style>