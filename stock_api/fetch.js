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
  // let sql=`SELECT DISTINCT(SYMBOL) FROM reportdata`;
  //     con.query(sql, async function (err, result) {
  //         for (const val of result){
  //           let data=await callAPI(`https://groww.in/v1/api/search/v1/entity?app=false&entity_type=stocks&page=0&q=${val.SYMBOL}&size=10`,val.SYMBOL);
  //           console.log(data);
  //           updateField(data);
  //         }
  //     });
  let sql=`SELECT SEARCHID FROM companyinfo`;
      con.query(sql, async function (err, result) {
          for (const val of result){
            let data=await callAPI(`https://groww.in/v1/api/stocks_data/v1/company/search_id/${val.SEARCHID}?page=0&size=10`);
            // console.log(data);
            updateField(data,val.SEARCHID);
          }
      });

});
app.get('/updateDate',async(req,res)=>{
  let sql=`SELECT DATE1,SYMBOL FROM reportdata`;
  con.query(sql, async function (err, result) {
      for (const val of result){
          let timConvert=dateEpochConvert(val.DATE1);
          let sqln=`UPDATE reportdata SET TIMESTAMP=${timConvert} WHERE DATE1="${val.DATE1}" and SYMBOL="${val.SYMBOL}"`;
          console.log(val.SYMBOL)
          con.query(sqln, async function (err, resu) {
            });
      }
    });
});
app.listen(3100,()=>{
	console.log('server stared 3100')
})
function inter(i){
  return new Promise((res,rej)=>{
    setTimeout(()=>{
      i++;
      res(i);
    },2000)
  })
}
function dateEpochConvert(date){
  return new Date(date).getTime();
}
function updateField(tmp,searchId){
  return new Promise((resolve,reject)=>{
      let tempnew=Object.values(tmp);
      let keys=Object.keys(tmp);
      console.log(searchId+"-"+tmp['MARKETCAP']);
      // let sql="UPDATE companyinfo SET `STATS`='"+tmp['STATS']+"',`FUNDAMENTALS`='"+tmp['FUNDAMENTALS']+"',      `SHAREHOLDINGPATTERN`='"+tmp['SHAREHOLDINGPATTERN']+"',      `FUNDSINVESTED`='"+tmp['FUNDSINVESTED']+"',`PRICEDATA`='"+tmp['PRICEDATA']+"',      `FINANCIALSTATEMENT`='"+tmp['FINANCIALSTATEMENT']+"',      `EXPERTRATING`='"+tmp['EXPERTRATING']+"',      `LOGO`='"+tmp['LOGO']+"',      `INDUSTRY`='"+tmp['INDUSTRY']+"' where SEARCHID='"+searchId+"'";
      let sql="UPDATE companyinfo SET  RETAILS='"+tmp['RETAILS']+"',FOREIGNIN='"+tmp['FOREIGNIN']+"',	DOMASTIC='"+tmp['DOMASTIC']+"',MUTUALFUND='"+tmp['MUTUALFUND']+"',PROMOTOR='"+tmp['PROMOTOR']+"',INDUSTRY='"+tmp['INDUSTRY']+"',MARKETCAP='"+tmp['MARKETCAP']+"' where SEARCHID='"+searchId+"'";
      con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
  })
}
function callAPI(url){
	return new Promise((res,rej)=>{
    // setTimeout(()=>{
       request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          let tmp={}
          let data=JSON.parse(body);
          // tmp['STATS']=(JSON.stringify(data.stats));
          // tmp['FUNDAMENTALS']=encodeURI(JSON.stringify(data.fundamentals));
          // tmp['SHAREHOLDINGPATTERN']=;
          // tmp['FUNDSINVESTED']=encodeURI(JSON.stringify(data.fundsInvested));
          // tmp['PRICEDATA']=encodeURI(JSON.stringify(data.priceData));
          // tmp['FINANCIALSTATEMENT']=encodeURI(JSON.stringify(data.financialStatement));
          // tmp['EXPERTRATING']=encodeURI(JSON.stringify(data.expertRating));
          // tmp['LOGO']=data.header?.logoUrl;
          tmp['INDUSTRY']=data?.header?.industryName
          tmp['MARKETCAP']=data?.stats?.marketCap;
          tmp['PROMOTOR']=data?.shareHoldingPattern?.[`Jun '21`]?.promoters?.individual?.percent
          tmp['MUTUALFUND']=data?.shareHoldingPattern?.[`Jun '21`]?.mutualFunds?.percent
          tmp['DOMASTIC']=data?.shareHoldingPattern?.[`Jun '21`]?.otherDomesticInstitutions?.insurance?.percent
          tmp['FOREIGNIN']=data?.shareHoldingPattern?.[`Jun '21`]?.foreignInstitutions?.percent
          tmp['RETAILS']=data?.shareHoldingPattern?.[`Jun '21`]?.retailAndOthers?.percent
            res(tmp);
         }else{
         	console.log(error);
         	res({});
         }
      })
    // },2510);

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
  finalObj['TIMESTAMP']=dateEpochConvert(finalObj['DATE1']);
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