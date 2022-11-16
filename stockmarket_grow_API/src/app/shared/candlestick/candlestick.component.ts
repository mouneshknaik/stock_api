import { Component, VERSION ,ViewChild,OnInit, Input } from '@angular/core';

import {ChartComponent,ApexAxisChartSeries,ApexChart,ApexYAxis,ApexXAxis,ApexTitleSubtitle} from "ng-apexcharts";

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

  ngOnInit(): void {
    this.chartOptions = {
      series: [{
        data:this.seriesData?.data
      }],
      chart: {
        type: "candlestick",
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: 'HH:mm:ss',
         datetimeUTC: false
        }
      },
      tooltip: {
        x: {
          format: "HH:mm:ss",
        }
      }
    };
  }

}
