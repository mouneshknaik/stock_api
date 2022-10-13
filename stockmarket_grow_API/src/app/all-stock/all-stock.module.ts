import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllStockRoutingModule } from './all-stock-routing.module';
import { AllStockComponent } from './all-stock.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AllStockComponent],
  imports: [
    CommonModule,
    AllStockRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AllStockModule { }
