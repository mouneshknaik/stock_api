const app=require('express')();
const fs=require('fs');
const cors=require('cors');
const http=require('http');
var request = require('request');
const { json } = require('express');
const express = require('express')
var mysql = require('mysql');
app.use(express.json()) 
app.use(cors());
var axios = require('axios');
const commonService=require("./service");
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database:'stock'
  });
  
var config = {
    /* Your settings here like Accept / Headers etc. */
}

setInterval(function () {
    con.query('SELECT 1',function (v){
		// console.log(v,'val');
	})
}, 5000);
handleDisconnect();

// let listOfCompanies=[ { "label": "Adani Green Energy Ltd.", "field": "ADANIGREEN" }, { "label": "Adani Power Ltd.", "field": "ADANIPOWER" }, { "label": "Adani Transmission Ltd.", "field": "ADANITRANS" }, { "label": "Adani Ports and Special Economic Zone Ltd.", "field": "ADANIPORTS" }, { "label": "Adani Wilmar Ltd.", "field": "AWL" }, { "label": "Adani Enterprises Ltd.", "field": "ADANIENT" }, { "label": "Adani Total Gas Ltd.", "field": "ATGL" }, { "label": "Reliance Industries Ltd.", "field": "RELIANCE" }, { "label": "Cipla Ltd.", "field": "CIPLA" }, { "label": "Ram Ratna Wires Ltd.", "field": "RAMRAT" }, { "label": "Ambuja Cements Ltd.", "field": "AMBUJACEM" }, { "label": "ITC Ltd.", "field": "ITC" }, { "label": "Golkunda Diamonds & Jewellery Ltd.", "field": "" }, { "label": "Infosys Ltd.", "field": "INFY" }, { "label": "Suzlon Energy Ltd.", "field": "SUZLON" }, { "label": "Tata Steel Ltd.", "field": "TATASTEEL" }, { "label": "Tata Consultancy Services Ltd.", "field": "TCS" }, { "label": "Tata Power Company Ltd.", "field": "TATAPOWER" }, { "label": "Tata Chemicals Ltd.", "field": "TATACHEM" }, { "label": "Hindustan Construction Company Ltd.", "field": "HCC" } ]
// let listOfCompanies=[ { "label": "Adani Green Energy Ltd.", "field": "ADANIGREEN" }, { "label": "Adani Power Ltd.", "field": "ADANIPOWER" }, { "label": "Adani Transmission Ltd.", "field": "ADANITRANS" }, { "label": "Adani Ports and Special Economic Zone Ltd.", "field": "ADANIPORTS" },]
app.get('/',async(req,res)=>{
	console.log('call')
  // callAPI('https://www.nseindia.com/api/search/autocomplete?q=ada');
	// var options = {
	// host: 'www.nseindia.com',
	// path: '/api/search/autocomplete?q=ada'
	// };
	// http.get(options, function(res) {
	// 	console.log(res)
	// });
});
// con.connect(function(err) {
// 	if (err) throw err;
// 	console.log("Connected!");
// });
app.post('/getData',async(req,res)=>{
	console.log(req.body);
	
	//   let tempnew=Object.values(req.body.list);
	let sql=`SELECT * FROM (select DISTINCT(TIMESTAMP) FROM reportdata ORDER by TIMESTAMP DESC LIMIT 6) as time JOIN reportdata as re on time.TIMESTAMP=re.TIMESTAMP where SYMBOL IN(?) ORDER by time.TIMESTAMP DESC`
	//   let sql=`SELECT * FROM reportdata WHERE SYMBOL IN (?) and TIMESTAMP IN(1666031400000,1665945000000,166568580000) ORDER BY TIMESTAMP DESC `
	  con.query(sql,[req.body.list], function (err, result) {
		if (err) throw err;
		// console.log(result);
		let FinalObjResult=UISupportobject(result,req.body.list);
		res.send(FinalObjResult);
	  });
  });
  app.get('/getInudtriList',async(req,res)=>{
	let sql=`SELECT DISTINCT(INDUSTRY) FROM companyinfo WHERE INDUSTRY!='' and INDUSTRY!="undefined"`
	//   let sql=`SELECT * FROM reportdata WHERE SYMBOL IN (?) and TIMESTAMP IN(1666031400000,1665945000000,166568580000) ORDER BY TIMESTAMP DESC `
	  con.query(sql, function (err, result) {
		if (err) throw err;
		res.send(result);
	  });
  });
  app.get('/getallsymbol',async(req,res)=>{
	// let sql=`SELECT DISTINCT(NSESYMBOL) FROM companyinfo WHERE NSESYMBOL!='' and NSESYMBOL!="undefined" order by MARKETCAP desc`
	let sql=`SELECT DISTINCT(NSESYMBOL) FROM companyinfo WHERE NSESYMBOL!='' and NSESYMBOL!="undefined"  and OPTIONTRADE=1 order by MARKETCAP desc`
	//   let sql=`SELECT * FROM reportdata WHERE SYMBOL IN (?) and TIMESTAMP IN(1666031400000,1665945000000,166568580000) ORDER BY TIMESTAMP DESC `
	  con.query(sql, function (err, result) {
		if (err) throw err;
		res.send(result);
	  });
  });
  function UISupportobject(data,list){
	let tmp={};
	list.forEach(ele=>{
		tmp[ele]=dateWiseObj(data.filter(e=>e['SYMBOL']==ele));
	});
	return (tmp);
  }
  function dateWiseObj(data){
	let tmp={};
	data.forEach(ele=>{
		tmp[ele['DATE1']]=ele;
	});
	return tmp;
  }
