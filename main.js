const express = require('express');
const app = express();
const port = 3000;

// เรนเดอร์ css ออกมา
var path = require('path')

// ตั้ง express view เพื่อให้มันเรียกใช้ index.ejs
app.set("view engine","ejs");

// to make css work 
app.use(express.static(path.join(__dirname, 'public')));

// ประกาศ object mongoose เพื่อที่จะใช้กับ mongodb
var mongoose = require('mongoose');
// ถ้าจะ save อย่างอื่นนอกจาก string จะต้องประกาศ type แบบนี้
var Long = require('mongodb').Long;
mongoose.connect("mongodb://127.0.0.1:27017/beacon").then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

var beaconSchema = new mongoose.Schema({
    macAddress: String,
    // rssi: Long
});

var beaconModel = mongoose.model("beaconTable", beaconSchema);

var testX = 1.0
var testY = 1.0 


app.get('/',(req, res)=> {

    // render webpage และ ส่งค่า parameter
    // res.render("index.ejs",{positionX:testX,positionY,testY});
    res.render('index.ejs', { position: {x: testX, y: testY } })

});

var saveData = new beaconModel({
    'mac': "E0:D9:DA:22:34:1B",
    // 'time': Math.floor(Date.now() / 1000) // Time of save the data in unix timestamp format
}).save(function(err, result) {
    if (err) throw err;

    if(result) {
        console.log(result)
    }
});

app.listen(port, () => console.log("Server running at port " + port));