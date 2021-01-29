const tfjs = require("@tensorflow/tfjs");
const express = require("express");
const app = express();
const port = 3000;
// const spawn  = require("child_process").spawn;
var proxy = require("express-http-proxy");
// ********************************ต้องใช้ body parser ในการ extract ค่า req ออกมาจาก method-
const bodyParser = require("body-parser");
// post ไม่งั้นมันจะเป็น req ก้อนใหญ่ที่ดูไม่รู้เรื่องเลย*****************
app.use(bodyParser.json());
// อันนี้ อาจะไม่ต้องใช้ ถ้าไม่ได้ encode url มา
app.use(bodyParser.urlencoded({ extended: true }));

// ประกาศ object mongoose เพื่อที่จะใช้กับ mongodb
var mongoose = require("mongoose");
// ถ้าจะ save อย่างอื่นนอกจาก string จะต้องประกาศ type แบบนี้
// var Long = require('mongodb').Long;
// mongoose.connect("mongodb://127.0.0.1:27017/beacon").then(() => console.log('MongoDB Connected')).catch(err => console.log(err));
mongoose
  .connect("mongodb://mongodb:27017/beacon")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
// กำหนด metadata ของ table
var beaconSchema = new mongoose.Schema({
  MAC: String,
  RSSI: Number,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var beaconModel = mongoose.model("beaconTable", beaconSchema);
const {PythonShell} =require('python-shell'); 
const path = require('path');
var url = '/src' 
app.get("/", async (req, res) => {
    /**
     * เนื่องจากในการเรียกใช้ python shell นั้น มันจะต้องใส่ path มายัง geofencing.py ด้วย เพราะว่า
     * มันไม่ใช่ nodejs มันคือการเรียก python interpreter ดังนั้น working directory จึงเป็น path ของ python
     * เราจึงต้อง navigate มาที่ไฟล์ใน directory เรา แล้วเพื่อให้มันยืดหยุ่น ใช้บนคอมเครื่องอื่นได้ (path ไม่เหมือนกัน)
     * จึงต้องใช้ process.cwd เพื่อเอา current working directory มานั่นเอง
     */
    var trulyPath = path.join(process.cwd(),url)
    console.log(trulyPath);
  
  let options = { 
    mode: 'text', 
    pythonOptions: ['-u'], // get print results in real-time 
      scriptPath: trulyPath, //If you are having python_test.py script in same folder, then it's optional. 
    args: [2,3] //An argument which can be accessed in the script using sys.argv[1] 
}; 
PythonShell.run('geofencing.py', options, function (err, result){ 
  if (err) throw err; 
  // result is an array consisting of messages collected  
  //during execution of script. 
  console.log('result: ', result.toString()); 
  // res.send(result.toString()) 
}); 
  // var spawn = require("child_process").spawn; 
  // var python = spawn("python", ["./geofencing.py", 2, 3]);
  // console.log("WTF IS THIS: ");
  // // console.log(python);
  // console.log(typeof(python));
  // // console.log("Start:");
  // python.stdout.on("data", function(data) {
  //   console.log("Pipe data from python script ...");
  //   res.sendStatus(200)
  //   res.send(data.toString())
  //   // dataToSend = data.toString();
  // });
  // python.on("close", (code) => {
  //   console.log(`child process close all stdio with code ${code}`);
  //   // send data to browser
  //   // console.log("Output: ", dataToSend);
  // });
  var items = [
    [-48, -61, -65, -67, -68, -82], //Position (1,1)
    // [-54, -62, -62, -69, -70, -75],
    // [-48, -67, -53, -63, -72, -71],
    // [-51, -70, -65, -83, -69, -89],
  ];
  // var example = [-48,-61,-65,-67,-68,-82];
  const model = await tfjs.loadLayersModel(
    "https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/old-web/model/model.json"
  );
  // ถ้าไม่ใส่ Batch size มันจะ print ออกมาเป็น Object ของ tensor ไม่ใช่ (x,y)
  const prediction = model.predict(tfjs.tensor(items), { batchSize: 32 });
  const ypred = prediction.dataSync();

  // console.log(ypred);
  // // console.log('testGet');
  // // res.render('index.ejs', { position: {x: ypred[0], y: ypred[1] } })
  res.send(ypred);
  res.sendStatus(200);

  // function sendData() {
  // //   res.send(ypred);
  // // res.sendStatus(200);
  // console.log("Sent !");
  // }
  // setInterval(res.send(ypred), 5*1000);
  // setInterval(function() {
  //   res.send(ypred);
  //   res.sendStatus(200);
  //   console.log("Sent!");
  // }, 1000); //run this thang every 2 seconds
});

// setInterval(function(){
//   res.send(ypred);
//   res.sendStatus(200);
//   console.log("Sent!");
// }, 1000);//run this thang every 2 seconds

// // app.use('/',proxy('localhost:8080'))
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const API_SERVICE_URL = "http://localhost:8080";
// // Proxy endpoints
// app.use('/api', createProxyMiddleware({
//   target: API_SERVICE_URL,
//   changeOrigin: true,
//   pathRewrite: {
//       [`^/api`]: '',
//   },
// }));

app.post("/getval", (req, res) => {
  // var data = await req.body
  // console.log("Got Data: ",req);
  // console.log("ALSO Got Data Use Query: ",req.query);
  console.log("full Body: ", req.body);
  // console.log("devEui: ", req.body.devEUI);
  // console.log(typeof req.body.rxInfo);
  // console.log("rxInfo: ", req.body.rxInfo);

  // this is how to extract rssi from rxInfo
  // ต้องทำแบบนี้เพราะว่า rxInfo เป็น object ที่อยู่ใน req.body อีกที ไม่สามารถใช้ req.body.rxInfo.rssi ได้
  var rssi = req.body.rxInfo.map(function(rxInfo) {
    return rxInfo.rssi;
  });
  console.log(typeof rssi);
  var rssiValue = rssi.map(function(rssi) {
    return rssi.values;
  });
  console.log("rssi: ", rssi);
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

// app.use('/test', require('./server.js'))

app.listen(port, () => console.log("Server running at port " + port));