app.get('/live',async(req,res)=>{
	let getlist="["+await readFile()+"]";
	let listOfCompanies=JSON.parse(getlist);
	
	// for (var i = 0; i<listOfCompanies.length; i++) {
	// 	let temp=`https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${listOfCompanies[i]['field']}/latest`;
	// 	// console.log(temp);
	// 	promiseData.push(callAPI(temp,listOfCompanies[i]))
	// }

	// Promise.all(promiseData).then((values) => {
	//   finalResult=values;
	// }).finally(()=>{
	// 	console.log('finieshed');
	// 	res.send(finalResult);
	// });
	// parralCall(listOfCompanies,res);
	// serialCall(listOfCompanies,res);
});
app.get('/chart-view',async(req,res)=>{
	let interval=1;
	if(req.query.interval){
		interval=req.query.interval
	}
	console.log('progressing...!');
	// let dbData=await commonService.dbquery('SELECT SYMBOL,CLOSE_PRICE,TITLE,INDUSTRY FROM companyinfo LEFT JOIN (select SYMBOL,CLOSE_PRICE FROM reportdata CROSS JOIN (SELECT TIMESTAMP FROM `reportdata` ORDER by TIMESTAMP DESC LIMIT 1) as t WHERE t.TIMESTAMP=reportdata.TIMESTAMP) as timbased on companyinfo.NSESYMBOL=timbased.SYMBOL WHERE OPTIONTRADE=1 ORDER by MARKETCAP DESC');
	// let dbData=await commonService.dbquery('SELECT TITLE,BSESYMBOL as CODE,NSESYMBOL as SYMBOL,INDUSTRY FROM companyinfo  WHERE OPTIONTRADE=1 order BY MARKETCAP DESC');
	let tmp=JSON.parse(await readFile());
	let dbData=tmp['list'];
	console.log('DB Data Got...');
	let apiList=[];
	dbData.forEach(ele=>{
		apiList.push({url:`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${ele?.SYMBOL}/daily?intervalInMinutes=${interval}&minimal=false`,keysymbol:ele?.SYMBOL});
	  });
	let keyValue={};
	dbData.forEach(ele=>{
		keyValue[ele['SYMBOL']]=ele['CLOSE_PRICE'];
	});
	console.log('previous Data fetched...');
	let result=await commonService.limitParrallCall(apiList,50);
	console.log('API Data fetched...');
	let finalObj=result.map(ele=>{
		let key=Object.keys(ele)?.[0];
		return chartObjForm(ele[key]?.candles,key,keyValue[key]);
	});
	console.log('completed');
	res.send(finalObj);
});
function chartObjForm(data,title,close_price){
	let startPrice=data?.[0]?.[1];
	let currentPrice=data?.[data.length-1]?.[4];
	let diff=((currentPrice-startPrice)/startPrice)*100;
	let open_diff=((startPrice-close_price)/close_price)*100;
	let finalObj={}
	let objData=data?.map(ele=>{
		let tmp=[];
		let mainObj={}
		tmp.push(ele[1]);
		tmp.push(ele[2]);
		tmp.push(ele[3]);
		tmp.push(ele[4]);
		mainObj={x:(ele[0]*1000),y:tmp};
		return mainObj;
	});
	finalObj['data']=objData;
	finalObj['title']=title;
	finalObj['startDiff']=diff;
	finalObj['pre_close']=close_price;
	finalObj['start_price']=startPrice;
	finalObj['open_diff']=open_diff;
	return finalObj;
}
app.get('/watchtimefram',async(req,res)=>{
	// let dbData=await getWatchList('time');
	let dbData=await commonService.dbquery('SELECT TITLE,BSESYMBOL as CODE,NSESYMBOL as SYMBOL,INDUSTRY FROM companyinfo  WHERE OPTIONTRADE=1 order BY MARKETCAP DESC');
	let start=new Date().getTime();
	let promiseList=[];
	let basis='daily';
	if(req.query.basis){
		basis=req.query.basis;
	}
	let typeData='watch_minute_data';
	let apiList=[]
	dbData.forEach(ele=>{
	  apiList.push({url:`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${ele?.SYMBOL}/${basis}?intervalInMinutes=1&minimal=false`,keysymbol:ele?.SYMBOL});
	});
	let result=await commonService.limitParrallCall(apiList,50);
	let finalObj=result.map(ele=>{
		let key=Object.keys(ele)?.[0];
		return liveminuteObjForm(ele[key],key);
	})
	// listOfCompanies.forEach(ele=>{
	// 	let tmp=callAPI(`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${ele.SYMBOL}/${basic}?intervalInMinutes=1&minimal=true`,ele,typeData);
	// 	promiseList.push(tmp);
	// })
	// const resultData = await Promise.all(promiseList);
	// let end=new Date().getTime();
	// console.log(start,end);
	// res.send(resultData);
	// i=0;
	// apiset=100;
	// let finalResult=[];
	// for(let val of dbData){
    //     let startIndex=i;
    //     i+=apiset;
    //     if(i>=dbData.length){
    //       i=dbData.length-1;
    //     }
    //     let listdbDataChunk=dbData.slice(startIndex,i);
    //     let result=await multiparralCall(listdbDataChunk,typeData,basis);
    //     // console.log(result);
    //       console.log('inprogress...');
    //       // console.log(result);
    //       console.log(i);
	// 	  finalResult=[...finalResult,...result]
    //     if(i==dbData.length-1){
    //       console.log('loop closed');
    //       break;
    //     }
  
    //   }
	res.send(finalObj);
});
function liveminuteObjForm(tmp,symbol){
	let formObj={}
	formObj['symbol']=symbol;
	formObj['title']=symbol;
	formObj['moving_avarage_20']=parsemovinAvarage(tmp?.candles,20);
	formObj['moving_avarage_50']=parsemovinAvarage(tmp?.candles,50);
	formObj['last_price']=tmp?.candles[tmp?.candles.length-1][4];
	formObj['todayDiff']=minutForm(tmp?.candles,tmp?.candles.length);
	formObj['min3']=minutForm(tmp?.candles,3);
	formObj['min5']=minutForm(tmp?.candles,5);
	formObj['min8']=minutForm(tmp?.candles,8);
	formObj['min10']=minutForm(tmp?.candles,10);
	formObj['min15']=minutForm(tmp?.candles,15);
	formObj['min25']=minutForm(tmp?.candles,25);
	formObj['min45']=minutForm(tmp?.candles,45);
	formObj['min60']=minutForm(tmp?.candles,60);
	formObj['min90']=minutForm(tmp?.candles,90);
	formObj['min120']=minutForm(tmp?.candles,120);
	formObj['min180']=minutForm(tmp?.candles,180);
	formObj['min240']=minutForm(tmp?.candles,240);
	formObj['min300']=minutForm(tmp?.candles,300);
	formObj['min360']=minutForm(tmp?.candles,360);
	return formObj;
}
app.get('/moving-average',async(req,res)=>{
	let dbData=await getWatchList('time');
	let start=new Date().getTime();
	let promiseList=[];
	let basis='daily';
	if(req.query.basis){
		basis=req.query.basis;
	}
	let typeData='moving_average'
	// listOfCompanies.forEach(ele=>{
	// 	let tmp=callAPI(`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${ele.SYMBOL}/weekly?intervalInMinutes=5&minimal=false`,ele,typeData);
	// 	promiseList.push(tmp);
	// })
	// const resultData = await Promise.all(promiseList);
	// let end=new Date().getTime();
	// console.log(resultData);
	i=0;
	apiset=100;
	let finalResult=[];
	for(let val of dbData){
        let startIndex=i;
        i+=apiset;
        if(i>=dbData.length){
          i=dbData.length-1;
        }
        let listdbDataChunk=dbData.slice(startIndex,i);
        let result=await multiparralCall(listdbDataChunk,typeData,basis);
        // console.log(result);
          console.log('inprogress...');
          // console.log(result);
          console.log(i);
		  finalResult=[...finalResult,...result]
        if(i==dbData.length-1){
          console.log('loop closed');
          break;
        }
  
      }
	res.send(finalResult);
});
app.get('/getAll',async(req,res)=>{
	// let getlist="["+await readFile()+"]";
	let time={start:91510,end:92010}
	let listOfCompanies=await getWatchList(time);
	console.log(listOfCompanies);
	let arrayList=listOfCompanies.filter(ele=>ele.SYMBOL).map(ele=>ele.SYMBOL);
	let bselist=listOfCompanies.filter(ele=>!ele.SYMBOL).map(ele=>ele.CODE);
	finalResult={};
	i=0;
	let index=0
	for(let i=0;i<arrayList.length/100;i++){
			let startIndex=index;
			index=index+100;
			if(arrayList.length<(index)){
				index=arrayList.length
			}
			console.log(startIndex,'-',index);
		let setindex=arrayList.slice(startIndex,index);
		let mainlist=listOfCompanies.slice(startIndex,index);
		let data=await postCall('https://groww.in/v1/api/stocks_data/v1/tr_live/segment/CASH/latest_aggregated',setindex,mainlist,bselist);
		finalResult={...finalResult,...data}
	}
	let result=Object.values(finalResult).map(ele=>ele);
	res.send(result);
});
app.get('/getAllStocks',async(req,res)=>{
	console.log(req.query);
	let insustry='';
	if(req.query.industry){
		insustry="and c.INDUSTRY='"+req.query.industry+"'"
	}
	// let sql=`SELECT * FROM reportdata as r LEFT JOIN companyinfo as c ON r.SYMBOL = c.NSESYMBOL WHERE r.DATE1="${req.query.date}" `
//and INDUSTRY="Banks"
	let sql=`SELECT * FROM reportdata as r LEFT JOIN companyinfo as c ON r.SYMBOL = c.NSESYMBOL WHERE c.OPTIONTRADE=1 and r.TIMESTAMP="${req.query.date}" ${insustry}  order by MARKETCAP DESC`
	// console.log(sql);
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  res.send(result);
	});
});
app.get('/getBySymbol',async(req,res)=>{
	console.log(req.query);
	let sql=`SELECT * FROM reportdata WHERE SYMBOL="${req.query.symbol}" ORDER BY DATE1 ASC`
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  res.send(result);
	});
});
app.get('/getFundamentals',async(req,res)=>{
	let sql=`SELECT * FROM companyinfo`
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  res.send(result);
	});
});
function watchgetAPI(){

}
function minutForm(obj,min){
	min?'':min=1;
	if(obj){
		return {price:(obj?.[obj?.length-1]?.[1])-(obj?.[obj?.length-min]?.[1]),diff:(((obj?.[obj?.length-1]?.[1])-(obj?.[obj?.length-min]?.[1]))/(obj?.[obj?.length-1]?.[1]))*100};
	}

}
async function serialCall(listOfCompanies,res){
	let promiseData=[];
	let finalResult=[];
	 for (const ele of listOfCompanies) {
	    console.log(ele);
	    let temp=`https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${ele['field']}/latest`;
	  	finalResult.push(await callAPI(temp,ele));
 
	  }
	  res.send(finalResult);
}
async function multiparralCall(listOfCompanies,typeData,basis){
	return new Promise((resolve,reject)=>{
	  let promiseData=[];
	  let finalResult=[];
	  for (var i = 0; i<listOfCompanies.length; i++) {
		if(!basis){
			basis='weekly';
		}
		let temp=`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${listOfCompanies[i]?.SYMBOL}/${basis}?intervalInMinutes=5&minimal=false`;
		promiseData.push(callAPI(temp,listOfCompanies[i],typeData,basis))
	  }
	  Promise.all(promiseData).then((values) => {
		finalResult=values;
	  }).finally(()=>{
		// console.log('finieshed');
		  resolve(finalResult);
	  });
	});
  
  }
