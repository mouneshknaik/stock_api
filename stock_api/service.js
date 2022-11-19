var request = require('request');
var mysql = require('mysql');
const pool = mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  connectionLimit: 2000, 
  database: "stock"
});



const apiCall=(url,label)=>{
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
              console.error("error"+label);
              res({});
            }
        })
    })
}
const parralCall=(list)=>{
    return new Promise((resolve,reject)=>{
      let listOfPromise=list.map(ele=>{return apiCall(ele?.url,ele?.keysymbol)});
      Promise.all(listOfPromise).then((values) => {
        resolve(values);
      }).catch(e=>{
        console.log(e);
      })
    });
}
const sleep=(ms)=>{
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const limitParrallCall=(completList,limit)=>{
  return new Promise(async (resolve,reject)=>{
    if(completList.length>limit){
      let bufferList=[];
      let tmpList=[]
      let loopCount=Math.ceil(completList.length/limit);
      let startIndex=0;
      for(let i=1;i<=loopCount;i++){
        let lastIndex=i*limit;
        if(lastIndex>=completList.length){
          lastIndex=completList.length;
        }
        tmpList.push(completList.slice(startIndex,lastIndex));
        startIndex=lastIndex;
      }
      let lengthShow=0
      for(val of tmpList){
        lengthShow+=val.length;
        console.log('Data Fetching  of -',lengthShow);
        let result=await parralCall(val);
        bufferList=[...bufferList,...result];
      }
      resolve (bufferList);
    }else{
      let resullt=await parralCall(completList);
      resolve(resullt)
    }
  });
}
const dbquery=(sql)=>{
	return new Promise((resolve,reject)=>{
    pool.query(sql,(err, data) => {
      if(err) {
          console.error(err);
          return;
      }
      resolve(data);
    });
	})
}
const dbInsert=(objectFormat,tableName)=>{
	return new Promise((resolve,reject)=>{
    let tempnew=Object.values(objectFormat);
    let keys=Object.keys(objectFormat);
    let sql="INSERT INTO "+tableName+" ("+keys+") VALUES (?)";
    pool.query(sql,[tempnew],(err, data) => {
      if(err) {
          console.error(err);
          return;
      }
      console.log('added-'+tempnew[0]);
      resolve(true);
    });
	})
}
const dbUpdate=(sql)=>{
	return new Promise((resolve,reject)=>{
    pool.query(sql,(err, data) => {
      if(err) {
          console.error(err);
          return;
      }
      console.log(data);
    });
	})
}
const existanceCheck=(sql)=>{
	return new Promise((resolve,reject)=>{
    pool.query(sql,(err, data) => {
      if(err) {
          console.error(err);
          return;
      }
      console.log(data);
    });
	})
}
module.exports = {
    apiCall:apiCall,
    sleep:sleep,
    parralCall:parralCall,
    limitParrallCall:limitParrallCall,
    dbquery:dbquery,
    dbInsert:dbInsert
}