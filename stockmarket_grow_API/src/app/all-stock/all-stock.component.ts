import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-all-stock',
  templateUrl: './all-stock.component.html',
  styleUrls: ['./all-stock.component.scss']
})
export class AllStockComponent implements OnInit {
  myData: any;
  rawData: any;
  uniquDates: any;
  data: any;
  data$: any;
  order:string='desc';
  listSelected:any;
  listEnterprises: any;
  finalSelected: any=[];
  loading: boolean=false;
  fetScope: any;
  filterTable:any;
  reportData: any;
  dateSelected:any;
  selectedSymbol:any;
  fileUploadnew: any;
  uploadLoader: boolean=false;
  message:any;
  avarage: any;
  industry: any;
  dailyAv: number;
  symbols: any;
  selectedDate: number;
  result: any;
  countList: any;
  orderOpen:string='desc';
  selectedSymbol1: any;
  sorOrder: string='desc';
  optionListData: any;
  constructor(private sanitizer: DomSanitizer,private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }

  dropdown
  ngOnInit(): void {
    this.dateSelected=(new Date().getTime());
    this.loadData('');
    this.loadFundamentals();
    this.industryList();
    this.symbolList();
    this.selectedSymbol='NIFTY';
    this.loadDataBySymbol('');
  }
  dateForm(date:any){
    let tmp=new Date(date);
    let monthList= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return tmp.getDate()+"-"+monthList[tmp.getMonth()]+"-"+tmp.getFullYear();
  }
  getWeekDay(date){
    let weekList=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekList[new Date(parseInt(date)).getDay()]
 }
  filterIndustry(){
    console.log(this.dropdown);
    this.loadData(this.dropdown)
  }
  loadbyDate(ev){
    console.log(ev);
    this.dateSelected=(new Date(ev.value).getTime());
    this.loadData('');
  }
  tset(){
    console.log('chnaged');
    console.log(this.dropdown);
  }
  loadData(industry){
    this.loading=true;
    let industryList=''
    if(industry && industry!='All'){
      industryList="&industry="+industry;
    }
    this.http.get(environment.domain+'/getAllStocks?date='+this.dateSelected+industryList).subscribe(async (val:any)=>{
      let openposcount=0;
      let opennegcount=0;
      let totalcount=0;
      val.forEach((element:any) => {
        element['dayChangePerc']=((element['CLOSE_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
        element['openPricePer']=((element['OPEN_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
        element['loss_gain']=element['CLOSE_PRICE']-element['PREV_CLOSE'];
        element['open_per']= ((element['OPEN_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
        element['weekDay']=this.getWeekDay(element['TIMESTAMP'])
        if(element['OPEN_PRICE']-element['PREV_CLOSE']>0){
          openposcount++;
        }else{
          opennegcount++;
        }
        totalcount++;
      });
      this.countList={'open':openposcount,'close':opennegcount,'total':totalcount}
      this.myData=val;
      this.rawData=val;
      this.loading=false;
      // this.sorOrder='desc';
      this.toggleSort('MARKETCAP')
      console.log( this.myData);
      // this.descOrder();
      // this.assendingOrder();
      // console.log(JSON.parse(val[0]));
    })
  }
  industryList(){
    this.http.get(environment.domain+'/getInudtriList').subscribe(async (val:any)=>{
      this.industry=val;
    });
  }
  symbolList(){
    this.http.get(environment.domain+'/getallsymbol').subscribe(async (val:any)=>{
      this.symbols=val;
    });
  }
  market='desc';

  dropdownList;
  optioTypeValue='Call'
  symbolSel(){
    console.log(this.dropdownList);
  }
  toggle_isChecked:false;
  changedtoggle(){
    if(this.toggle_isChecked){
      this.http.get(environment.domain+'/option-trading-analysis?date=1668160800').subscribe(async (val:any)=>{
        this.myData=val;
        this.rawData=val;
      })
    }

  }
  listoptionType=['Call','Put']
  optionType(){
    console.log(this.optioTypeValue);
    this.myData=this.rawData.filter(ele=>ele?.optionType==this.optioTypeValue);
  }
  toggleSort(key){
    console.log(key);
    if(this.sorOrder=='asc'){
      this.sorOrder='desc';
      this.descGen(key);
    }else{
      this.sorOrder='asc';
      this.ascGen(key);
    }
  }
  ascGen(key){
    this.myData.sort((a:any,b:any)=> ((a[key]) > (b[key]) ? 1 : -1))
  }
  descGen(key){
    this.myData.sort((a:any,b:any)=> ((a[key]) < (b[key]) ? 1 : -1))
  }
loadDataBySymbol(auto){
  this.loading=true;
  let symbol=this.selectedSymbol
  if(auto){
    symbol=this.selectedSymbol1;
  }
  this.http.get(environment.domain+'/getBySymbol?symbol='+symbol).subscribe(async (val:any)=>{

    val.forEach((element:any) => {
      element['dayChangePerc']=((element['CLOSE_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
      element['loss_gain']=element['CLOSE_PRICE']-element['PREV_CLOSE'];
      element['open_per']= ((element['OPEN_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
      element['weekDay']=this.getWeekDay(element['TIMESTAMP'])
      ;
    });
    this.myData=val;
    this.rawData=val;
    this.loading=false;
    // this.assendingOrder();


    let openposcount=0;
    let opennegcount=0;
    let totalcount=0;
    this.myData.forEach((element:any) => {
      element['timestamp']=new Date(element['DATE1']).getTime();
      if(element['OPEN_PRICE']-element['PREV_CLOSE']>0){
        openposcount++;
      }else{
        opennegcount++;
      }
      totalcount++;
    });
    this.countList={'open':openposcount,'close':opennegcount,'total':totalcount}
    console.log( this.myData);
    this.descOrder('timestamp');
    if(this.myData){
      this.avarage=((this.myData[0]['CLOSE_PRICE']-this.myData[this.myData.length-1]['CLOSE_PRICE'])/this.myData[this.myData.length-1]['CLOSE_PRICE'])*100;
      
      this.dailyAv=this.avarage/this.myData.length;
    }
    // this.assendingOrder('timestamp');
    // console.log(JSON.parse(val[0]));
  })
}
dateFormat(date:any){
  let tmp=new Date(date);
  let monthList= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return tmp.getDate()+"-"+monthList[tmp.getMonth()]+"-"+(tmp.getFullYear()).toString().substring(2, 4);
}
  assendingOrder(val:string){
    let key='dayChangePerc';
    if(val){
      key=val;
    }
    this.myData.sort((a:any,b:any)=> (a[key] > b[key] ? 1 : -1))
  }
  toggle(){
    if(this.order=="asc"){
      this.order='desc';
      this.assendingOrder('');
    }else{
      this.order='asc';
      this.descOrder('');

    }
  }  filterTableData(){
    this.myData=this.rawData;
    console.log(this.filterTable);
    this.myData = this.myData.filter((str:any)=> { return (str['SYMBOL'].toUpperCase()).indexOf(this.filterTable.toUpperCase()) > -1; });
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
  loadFundamentals(){
    this.http.get(environment.domain+'/getFundamentals').subscribe((val:any)=>{
          console.log(JSON.parse(val[0].STATS));
      })
  }
  onInput(event:any) {
  }
  inputFileName: string=''
  onFileSelected(event:any) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    this.fileUploadnew=files[0];
    // for (let i = 0; i < files.length; i++) {
    //   let file = files[i];
    //     file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
    //     console.log(file);
    //   }
  }
  @ViewChild('fileUpload')  fileUpload: ElementRef
  onClick(event:any) {
    if (this.fileUpload)
      this.fileUpload.nativeElement.click()
  }
  descOrder(val:string){
    let key='dayChangePerc';
    if(val){
      key=val;
    }
    this.myData.sort((a:any,b:any)=> (a[key] < b[key] ? 1 : -1))
  }
 async uploadFile() {
  this.uploadLoader=true;
  this.message='';
    let formData = new FormData();
     formData.append("fileupload", this.fileUploadnew);
     await fetch('http://localhost:3100/upload', {
        method: "POST",
        body: formData
    }).then(result=>{
      console.log(result);
      if(result.status===200){
        this.message={message:'uploaded succesfull'};
      }
      this.uploadLoader=true;
    });
    }
    addEvent(pickDate){
      this.selectedDate=(new Date(pickDate.value).getTime())/1000;
    }
    fetchData(){
      console.log(this.selectedDate);
      this.result={message:"fetching"};
      this.http.get(environment.domain+'/api-inject?date='+this.selectedDate).subscribe((val:any)=>{
        this.result=val
    })
    }
}