async function parralCall(listOfCompanies,url){
	let promiseData=[];
	let finalResult=[];
	for (var i = 0; i<listOfCompanies.length; i++) {
		let temp=`https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/${listOfCompanies[i]?.SYMBOL}/weekly?intervalInMinutes=5&minimal=false`;
		// console.log(temp);
		promiseData.push(callAPI(temp,listOfCompanies[i]))
	}

	Promise.all(promiseData).then((values) => {
		console.log(values);
	  finalResult=values;
	}).finally(()=>{
		console.log('finieshed');
		res.send(finalResult);
	});
}
app.get('/fetchList',async(req,res)=>{
	console.log(req.query.q);
	callAPI(`https://groww.in/v1/api/search/v1/entity?app=false&entity_type=stocks&page=0&q=${req.query.q}&size=10`).then(result=>{
		// console.log(result);
		res.send(result);
	});

});
app.get('/option-trading-analysis',async(req,res)=>{
	console.log(req.query);
	let insustry='';
	if(req.query.industry){
		insustry="and c.INDUSTRY='"+req.query.industry+"'"
	}
	// let sql=`SELECT * FROM reportdata as r LEFT JOIN companyinfo as c ON r.SYMBOL = c.NSESYMBOL WHERE r.DATE1="${req.query.date}" `
//and INDUSTRY="Banks"
	let sql=`SELECT * FROM optiontradlist where timstamp="${req.query.date}" ${insustry}`
	// console.log(sql);
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  res.send(result);
	});
});
app.post('/addtoList',async(req,res)=>{
	console.log(req.body);
	// fs.appendFile("list_of_company.json", ','+JSON.stringify(req.body), (err) => {
	// 	res.json({message:"Success Added"});
	//   if (err) {
	//     console.log(err);
	// 	res.json({message:"Failed Added"});
	//   }
	// })
	let tempnew=Object.values(req.body);
	let keys=Object.keys(req.body);
	let noexistance=await checkexistanceData(req.body);
	if(noexistance){
		let sql="INSERT INTO optionwatch  ("+keys+") VALUES (?)";
		con.query(sql,[tempnew], function (err, result) {
		  if (err) throw err;
		  res.send({message:"Added to Watch List"});
		});
	}else{
		res.send({message:"Already in Watch List"});
	}

});

