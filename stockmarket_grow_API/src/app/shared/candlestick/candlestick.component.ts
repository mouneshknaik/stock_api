import { Component, VERSION ,ViewChild,OnInit, Input, SimpleChanges } from '@angular/core';

import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexYAxis,ApexXAxis,ApexTitleSubtitle} from "ng-apexcharts";
import * as moment from 'moment';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-candlestick',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.css']
})
export class CandlestickComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: any;
  @Input() seriesData :any; 
  @Input() chartVisible :boolean; 
  constructor() { 

  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)  ;  
  }
  ngOnInit(): void {
    this.populateChart();
    console.log(this.seriesData?.data);
  }
populateChart(){
  this.chartOptions = {
    series: [{
      data:this.filterTime(this.seriesData?.data)
    }],
    stroke: {
      width: 1
    },
    chart: {
      type: "candlestick",
    },
    xaxis: {
      type: "category",

      labels: {
        formatter: function(val) {
          return moment(val).format("MMM DD HH:mm");
        },
      }
    },
    tooltip: {
      x: {
        format: "HH:mm:ss",
      }
    }
  };
}
filterTime(data){
  let tmp=data?.[0]['x'];
  return data.map(ele=>{
    ele['x']=tmp;
    tmp=tmp+(60*1000);
    return ele;
  });
  }
}
