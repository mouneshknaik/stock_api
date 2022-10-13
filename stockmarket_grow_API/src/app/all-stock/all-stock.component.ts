import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  constructor(private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }


  ngOnInit(): void {
    this.dateSelected='13-Oct-2022';
    this.selectedSymbol='HINDCON';
    this.loadData();
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
  descOrder(val:string){
    let key='dayChangePerc';
    if(val){
      key=val;
    }
    this.myData.sort((a:any,b:any)=> (a[key] < b[key] ? 1 : -1))
  }
}
