import { HttpClient } from '@angular/common/http';
import { Component, VERSION ,ViewChild,OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-live-chart',
  templateUrl: './live-chart.component.html',
  styleUrls: ['./live-chart.component.scss']
})
export class LiveChartComponent implements OnInit {
  loader: boolean;
  chartData: any;
  paginationLimit:number=6;
  limit:number=6;
  skip:number=0;
  defaultLimit: any;
  interval: number=1;
  intervalMinute: any='Minute1';
  toggle_isChecked: boolean=false;
  current_high:any;
  rawObj: any;
  inter: string='day';
  nonOption:boolean=false;
  tableStepper: any;
  sopenOrder: string;
  constructor(private http:HttpClient) {

   }
   candleList;
   order='desc';
  ngOnInit(): void {
    this.chartAPI();
    this.defaultLimit=parseInt(JSON.stringify(this.paginationLimit));
  }
  changedbasis(){
    console.log(this.interval);
    this.chartAPI()
  }
  changedyear(){
    this.chartAPI();
  }
  chartAPI(){
    this.loader=true;
    this.http.get(environment.domain+'/chart-view?interval='+this.interval+'&nonOption='+this.nonOption+'&inter='+this.inter).subscribe(async (val:any)=>{
      this.loader=false;
      this.rawObj=val;
      // this.tableStepper=this.chartStepperData(val);
      // console.log(this.tableStepper,'tableStepper')
      this.current_hightoggle();
      // this.chartData=this.candleList.slice(this.skip, this.paginationLimit);
    });
  }
  filterCurrentTime(data,time){
    return data.map(ele=>{
      ele['data']=this.sliceindex(ele?.data,time);
      return ele;
    })
  }
  chartStepperData(objData){
    return objData.map(ele=>{
      let tmp={};
      tmp['data']=this.chartStepperChart(ele?.data);
      tmp['count']= tmp['data'].filter(ele=>ele>0).length;
      tmp['title']=(ele?.title);
      return tmp;
    });
  }
  chartStepperChart(obj){
    let difList=[];
    for(let i=0;i<obj.length;i++){
      let prev=obj[i-1]?.y?.[3]||obj[i]?.y?.[3];
      let cur=obj[i]?.y?.[3];
      difList.push(((cur-prev)/prev)*100);
    }
    return difList;
  }
  stepperSort(key,type){
    if(!type){
      this.toggle();
      type=this.sopenOrder;
    }
    if(type=='asc'){
      this.steppeDesc(key);
    }else{
      this.stepperAsc(key)
    }
  }
  toggle(){
    if(this.sopenOrder=='desc'){
      this.sopenOrder= 'asc';
    }else{
      this.sopenOrder='desc';
    }
  }
  steppeDesc(key){
    this.tableStepper.sort((a:any,b:any)=> ((a[key]) < (b[key]) ? 1 : -1));
  }
  stepperAsc(key){
    this.tableStepper.sort((a:any,b:any)=> ((a[key]) > (b[key]) ? 1 : -1));
  }
  currentTimeinMinutes(date){
    let formDate=new Date(new Date(date).getTime()-(60*4*1000)).toString().split(":");
    let splittd=formDate[0]+":"+formDate[1];
    return (new Date(splittd).getTime()); 
  }
  sliceindex(data,time){
    let index=data.findIndex(x => x.x ==time);
    return data.slice(index,data.length)
  }
  current_hightoggle(){
    console.log(this.current_high)
    let tmp;
    let raw=[...(this.rawObj)];
    console.log(this.rawObj)
    if(this.current_high){
      let tmp=this.filterCurrentTime(raw,this.currentTimeinMinutes(new Date()));
      this.candleList=this.updateLatest(tmp);
    }else{
      this.candleList=raw;
    }
    this.order='asc';
    this.sort();
    this.chartData=this.candleList.slice(this.skip, this.paginationLimit);
  }
  updateLatest(data){
    return data.map(ele=>{
      let startPrice=ele?.data?.[0]?.y?.[1];
      let currentPrice=ele?.data?.[ele?.data.length-1]?.y?.[3];
      let diff=((currentPrice-startPrice)/startPrice)*100;
      ele['startDiff']=diff;
      return ele;
    });
  }
  leftPagination(){
    if(this.paginationLimit>this.limit){
      this.paginationLimit=this.skip;
      this.skip=this.paginationLimit-this.limit;
    }
    console.log(this.skip, this.paginationLimit);
    this.chartData=this.candleList.slice(this.skip, this.paginationLimit);
  }
  rightPagination(){
    if(this.paginationLimit<=this.candleList.length){
      this.skip=this.skip+this.limit;
      this.paginationLimit=this.skip+this.limit;
    }
    console.log(this.skip, this.paginationLimit);
    this.chartData=this.candleList.slice(this.skip, this.paginationLimit);
  }
  nonOption_hightoggle(){

  }
  sort(){
    if(this.order=='asc'){
      this.order='desc';
      this.descOrder('startDiff');
    }else{
      this.order='asc';
      this.ascOrder('startDiff')
    }
    let resetLimit=this.defaultLimit;
    let resetSkip=0;
    this.chartData=this.candleList.slice(resetSkip, resetLimit);
  }
  changedtoggle(){
    console.log(this.toggle_isChecked);
  }
  descOrder(key){
    this.candleList.sort((a:any,b:any)=> ((a[key]) < (b[key]) ? 1 : -1));
  }
  ascOrder(key){
    this.candleList.sort((a:any,b:any)=> ((a[key]) > (b[key]) ? 1 : -1));
  }
}
