import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-watch',
  templateUrl: './live-watch.component.html',
  styleUrls: ['./live-watch.component.scss']
})
export class LiveWatchComponent implements OnInit {
  loading: boolean;
  openOrder: string="desc";

  constructor(private http:HttpClient) { }
  liveData;
  ngOnInit(): void {
    this.getLiveWatch()
    let timeInverval=60*60*6;
    if(new Date().getHours()>=8 && new Date().getHours()<=15){
      timeInverval=60
    }
    setInterval(()=>{
      this.getLiveWatch();
    },1000*timeInverval)
  }
  getLiveWatch(){
    this.loading=true;
    this.http.get('http://localhost:3000/watchtimefram').subscribe((reportData:any)=>{
      this.liveData=reportData;
      this.liveData.map(ele=>{
        let slgain=0;
        let slowgl=Object.values(ele).filter(e=>e?.['diff']);
        let gain=0;
        let loss=0;
        slowgl.map(e=>{
          if(e?.['diff']>=0){
            gain++;
          }else{
            loss++;
          }
        });
        let tt={};
        tt['diff']=gain;
        let ll={};
        ll['diff']=loss;
        ele['gain']=tt;
        ele['loss']=ll;
        return ele;
      })
      this.loading=false;
      this.sort('todayDiff');
      console.log(reportData);
    });
  }
  sort(id){
    if(this.openOrder=="asc"){
      this.openOrder='desc';
      this.assendingOrder(id);
    }else{
      this.openOrder='asc';
      this.descOrder(id)
    }
  }
  assendingOrder(id){
    this.liveData.sort((a:any,b:any)=> (a[id]['diff'] > b[id]['diff'] ? 1 : -1))
  }
  descOrder(id){
    this.liveData.sort((a:any,b:any)=> (a[id]['diff'] < b[id]['diff'] ? 1 : -1))
  }
}
