import { LiveWatchComponent } from './live-watch.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveWatchRoutingModule } from './live-watch-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [LiveWatchComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    LiveWatchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class LiveWatchModule { }
