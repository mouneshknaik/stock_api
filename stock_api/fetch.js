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
let formidable = require('formidable');

app.use(express.json()) 
app.use(cors());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'stock'
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/upload',async(req,res, next)=>{
  let form = new formidable.IncomingForm();
  form.parse(req, function (error, fields, file) {
    if(error)console.log(error);
    let filepath = file.fileupload.filepath;

    // let mypath = 'C:/Users/mounesh/AppData/Local/Temp/';
    // let mypath = 'C:/Users/mounesh/AppData/Local/Temp/';
    // console.log(filepath);
    // mypath += file.fileupload.originalFilename;
    // console.log(mypath);

    // fs.rename(filepath, mypath, function (err,resu) {
    //   if(err)console.log(err);
    //   res.write('File uploaded successfully');

    //   res.end();

    // });
    csv()
    .fromFile(filepath)
    .then(function(jsonArrayObj){
        jsonArrayObj.forEach(async(element) => {
          let filteredObj=replaceSpace(element);
          if(filteredObj?.SYMBOL){
           let noexistance= await checkexistanceData(filteredObj);
           if(noexistance){
            await insertData(filteredObj);
           }else{
            console.log('data already exits');
           }
          }
          console.log(filteredObj);
        });
        console.log('finished')
        res.send({message:'finished'});
    });
  });
  // var workbook = XLSX.readFile('./stock_report.xlsx');
  // var sheet_name_list = workbook.SheetNames;
  // var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  // let tmp=replaceKey(xlData[0])
  // console.log(tmp.DATE1);
});
function checkexistanceData(data){
  //SELECT count(SYMBOL) FROM `reportdata` WHERE `SYMBOL`="RAMRAT" and `DATE1`="14-Oct-22";
  return new Promise((resolve,reject)=>{
      let sql=`SELECT count(SYMBOL) as count FROM reportdata WHERE SYMBOL='${data.SYMBOL}' and DATE1='${data.DATE1}'`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        if(result[0].count==0){
          resolve(true);
        }else{
          resolve(false);
        }
      });
  })
}
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
  .fromFile('./excel_import/01-06-2022-TO-14-10-2022HCLTECHALLN.csv')
  .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
     con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      jsonArrayObj.forEach(async(element) => {
        let filteredObj=replaceSpace(element);
        await insertData(filteredObj);
        console.log(filteredObj);
      });
      console.log('finished')
      res.send({message:'finished'});
    });
   })



});
app.get('/fetchList',async(req,res)=>{
	console.log(req.query.q);
  // let sql=`SELECT count(SYMBOL) as count FROM reportdata WHERE SYMBOL='${data.SYMBOL}' and DATE1='${data.DATE1}'`;
  //     con.query(sql, function (err, result) {

  //     });
  let list=['20MICRONS','3IINFOLTD','A2ZINFRA'];
  list.forEach(async(ele)=>{
  let data=await callAPI(`https://groww.in/v1/api/search/v1/entity?app=false&entity_type=stocks&page=0&q=${ele}&size=10`);
    console.log(data);
  });
  // let data=await callAPI(`https://groww.in/v1/api/search/v1/entity?app=false&entity_type=stocks&page=0&q=${req.query.q}&size=10`);

});
app.listen(3100,()=>{
	console.log('server stared 3100')
})
function callAPI(url,label){
	return new Promise((res,rej)=>{
		 request(url, function (error, response, body) {
	    if (!error && response.statusCode === 200) {
	    	let tmp=JSON.parse(body);
	    	if(label){
	    		tmp['Tittle']=label['label'];
	    	}
	        res(tmp);
	     }else{
	     	console.log(error);
	     	res({});
	     }
		})
	})

}
function replaceSpace(stringObj){
  let string =JSON.stringify(stringObj);
  if(string.indexOf(`"Symbol"`)>-1){
    string=replaceKey(string);
  }
  let str= string.replace(new RegExp(' ', 'g'), '');
  let finalObj=JSON.parse(str);
  finalObj['DATE1']=dateFormat(finalObj['DATE1']);
  return finalObj;
}
function dateFormat(date){
  let tmp=new Date(date);
  let monthList= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return tmp.getDate()+"-"+monthList[tmp.getMonth()]+"-"+(tmp.getFullYear()).toString().substring(2, 4);
}
function replaceKey(string){
  let originList=[`"Symbol"`,`"Series"`,`"Date"`,`"Prev Close"`,`"Open Price"`,`"High Price"`,`"Low Price"`,`"Last Price"`,`"Close Price"`,`"Average Price"`,`"Total Traded Quantity"`,`"Turnover"`,`"No"`,`"Deliverable Qty"`,`"% Dly Qt to Traded Qty"`];
  let replaceList= [`"SYMBOL"`, 
  `"SERIES"`, 
  `"DATE1"`, 
  `"PREV_CLOSE"`, 
  `"OPEN_PRICE"`, 
  `"HIGH_PRICE"`, 
  `"LOW_PRICE"`, 
  `"LAST_PRICE"`, 
  `"CLOSE_PRICE"`, 
  `"AVG_PRICE"`, 
  `"TTL_TRD_QNTY"`, 
  `"TURNOVER_LACS"`, 
  `"NO_OF_TRADES"`, 
  `"DELIV_QTY"`, 
  `"DELIV_PER"` ];
  for(let i=0;i<originList.length;i++){
    string=string.replace(originList[i],replaceList[i]);
  }
  return string;
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