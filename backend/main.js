// import { tfjs } from '@tensorflow/tfjs';
// import * as tf from '@tensorflow/tfjs-node'
const tfjs = require("@tensorflow/tfjs");

//const model =  tfjs.loadLayersModel('D:/Work/Project/Github/Low-Power-IPS-Web-App/model/model.json');
// const tf = require('@tensorflow/tfjs-node');

const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

// เรนเดอร์ css ออกมา
var path = require('path')

// ตั้ง express view เพื่อให้มันเรียกใช้ index.ejs
app.set("view engine","ejs");

// to make css work 
app.use(express.static(path.join(__dirname, 'public')));

// ********************************ต้องใช้ body parser ในการ extract ค่า req ออกมาจาก method-
// post ไม่งั้นมันจะเป็น req ก้อนใหญ่ที่ดูไม่รู้เรื่องเลย*****************
app.use(bodyParser.json());
// อันนี้ อาจะไม่ต้องใช้ ถ้าไม่ได้ encode url มา
app.use(bodyParser.urlencoded({ extended: true }));


// ประกาศ object mongoose เพื่อที่จะใช้กับ mongodb
var mongoose = require('mongoose');
// ถ้าจะ save อย่างอื่นนอกจาก string จะต้องประกาศ type แบบนี้
// var Long = require('mongodb').Long;
// mongoose.connect("mongodb://127.0.0.1:27017/beacon").then(() => console.log('MongoDB Connected')).catch(err => console.log(err));
mongoose.connect("mongodb://mongodb:27017/beacon").then(() => console.log('MongoDB Connected')).catch(err => console.log(err));
// กำหนด metadata ของ table
var beaconSchema = new mongoose.Schema({
    MAC: String,
    RSSI: Number
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var beaconModel = mongoose.model("beaconTable", beaconSchema);

var testX = 1.0
var testY = 1.0 



// async function predict() {
//     var items = [
//         [-48,-61,-65,-67,-68,-82],
//         [-48,-67,-53,-63,-72,-71],
//         [-51,-70,-65,-83,-69,-89]
//       ];
//     var example = [-48,-61,-65,-67,-68,-82];
//     const model =   await tfjs.loadLayersModel('https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/model/model.json');
//     // const model =   await tfjs.loadLayersModel('file://D:/Work/Project/Github/Low-Power-IPS-Web-App/model/model.json');
//     //const model =   await tf.loadLayersModel('file://D:/Work/Project/Github/Low-Power-IPS-Web-App/model/model.json');
//     const prediction = model.predict(tfjs.tensor(items),{batchSize: 32})
    
//     // ถ้าไม่ใส่ Batch size มันจะ print ออกมาเป็น Object ของ tensor ไม่ใช่ (x,y)
//     // model.predict(tfjs.stack(items),{batchSize: 32}).print()
//     // const ypred = prediction.flatten().arraySync();
//     const ypred = prediction.dataSync()
//     // const prediction = model.then(data =>{
//     //     console.log(data)
//     // });
//     // console.log(prediction);
//     console.log(ypred);
//     // return prediction;
//     return ypred
// }

app.get('/',async(req, res)=> {
    // var data = await req.body;
    // console.log("Got Data: ",data);
    // console.log("ALSO Got Data: ",req.query);
    // console.log("ALSO Got Data: ",req.query.event);
    // console.log('get')
    // render webpage และ ส่งค่า parameter
    // res.render("index.ejs",{positionX:testX,positionY,testY});

    // ไม่น่าจะต้อง query posx,y จาก database ก็คือให้ python คำนวณแล้วก็ get ค่ามาเลย
    // beaconModel.find({}, function(err,))
    // var predictio = await predict();
    // var prediction = Promise(predictio);
    // prediction.then(function(result) {
    //     console.log("OMG");
    //     console.log(prediction);
    //     // here you can use the result of promiseB
    //     res.render('index.ejs', { position: {x: prediction, y: prediction } })

    // });
    // const prediction = predict(data =>{
    //     console.log(data)
    // });

    var items = [
        [-48,-61,-65,-67,-68,-82],
        [-48,-67,-53,-63,-72,-71],
        [-51,-70,-65,-83,-69,-89]
      ];
    // var example = [-48,-61,-65,-67,-68,-82];
    const model =   await tfjs.loadLayersModel('https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/model/model.json');
    // const model =   await tfjs.loadLayersModel('file://D:/Work/Project/Github/Low-Power-IPS-Web-App/model/model.json');
    //const model =   await tf.loadLayersModel('file://D:/Work/Project/Github/Low-Power-IPS-Web-App/model/model.json');
    const prediction = model.predict(tfjs.tensor(items),{batchSize: 32})
    
    // ถ้าไม่ใส่ Batch size มันจะ print ออกมาเป็น Object ของ tensor ไม่ใช่ (x,y)
    // model.predict(tfjs.stack(items),{batchSize: 32}).print()
    // const ypred = prediction.flatten().arraySync();
    const ypred = prediction.dataSync()
    // const prediction = model.then(data =>{
    //     console.log(data)
    // });
    // console.log(prediction);
    console.log(ypred);
    // console.log(prediction);
    res.render('index.ejs', { position: {x: ypred[0], y: ypred[1] } })
    
});

app.post('/getval',(req, res)=> {

    // var data = await req.body
    // console.log("Got Data: ",req);
    // console.log("ALSO Got Data Use Query: ",req.query);
    console.log("full Body: ", req.body);
    // console.log("devEui: ", req.body.devEUI);
    // console.log(typeof req.body.rxInfo);
    // console.log("rxInfo: ", req.body.rxInfo);

    // this is how to extract rssi from rxInfo 
    // ต้องทำแบบนี้เพราะว่า rxInfo เป็น object ที่อยู่ใน req.body อีกที ไม่สามารถใช้ req.body.rxInfo.rssi ได้
    var rssi = req.body.rxInfo.map(function (rxInfo){
        return rxInfo.rssi;
    });
    console.log(typeof rssi);
    var rssiValue = rssi.map(function (rssi){
        return rssi.values;
    });
    console.log("rssi: ",rssi);
    // console.log("rssiValue: ",rssiValue);
    // console.log(typeof rssi.values);
    // console.log("rssi: ",rssi.value);
    // console.log("rssi2: ", req.body.rxInfo[rssi]);
    
    res.sendStatus(200);
    // console.log("ALSO Got Data: ",req.query.event.up);
    // console.log("ALSO Got Data: ",req.query.event.up.dev_eui);
    // res.render('index.ejs')
});


// var saveData = new beaconModel({
//     "MAC": "E0:D9:DA:22:34:1B",
//     "RSSI" : -50
//     // 'time': Math.floor(Date.now() / 1000) // Time of save the data in unix timestamp format
// }).save(function(err, result) {
//     if (err) throw err;

//     if(result) {
//         console.log(result)
//     }
// });



app.listen(port, () => console.log("Server running at port " + port));