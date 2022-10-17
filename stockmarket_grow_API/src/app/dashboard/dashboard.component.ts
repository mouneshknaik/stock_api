import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';

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
  finalSelected: any=[];
  loading: boolean=false;
  fetScope: any;
  filterTable:any;
  rawData: any;
  reportData: any;
  constructor(private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }
  
uniquDates:any=[];
  ngOnInit(): void {

    // this.data$ = this.http.get('http://localhost:3000/').pipe(
    //   tap(console.log),
    //   shareReplay(1),
    //   tap(() => console.log('after sharing'))
    // );
    // getData() {
      // this.data$.subscribe((data:any) => this.myData = data?.data);

    this.loadData();

    let timeInverval=60*60*6;
    if(new Date().getHours()>=8 && new Date().getHours()<=15){
      timeInverval=15
    }
    setInterval(()=>{
      this.loadData();
    },1000*timeInverval)
  }
  fetchreportData(list:any){
    return new Promise((resolve,reject)=>{
      this.http.post('http://localhost:3000/getData',{"list":list}).subscribe((reportData:any)=>{
        console.log(reportData);
        this.reportData=reportData
        Object.values(reportData).forEach((ele:any)=>{
          this.uniquDates=Object.keys(ele).toString();
          // if(!this.uniquDates.includes(date)){
          //   this.uniquDates.push(date);
          // }
        });
        this.uniquDates=this.uniquDates.split(',');
        // console.log(this.uniquDates);
        this.uniquDates=this.uniquDates.filter((ele:any)=>ele!='');
        // console.log(this.uniquDates);
        resolve(this.uniquDates);
      });
    })

  }
  loadData(){
    this.loading=true;
    this.http.get('http://localhost:3000/getAll').subscribe(async (val:any)=>{
      this.myData=val;
      this.rawData=val;
      if(this.uniquDates.length==0){
        let list=this.myData.map((ele:any)=>ele.symbol);
        await this.fetchreportData(list);
      }
      // this.myData = val.map((ele:any)=>JSON.parse(ele));
      this.replaceReportData(this.myData);
      this.loading=false;
      this.assendingOrder();
      console.log( this.myData);
      // this.descOrder();
      // this.assendingOrder();
      // console.log(JSON.parse(val[0]));
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
      this.fetScope=this.http.get('http://localhost:3000/fetchList?q='+this.listSelected).subscribe((val:any)=>{
          console.log(val);
          this.listEnterprises=val?.content;
        // this.myData = val.map((ele:any)=>JSON.parse(ele));

      })
    }
  }
  selectedOption(list:any){
    console.log(list);
    let options = {
      // headers: {
      //   'Content-Type':'application/json'
      // },
      body:{'label':list?.title,field:list?.nse_scrip_code}
    };
    // let options={'label':list?.title,field:list?.nse_scrip_code}
    this.finalSelected.push(options.body);
    this.http.post('http://localhost:3000/addtoList',options.body).subscribe((val:any)=>{
      console.log(val);
      this.listEnterprises=val?.content;
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
  toggle(){
    if(this.order=="asc"){
      this.order='desc';
      this.assendingOrder();
    }else{
      this.order='asc';
      this.descOrder();

    }
  }
  descOrder(){
    this.myData.sort((a:any,b:any)=> (a.dayChangePerc < b.dayChangePerc ? 1 : -1))

  }
  getData() {
    this.http.get('http://localhost:3000/1').subscribe((val:any)=>{
      this.myData = val?.data
    })
    // this.data$.subscribe((data:any) => this.myData = data?.data);
    this.http.get('http://localhost:3000/').subscribe((val:any)=>{
      this.myData = val?.data
    });

  }
  postData(){
    let param={
      name:"hai"
    }
    this.http.post('http://localhost:3000/1',param).subscribe((val:any)=>{
      this.myData = val?.data
    })
    this.http.post('http://localhost:3000/5',param).subscribe((val:any)=>{
      this.myData = val?.data
    })
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
}
