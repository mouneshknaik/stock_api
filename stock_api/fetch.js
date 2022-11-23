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
const commonService=require("./service");
app.use(express.json()) 
app.use(cors());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'stock'
});
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
setInterval(function () {
  con.query('SELECT 1',function (v){
  // console.log(v,'val');
})
}, 5000);
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
app.get('/apibsedata',async(req,res, next)=>{
  // for (const val of result){
    dateList=['21-Oct-2022','17-Oct-2022']
    let result=await validateDate(new Date(dateList[1]));
    console.log(result);
    // await daybaseAPI(`https://api.bseindia.com/BseIndiaAPI/api/StockpricesearchData/w?MonthDate=21%2F10%2F2022&Scode=500087&YearDate=21%2F10%2F2022&pageType=0&rbType=D`);
  // }
		// console.log(result);
		res.send({message:'finieshed'});
});
function validateDate(date){
  return new Promise(async (resolve,reject)=>{
    console.log((date));
    let url=urlFOrm(date);
    console.log(url);

    let result=await daybaseAPI(url);
    console.log(result);
    let flag=false;
    if(result?.StockData!=null){
      let oneday=1000*60*60*24; 
      let previoustDate=(new Date(date).getTime());
      console.log(date);
      console.log(new Date(previoustDate));
      let noDays=[];
      noDays.length=10
      for (const val of noDays){
        // previoustDate=previoustDate-oneday;
        let result=await daybaseAPI(urlFOrm(previoustDate));
        console.log(new Date(previoustDate));

        if(result.StockData!=null){
          flag= true;
          resolve(flag)
          break;
        }
      }
      resolve(flag)
    }else{
      resolve(flag)
    }
  })
}
function urlFOrm(date){
    let dateValue=replaceURI(dateFormatFull(new Date(date)));
    let url=`https://api.bseindia.com/BseIndiaAPI/api/StockpricesearchData/w?MonthDate=${dateValue}&Scode=500087&YearDate=${dateValue}&pageType=0&rbType=D`;
    return url;
  }
