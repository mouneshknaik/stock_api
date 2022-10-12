import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
  constructor(private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }

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
      timeInverval=5
    }
    setInterval(()=>{
      this.loadData();
    },1000*timeInverval)
  }
  loadData(){
    this.loading=true;
    this.http.get('http://localhost:3000/getAll').subscribe((val:any)=>{
        
      // this.myData = val.map((ele:any)=>JSON.parse(ele));
      this.myData=val;
      this.rawData=val;
      this.loading=false;
      this.assendingOrder();
      // this.descOrder();
      // this.assendingOrder();
      // console.log(JSON.parse(val[0]));
    })
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
}
