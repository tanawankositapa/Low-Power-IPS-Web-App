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
  // .connect("mongodb://mongodb:27017/indoordb") // for using docker
  .connect("mongodb://127.0.0.1:27017/indoordb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
// กำหนด metadata ของ table area_table
var areaSchema = new mongoose.Schema({
  fence: [],
  name: String,
  floor: String,
  restrictfor: String,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var areaModel = mongoose.model("area_table", areaSchema);

/**
 * c\แม้เราจะตั้งชื่อว่า area_table หรือ user_table แต่ mongo มันจะใส่ชื่อให้เราเป็น area_tables และ user_tables เสมอ
 */

// กำหนด metadata ของ table area_table
var userSchema = new mongoose.Schema({
  fence: [],
  name: String,
  surname: String,
  isemployee: Boolean,
  department: String,
  company: String,
  trackerid: String,
  macaddress: String,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var userModel = mongoose.model("user_table", userSchema);




const { PythonShell } = require("python-shell");
const path = require("path");
var url = "/src";
app.get("/", async (req, res) => {
  /**
   * เนื่องจากในการเรียกใช้ python shell นั้น มันจะต้องใส่ path มายัง geofencing.py ด้วย เพราะว่า
   * มันไม่ใช่ nodejs มันคือการเรียก python interpreter ดังนั้น working directory จึงเป็น path ของ python
   * เราจึงต้อง navigate มาที่ไฟล์ใน directory เรา แล้วเพื่อให้มันยืดหยุ่น ใช้บนคอมเครื่องอื่นได้ (path ไม่เหมือนกัน)
   * จึงต้องใช้ process.cwd เพื่อเอา current working directory มานั่นเอง
   */
  var trulyPath = path.join(process.cwd(), url);
  console.log(trulyPath);

  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: trulyPath, //If you are having python_test.py script in same folder, then it's optional.
    args: [2, 3], //An argument which can be accessed in the script using sys.argv[1]
  };
  PythonShell.run("geofencing.py", options, function(err, result) {
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    console.log("result: ", result.toString());
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
  var rssi = [
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
  const prediction = model.predict(tfjs.tensor(rssi), { batchSize: 32 });
  const ypred = prediction.dataSync();
  // res.send(ypred)
  // console.log(ypred);
  // // console.log('testGet');
  // // res.render('index.ejs', { position: {x: ypred[0], y: ypred[1] } })

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

  

  /**
   * ในอนาคต ตัวแปรพวกนี่้จะถูก extract มาจาก payload
   */
  var major = 1;
  var minor = 5;
  var floor;
  if (major === 1 && minor === 5) {
    floor = 5;
  }
  var mac = "E0:D9:DA:22:34:1B";
  

  // เอา mac ไปตรวจสอบว่าเป็นของ tracking ตัวไหน
  userModel.find({"macaddress" : mac}, function(err, user) {
    if (err) console.log(err);
    else {
      // res.render("index.ejs",{todo:todo});  //ส่งตัวแปร local ไปยัง view // pass a local variable to the view
      var name,surName,isEmployee,department,company,trackerId,macAddress
      console.log(user);
      user.map(function(user) {
        name = user.name;
        surName = user.surname;
        isEmployee = user.isemployee;
        department = user.department;
        company = user.company;
        trackerId = user.trackerid;
        macAddress = user.macaddress;
      });
      console.log("Name: ",name);
      console.log("Surname: ",surName);
      console.log("Is Employee: ",isEmployee);
      console.log("Department: ",department);
      console.log("Company: ",company);
      console.log("Trackerid: ",trackerId);
      console.log("Mac Address: ",macAddress);
      // res.send(name);
      // res.send(surName);
      res.send(user)
      // res.sendStatus(200);
      // return;
    }
  });

  console.log(" ");
  // var fofo =[]
  areaModel.find({"floor" : floor}, function(err, area) {
    if (err) console.log(err);
    else {
      // console.log(length(area));
      var fence,name,floor,restrictFor;
      area.map(function(area) {
        fence = area.fence;
        name = area.name;
        floor = area.floor;
        restrictFor = area.restrictfor;
      });
      console.log("Fence: ",fence);
      console.log(typeof(fence));
      console.log("Name: ",name);
      console.log("Floor: ",floor);
      console.log("Restrict for: ",restrictFor);
      // fofo.push(fence)
      // console.log("fofo",fofo);
    }
  });

});

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

// var saveData = new areaModel({
//   fence: "[(1, 1), (1, 4), (2, 4), (2, 5), (4, 5), (4, 1)]",
//   name: "Agile inner meeting room",
//   floor: "4",
//   restrictfor: "DevOps",
//   // 'time': Math.floor(Date.now() / 1000) // Time of save the data in unix timestamp format
// }).save(function(err, result) {
//   if (err) throw err;
//   if (result) {
//     console.log(result);
//   }
// });

// app.use('/test', require('./server.js'))

app.listen(port, () => console.log("Server running at port " + port));