function replaceURI(string)
{
  const search = '-';
  const searchRegExp = new RegExp(search, 'g'); 
  const replaceWith = '%2F';
  return string.replace(searchRegExp, replaceWith);
}
function daybaseAPI(url){
	return new Promise((res,rej)=>{
    // setTimeout(()=>{
      request(url, function (error, response, body) {
        // console.log(error);
       if (!error && response.statusCode === 200) {
         
         // console.log(label);
         // console.log(body);
         let tmp=JSON.parse(body);
         // if(label){
         // 	tmp['Tittle']=label['label'];
         // }
        //  console.log(tmp);
           res(tmp);
 
        }else{
          console.log(error);
          res({});
        }
     })
    // },3000);

	})

}
function checkexistanceData(data,dateonly){
  //SELECT count(SYMBOL) FROM `reportdata` WHERE `SYMBOL`="RAMRAT" and `DATE1`="14-Oct-22";
  return new Promise((resolve,reject)=>{
    let sql='';
    if(dateonly){
        sql=`SELECT count(SYMBOL) as count FROM reportdata WHERE TIMESTAMP='${data.TIMESTAMP}'`;
      }else{
        sql=`SELECT count(SYMBOL) as count FROM reportdata WHERE SYMBOL='${data.SYMBOL}' and DATE1='${data.DATE1}'`;
      }
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
  // let sql=`SELECT SEARCHID FROM companyinfo`;
  let sql=`SELECT SEARCHID FROM companyinfo WHERE SEARCHID is NOT null;`;
      con.query(sql, async function (err, result) {
          for (const val of result){
            // let data=await callAPI(`https://groww.in/v1/api/stocks_data/v1/company/search_id/${val.SEARCHID}?page=0&size=10`);
            let url=`https://groww.in/v1/api/stocks_fo_data/v1/contracts/${val.SEARCHID}/top`;
            let data=await callAPI(url);
            console.log(url);
            if(data?.derivatives){
              console.log(data?.derivatives?.contract?.contractDisplayName);
              updateField(data,val.SEARCHID);
            }
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
function updatePrevClose(obj){
  return new Promise((res,rej)=>{
    let sql=`UPDATE reportdata SET PREV_CLOSE=${obj.PREV_CLOSE} WHERE TIMESTAMP=${obj.TIMESTAMP} and SYMBOL="${obj.SYMBOL}"`;
    con.query(sql, async function (err, result) {
      res(result)
    });
  })
}
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
async function checkDataAvailablity(time){
  return new Promise(async (resolve,reject)=>{
    let adaniSample=`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/ADANIENT/1y?intervalInDays=1&minimal=false`;
    let responseData=await callAPI(adaniSample);
    let lastIndex=responseData?.candles[responseData?.candles.length-1];
    let result=responseData?.candles.some(ele=> ele[0]==time);
    resolve(result);
  });

}
function updateField(tmp,searchId){
  return new Promise((resolve,reject)=>{
      let tempnew=Object.values(tmp);
      let keys=Object.keys(tmp);
      console.log(searchId);
      // let sql="UPDATE companyinfo SET `STATS`='"+tmp['STATS']+"',`FUNDAMENTALS`='"+tmp['FUNDAMENTALS']+"',      `SHAREHOLDINGPATTERN`='"+tmp['SHAREHOLDINGPATTERN']+"',      `FUNDSINVESTED`='"+tmp['FUNDSINVESTED']+"',`PRICEDATA`='"+tmp['PRICEDATA']+"',      `FINANCIALSTATEMENT`='"+tmp['FINANCIALSTATEMENT']+"',      `EXPERTRATING`='"+tmp['EXPERTRATING']+"',      `LOGO`='"+tmp['LOGO']+"',      `INDUSTRY`='"+tmp['INDUSTRY']+"' where SEARCHID='"+searchId+"'";
      // let sql="UPDATE companyinfo SET  RETAILS='"+tmp['RETAILS']+"',FOREIGNIN='"+tmp['FOREIGNIN']+"',	DOMASTIC='"+tmp['DOMASTIC']+"',MUTUALFUND='"+tmp['MUTUALFUND']+"',PROMOTOR='"+tmp['PROMOTOR']+"',INDUSTRY='"+tmp['INDUSTRY']+"',MARKETCAP='"+tmp['MARKETCAP']+"' where SEARCHID='"+searchId+"'";
      let sql="UPDATE companyinfo SET OPTIONTRADE=1 where SEARCHID='"+searchId+"'";
      con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
      });
  })
}
function callAPI(url,label){
return new Promise((res,rej)=>{
    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let tmp={}
        let data=JSON.parse(body);
        if(label){
              tmp[label]=data;
              res(tmp);
            }else{
              res(data);
            }  
        }else{
          console.error("error"+label,error);
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
  finalObj['TIMESTAMP']=dateEpochConvert(finalObj['DATE1']);
  return finalObj;
}
app.get('/inject-option',async(req,res, next)=>{
  let dbData=await commonService.dbquery('SELECT SEARCHID,NSESYMBOL FROM companyinfo WHERE OPTIONTRADE=1 and NSESYMBOL is NOT null order by MARKETCAP desc');
  let apiList=[]
  dbData.forEach(ele=>{
    apiList.push({url:"https://groww.in/v1/api/stocks_fo_data/v1/contracts/"+ele?.SEARCHID+"/top",keysymbol:ele?.NSESYMBOL})
  });
  let result=await commonService.limitParrallCall(apiList,100);
  for(val of result){
    let symbol=Object.keys(val)?.[0];
     let dbappend=optionTradingDatForm(val[symbol]);
     for(e of dbappend){
      // await commonService.dbInsert(e,'optiontradlist');
     }
  }

  res.send({message:'injected Data'});

});
function optionTradingDatForm(data){
	return data?.derivatives?.map(ele=>{
		console.log(ele);
		let obj={}
		obj['contractDisplayName']=ele?.contract?.contractDisplayName;
		obj['symbol']=ele?.contract?.symbol;
		obj['target_price']=ele?.contract?.price;
		obj['optionType']=ele?.contract?.optionType;
		obj['expiry']=ele?.contract?.expiry;
		obj['lotSize']=ele?.contract?.lotSize;
		obj['timstamp']=ele?.livePrice?.tsInMillis;
		obj['low_price']=ele?.livePrice?.low;
		obj['high_price']=ele?.livePrice?.high;
		obj['open_price']=ele?.livePrice?.open;
		obj['price']=ele?.livePrice?.ltp;
		obj['dayChange']=ele?.livePrice?.dayChange;
		obj['volume']=ele?.livePrice?.volume;
		obj['min_price_buy']=(ele?.contract?.lotSize)*(ele?.livePrice?.ltp);
		return obj;
	});
}
app.get('/api-inject',async(req,res, next)=>{
  console.log(req.query.date);
  let start=new Date().getTime();
  let checkDataAv= await checkDataAvailablity(req.query.date);
  if(checkDataAv){
    let noexistance= await checkexistanceData({TIMESTAMP:(req.query.date)*1000},true);
    if(req.query.date && noexistance){
      console.warn('process started...!');
      let dbData=await dbquery('SELECT NSESYMBOL as SYMBOL FROM companyinfo WHERE NSESYMBOL is NOT null order by MARKETCAP desc');
      // let dbData=await dbquery('SELECT NSESYMBOL as SYMBOL FROM `companyinfo` WHERE NSESYMBOL="NIFTY" OR NSESYMBOL="BANKNIFTY"');
      i=0;
      apiset=100;
      console.warn('got All SYMBOL...!');

      for(let val of dbData){
        let startIndex=i;

        if(i>=dbData.length){
          i=dbData.length-1;
        }
        i+=apiset;
        console.log(i);
        let listdbDataChunk=dbData.slice(startIndex,i);
        console.log(listdbDataChunk);
        let result=await parralCall(listdbDataChunk);
        console.warn('all Keys from API ...!');
        let timelist=[req.query.date];

          console.log('inprogress...');
          // console.log(result);
          console.log(i);
          await dbappend(result,timelist);
        if(i==dbData.length-1){
          console.log('loop closed');
          break;
        }
  
      }
      let end=new Date().getTime();
      console.log('start:'+start,"end:"+end);
      console.log('completed');
      res.send({message:'completed'})
    }else{
      console.log('data exits');
      res.send({message:'data exits'});
    }
  }else{
    res.send({message:'Data not Available yet wait till tomorrow'});
  }


});
function dbappend(result,timelist){
  return new Promise((resolve,reject)=>{
    result.forEach(async ele=>{
      if(Object.keys(ele).length>0){
        let formatData=priceFormatmaker(ele?.[Object.keys(ele)?.[0]]?.candles,timelist,Object.keys(ele)[0]);
        // for(let chunk of formatData){
          console.log(formatData);
        formatData.forEach(async chunk=>{
          // if(noexistance){
         
          // console.log(chunk.SYMBOL+'-added Data-'+chunk.DATE1);
          // }else{
          // console.log(chunk.SYMBOL+'-data already exits-'+chunk.DATE1);
          // }
          console.log(chunk.SYMBOL+'-added Data-'+chunk.DATE1);
          await insertData(chunk);
          // await updatePrevClose(chunk);
        });
      }
    });
    resolve(true);
  });
}
async function parralCall(listOfCompanies){
  return new Promise((resolve,reject)=>{
    let promiseData=[];
    let finalResult=[];
    for (var i = 0; i<listOfCompanies.length; i++) {
      let temp=`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${listOfCompanies[i].SYMBOL}/1y?intervalInDays=1&minimal=false`;
      // console.log(temp);
      promiseData.push(callAPI(temp,listOfCompanies[i]?.SYMBOL))
    }
    Promise.all(promiseData).then((values) => {
      finalResult=values;
      resolve(finalResult);
    })
  });
}
function dbquery(sql){
	return new Promise((resolve,reject)=>{
		con.query(sql, function (err, result) {
		  if (err) throw err;
			resolve(result);
		});
	})
  }
function priceFormatmaker(data,timelist,symbol){
	allRecords=[];
	timelist.forEach(time=>{
		let objSelect=data?selectExtractPrice(data,time,symbol):'';
    if(objSelect){
      allRecords.push(objSelect);
    }
	});
	return(allRecords);
}
function selectExtractPrice(data,time,symbol){
	let dataObj={};
	data.forEach((ele,i)=>{
		if(ele[0]==time){
			dataObj['SYMBOL']=symbol;
			dataObj['TIMESTAMP']=ele[0]*1000;
			dataObj['DATE1']=dateFormat(ele[0],true);
			dataObj['OPEN_PRICE']=ele[1];
			dataObj['HIGH_PRICE']=ele[2];
			dataObj['LOW_PRICE']=ele[3];
			dataObj['CLOSE_PRICE']=ele[4];
			dataObj['PREV_CLOSE']=(i>=0)?(data[i-1]?.[4]):(data[i]?.[4]);
			dataObj['id']='';
		}
	});
	if(Object.keys(dataObj).length === 0){
		return null;
	}
	return dataObj;
}
function dateFormat(date,small){
  if(small){
		date=date*1000;
	}
  let tmp=new Date(date);
  let monthList= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return tmp.getDate()+"-"+monthList[tmp.getMonth()]+"-"+(tmp.getFullYear()).toString().substring(2, 4);
}
function dateFormatFull(date){
  let tmp=new Date(date);
  let monthList= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return tmp.getDate()+"-"+(tmp.getMonth()+1)+"-"+(tmp.getFullYear());
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
      // if(Object.keys(temp).length>0){
      //   temp['PREV_CLOSE']=parseFloat(temp['PREV_CLOSE']);
      //   temp['OPEN_PRICE']=parseFloat(temp['OPEN_PRICE']);
      //   temp['HIGH_PRICE']=parseFloat(temp['HIGH_PRICE']);
      //   temp['LOW_PRICE']=parseFloat(temp['LOW_PRICE']);
      //   temp['LAST_PRICE']=parseFloat(temp['LAST_PRICE']);
      //   temp['CLOSE_PRICE']=parseFloat(temp['CLOSE_PRICE']);
      //   temp['AVG_PRICE']=parseFloat(temp['AVG_PRICE']);
      //   temp['TTL_TRD_QNTY']=parseFloat(temp['TTL_TRD_QNTY']);
      //   temp['TURNOVER_LACS']=parseFloat(temp['TURNOVER_LACS']);
      //   temp['DELIV_PER']=parseFloat(temp['DELIV_PER']);
      //   temp['DELIV_QTY']=parseFloat(temp['DELIV_QTY']);
      //   temp['NO_OF_TRADES']=parseFloat(temp['NO_OF_TRADES']);
      // }
      let tempnew=Object.values(temp);
      let keys=Object.keys(temp);
      let sql="INSERT INTO `reportdata` ("+keys+") VALUES (?)";
      console.log(sql);
      console.log(tempnew);
      con.query(sql,[tempnew], function (err, result) {
        if (err) console.error(err);
        console.log(temp['SYMBOL']+'-added');
        resolve(result);
        // res.send(result);
      });
    // });
  })
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}