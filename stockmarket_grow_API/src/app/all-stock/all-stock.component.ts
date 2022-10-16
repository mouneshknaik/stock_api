import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';

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
  constructor(private sanitizer: DomSanitizer,private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }


  ngOnInit(): void {
    this.dateSelected=this.dateFormat(new Date());
    this.selectedSymbol='CIPLA';
    this.loadData();
  }
  dateForm(date:any){
    let tmp=new Date(date);
    let monthList= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return tmp.getDate()+"-"+monthList[tmp.getMonth()]+"-"+tmp.getFullYear();
  }
  loadData(){
    this.loading=true;
    this.http.get('http://localhost:3000/getAllStocks?date='+this.dateSelected).subscribe(async (val:any)=>{

      val.forEach((element:any) => {
        element['dayChangePerc']=((element['CLOSE_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
      });
      this.myData=val;
      this.rawData=val;
      this.loading=false;
      this.assendingOrder('');
      console.log( this.myData);
      // this.descOrder();
      // this.assendingOrder();
      // console.log(JSON.parse(val[0]));
    })
  }
loadDataBySymbol(){
  this.loading=true;
  this.http.get('http://localhost:3000/getBySymbol?symbol='+this.selectedSymbol).subscribe(async (val:any)=>{

    val.forEach((element:any) => {
      element['dayChangePerc']=((element['CLOSE_PRICE']-element['PREV_CLOSE'])/element['PREV_CLOSE'])*100;
    });
    this.myData=val;
    this.rawData=val;
    this.loading=false;
    // this.assendingOrder();
    this.myData.forEach((element:any) => {
      element['timestamp']=new Date(element['DATE1']).getTime()
    });
    
    console.log( this.myData);
    // this.descOrder();
    this.assendingOrder('timestamp');
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
      this.fetScope=this.http.get('http://localhost:3000/fetchList?q='+this.listSelected).subscribe((val:any)=>{
          console.log(val);
          this.listEnterprises=val?.content;
        // this.myData = val.map((ele:any)=>JSON.parse(ele));

      })
    }
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

}
