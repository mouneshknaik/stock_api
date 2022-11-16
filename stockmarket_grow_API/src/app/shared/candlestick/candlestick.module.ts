import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LiveChartRoutingModule } from 'src/app/live-chart/live-chart-routing.module';
import { CandlestickComponent } from './candlestick.component';

@NgModule({
  declarations: [CandlestickComponent],
  imports: [
    CommonModule,
    LiveChartRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
  ],
  exports:[CandlestickComponent]
})
export class CandlestickModule { }
