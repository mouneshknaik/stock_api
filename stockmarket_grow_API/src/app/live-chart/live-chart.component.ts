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
  chartscope: any;
  getallscope: any;
  fundamentalscope: any;
  fetScope: any;
  getsymbolscope: any;
  optiontradinganascope: any;
  allsymbol: any;
  industryscope: any;
  highvolumnScope: any;
  optionHigh:boolean;
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
    this.chartscope?this.chartscope.unsubscribe():'';
    this.chartscope=this.http.get(environment.domain+'/chart-view?interval='+this.interval+'&nonOption='+this.nonOption+'&inter='+this.inter).subscribe(async (val:any)=>{
      this.loader=false;
      this.rawObj=val;
      // this.tableStepper=this.chartStepperData(val);
      // console.log(this.tableStepper,'tableStepper')
      this.current_hightoggle();
      // this.chartData=this.candleList.slice(this.skip, this.paginationLimit);
    });
  }
  optionHighToggle(){
    this.highvolumnScope?this.highvolumnScope.unsubscribe():'';
    this.chartscope?this.chartscope.unsubscribe():'';
    if(this.optionHigh){
      this.optionHighVolumn();
    }else{
      this.chartAPI();  
    }
  }
  optionHighVolumn(){
    this.loader=true;
    this.highvolumnScope?this.highvolumnScope.unsubscribe():'';
    this.highvolumnScope=this.http.get(environment.domain+'/highperc').subscribe(async (val:any)=>{
      this.loader=false;
      this.tableStepper=val;
      this.tableStepper=this.tableStepper.map(ele=>{
        ele['cdayChangePerc']=ele.price?.callOption?.dayChangePerc;
        ele['pdayChangePerc']=ele.price?.putOption?.dayChangePerc;
        ele['ltsprice']=ele.price?.callOption?.ltp;
        ele['pltsprice']=ele.price?.putOption?.ltp;
        ele['cvolumn']=ele.price?.callOption?.volume;
        ele['pvolumn']=ele.price?.putOption?.volume;
        ele['quantity']=ele.price?.callOption?.lastTradeQty;
        ele['cbuyPrice']=ele.price?.callOption?.lastTradeQty*ele.price?.callOption?.ltp;
        ele['pbuyPrice']=ele.price?.callOption?.lastTradeQty*ele.price?.putOption?.ltp;
        return ele;
      })
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
    // this.formKeyObj(key)
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
  ngOnDestroy(): void {
    console.log('closed watch chart compo')
    this.chartscope?this.chartscope.unsubscribe():'';
    this.getallscope?this.getallscope.unsubscribe():'';
  this.fundamentalscope?this.fundamentalscope.unsubscribe():'';
  this.fetScope?this.fetScope.unsubscribe():'';
  this.getsymbolscope?this.getsymbolscope.unsubscribe():'';
  this.optiontradinganascope?this.optiontradinganascope.unsubscribe():'';
  this.allsymbol?this.allsymbol.unsubscribe():'';
  this.industryscope?this.industryscope.unsubscribe():'';
  this.highvolumnScope?this.highvolumnScope.unsubscribe():'';
  }
}
