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


// กำหนด metadata ของ table area_table
var alertSchema = new mongoose.Schema({
  name: String,
  trackerid: String,
  areaname: String,
  floor: String,
  timestamp: String, // เก็บเป็น String ไปก่อน เพราะพอเป็น Date แล้ว mongo มันจะไป convert ให้เป็น ISO Date อัติโนมัติ และเรายังเลือก timezone ไม่เป็น
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var alertModel = mongoose.model("alert_table", alertSchema);


// กำหนด metadata ของ table area_table
var locationSchema = new mongoose.Schema({
  xy: [],
  areaname: String,
  floor: String,
  name: String,
  timestamp: String, // เก็บเป็น String ไปก่อน เพราะพอเป็น Date แล้ว mongo มันจะไป convert ให้เป็น ISO Date อัติโนมัติ และเรายังเลือก timezone ไม่เป็น
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var locationModel = mongoose.model("location_table", locationSchema);

const { PythonShell } = require("python-shell");
const path = require("path");
var url = "/src";
app.get("/", async (req, res) => {
  /**
   * ชั้นตอนการทำงาน (ณ ตอนนี้)
   * 1. Extract ค่าจาก payload ที่ส่งมาจาก Chirpstack
   * 2. ตรวจหา floor ของผู้ใช้จาก Major Minor
   * 3. นำ MAC Address ไป Query ใน user_tables ว่าข้อมูลที่ส่งมาเป็นของใคร แล้วดึงข้อมูลของ user นั้นออกมา
   * 4. นำ floor ไป Query ใน area_tables เพื่อดึงข้อมูลเฉพาะชั้นที่ user อยู่ออกมา
   * 5. ให้ model ทำนายตำแหน่ง
   * 6. นำตำแหน่งที่ได้ไปทำ Geofencing ผ่าน PythonShell
   * 7. ถ้ารู้แล้วว่า user อยู่ในตำแหน่งไหน ให้เช็คต่อว่า ตำแหน่งนั้นมัน restrict รึเปล่า โดยการดูจาก restrictfor ของ document นั้น
   * 8. ถ้าละเมิดให้บันทึกค่าลงใน alert_tables
   * 
   * ในอนาคต
   * 8. ถ้าละเมิดให้ปรับสภานะของ user เป็น warning ถ้ามีการละเมิดอีกครั้งภายหลัง จึงบันทึกลงใน alert_tables
   * 9. อย่าลืมบันทึกตำแหน่งแต่ละครั้งของ user เอาไว้ด้วย ยังไม่แน่ใจว่าจะบันทึกทุก ๆ กี่นาที
   * 10. ส่งข้อมูล ตำแหน่งไปแสดงบนหน้า map frontend และรายละเอียดอื่น ๆ เช่น ชื่อห้อง ชั้น ไปแสดงที่หน้า Info
   * 11. ส่งข้อมูลการละเมิดไปยังหน้า Info (คิดว่าจะต้องมีการส่ง email ไป แต่ว่าเขียน code ยังไงก็ยังคิดไม่ออก T_T)
   */


  /**
   * ในอนาคต ตัวแปรพวกนี่้จะถูก extract มาจาก payload (MAC, RSSI, Major, Minor)
   */
  var major = 1;
  var minor = 5;
  var floor;
  if (major === 1 && minor === 5) {
    floor = 5;
  }
  var mac = "E0:D9:DA:22:34:1B";


  var name = "Somchai"
  var surName = "Kositapa"
  var trackerId = "n00001"
  // var company = "";
  // var department = "DevOps";
  var department = "Infras";
  // var isInsideCompany = true;
  // var fence ="",name,floor,restrictFor;

  var rssi = [
    // [-48, -61, -65, -67, -68, -82], //Position (1,1)
    [-54, -62, -62, -69, -70, -75],
    // [-48, -67, -53, -63, -72, -71],
    // [-51, -70, -65, -83, -69, -89],
  ];
  
  const model = await tfjs.loadLayersModel(
    "https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/old-web/model/model.json"
  );
  // ถ้าไม่ใส่ Batch size มันจะ print ออกมาเป็น Object ของ tensor ไม่ใช่ (x,y)
  const prediction = model.predict(tfjs.tensor(rssi), { batchSize: 32 });
  const ypred = prediction.dataSync();
  // res.send(ypred)
  // console.log(ypred);

  var database =[];
  /**
   * ต้องใส่ await เพราะเราจะต้อง copy ค่าไปไว้ใน global var เพื่อจะทำ striglify แล้วนำไปเป็น argument ของ python
   * (เหตุเกิดจากการที่ใส่ argument เป็น [[1, 1], [1, 4], [2, 4], [2, 5], [4, 5], [4, 1]] แล้วมันเพี้ยนไปเป็น tuple ใน python)
   * เราจึงต้องทำให้เป็น String ก่อน เพราะในไฟล์ python มันมี logic แปลง string เป็น list เรียบร้อยแล้ว
   * แล้วเราต้องการจะเอาค่าจาก DB ไปใส่เป็น argument ถ้าไม่ใส่ await แล้วค่า var fence จะเป็นตามค่า default มัน เช่น undefined หรือ ""
   * ทั้งนี้เกิดจากการที่ javascript เป็น asynchronous programming คือระหว่างรอ areaModel.find() มันก็ไปทำส่วนถัดไปซะแล้ว ~ ~
   */
  await areaModel.find({"floor" : floor}, function(err, area) { 
    if (err) console.log(err);
    else {
      database = area
    }
  });
  // var fenceString
  // var objectLength = Object.keys(database).length
  // console.log("Database:", database);
  // console.log("Object length ",objectLength);

  /**
   * เนื่องจากในการเรียกใช้ python shell นั้น มันจะต้องใส่ path มายัง geofencing.py ด้วย เพราะว่า
   * มันไม่ใช่ nodejs มันคือการเรียก python interpreter ดังนั้น working directory จึงเป็น path ของ python
   * เราจึงต้อง navigate มาที่ไฟล์ใน directory เรา แล้วเพื่อให้มันยืดหยุ่น ใช้บนคอมเครื่องอื่นได้ (path ไม่เหมือนกัน)
   * จึงต้องใช้ process.cwd เพื่อเอา current working directory มานั่นเอง
   */
  var trulyPath = path.join(process.cwd(), url);
  // console.log(trulyPath);
  var areaName, restrictForDepartment, isAlert, resultFromPython, readyToBreak, locationAreaName;
  
  var database2
  // setInterval(async function() {
  //   locationModel.find({"areaname": locationAreaName,"name" : name}, function(err, location) { 
  //        if (err) console.log(err);
  //        else {
  //         //  console.log("locationAreaName: ",locationAreaName);
  //         //  console.log("Name: ",name);
  //         //  console.log("location: ",location);
  //          database2 = location
  //          // console.log("Database2 ",database2);
  //        }
  //      });
  //      }, 5000); //run this thang every ... seconds
  // setTimeout(() => {
  //   // setInterval(res.send(ypred), 5*1000);
      
  //   }, 6000);
  async function test(){
    console.log("Database:", database);
    for (var property in database){
      // console.log(`${database[property].fence}`);
      // ค่าที่ดึงออกมาจาก DB เป็น Object เราจึงต้องแปลงเป็น String ก่อน
      readyToBreak = false
      
      // console.log("Fence: ",database[property].fence);
      // console.log("Restrictfor: ",database[property].restrictfor);
      
      let tempRestrict = database[property].restrictfor
      let tempFence = database[property].fence
      let fenceString = JSON.stringify(tempFence)
      // console.log("Fencestring ",fenceString);
      let options = {
        mode: "text",
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: trulyPath, //If you are having python_test.py script in same folder, then it's optional.
        args: [2, 3, fenceString], //An argument which can be accessed in the script using sys.argv[1]
        // args: [ypred[0], ypred[1], fenceString], //An argument which can be accessed in the script using sys.argv[1]
      };
      let tempAreaName = await database[property].name
      
      PythonShell.run("geofencing.py", options, function(err, result) {
        // isAlert = false
        // console.log("Inside Fencestring ",fenceString);
        if (err) throw err;
        // result is an array consisting of messages collected during execution of script.
        var tempAns = result.toString()
        console.log("result: ", tempAns);
        // console.log("Inside Fence: ",database[property].fence);
        // console.log("Inside Restrictfor: ",tempRestrict);
        console.log("Area: ",tempAreaName);
        if (tempAns === "True"){
          // console.log("Holy");
          // timer
          locationAreaName = tempAreaName
          areaName = database[property].name
          restrictForDepartment = tempRestrict
          // console.log("Area name: ",areaName);
          console.log("User Department: ",department);
          console.log("Area Restrict for: ",restrictForDepartment);
          // console.log("Check Restrictfor: ",restrictForDepartment);
          var dt = new Date();
          if (department != restrictForDepartment){
            isAlert = true
            
            // var saveData = new alertModel({
            //   name: name+" "+surName,
            //   trackerid: trackerId,
            //   areaname: tempAreaName,
            //   floor: floor,
            //   timestamp: `${
            //     (dt.getMonth()+1).toString().padStart(2, '0')}/${
            //     dt.getDate().toString().padStart(2, '0')}/${
            //     dt.getFullYear().toString().padStart(4, '0')} ${
            //     dt.getHours().toString().padStart(2, '0')}:${
            //     dt.getMinutes().toString().padStart(2, '0')}:${
            //     dt.getSeconds().toString().padStart(2, '0')}`,// Time of save the data in unix timestamp format
  
            //   }).save(function(err, result) {
            //     if (err) throw err;
            //     if (result) {
            //       console.log(result);
            //       console.log("Alert Save Complete");
            //     }
            //   });
          }else{
            isAlert = false
          }
          console.log("Alert: ",isAlert);
          // async function f3() {
          //   readyToBreak = await true;
          //   // console.log(y); // 20
          // }
  
          // f3()
          // readyToBreak = true;
          //   if(readyToBreak){
          //     console.log("break");
          //     return
          //   }else{
          //     console.log("not break");
          //   }
  
          var saveData = new locationModel({
            xy: [2, 3],
            areaname: tempAreaName,
            floor: floor,
            name: name,
            timestamp: `${
              (dt.getMonth()+1).toString().padStart(2, '0')}/${
              dt.getDate().toString().padStart(2, '0')}/${
              dt.getFullYear().toString().padStart(4, '0')} ${
              dt.getHours().toString().padStart(2, '0')}:${
              dt.getMinutes().toString().padStart(2, '0')}:${
              dt.getSeconds().toString().padStart(2, '0')}`,// Time of save the data in unix timestamp format,
            }).save(function(err, result) {
              if (err) throw err;
              if (result) {
                console.log(result);
                console.log("Location Save Complete");
              }
            });
        }else{
          // console.log("Moly");
        }
        // console.log("depart: ",department);
        // console.log("restrictfor ",restrictForDepartment);
        console.log("\n");
        // res.send(result.toString())
      });
      // setTimeout(() => {
      //   if(readyToBreak){
      //     console.log("ppp");
      //     return
      //   }else{
      //     console.log("Yolo");
      //   }
      // }, 3000);
      
    }
  }
  var timeArray = [] , areaNameArray = [];
  async function test2(){
    
  //  await locationModel.find({"areaname": locationAreaName,"name" : name}, function(err, location) { 
    await locationModel.find({"name" : name}, function(err, location) { 
      if (err) console.log(err);
      else {
        console.log("locationAreaName: ",locationAreaName);
        console.log("Name: ",name);
        console.log("location: ",location);
        database2 = location;
        // console.log("Database2 ",database2);
        console.log("Database2 ", database2);
        var objectLength = Object.keys(database2).length;
        var areaNameCounter = 0;
        var minusDate;
      /** ค้นหาใน database 2 ที่เก็บข้อมูลตำแหน่งของ user อยู่ */
      for (var property2 in database2){
        let tempTimestamp = database2[property2].timestamp;
        // let tempFence = database2[property2].fence
        // let fenceString = JSON.stringify(tempFence)  
        console.log("Iterator: ",property2); 
        console.log("time: ", tempTimestamp);
        timeArray.push(database2[property2].timestamp);
        areaNameArray.push(database2[property2].areaname);
        // if (database2[property2].areaname){

        // }
        // console.log("Outside: ",database2[property2].areaname);

        /** ไม่ให้ overflow */
        if (property2 < objectLength){
          // console.log("inside: ",database2[property2].areaname);
          // console.log("Database[property]: ",database2[property2]);
          // console.log("Counter: ",areaNameCounter); 
          /** ต้องไม่เป็น 0 เพราว่าเราใช้การตรวจสอบแบบย้อนหลัง (ตำแหน่งปัจจุบัน กับ ตำแหน่งก่อนหน้า) 
           * ถ้าเป็น 0 มันจะติด - และ error undefined
          */
          if(property2 != 0){
            /** ถ้า area name ตรงกับตัวก่อนหน้า (ยังอยู่ใน area เดิม) ใหันับ +1 */
            if(database2[property2].areaname == database2[property2-1].areaname  ) {
              areaNameCounter += 1
            }
            /** ถ้า area name ไม่ตรงกับตัวก่อนหน้า (แสดงว่าเปลี่ยน area แล้ว) ให้คำนวณเวลาที่อยู่ในพื่้นที่ล่าสุดที่ผ่านมา */
            if((database2[property2].areaname != database2[property2-1].areaname) && property2 != 0){
              var numericProperty = parseInt(property2)
              // console.log("Exc Pro: ", numericProperty);
              // console.log("Exc AreaNameCounter: ",areaNameCounter);
              // console.log("TYPE: ",typeof(property2));
              // console.log("WTF: ",numericProperty - areaNameCounter);
              // minusDate = database2[property2-1].timestamp - database2[(property2 - 1) - (areaNameCounter+1) -1 ].timestamp
              var firstTimeStamp = database2[numericProperty - areaNameCounter].timestamp
              var lastTimeStamp = database2[numericProperty-1].timestamp
              console.log("First timestamp:",firstTimeStamp);
              console.log("Last timestamp:",lastTimeStamp);
              const date1 = new Date(firstTimeStamp);
              const date2 = new Date(lastTimeStamp);

              var diff = Math.abs(date1 - date2)/1000/60/60;
              // if (diff >= 1){

              // }
              console.log(diff)
              areaNameCounter = 1
            }
          }
          /** กรณีเฉพาะตัวแรก */
         else if(property2 == 0){
            areaNameCounter += 1
          }
         
        }
        // console.log("Time Array: ", timeArray);
        // console.log("WTF: ", database2[property2].timestamp);
      }
      
      // const sortedDate = database2.sort((a, b) => b.timestamp - a.timestamp)
      }
    });
    console.log("Time Array: ", timeArray);
    console.log("Area Name Array: ", areaNameArray);
  }
  async function test3(){
    // console.log("Time Array: ", timeArray);
  }

   
    await test()
    

    setTimeout(async () => {
     await test2()
    //  await test3()
      }, 6000);
    
      
    // console.log("Database2 Time ", database2.timestamp);
  

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

  
  // // เอา mac ไปตรวจสอบว่าเป็นของ tracking ตัวไหน
  // userModel.find({"macaddress" : mac}, function(err, user) {
  //   if (err) console.log(err);
  //   else {
  //     // res.render("index.ejs",{todo:todo});  //ส่งตัวแปร local ไปยัง view // pass a local variable to the view
  //     var name,surName,isEmployee,department,company,trackerId,macAddress
  //     console.log(user);
  //     user.map(function(user) {
  //       name = user.name;
  //       surName = user.surname;
  //       isEmployee = user.isemployee;
  //       department = user.department;
  //       company = user.company;
  //       trackerId = user.trackerid;
  //       macAddress = user.macaddress;
  //     });
  //     console.log("Name: ",name);
  //     console.log("Surname: ",surName);
  //     console.log("Is Employee: ",isEmployee);
  //     console.log("Department: ",department);
  //     console.log("Company: ",company);
  //     console.log("Trackerid: ",trackerId);
  //     console.log("Mac Address: ",macAddress);
  //     // res.send(name);
  //     // res.send(surName);
  //     res.send(user)
  //     // res.sendStatus(200);
  //     // return;
  //   }
  // });

  // console.log(" ");
  // var fofo =[]
  // areaModel.f
  
    // res.status(200).send(fence)
    
    res.sendStatus(200)
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
var myPoly = [
  // [1, 1], [1, 4], [2, 4], [2, 5], [4, 5], [4, 1] // true DevOps
  // [1, 1], [1, 2], [3, 2], [2, 5], [4, 5], [4, 1] // false Test Automation
  [5, 1], [3, 2], [2, 5], [4, 5], [5, 3] //false Infras
];

// var saveData = new areaModel({
//   fence: myPoly,
//   // name: "Agile inner meeting room",
//   name: "Infras working space",
//   // name: "Test automation data room",
//   floor: "5",
//   // restrictfor: "DevOps",
//   restrictfor: "Infras",
//   // restrictfor: "Test Automation",
//   // 'time': Math.floor(Date.now() / 1000) // Time of save the data in unix timestamp format
// }).save(function(err, result) {
//   if (err) throw err;
//   if (result) {
//     // console.log(result);
//     console.log("Save Complete");
//   }
// });

 

// app.use('/test', require('./server.js'))

app.listen(port, () => console.log("Server running at port " + port));
