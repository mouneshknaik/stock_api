const app=require('express')();
const fs=require('fs');
const cors=require('cors');
const http=require('http');
var request = require('request');
const { json } = require('express');
const express = require('express')

app.use(express.json()) 
app.use(cors());
app.get('/',async(req,res)=>{
	console.log('call')
    let url='https://www1.nseindia.com/products/dynaContent/common/productsSymbolMapping.jsp?symbol=awl&segmentLink=3&symbolCount=1&series=ALL&dateRange=+&fromDate=01-10-2022&toDate=12-10-2022&dataType=PRICEVOLUMEDELIVERABLE'
  // callAPI('https://www.nseindia.com/api/search/autocomplete?q=ada');
  var headers = { 
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
      'Content-Type' : 'application/x-www-form-urlencoded' 
  };
  var form = { username: 'user', password: '', opaque: 'someValue', logintype: '1'};
  
  request.post({ url: url, form: form, headers: headers }, function (e, r, body) {
    console.log(body);
      // your callback body
  });
});
app.listen(3100,()=>{
	console.log('server stared 3100')
})