import { HttpClient } from '@angular/common/http';
import { Component, VERSION ,ViewChild,OnInit } from '@angular/core';


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
  toggle_isChecked: any;
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

  chartAPI(){
    this.loader=true;
    this.http.get('http://localhost:3000/chart-view?interval='+this.interval).subscribe(async (val:any)=>{
      this.loader=false;
      this.candleList=val;
      this.sort();
      this.chartData=this.candleList.slice(this.skip, this.paginationLimit);
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
