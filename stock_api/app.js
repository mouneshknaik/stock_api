const app=require('express')();
const fs=require('fs');
const cors=require('cors');
const http=require('http');
var request = require('request');
const { json } = require('express');
const express = require('express')

app.use(express.json()) 
app.use(cors());
var axios = require('axios');

var config = {
    /* Your settings here like Accept / Headers etc. */
}




// let listOfCompanies=[ { "label": "Adani Green Energy Ltd.", "field": "ADANIGREEN" }, { "label": "Adani Power Ltd.", "field": "ADANIPOWER" }, { "label": "Adani Transmission Ltd.", "field": "ADANITRANS" }, { "label": "Adani Ports and Special Economic Zone Ltd.", "field": "ADANIPORTS" }, { "label": "Adani Wilmar Ltd.", "field": "AWL" }, { "label": "Adani Enterprises Ltd.", "field": "ADANIENT" }, { "label": "Adani Total Gas Ltd.", "field": "ATGL" }, { "label": "Reliance Industries Ltd.", "field": "RELIANCE" }, { "label": "Cipla Ltd.", "field": "CIPLA" }, { "label": "Ram Ratna Wires Ltd.", "field": "RAMRAT" }, { "label": "Ambuja Cements Ltd.", "field": "AMBUJACEM" }, { "label": "ITC Ltd.", "field": "ITC" }, { "label": "Golkunda Diamonds & Jewellery Ltd.", "field": "" }, { "label": "Infosys Ltd.", "field": "INFY" }, { "label": "Suzlon Energy Ltd.", "field": "SUZLON" }, { "label": "Tata Steel Ltd.", "field": "TATASTEEL" }, { "label": "Tata Consultancy Services Ltd.", "field": "TCS" }, { "label": "Tata Power Company Ltd.", "field": "TATAPOWER" }, { "label": "Tata Chemicals Ltd.", "field": "TATACHEM" }, { "label": "Hindustan Construction Company Ltd.", "field": "HCC" } ]
// let listOfCompanies=[ { "label": "Adani Green Energy Ltd.", "field": "ADANIGREEN" }, { "label": "Adani Power Ltd.", "field": "ADANIPOWER" }, { "label": "Adani Transmission Ltd.", "field": "ADANITRANS" }, { "label": "Adani Ports and Special Economic Zone Ltd.", "field": "ADANIPORTS" },]
app.get('/',async(req,res)=>{
	console.log('call')
  // callAPI('https://www.nseindia.com/api/search/autocomplete?q=ada');
var options = {
  host: 'www.nseindia.com',
  path: '/api/search/autocomplete?q=ada'
};
http.get(options, function(res) {
	console.log(res)
});
});
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
	parralCall(listOfCompanies,res);
	// serialCall(listOfCompanies,res);
});
app.get('/getAll',async(req,res)=>{
	let getlist="["+await readFile()+"]";
	let listOfCompanies=JSON.parse(getlist);
	let arrayList=listOfCompanies.map(ele=>ele.field);
	let data=await postCall('https://groww.in/v1/api/stocks_data/v1/tr_live/segment/CASH/latest_aggregated',arrayList,listOfCompanies);
	let result=Object.values(data).map(ele=>ele);
	res.send(result);
});
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
async function parralCall(listOfCompanies,res){
	let promiseData=[];
	let finalResult=[];
	for (var i = 0; i<listOfCompanies.length; i++) {
		let temp=`https://groww.in/v1/api/stocks_data/v1/tr_live_prices/exchange/NSE/segment/CASH/${listOfCompanies[i]['field']}/latest`;
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
app.post('/addtoList',async(req,res)=>{
	console.log(req.body);
	fs.appendFile("list_of_company.json", ','+JSON.stringify(req.body), (err) => {
		res.json({message:"Success Added"});
	  if (err) {
	    console.log(err);
		res.json({message:"Failed Added"});
	  }
	})
});
app.listen(3000,()=>{
	console.log('server stared 3000')
})
function postCall(url,arrayList,listOfCompanies){
	return new Promise((res,rej)=>{
		let jsonDataObj={"exchangeAggReqMap":{"NSE":{"priceSymbolList":arrayList,"indexSymbolList":[]},"BSE":{"priceSymbolList":[],"indexSymbolList":[]}}}
		request.post({
			url: url,
			body: jsonDataObj,
			json: true
		  }, function(error, response, body){
			let tmpbody=body?.exchangeAggRespMap?.NSE?.priceLivePointsMap;
			listOfCompanies.forEach(ele => {
				tmpbody[ele['field']]?tmpbody[ele['field']]['Tittle']=ele['label']:'';
			});
		  res(tmpbody);
		});
	});

}
function callAPI(url,label){
	return new Promise((res,rej)=>{
		 request(url, function (error, response, body) {
		 	// console.log(error);
	    if (!error && response.statusCode === 200) {
	    	
	    	// console.log(label);
	    	// console.log(body);
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

function readFile(){
	return new Promise((res,rej)=>{
		return fs.readFile('./list_of_company.json', 'utf8', function(err, data){
		    res(data);
		});
	});
}