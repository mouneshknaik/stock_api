const app=require('express')();
const fs=require('fs');
const cors=require('cors');
const http=require('http');
var request = require('request');
const { json } = require('express');
const express = require('express')
var mysql = require('mysql');
var XLSX = require('xlsx')
var csv = require("csvtojson");

app.use(express.json()) 
app.use(cors());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'stock'
});


app.get('/',async(req,res)=>{
  // var workbook = XLSX.readFile('./stock_report.xlsx');
  // var sheet_name_list = workbook.SheetNames;
  // var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  // let tmp=replaceKey(xlData[0])
  // console.log(tmp.DATE1);
});

app.get('/injectData',async(req,res)=>{
  // let xlData= [{
  //   SYMBOL: 'tertert',
  //   SERIES: 'ffd',
  //   DATE1: 'df',
  //   PREV_CLOSE: 0,
  //   OPEN_PRICE: 0,
  //   HIGH_PRICE: 0,
  //   LOW_PRICE: 0,
  //   LAST_PRICE: 0,
  //   CLOSE_PRICE: 0,
  //   AVG_PRICE: 0,
  //   TTL_TRD_QNTY: 10,
  //   TURNOVER_LACS: 0,
  //   NO_OF_TRADES: 0,
  //   NAME: 'md',
  //   DELIV_QTY: 10,
  //   DELIV_PER: 0
  // }];
  // UPDATE `reportdata` SET `DATE1`="12-Oct-2022" WHERE `DATE1`="44846.00011574074"
//   var workbook = XLSX.readFile('./excel_import/11-10-2022-TO-11-10-2022HINDCONALLN.csv');
//   var sheet_name_list = workbook.SheetNames;
//   var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
// console.log(xlData);
csv()
  .fromFile('./excel_import/01-07-2022-TO-14-10-2022RAMRATALLN.csv')
  .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
     con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      jsonArrayObj.forEach(async(element) => {
        let filteredObj=replaceKey(element);
        await insertData(filteredObj);
        console.log(filteredObj);
      });
      console.log('finished')
      res.send({message:'finished'});
    });
   })



});
app.listen(3100,()=>{
	console.log('server stared 3100')
})
function replaceKey(stringObj){
  let string =JSON.stringify(stringObj);
  let str= string.replace(new RegExp(' ', 'g'), '');
  return JSON.parse(str);
}
function insertData(temp){
  return new Promise((resolve,reject)=>{
    // con.connect(function(err) {

      let tempnew=Object.values(temp);
      let keys=Object.keys(temp);
      let sql="INSERT INTO `reportdata` ("+keys+") VALUES (?)";
      con.query(sql,[tempnew], function (err, result) {
        if (err) throw err;
        resolve(result);
        // res.send(result);
      });
    // });
  })

}