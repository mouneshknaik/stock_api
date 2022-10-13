import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './appn-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CacheInterceptor } from './intercepter/cacheInterceptor.service';
import { NewCacheInterceptor } from './intercepter/cacheMap/cache-interceptor.service';
import { CacheResolverService } from './intercepter/cacheMap/cache-resolver.service';
import { PageComponent } from './page/page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AllStockComponent } from './all-stock/all-stock.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CacheInterceptor,NewCacheInterceptor,CacheResolverService,
    // { provide: HTTP_INTERCEPTORS, useClass: NewCacheInterceptor, multi: true },
  ],
  bootstrap: [AppComponent
  ]
})
export class AppModule { }
