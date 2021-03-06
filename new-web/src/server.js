/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
const tfjs = require("@tensorflow/tfjs");
const express = require("express");
const app = express();
const port = 3000;
("use strict");
// const spawn  = require("child_process").spawn;
var proxy = require("express-http-proxy");
// ********************************ต้องใช้ body parser ในการ extract ค่า req ออกมาจาก method-
const bodyParser = require("body-parser");
// post ไม่งั้นมันจะเป็น req ก้อนใหญ่ที่ดูไม่รู้เรื่องเลย*****************
app.use(bodyParser.json());
// อันนี้ อาจะไม่ต้องใช้ ถ้าไม่ได้ encode url มา
app.use(bodyParser.urlencoded({ extended: true }));
/** จะได้ไม่ต้องใช้ extension */
const allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};
app.use(allowCrossDomain);
// ประกาศ object mongoose เพื่อที่จะใช้กับ mongodb
var mongoose = require("mongoose");
// ถ้าจะ save อย่างอื่นนอกจาก string จะต้องประกาศ type แบบนี้
// var Long = require('mongodb').Long;
// mongoose.connect("mongodb://127.0.0.1:27017/beacon").then(() => console.log('MongoDB Connected')).catch(err => console.log(err));
mongoose
  .connect("mongodb://mongodb:27017/indoordb") // for using docker
  // .connect("mongodb://127.0.0.1:27017/indoordb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
