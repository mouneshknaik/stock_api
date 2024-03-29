import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: any;
  data$: any;
  myData: any;
  order:string='asc';
  listSelected:any;
  listEnterprises: any;
  finalSelected: any;
  loading: boolean=false;
  fetScope: any;
  filterTable:any;
  rawData: any;
  reportData: any;
  openOrder: string='asc';
  stopLossValue=6;
  exitValue: number=10;
  stgn=0;
  stlss=0;
  stlssValue: any;
  gainLoss: {gain,loss};
  dropdown: any;
  industry: any;
  volumOrder: string;
  addtolist: any;
  industryscope: any;
  getallscope: any;
  getDatascope: any;
  watchdatascope: any;
  constructor(private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }
  
uniquDates:any=[];
  ngOnInit(): void {

    // this.data$ = this.http.get(environment.domain+'/').pipe(
    //   tap(console.log),
    //   shareReplay(1),
    //   tap(() => console.log('after sharing'))
    // );
    // getData() {
      // this.data$.subscribe((data:any) => this.myData = data?.data);

    this.loadData();
    this.industryList();
    let timeInverval=60*60*6;
    if(new Date().getHours()>=8 && new Date().getHours()<=15){
      // timeInverval=30
    }
    setInterval(()=>{
      this.loadData();
      // this.rawData?this.updateIntervalData():'';
    },1000*timeInverval)
  }
  getTimeHourBasic(){
    let splitted=new Date().toLocaleTimeString().split(' ');
    let currentTime=parseInt((new Date().toLocaleTimeString()).split(' ')[0].split(':').join(''));
    console.log(splitted);
    if(splitted[1]=='PM'){
      currentTime+=120000;
    }
    return currentTime;
  }
  updateIntervalData(){
    let time=this.getTimeHourBasic();
    console.log(time);
      // if(this.rawData && time>=90000 && time<=153000){
        let priceList=this.rawData.map(ele=>{
          let tmp={};
          tmp['SYMBOL']=ele['symbol'];
          tmp['TIMESTAMP']=time;
          tmp['PRICE']=ele['ltp'];
          return tmp;
        });
        this.watchdatascope=this.http.post(environment.domain+'/watchdata',priceList).subscribe((reportData:any)=>{
          console.log(reportData);
        });
      // }else{
      //   console.log('market data not updated');
      // }

  }
  stoploss(){
    this.loadData();
  }
  stoplosscal(){
    let gain=this.stlssValue;
    this.stlss=((this.stlssValue-((this.stlssValue/100)*6)));
    this.stgn=(((parseFloat(gain)+(parseFloat(gain)/100)*10)));
  }
  fetchreportData(list:any){
    return new Promise((resolve,reject)=>{
      this.getDatascope=this.http.post(environment.domain+'/getData',{"list":list}).subscribe((reportData:any)=>{
        console.log(reportData);
        this.reportData=reportData;
        let listDates=[];
        Object.values(reportData).forEach((ele:any)=>{
          Object.keys(ele).forEach(e=>{
            if(!listDates.includes(e)){
              listDates.push(e);
            }
          })
          // this.uniquDates=Object.keys(ele).toString();
          // if(!this.uniquDates.includes(date)){
          //   this.uniquDates.push(date);
          // }
        });
        // console.log(this.uniquDates);
        this.uniquDates=listDates;
        // console.log(this.uniquDates);
        resolve(this.uniquDates);
      });
    })

  }
  loadData(){
    this.loading=true;
    this.getallscope=this.http.get(environment.domain+'/getAll').subscribe(async (val:any)=>{
      this.myData=val;
      this.rawData=val;
      if(this.uniquDates.length==0){
        let list=this.myData.map((ele:any)=>ele.symbol);
        await this.fetchreportData(list);
      }
      // this.myData = val.map((ele:any)=>JSON.parse(ele));
      this.replaceReportData(this.myData);
      this.loading=false;
      // this.assendingOrder();
      console.log( this.myData);
      let loss=0;
      let gain=0;
      this.myData.map(list=>{
        list['openChange']=((list?.open-list?.close)/list?.close)*100;
        list['stoploss']=list?.ltp-((list?.ltp/100)*this.stopLossValue);
        list['exit']=list?.ltp+((list?.ltp/100)*this.exitValue);
        if(list['openChange']>0){
          gain++;
        }else{
          loss++;
        }
        return list;
      });
      // this.myData.push({gain:gain});
      // this.myData.push({loss:loss});
      this.gainLoss={gain:0,loss:0};
      this.gainLoss['gain']=gain
      this.gainLoss['loss']=loss;
      this.descOrder();
      // this.assendingOrder();
      // console.log(JSON.parse(val[0]));
    })
  }
  filterIndustry(){
    console.log(this.dropdown);
    let loss=0;
    let gain=0;
    let dp=''
    if(this.dropdown!='All'){
      dp=this.dropdown;
    }else{
      dp='';
    }
    this.myData=this.rawData.filter(list=>{return dp?list.INDUSTRY==dp:true}).map(ele=>{
      if(ele['openChange']>0){
        gain++;
      }else{
        loss++;
      }
      return ele;
    });
    this.gainLoss={gain:0,loss:0};
    this.gainLoss['gain']=gain
    this.gainLoss['loss']=loss;
    this.descOrder();
  }
  industryList(){
      this.industryscope=this.http.get(environment.domain+'/getInudtriList').subscribe((val:any)=>{
          console.log(val);
          this.industry=val;
      })
  }
  replaceReportData(data:any){
    data.forEach((ele:any)=>{
      this.uniquDates.forEach((element:any) => {
        ele[element]=this.reportData?.[ele['symbol']]?this.reportData[ele['symbol']][element]:'';
      });
    });
  }
  filterTableData(){
    this.myData=this.rawData;
    console.log(this.filterTable);
    this.myData = this.myData.filter((str:any)=> { return (str['Tittle'].toUpperCase()).indexOf(this.filterTable.toUpperCase()) > -1; });
  }
  changedDropdown(){
    this.fetScope?this.fetScope.unsubscribe():'';
    if(this.listSelected){
      this.fetScope=this.http.get(environment.domain+'/fetchList?q='+this.listSelected).subscribe((val:any)=>{
          console.log(val);
          this.listEnterprises=val?.content;
        // this.myData = val.map((ele:any)=>JSON.parse(ele));

      })
    }
  }
  selectedOption(list:any){
    console.log(list);
    let options = {
      body:{TITLE:list?.title,SYMBOL:list?.nse_scrip_code,CODE:list?.bse_scrip_code}
    };
    // let options={'label':list?.title,field:list?.nse_scrip_code}

    this.addtolist=this.http.post(environment.domain+'/addtoList',options.body).subscribe((val:any)=>{
      console.log(val);
      this.listEnterprises=val?.content;
      this.finalSelected=val?.message;
      this.loadData();
    // this.myData = val.map((ele:any)=>JSON.parse(ele));

  })
  }
  navigateByUrl(){
    this.router.navigate(['/page']);
  }
  assendingOrder(){
    this.myData.sort((a:any,b:any)=> (a.dayChangePerc > b.dayChangePerc ? 1 : -1))
  }
  openassendingOrder(){
    this.myData.sort((a:any,b:any)=> (a.openChange > b.openChange ? 1 : -1))
  }
  toggle(){
    if(this.order=="asc"){
      this.order='desc';
      this.assendingOrder();
    }else{
      this.order='asc';
      this.descOrder();

    }
  }
  openToggle(){
    if(this.openOrder=="asc"){
      this.openOrder='desc';
      this.openassendingOrder();
    }else{
      this.openOrder='asc';
      this.opendescOrder();

    }
  }
  volumToggle(){
    if(this.volumOrder=="asc"){
      this.volumOrder='desc';
      this.volumassendingOrder();
    }else{
      this.volumOrder='asc';
      this.volumdescOrder();

    }
  }
  descOrder(){
    this.myData.sort((a:any,b:any)=> (a.dayChangePerc < b.dayChangePerc ? 1 : -1))
  }
  opendescOrder(){
    this.myData.sort((a:any,b:any)=> (a.openChange < b.openChange ? 1 : -1))
  }
  volumassendingOrder(){
    this.myData.sort((a:any,b:any)=> (a.volume > b.volume ? 1 : -1))
  }
  volumdescOrder(){
    this.myData.sort((a:any,b:any)=> (a.volume < b.volume ? 1 : -1))
  }
  getData() {
    // this.http.get(environment.domain+'/1').subscribe((val:any)=>{
    //   this.myData = val?.data
    // })
    // // this.data$.subscribe((data:any) => this.myData = data?.data);
    // this.http.get(environment.domain+'/').subscribe((val:any)=>{
    //   this.myData = val?.data
    // });

  }
  postData(){
    let param={
      name:"hai"
    }
    // this.http.post(environment.domain+'/1',param).subscribe((val:any)=>{
    //   this.myData = val?.data
    // })
    // this.http.post(environment.domain+'/5',param).subscribe((val:any)=>{
    //   this.myData = val?.data
    // })
  }
  cacheDelete(){
    this.cacheInterceptor.clearCache();
  }
  clearData() {
    this.myData = null;
  }
  linkPage(link:string){
    // this.router.navigate('link')
  }
  ngOnDestroy(): void {
    console.log('closed dashboard compo')
    this.fetScope?this.fetScope.unsubscribe():'';
    this.industryscope?this.industryscope.unsubscribe():'';
    this.getallscope?this.getallscope.unsubscribe():'';
    this.getDatascope?this.getDatascope.unsubscribe():'';
    this.watchdatascope?this.watchdatascope.unsubscribe():'';
  }
}
