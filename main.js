const express = require('express');
const app = express();
const port = 3000;

// เรนเดอร์ css ออกมา
var path = require('path')
// ประกาศ object mongoose เพื่อที่จะใช้กับ mongodb
// var mongoose = require('mongoose');

// ตั้ง express view เพื่อให้มันเรียกใช้ index.ejs
app.set("view engine","ejs");

// to make css work 
app.use(express.static(path.join(__dirname, 'public')));

// ประกาศ object mongoose เพื่อที่จะใช้กับ mongodb
var mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/beacon").then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

var beaconSchema = new mongoose.Schema({
    macAddress: String,
    rssi: Int16Array
});

var beaconModel = mongoose.model("beacon", beaconSchema);

var test = "Work!"

app.get('/',(req, res)=> {
    
    // todoModel.find({}, function(err,todo){
    //     if(err) console.log(err);
    //     else{
    //         res.render("index.ejs",{todo:todo});  //ส่งตัวแปร local ไปยัง view // pass a local variable to the view
    //     }
    // })
    

    // render webpage และ ส่งค่า parameter
    res.render("index.ejs",{position:test});
    

});

// app.get('/script.js',(req, res)=> {
    
//     // todoModel.find({}, function(err,todo){
//     //     if(err) console.log(err);
//     //     else{
//     //         res.render("index.ejs",{todo:todo});  //ส่งตัวแปร local ไปยัง view // pass a local variable to the view
//     //     }
//     // })
//     res.render("index.ejs")
    

// });


app.listen(port, () => console.log("Server running at port " + port));