// กำหนด metadata ของ table area_table
var areaSchema = new mongoose.Schema({
  fence: [],
  name: String,
  // floor: String,
  restrictfor: String,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var areaModel = mongoose.model("area_table", areaSchema);

/**
 * c\แม้เราจะตั้งชื่อว่า area_table หรือ user_table แต่ mongo มันจะใส่ชื่อให้เราเป็น area_tables และ user_tables เสมอ
 */

// กำหนด metadata ของ table area_table
var userSchema = new mongoose.Schema({
  // fence: [],
  name: String,
  isemployee: Boolean,
  department: String,
  company: String,
  trackerid: String,
  macaddress: String,
  alertstatuslevel: Number,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var userModel = mongoose.model("user_table", userSchema);

// กำหนด metadata ของ table area_table
var alertSchema = new mongoose.Schema({
  name: String,
  trackerid: String,
  areaname: String,
  // floor: String,
  timestamp: String, // เก็บเป็น String ไปก่อน เพราะพอเป็น Date แล้ว mongo มันจะไป convert ให้เป็น ISO Date อัติโนมัติ และเรายังเลือก timezone ไม่เป็น
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var alertModel = mongoose.model("alert_table", alertSchema);

// กำหนด metadata ของ table area_table
var locationSchema = new mongoose.Schema({
  xy: [],
  areaname: String,
  // floor: String,
  name: String,
  timestamp: String, // เก็บเป็น String ไปก่อน เพราะพอเป็น Date แล้ว mongo มันจะไป convert ให้เป็น ISO Date อัติโนมัติ และเรายังเลือก timezone ไม่เป็น
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var locationModel = mongoose.model("location_table", locationSchema);

var staffSchema = new mongoose.Schema({
  username: String,
  password: String,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var staffModel = mongoose.model("staff_table", staffSchema);

var workTimeSchema = new mongoose.Schema({
  name: String,
  areaname: String,
  duration: Number,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var workTimeModel = mongoose.model("worktime_table", workTimeSchema);

var workTimeTestSchema = new mongoose.Schema({
  name: String,
  areaname: String,
  duration: Number,
});
// สร้าง model ของ db ต่อไปจะเรียกใช้ db ผ่าน object ตัวนี้
var workTimeTestModel = mongoose.model(
  "worktimetest_table",
  workTimeTestSchema
);

const { PythonShell } = require("python-shell");
const path = require("path");

const { json } = require("body-parser");

var url = "/src";

/**
 * ในอนาคต ตัวแปรพวกนี่้จะถูก extract มาจาก payload (MAC, RSSI, Major, Minor)
 */
var major = 1;
var minor = 5;
// var floor;
// if (major === 1 && minor === 5) {
//   floor = 5;
// }
var mac = "E0:D9:DA:22:34:1B";
// var name = "Somchai Kositapa";
var name = "Chuchart Kositapa";
// var name = "Arpa Kositapa";
var trackerId = "n00001";
var company = "";
var department = "Agile & DevOps";
var alertStatusLevel = 0;
// var department = "DevOps";
// var department = "Infras";
// var isInsideCompany = true;
// var fence ="",name,floor,restrictFor;

// var rssi = [
//   // [-48, -61, -65, -67, -68, -82], //Position (1,1)
//   [-54, -62, -62, -69, -70, -75], //Position (2,1)
//   // [-48, -67, -53, -63, -72, -71],
//   // [-51, -70, -65, -83, -69, -89],
// ];

var rssi = [
  // [-58, -73, -70, -76], //Position (1,1)
  //  [-57, -56, -67, -58],
  [-59, -58, -64, -61],
  // [-56, -60, -64, -61], //Position (1,1)
  // [-56, -64, -67, -61], //Position (2,1)
  // [-62, -72, -71, -53],  //Position (3,1)
];
var ypred = [];
app.post("/position", async (req, res) => {
  if (req.body.check == "OK") {
    console.log("Predict1 ", ypred);
    if (ypred.length != 0) {
      // console.log("Inside Ok");
      console.log("Predict2 ", ypred);
      // console.log("Outside ypred",ypred.length);

      // console.log("Inside ypred",ypred.length);
      res.json({
        data: {
          ypred: ypred,
          // ypred: [1, 2],
          name: name,
          department: department,
          company: company,
        },
      });
    }
  }
});
app.post("/", async (req, res) => {
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
  // // res.json({test: "OK"})
  // // res.json({
  // //   data: {
  // //     test: "OK"
  // //   },
  // // });
  // var ypred = [1,2]
  // res.json({
  //   data: {
  //     ypred: ypred,
  //     name: name,
  //     department: department,
  //     company: company,
  //   },
  // });
  console.log("req", req.body);
  console.log(typeof req.body.data);
  if (req.body.data === NULL) {
    console.log("Get NULL");
  }
  function hexToString(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
  // console.log("req body data",req.body.data);
  // var ypred =[];
  // console.log("Check: ",req.body.check);
  if (
    req.body.data != NULL &&
    req.body.data != undefined &&
    req.body.data != "null"
  ) {
    // น่าจะไม่ error ว่่า cannot set header แล้ว พน.ลองเทส อาจจะไม่ต้องใช้ if

    let buff = Buffer.from(req.body.data, "base64");
    let base64data = buff.toString("utf-8");
    // console.log(base64data);
    // console.log(typeof(base64data));
    var strSplit1 = base64data.split(" ");
    // console.log("Split1", strSplit1);

    var rssi = [];
    var rssiBig = [];
    for (var i in strSplit1) {
      console.log(strSplit1[i]);
      // console.log();
      // let strSplit2 = strSplit1[i].split(":");
      // console.log(strSplit2[1]);
      var intStrSplit1 = parseInt(strSplit1[i]);
      rssi.push(intStrSplit1);
      // rssi.push(strSplit1[i]);
    }
    rssiBig.push(rssi);
    // console.log("Big: ",rssiBig);
    // const model = await tfjs.loadLayersModel(
    //   "https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/old-web/model/model.json"
    // );
    const model = await tfjs.loadLayersModel(
      "https://raw.githubusercontent.com/tanawankositapa/Low-Power-IPS-Web-App/master/new-web/model/model.json"
    );
    // ถ้าไม่ใส่ Batch size มันจะ print ออกมาเป็น Object ของ tensor ไม่ใช่ (x,y)
    const prediction = model.predict(tfjs.tensor(rssiBig), { batchSize: 32 });
    ypred = prediction.dataSync();
    // res.send(ypred)
    console.log("Predict ", ypred);
  }
  console.log(ypred);
  if(req.body.check == "OK"){
    // console.log("Inside Ok");
    console.log("Predict2 ",ypred);
    console.log("Outside ypred",ypred.length);
    if(ypred.length != 0){
      console.log("Inside ypred",ypred.length);
      res.json({
        data: {
          ypred: ypred,
          // ypred: [1, 2],
          name: name,
          department: department,
          company: company,
        },
      });
    }
  }
  var database = [];
  /**
   * ต้องใส่ await เพราะเราจะต้อง copy ค่าไปไว้ใน global var เพื่อจะทำ striglify แล้วนำไปเป็น argument ของ python
   * (เหตุเกิดจากการที่ใส่ argument เป็น [[1, 1], [1, 4], [2, 4], [2, 5], [4, 5], [4, 1]] แล้วมันเพี้ยนไปเป็น tuple ใน python)
   * เราจึงต้องทำให้เป็น String ก่อน เพราะในไฟล์ python มันมี logic แปลง string เป็น list เรียบร้อยแล้ว
   * แล้วเราต้องการจะเอาค่าจาก DB ไปใส่เป็น argument ถ้าไม่ใส่ await แล้วค่า var fence จะเป็นตามค่า default มัน เช่น undefined หรือ ""
   * ทั้งนี้เกิดจากการที่ javascript เป็น asynchronous programming คือระหว่างรอ areaModel.find() มันก็ไปทำส่วนถัดไปซะแล้ว ~ ~
   */
  // await areaModel.find({ floor: floor }, function(err, area) {
  //   if (err) console.log(err);
  //   else {
  //     database = area;
  //   }
  // });
  /**ตอนนี้ไม่ใช้ floor แล้ว */
  // await areaModel.find({floor:floor}, function(err, area) {
  await areaModel.find({}, function(err, area) {
    if (err) console.log(err);
    else {
      database = area;
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
  var areaName,
    restrictForDepartment,
    isAlert,
    resultFromPython,
    readyToBreak,
    locationAreaName;

  var database2;
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
  async function geoFence() {
    console.log("Database:", database);
    for (var property in database) {
      // console.log(`${database[property].fence}`);
      // ค่าที่ดึงออกมาจาก DB เป็น Object เราจึงต้องแปลงเป็น String ก่อน
      readyToBreak = false;

      // console.log("Fence: ",database[property].fence);
      // console.log("Restrictfor: ",database[property].restrictfor);

      let tempRestrict = database[property].restrictfor;
      let tempFence = database[property].fence;
      let fenceString = JSON.stringify(tempFence);
      // console.log("Fencestring ",fenceString);
      console.log("Check Ypred[0]: ", ypred[0]);
      console.log("Check Ypred[1]: ", ypred[1]);
      let options = {
        mode: "text",
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: trulyPath, //If you are having python_test.py script in same folder, then it's optional.
        // args: [2, 3, fenceString], //An argument which can be accessed in the script using sys.argv[1]
        args: [ypred[0], ypred[1], fenceString], //An argument which can be accessed in the script using sys.argv[1]
      };
      let tempAreaName = await database[property].name;

      PythonShell.run("geofencing.py", options, function(err, result) {
        // isAlert = false
        // console.log("Inside Fencestring ",fenceString);
        if (err) throw err;
        /**result is an array consisting of messages collected during execution of script. */
        var tempAns = result.toString();
        console.log("result: ", tempAns);
        // console.log("Inside Fence: ",database[property].fence);
        // console.log("Inside Restrictfor: ",tempRestrict);
        console.log("Area: ", tempAreaName);
        /**ถ้าเจอ */
        if (tempAns === "True") {
          // console.log("Holy");
          // timer
          locationAreaName = tempAreaName;
          areaName = database[property].name;
          restrictForDepartment = tempRestrict;
          // console.log("Area name: ",areaName);
          console.log("User Department: ", department);
          console.log("Area Restrict for: ", restrictForDepartment);
          // console.log("Check Restrictfor: ",restrictForDepartment);
          var dt = new Date();
          if (department != restrictForDepartment) {
            // isAlert = true;
            console.log("Alert status level: ", alertStatusLevel);
            if (alertStatusLevel == 6) {
              // อยู่ในพื้นที่ต้องห้าม 3 นาที
              var saveData = new alertModel({
                name: name,
                trackerid: trackerId,
                areaname: tempAreaName,
                // floor: floor, /**ไม่ได้ใช้ floor แล้ว */
                timestamp: `${(dt.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${dt
                  .getDate()
                  .toString()
                  .padStart(2, "0")}/${dt
                  .getFullYear()
                  .toString()
                  .padStart(4, "0")} ${dt
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${dt
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}:${dt
                  .getSeconds()
                  .toString()
                  .padStart(2, "0")}`, // Time of save the data in unix timestamp format
              }).save(function(err, result) {
                if (err) throw err;
                if (result) {
                  console.log(result);
                  console.log("Alert Save Complete");
                }
              });
            } else {
              alertStatusLevel = alertStatusLevel + 1;
              userModel.findOneAndUpdate(
                { name: name },
                {
                  alertstatuslevel: alertStatusLevel,
                },
                function(err, user) {
                  // console.log();
                  if (err) console.log(err);
                  if (user == null) {
                    console.log("Can't find data");
                  } else {
                    // res.json({ data: { status: "update" } });
                    console.log("Update status complete!");
                    // console.log("User: ", user);
                  }
                }
              );
            }
          } else {
            /** ไม่ตรงเงื่อนไขละเมิด */
            alertStatusLevel = 0;
            // isAlert = false;
          }

          locationModel.find(
            {
              name: name,
              xy: [ypred[0], ypred[1]],
              areaname: tempAreaName,
            },
          function(err, data) {
            // console.log();
            if (err) console.log(err);
            if (data == null) {
              var saveData = new locationModel({
                // xy: [2, 3],
                xy: [ypred[0], ypred[1]],
                areaname: tempAreaName,
                // floor: floor, //ไม่ได้ใช้ floor แล้ว
                name: name,
                timestamp: `${(dt.getMonth() + 1).toString().padStart(2, "0")}/${dt
                  .getDate()
                  .toString()
                  .padStart(2, "0")}/${dt
                  .getFullYear()
                  .toString()
                  .padStart(4, "0")} ${dt
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${dt
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}:${dt
                  .getSeconds()
                  .toString()
                  .padStart(2, "0")}`, // Time of save the data in unix timestamp format,
              }).save(function(err, result) {
                if (err) throw err;
                if (result) {
                  console.log(result);
                  console.log("Location Save Complete");
                }
              });
            } else {
              console.log("Wait until new data sent");
              
            }
          }
          );
          /**ของเดิมก่อนแก้ปัญหา save locaiton เดิมๆ ซ้ำ ถ้าอันบนบัต ก็มาเปิดใช้ข้างล่างนี้ */
          // var saveData = new locationModel({
          //   // xy: [2, 3],
          //   xy: [ypred[0], ypred[1]],
          //   areaname: tempAreaName,
          //   // floor: floor, //ไม่ได้ใช้ floor แล้ว
          //   name: name,
          //   timestamp: `${(dt.getMonth() + 1).toString().padStart(2, "0")}/${dt
          //     .getDate()
          //     .toString()
          //     .padStart(2, "0")}/${dt
          //     .getFullYear()
          //     .toString()
          //     .padStart(4, "0")} ${dt
          //     .getHours()
          //     .toString()
          //     .padStart(2, "0")}:${dt
          //     .getMinutes()
          //     .toString()
          //     .padStart(2, "0")}:${dt
          //     .getSeconds()
          //     .toString()
          //     .padStart(2, "0")}`, // Time of save the data in unix timestamp format,
          // }).save(function(err, result) {
          //   if (err) throw err;
          //   if (result) {
          //     console.log(result);
          //     console.log("Location Save Complete");
          //   }
          // });
        } else {
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
  /**ส่วน logic การนับคนในพื้นที่ ไม่ได้ใช้แล้ว */
  // var userNameArray = ["Somchai", "Arpa"];
  // async function countPeopleInArea() {
  //   var areaNameArray = [];
  //   for (var property in database) {
  //     let tempLocationName = database[property].name;
  //     areaNameArray.push(tempLocationName);
  //     // console.log(tempLocationName);
  //     // console.log(database[property].name);
  //     await locationModel.distinct(
  //       "name",
  //       { areaname: database[property].name },
  //       function(err, username) {
  //         if (err) console.log(err);
  //         else {
  //           // console.log("Area Name: ",tempLocationName);
  //           // console.log("People: ",username);
  //           // var objectLength = Object.keys(username).length;
  //           // console.log("Number of People: ",objectLength);
  //           // console.log(username);
  //           // await locationModel.distinct("areaname", { areaname: database[property].name }, function(err, username) {
  //           //   if (err) console.log(err);
  //           //   else {
  //           //     // console.log("Area Name: ",tempLocationName);
  //           //     // console.log("People: ",username);
  //           //     // var objectLength = Object.keys(username).length;
  //           //     // console.log("Number of People: ",objectLength);
  //           //     // console.log(username);
  //           //   }
  //           // });
  //         }
  //       }
  //     );
  //     locationModel.find({ areaname: tempLocationName }, function(
  //       err,
  //       username
  //     ) {
  //       if (err) console.log(err);
  //       else {
  //         // console.log("Area Name: ",tempLocationName);
  //         // console.log("Hoho: ",username);
  //         // var objectLength = Object.keys(username).length;
  //         // console.log("Number of People: ",objectLength);
  //         // console.log(username);
  //       }
  //     });
  //   }
  //   console.log("usernamearray ", userNameArray);
  //   var summary = [],
  //     database3 = [];
  //   for (var property in userNameArray) {
  //     // locationModel.find({ name: userNameArray[property] }.limit(1).sort( { _id : -1 } ), function(err, username) {
  //     console.log("property ", property);
  //     console.log("Name: ", userNameArray[property]);
  //     let tempUserName = userNameArray[property];
  //     await locationModel.findOne(
  //       { name: tempUserName },
  //       "name areaname timestamp",
  //       { sort: { _id: -1 } },
  //       function(err, username) {
  //         if (err) console.log(err);
  //         else {
  //           // console.log("Area Name: ",tempLocationName);
  //           // console.log("Name: ",tempUserName);
  //           // console.log("Hoho: ",username);
  //           database3.push(username);
  //           // summary.push({"name": tempUserName})
  //           // var objectLength = Object.keys(username).length;
  //           // console.log("Number of People: ",objectLength);
  //           // console.log(username);
  //         }
  //       }
  //     );
  //     console.log("DB3 ", database3);
  //   }
  //   // console.log("DB32 ",database3);
  //   var objectLength = Object.keys(database3).length;
  //   // console.log(areaNameArray);
  //   console.log(objectLength);
  //   for (var property in database3) {
  //     console.log(database3[property].name);
  //     summary.push({
  //       name: database3[property].name,
  //       areaname: database3[property].areaname,
  //       timestamp: database3[property].timestamp,
  //     });
  //     console.log("Summ ", summary);
  //     /**ในอนาคตเราจะส่ง object นี้ไป extract ที่ frontend */
  //   }
  // }
  if (ypred[0] != undefined && ypred[1] != undefined) {
    await geoFence();
  }

  // setTimeout(async () => {
  //  await workForceManage();
  //  countPeopleInArea();
  // //  await test3()
  //   }, 5500);

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
  //     var name,isEmployee,department,company,trackerId,macAddress
  //     console.log(user);
  //     user.map(function(user) {
  //       name = user.name;
  //       isEmployee = user.isemployee;
  //       department = user.department;
  //       company = user.company;
  //       trackerId = user.trackerid;
  //       macAddress = user.macaddress;
  //      alertStatusLevel = user.alertstatuslevel;
  //     });
  //     console.log("Name: ",name);
  //     console.log("Is Employee: ",isEmployee);
  //     console.log("Department: ",department);
  //     console.log("Company: ",company);
  //     console.log("Trackerid: ",trackerId);
  //     console.log("Mac Address: ",macAddress);
  //     // res.send(name);
  //     res.send(user)
  //     // res.sendStatus(200);
  //     // return;
  //   }
  // });

  // console.log(" ");
  // var fofo =[]
  // areaModel.f

  // res.status(200).send(fence)

  // res.sendStatus(200);
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

// app.get("/getval", (req, res) => {
//   // var data = await req.body
//   console.log("Got Data: ", req);
//   // console.log("ALSO Got Data Use Query: ",req.query);
//   console.log("full Body: ", req.body);
//   console.log("Data label: ", req.body.data);
//   // var decodedString = window.atob(req.body.data);
//   // let buff = Buffer.from(req.body.data, 'base64');
//   // let base64data = buff.toString('utf-8');
//   // console.log(base64data);
//   // console.log(typeof(base64data));
//   // var strSplit1 = base64data.split(" ");
//   // console.log("Split1", strSplit1);

//   // var rssi = [];
//   // for (var i in strSplit1){
//   //   console.log(strSplit1[i]);
//   //   // console.log();
//   //   // let strSplit2 = strSplit1[i].split(":");
//   //   // console.log(strSplit2[1]);
//   //   var intStrSplit1 = parseInt(strSplit1[i]);
//   //   rssi.push(intStrSplit1);
//   //   // rssi.push(strSplit1[i]);

//   // }
//   // console.log(rssi);
//   // // console.log(decodedString);
//   // // console.log("devEui: ", req.body.devEUI);
//   // // console.log(typeof req.body.rxInfo);
//   // // console.log("rxInfo: ", req.body.rxInfo);

//   // // this is how to extract rssi from rxInfo
//   // // ต้องทำแบบนี้เพราะว่า rxInfo เป็น object ที่อยู่ใน req.body อีกที ไม่สามารถใช้ req.body.rxInfo.rssi ได้
//   // // var rssi = req.body.rxInfo.map(function(rxInfo) {
//   // //   return rxInfo.rssi;
//   // // });
//   // // console.log(typeof rssi);
//   // // var rssiValue = rssi.map(function(rssi) {
//   // //   return rssi.values;
//   // // });
//   // // console.log("rssi: ", rssi);
//   // // console.log("rssiValue: ",rssiValue);
//   // // console.log(typeof rssi.values);
//   // // console.log("rssi: ",rssi.value);
//   // // console.log("rssi2: ", req.body.rxInfo[rssi]);

//   // // res.sendStatus(200);
//   // // console.log("ALSO Got Data: ",req.query.event.up);
//   // // console.log("ALSO Got Data: ",req.query.event.up.dev_eui);
//   // // res.render('index.ejs')
// });


app.post("/login", (req, res) => {
  // console.log("full Body: ", req.body);
  var staffUsername = req.body.username;
  var staffPassword = req.body.password;
  console.log("Username: ", staffUsername);
  console.log("Password: ", staffPassword);
  // staffSchema.statics.findByCredentials = async (staffUsername, staffPassword) => {
  //   const staff = await staffModel.findOne({staffUsername});
  //   if (!staff) {
  //     throw new Error({ error: "Invalid login username" });
  //     console.log("Invalid login username");
  //   }

  //   if (staffPassword != staff.password) {
  //     throw new Error({ error: "Invalid password " });
  //     console.log("Invalid login password");
  //   }
  //   // return staff;
  // };

  staffModel.findOne(
    { username: staffUsername, password: staffPassword },
    function(err, user) {
      // console.log();
      if (err) console.log(err);
      else {
        if (user == null) {
          console.log("Credential failed");
          res.send(false);
        } else {
          console.log("Login Success");
          res.send(true);
        }
        // console.log("Area Name: ",tempLocationName);
        // console.log("Hoho: ",username);
        // var objectLength = Object.keys(username).length;
        // console.log("Number of People: ",objectLength);
        // console.log(username);
      }
    }
  );
});

app.post("/register", (req, res) => {
  console.log("full Body: ", req.body);
  console.log("Hoho: ", req.body.data.name);
  var name = req.body.data.name;
  var isEmployee = Boolean(req.body.data.isemployee);
  var department = req.body.data.department;
  var company = req.body.data.company;
  var trackerId = req.body.data.trackerid;
  var macaddress = req.body.data.macaddress;
  var alertStatusLevel = req.body.data.alertstatuslevel;
  /** ในอนาคตเราต้องมีการตรวจสอบด้วยว่า มีการลงทะเบียนคนนี้ไปแล้วหรือยัง ถ้ามี แล้วมีการลงทะเบียนซ้ำ ให้ทำการอัพเดท */
  /** เดี๋ยวมาดูด้วยว่าเป็น staffModel หรือ userModel แต่น่าจะเป็น staffModel */
  // userModel.findOne({ username: staffUsername, password: staffPassword }, function(err, user) {
  //   // console.log();
  //   if (err) console.log(err);
  //   else {
  //     if (user == null){
  //       console.log("Credential failed");
  //       res.send(false);
  //     }else{
  //       console.log("Login Success");
  //       res.send(true);
  //     }
  //     // console.log("Area Name: ",tempLocationName);
  //     // console.log("Hoho: ",username);
  //     // var objectLength = Object.keys(username).length;
  //     // console.log("Number of People: ",objectLength);
  //     // console.log(username);
  //   }
  // });

  userModel.findOneAndUpdate(
    { name: name },
    {
      name: name,
      isemployee: isEmployee,
      department: department,
      company: company,
      trackerid: trackerId,
      macaddress: macaddress,
      alertstatuslevel: alertStatusLevel,
    },
    function(err, user) {
      // console.log();
      if (err) console.log(err);
      if (user == null) {
        var saveData = new userModel({
          name: name,
          isemployee: isEmployee,
          department: department,
          company: company,
          trackerid: trackerId,
          macaddress: macaddress,
          alertstatuslevel: alertStatusLevel,
        }).save(function(err, result) {
          if (err) throw err;
          if (result) {
            // res.json({status:"save"})
            res.json({ data: { status: "save" } });
            console.log("Save Complete");
            console.log(result);
          }
        });
      } else {
        res.json({ data: { status: "update" } });
        console.log("Update data complete!");
        console.log("User: ", user);
      }
    }
  );
});

app.get("/getemployee", (req, res) => {
  userModel.find({}, function(err, user) {
    if (err) console.log(err);
    else {
      // console.log(user);
      res.json({ data: user });
    }
  });
});

app.get("/alert", (req, res) => {
  alertModel.find({}, function(err, alert) {
    // console.log();
    if (err) console.log(err);
    else {
      res.json({ data: alert });
    }
  });
});

app.get("/worktime", async (req, res) => {
  var database2;
  /**ฟังก์ชั่นนี้ ดึงข้อมูล location ของพนักงานคนนึงออกมา แล้วหาว่า คนนั้นอยู่ใน area ไหน
   * โดยการตรวจสอบการเปลี่ยนแปลง area เมื่อ area ไม่ตรงกับตัวก่อนหน้า แสดงว่ามีการเปลี่ยนพื้นที่
   * จากนั้นจะทำการคำนวณเวลาที่พนักงานคนนั้นอยู่ใน area ที่ผ่านมาล่าสุด 1 area แล้วบันทึกลงใน worktime table
   */
  async function workForceManage() {
    //  await locationModel.find({"areaname": locationAreaName,"name" : name}, function(err, location) {
    /**ดึงข้อมูลใน location table ออกมาใส่ไว้ใน array*/
    await locationModel.find({ name: name }, function(err, location) {
      if (err) console.log(err);
      else {
        // console.log("locationAreaName: ",locationAreaName);
        // console.log("Name: ",name);
        // console.log("location: ",location);
        database2 = location;

        // console.log("After Database2 ",database2);
        // console.log("Database2 ", database2);
      }
    });
    console.log("Inside Db2: ", database2.length);
    var timeArray = [],
      areaNameArray = [],
      lastTimeStampArray = [],
      lastAreaNameArray = [];
    // if(database2 != undefined){
    var objectLength = Object.keys(database2).length;
    // }
    var areaNameCounter = 0;
    var minusDate;

    /** ค้นหาใน array database 2 ที่เก็บข้อมูลตำแหน่งของ user อยู่ */
    for (var property in database2) {
      let tempTimestamp = database2[property].timestamp;
      let tempLocationName = database2[property].areaname;
      // let tempFence = database2[property].fence
      // let fenceString = JSON.stringify(tempFence)
      // console.log("Iterator: ",property);
      // console.log("time: ", tempTimestamp);
      // console.log("Area Name: ",tempLocationName);
      timeArray.push(database2[property].timestamp);
      areaNameArray.push(database2[property].areaname);
      // console.log("Time Array: ",timeArray);
      // if (database2[property].areaname){

      // }
      // console.log("Outside: ",database2[property].areaname);

      /** ไม่ให้ overflow */
      if (property < objectLength) {
        // console.log("inside: ",database2[property].areaname);
        // console.log("Database[property]: ",database2[property]);
        // console.log("Counter: ",areaNameCounter);
        // console.log("Area name: ",database2[property].areaname);
        // console.log("Property: ",property);

        /** ต้องไม่เป็น 0 เพราว่าเราใช้การตรวจสอบแบบย้อนหลัง (ตำแหน่งปัจจุบัน กับ ตำแหน่งก่อนหน้า)
         * ถ้าเป็น 0 มันจะติด - และ error undefined
         */
        if (property != 0 && property != 1 && property != objectLength - 1) {
          /** ถ้า area name ตรงกับตัวก่อนหน้า (ยังอยู่ใน area เดิม) ใหันับ +1 */
          if (
            database2[property].areaname == database2[property - 1].areaname
          ) {
            areaNameCounter += 1;
          }
          /** ถ้า area name ไม่ตรงกับตัวก่อนหน้า (แสดงว่าเปลี่ยน area แล้ว) ให้คำนวณเวลาที่อยู่ในพื่้นที่ล่าสุดที่ผ่านมา */
          if (
            database2[property].areaname != database2[property - 1].areaname &&
            property != 0
          ) {
            // console.log(" ");
            // console.log("Area Changed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            // console.log(" ");
            var numericProperty = parseInt(property);
            // console.log("Exc Pro: ", numericProperty);
            // console.log("Exc AreaNameCounter: ",areaNameCounter);
            // console.log("TYPE: ",typeof(property));
            // console.log("WTF: ",numericProperty - areaNameCounter);
            // minusDate = database2[property-1].timestamp - database2[(property - 1) - (areaNameCounter+1) -1 ].timestamp
            if (numericProperty - areaNameCounter == numericProperty - 1) {
              var firstTimeStamp =
                database2[numericProperty - areaNameCounter].timestamp;
              var lastTimeStamp = database2[numericProperty].timestamp;
              var pastLocationName = database2[property - 1].areaname;
              var currentLocation = database2[property].areaname;
              // console.log("Same");
            } else {
              var firstTimeStamp =
                database2[numericProperty - areaNameCounter].timestamp;
              var lastTimeStamp = database2[numericProperty - 1].timestamp;
              var pastLocationName = database2[property - 1].areaname;
              var currentLocation = database2[property].areaname;
              // console.log("Different");
            }

            // if(firstTimeStamp == lastTimeStamp){
            //     console.log("First in database: ",database2[numericProperty - areaNameCounter]);
            //     console.log("Last in database: ",database2[numericProperty-1]);
            //     console.log("Past location: ",pastLocationName);
            //     console.log("Current location: ",database2[property].areaname);
            //     // break;
            // }
            // console.log("Area Name Counter: ",areaNameCounter);
            // console.log("Numeric Prop: ",numericProperty);
            // console.log(" ");
            // console.log("Minus of Numeric Prop and Area Name Counter ",numericProperty-areaNameCounter);
            // console.log("Minus of Numeric Prop and 1 ",numericProperty-1);
            // console.log("First timestamp:",firstTimeStamp);
            // console.log("Last timestamp:",lastTimeStamp);
            const date1 = new Date(firstTimeStamp);
            const date2 = new Date(lastTimeStamp);
            var diff = +(
              Math.round(Math.abs(date1 - date2) / 1000 + "e+2") + "e-2"
            );
            var diffInMin, diffInHour;
            // var diff = Math.abs(date1 - date2)/1000;
            // var diff = +(Math.round((Math.abs(date1 - date2)/1000/60/60) + "e+2") + "e-2");
            // lastTimeStampArray.push(lastTimeStamp);
            // lastAreaNameArray.push(pastLocationName);
            if (diff < 60) {
              // console.log("User "+name+" live in the "+pastLocationName+" for "+diff+ " Second");
              // res.json({name: name, areaname: pastLocationName, time:diff});
            }
            if (diff >= 60 && diff < 3600) {
              diffInMin = +(Math.round(diff / 60 + "e+2") + "e-2");
              // console.log("User "+name+" live in the "+pastLocationName+" for "+diffInMin + " Minute");
              // res.json({name: name, areaname: pastLocationName, time:diffInMin});
            }
            if (diff >= 3600) {
              diffInHour = +(Math.round(diff / 60 / 60 + "e+2") + "e-2");
              // console.log("User "+name+" live in the "+pastLocationName+" for "+diffInHour+ " Hour(s)");
              // res.json({name: name, areaname: pastLocationName, time:diffInHour});
            }
            // // console.log(" ");
            // // console.log(" ");
            // console.log("Change from "+pastLocationName+" to "+currentLocation);
            // console.log("Duration in "+pastLocationName+" is "+diff);
            // // console.log(" ");
            // // console.log(" ");

            var saveData = new workTimeTestModel({
              name: name,
              areaname: pastLocationName,
              duration: diff,
            }).save(function(err, result) {
              if (err) throw err;
              if (result) {
                // console.log("Save Worktime Complete");
                // console.log(result);
              }
            });
            // workTimeTestModel.findOneAndUpdate({name:name,areaname:pastLocationName},
            //   {
            //     $set:
            //     {
            //       duration:diff
            //     }
            //   },(error, results) => {
            //     if (error) throw error
            //     return res.json(results)
            //   }
            // )
            // // workTimeModel.findOneAndUpdate(
            //   // console.log("Location: ",pastLocationName);
            //   workTimeTestModel.find({ "name": name, "areaname": pastLocationName }, async function (err, worktime) {
            //     // console.log("Worktime: ",worktime);
            //     // console.log("Type: ",typeof(worktime));
            //     // console.log("Length: ",worktime.length);
            //     if (worktime.length == 0){
            //       var saveData = new workTimeTestModel({
            //         name: name,
            //         areaname: pastLocationName,
            //         duration: diff,
            //       }).save(function (err, result) {
            //         if (err) throw err;
            //         if (result) {
            //           console.log("Save Worktime Complete");
            //           // console.log("result", result);
            //         }
            //       });
            //     }if (worktime.length > 0){
            //       // workTimeTestModel.updateOne(
            //        await workTimeTestModel.findOneAndUpdate(
            //         {
            //           name: name,
            //           areaname: pastLocationName,
            //           // duration: diff,
            //         },
            //         {
            //           // name: name,
            //           // areaname: pastLocationName,
            //           duration: diff
            //         },
            //         { new: true }
            //         ,
            //         function (err, area) {
            //           console.log("area ",area);
            //           if (err) console.log(err);
            //           if (area == null) {
            //             console.log("Can't find data");
            //             // // var saveData = new workTimeModel({
            //             // var saveData = new workTimeTestModel({
            //             //   name: name,
            //             //   areaname: pastLocationName,
            //             //   duration: diff,
            //             // }).save(function (err, result) {
            //             //   if (err) throw err;
            //             //   if (result) {
            //             //     console.log("Save Worktime Complete");
            //             //     // console.log("result", result);
            //             //   }
            //             // });
            //           } else {
            //             // res.json({ data: { status: "update" } });
            //             console.log("Update duration complete!");
            //             // console.log("User: ", area);
            //           }
            //         }
            //       )
            //     }
            //   });

            areaNameCounter = 1;
          }
        } else if (property == 0) {
        /** กรณีเฉพาะตัวแรก */
          areaNameCounter += 1;
        } else if (property == objectLength - 1) {
          // console.log("pro ",property);
          // console.log("wf ",lastTimeStamp);
          // console.log("wiq ",pastLocationName);
          lastTimeStampArray.push(database2[property].timestamp);
          lastAreaNameArray.push(database2[property].areaname);
        }
      }

      // console.log("Time Array: ", timeArray);
      // console.log("WTF: ", database2[property].timestamp);
    }
  }
  /**ดึงข้อมูลจาก worktime table มาคำนวณหาผลรวมของช่วงเวลาในแต่ละพื้นที่ */
  async function countWorktime() {
    // console.log("Outside Db2: ",database2);
    // const sortedDate = database2.sort((a, b) => b.timestamp - a.timestamp)
    //end of find()

    // console.log("dB2: ",database2);
    // console.log("Time Array: ", timeArray);
    // console.log("Area Name Array: ", areaNameArray);
    // console.log("Last Area Array: ", lastAreaNameArray);
    // console.log("Last Timestamp Array: ", lastTimeStampArray);
    // var indexOfMaxValue = lastTimeStampArray.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    // console.log("Index of max: ",indexOfMaxValue);
    // var maxDate = new Date(Math.max.apply(null, lastTimeStampArray.map(function(e) {
    //   return new Date(e.MeasureDate);
    // })));
    // console.log("Max DAET: ",maxDate);
    var database3 = [],
      areaWorkTimeName = [],
      uniqueAreaWorkTimeName = [];
    await workTimeModel.find({ name: name }, function(err, user) {
      // console.log("User name: ",name);
      // console.log("All location of this user: ",user);
      database3 = user;
      // console.log("Database3: ",database3);
      // console.log("haha ",user[0].areaname);
      //   workTimeModel.aggregate({$group:{_id:{'areaname':'$pastLocationName'},count:{$sum:1}}},function(err,  apartments) {
      //     if (err) res.send(err);
      //     res.json(apartments);
      // });
    });
    for (var i in database3) {
      // console.log("OO:", database3[i].areaname);
      areaWorkTimeName.push(database3[i].areaname);
    }
    // end of workForceManage()
    function removeDuplicate(data) {
      return data.filter((value, index) => data.indexOf(value) == index);
    }
    uniqueAreaWorkTimeName = removeDuplicate(areaWorkTimeName);
    // console.log("Unique: ",uniqueAreaWorkTimeName);

    // for(var i in uniqueAreaWorkTimeName){
    // console.log("Unique Area: ",uniqueAreaWorkTimeName[i]);

    // workTimeModel.aggregate(
    workTimeTestModel.aggregate(
      [
        {
          $group: {
            // _id: "$areaname",
            _id: {
              name: "$name",
              areaname: "$areaname",
            },
            total: {
              $sum: "$duration",
            },
          },
        },
      ],
      function(err, result) {
        if (err) {
          // res.send(err);
          console.log(err);
        } else {
          res.json({ data: result });
          console.log("Result: ", result);
        }
      }
    );
    // }
  }
  // await workForceManage();
  // countWorktime();
  async function clearData() {
    workTimeTestModel.remove({}, function(err) {
      if (err) {
        console.log(err);
      } else {
        // res.end('success');
        console.log("Cleared Data");
      }
    });
  }
  await Promise.all([workForceManage(), countWorktime()]);
  clearData();
});

app.get("/historyroute", async (req, res) => {
  var database4 = [];
  var firstTimeStamp, secondTimeStamp;
  await locationModel.find(
    {},
    // "xy floor timestamp name",
    "xy timestamp name",
    { sort: { timestamp: -1 } },
    function(err, location) {
      // console.log();
      if (err) console.log(err);
      else {
        // res.json({data:alert});
        // console.log("location: ", location);

        database4 = location;
      }
    }
  );
  var lengthOfDatabase4 = Object.keys(database4).length;
  var index = 0,
    diff;
  var informationArray = [];
  while (index < lengthOfDatabase4 - 1) {
    diff = 0;
    // console.log("firstdiff: ",diff);
    // console.log(database4[index].timestamp);
    // if(database4[index].name){

    // }
    firstTimeStamp = database4[0].timestamp;
    secondTimeStamp = database4[index + 1].timestamp;
    immediateTimestamp = database4[index].timestamp;
    // console.log(database4[index].name);
    // console.log(firstTimeStamp);
    // console.log(secondTimeStamp);
    var date1 = new Date(firstTimeStamp);
    var date2 = new Date(secondTimeStamp);
    var date3 = new Date(immediateTimestamp);
    diff = +(Math.round(Math.abs(date1 - date2) / 1000 / 60 + "e+2") + "e-2");
    diff = Math.floor(diff);
    diff2 = +(Math.round(Math.abs(date2 - date3) / 1000 / 60 + "e+2") + "e-2");
    // console.log("diff: ",diff);
    // console.log("seconddiff: ",diff);
    // console.log(database4[index+1]);
    // if (diff2 >= 1){
    // if (diff2 > 0){
    // if(diff <= 60){
    console.log("diff: ", diff);
    informationArray.push({
      xy: database4[index + 1].xy,
      // floor: database4[index + 1].floor,
      past: diff,
      name: database4[index + 1].name,
    });

    // }
    // }
    index = index + 1;
  }
  // console.log("Informarayartion: ", informationArray);
  res.json({ data: informationArray });
});

// app.use('/test', require('./server.js'))

app.listen(port, () => console.log("Server running at port " + port));
