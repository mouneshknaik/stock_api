import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';
import { NewCacheInterceptor } from '../intercepter/cacheMap/cache-interceptor.service';
import { CacheResolverService } from '../intercepter/cacheMap/cache-resolver.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
// import {MatNativeDateModule} from '@angular/material/core';
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ],
  exports:[DashboardComponent],
  providers:[ 
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: CacheResolverService, multi: true }
  ]
})
export class DashboardModule { }
