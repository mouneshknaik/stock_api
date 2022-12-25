var request = require('request');
const app=require('express')();
const fs=require('fs');
const cors=require('cors');
const http=require('http');
var request = require('request');
const { json } = require('express');
const express = require('express')
app.use(express.json()) 
app.use(cors());
curUrl('daaa')
app.listen(3100,()=>{
	console.log('server stared 3100')
});
function curUrl(date){
	return new Promise((res,rej)=>{
		request("http://127.0.0.1:3000/stockapp/getFundamentals", function (error, response, body) {
			console.log(error)
		})
	})
}