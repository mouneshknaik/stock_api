import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveChartRoutingModule } from './live-chart-routing.module';
import { LiveChartComponent } from './live-chart.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CandlestickModule } from '../shared/candlestick/candlestick.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
  declarations: [LiveChartComponent],
  imports: [
    CommonModule,
    LiveChartRoutingModule,
    CandlestickModule,
    HttpClientModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSlideToggleModule
  ],
  exports:[LiveChartComponent]
})
export class LiveChartModule { }
