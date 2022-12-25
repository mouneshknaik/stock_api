const app=require('express')();
const express = require('express')
var mysql = require('mysql');
app.use(express.json()) 
var { exec, spawn, execSync, spawnSync } = require('child_process');
app.get('/restart',async(req,res)=>{
    var data = execSync('pm2 start app.js');
    console.warn('started server');
    res.send({message:"app restarted"});
})
app.get('/stop',async(req,res)=>{
    var data = execSync('pm2 stop app.js');
    console.warn('started server');
    res.send({message:"app stopped"});
});
app.get('/start',async(req,res)=>{
    var data = execSync('pm2 start app.js');
    console.warn('started server');
    res.send({message:"app started"});
})
app.listen(3100,()=>{
	console.log('server stared 3100')
});