app.post('/watchdata',async(req,res)=>{
	for(let ele of req.body){
		let noexistance=await checkexistanceWatchData(ele);
		if(noexistance){
			insertWatchData(ele)
		}else{
			updateWatchData(ele)
		}
	}
	res.send({message:'success added'});

});
async function insertWatchData(data){
	let tempnew=Object.values(data);
	let keys=Object.keys(data);
	return new Promise((resolve,reject)=>{
		let sql="INSERT INTO watchinterval  ("+keys+") VALUES (?)";
		con.query(sql,[tempnew], function (err, result) {
		if (err) throw err;
			resolve(true);
		});
	})
}
async function updateWatchData(data){
	return new Promise((resolve,reject)=>{
		let sql="UPDATE watchinterval SET PRICE="+data?.PRICE+" where TIMESTAMP="+data?.TIMESTAMP+" and SYMBOL='"+data?.SYMBOL+"'";
		con.query(sql, function (err, result) {
		if (err) throw err;
			resolve(true);
		});
	})
}
app.listen(3000,()=>{
	console.log('server stared 3000')
});
function checkexistanceWatchData(data){
	return new Promise((resolve,reject)=>{
		let sql=`SELECT count(SYMBOL) as count FROM watchinterval WHERE SYMBOL='${data.SYMBOL}' and TIMESTAMP='${data.TIMESTAMP}'`;
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
function checkexistanceData(data){
	return new Promise((resolve,reject)=>{
		let sql=`SELECT count(SYMBOL) as count FROM optionwatch WHERE SYMBOL='${data.SYMBOL}'`;
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
  function getWatchList(time){
	return new Promise((resolve,reject)=>{
		// let sql=`SELECT * FROM optionwatch`;
		let sql=`SELECT TITLE,BSESYMBOL as CODE,NSESYMBOL as SYMBOL,INDUSTRY FROM companyinfo  WHERE OPTIONTRADE=1 order BY MARKETCAP DESC`;
		// let sql=`SELECT TITLE,BSESYMBOL as CODE,NSESYMBOL as SYMBOL,m.PRICE as OLDPRICE,m.TIMESTAMP FROM companyinfo as c JOIN  (SELECT * from (SELECT * from watchinterval where TIMESTAMP>${time.start} and TIMESTAMP<=${time.end} GROUP BY SYMBOL,TIMESTAMP ORDER BY watchinterval.TIMESTAMP ASC) as t GROUP by SYMBOL) as m  on m.SYMBOL=c.NSESYMBOL WHERE c.OPTIONTRADE=1 order BY c.MARKETCAP DESC`;
		con.query(sql, function (err, result) {
		  if (err) throw err;
			resolve(result);
		});
	})
  }
function postCall(url,arrayList,listOfCompanies,bselist){
	return new Promise((res,rej)=>{
		let jsonDataObj={"exchangeAggReqMap":{"NSE":{"priceSymbolList":arrayList,"indexSymbolList":[]},"BSE":{"priceSymbolList":[],"indexSymbolList":[]}}}
		request.post({
			url: url,
			body: jsonDataObj,
			json: true
		  }, function(error, response, body){
			let tmpbody=body?.exchangeAggRespMap?.NSE?.priceLivePointsMap;
			let bsebody=body?.exchangeAggRespMap?.BSE?.priceLivePointsMap;
			listOfCompanies.forEach(ele => {
				if(tmpbody){
					if(ele['SYMBOL']){
						tmpbody[ele['SYMBOL']]?tmpbody[ele['SYMBOL']]['Tittle']=ele['TITLE']:'';
						tmpbody[ele['SYMBOL']]?tmpbody[ele['SYMBOL']]['OLDPRICE']=ele['OLDPRICE']:'';
						tmpbody[ele['SYMBOL']]?tmpbody[ele['SYMBOL']]['TIME']=ele['TIMESTAMP']:'';
						tmpbody[ele['SYMBOL']]?tmpbody[ele['SYMBOL']]['INDUSTRY']=ele['INDUSTRY']:'';
					}else{
							if(ele['CODE']){
								tmpbody[ele['CODE']]=bsebody[ele['CODE']];
								tmpbody[ele['CODE']]['Tittle']=ele['TITLE'];
							}else{
								tmpbody[ele['CODE']]='0';
							}
						}
				}
			});
		  res(tmpbody);
		});
	});

}
function callAPI(url,label,typeData){
	return new Promise((res,rej)=>{
		 request(url, function (error, response, body) {
		 	// console.log(error);
	    if (!error && response.statusCode === 200) {
	    	
	    	// console.log(label);
	    	// console.log(body);
	    	let tmp=JSON.parse(body);
	    	if(label & !typeData){
	    		tmp['Tittle']=label['label'];
	    	}
			if(typeData=='moving_average'){
				let formObj={};
				formObj['symbol']=label['SYMBOL'];
				formObj['title']=label['TITLE'];
				formObj['moving_avarage_20']=parsemovinAvarage(tmp?.candles,20);
				formObj['moving_avarage_50']=parsemovinAvarage(tmp?.candles,50);
				formObj['stocastic14']=stockasticCalclator(tmp?.candles,14);
				formObj['stocastic50']=stockasticCalclator(tmp?.candles,50);
				formObj['last_price']=tmp?.candles[tmp?.candles.length-1][4];
				res(formObj);
			}
			if(typeData=='watch_minute_data'){
				let objtmp={};
				let formObj={};
				formObj['symbol']=label['SYMBOL'];
				formObj['title']=label['TITLE'];
				formObj['moving_avarage_20']=parsemovinAvarage(tmp?.candles,20);
				formObj['moving_avarage_50']=parsemovinAvarage(tmp?.candles,50);
				formObj['last_price']=tmp?.candles[tmp?.candles.length-1][4];
				formObj['todayDiff']=minutForm(tmp?.candles,tmp?.candles.length);
				formObj['min3']=minutForm(tmp?.candles,3);
				formObj['min5']=minutForm(tmp?.candles,5);
				formObj['min8']=minutForm(tmp?.candles,8);
				formObj['min10']=minutForm(tmp?.candles,10);
				formObj['min15']=minutForm(tmp?.candles,15);
				formObj['min25']=minutForm(tmp?.candles,25);
				formObj['min45']=minutForm(tmp?.candles,45);
				formObj['min60']=minutForm(tmp?.candles,60);
				formObj['min90']=minutForm(tmp?.candles,90);
				formObj['min120']=minutForm(tmp?.candles,120);
				formObj['min180']=minutForm(tmp?.candles,180);
				formObj['min240']=minutForm(tmp?.candles,240);
				formObj['min300']=minutForm(tmp?.candles,300);
				formObj['min360']=minutForm(tmp?.candles,360);

				res(formObj);
			}else{
				res(tmp);
			}
	     }else{
	     	console.log(error);
	     	res({});
	     }
		})
	})
}
function stockasticCalclator(data,num){
	let n=0;
	let lowest=9999999999;
	let highest=0;
	let current=data[data.length-1]?.[4];
	for(let i=data.length-2;i>data.length-2-num;i--){
		if(data?.[i]){
			if(highest<data[i][2]){
				highest=data[i][2];
			}
			if(lowest>data[i][3]){
				lowest=data[i][3];
			}
			n++;
		}
	}
	let result=((current-lowest)/(highest-lowest))*100;
	return result;
}
function parsemovinAvarage(data,num){
	let val=0;
	let n=0;
	for(let i=data.length-2;i>data.length-2-num;i--){
		if(data?.[i]){
			val+=data[i][4];
			n++;
		}
	}
	let result=val/n;
	return result;
}
function readFile(){
	return new Promise((res,rej)=>{
		return fs.readFile('./company_list.json', 'utf8', function(err, data){
		    res(data);
		});
	});
}
function handleDisconnect() {
	connection = mysql.createConnection(con); // Recreate the connection, since
													// the old one cannot be reused.
  
	connection.connect(function(err) {              // The server is either down
	  if(err) {                                     // or restarting (takes a while sometimes).
		console.log('error when connecting to db:', err);
		setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
	  }                                     // to avoid a hot loop, and to allow our node script to
	});                                     // process asynchronous requests in the meantime.
											// If you're also serving http, display a 503 error.
	connection.on('error', function(err) {
	  console.log('db error', err);
	  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
		handleDisconnect();                         // lost due to either server restart, or a
	  } else {                                      // connnection idle timeout (the wait_timeout
		throw err;                                  // server variable configures this)
	  }
	});
  }
  
