import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

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
  toggle_isChecked:boolean=true;
  ngOnInit(): void {
    this.liveAverage()
    let timeInverval=60*60*6;
    if(new Date().getHours()>=8 && new Date().getHours()<=15){
      timeInverval=60
    }
    setInterval(()=>{
      // this.changedtoggle();
    },1000*timeInverval)
  }
  basisSelected='daily'
  changedbasis(){
    console.log(this.basisSelected);
    this.getLiveWatch();
  }
  changedtoggle(){
    console.log(this.toggle_isChecked);
    if(this.toggle_isChecked){
      this.liveAverage()
    }else{
      this.getLiveWatch()
    }
  }
  getLiveWatch(){
    this.loading=true;
    this.liveData=[];
    this.http.get(environment.domain+'/watchtimefram?basis='+this.basisSelected).subscribe((reportData:any)=>{
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
      this.sort('todayDiff','desc');
      console.log(reportData);
    });

  }
  liveAverage(){
    this.loading=true;
    this.liveData=[];
    this.http.get(environment.domain+'/moving-average').subscribe((reportData:any)=>{
      this.liveData=reportData;
      this.liveData.map(ele=>{
        let tmp={};
        let ttp={}
        tmp['diff']=((ele?.['last_price']-ele?.['moving_avarage_20'])/ele?.['moving_avarage_20'])*100;
        ele['moving_diff20']=tmp;
        ttp['diff']=((ele?.['last_price']-ele?.['moving_avarage_50'])/ele?.['moving_avarage_50'])*100;
        ele['moving_diff50']=ttp;
        let moneyDiff={};
        moneyDiff['diff']=ele?.['last_price']-ele?.['moving_avarage_20'];
        let stocastic14tmp={};
        stocastic14tmp['diff']=ele?.stocastic14;
        ele['stocastic14']=stocastic14tmp;
        let stocastic50tmp={};
        stocastic50tmp['diff']= ele['stocastic50']
        ele['stocastic50']=stocastic50tmp;
        ele['diff_amount']=moneyDiff;
        this.loading=false;
      })
    });
  }
  sort(id,type){
    if(!type){
      this.toggle();
      type=this.openOrder;
    }
    if(type=="asc"){
      // this.openOrder='desc';
      this.assendingOrder(id);
    }else{
      // this.openOrder='asc';
      this.descOrder(id)
    }
  }
  toggle(){
    if(this.openOrder=='desc'){
      this.openOrder= 'asc';
    }else{
      this.openOrder='desc';
    }
  }
  assendingOrder(id){
    this.liveData.sort((a:any,b:any)=> (a[id]['diff'] > b[id]['diff'] ? 1 : -1))
  }
  descOrder(id){
    this.liveData.sort((a:any,b:any)=> (a[id]['diff'] < b[id]['diff'] ? 1 : -1))
  }
}
