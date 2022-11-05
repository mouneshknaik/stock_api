import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllStockRoutingModule } from './all-stock-routing.module';
import { AllStockComponent } from './all-stock.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerInput, MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AllStockComponent],
  imports: [
    CommonModule,
    AllStockRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, 
    MatNativeDateModule,
    MatDatepickerModule,
  
  ],
 })
export class AllStockModule { }
