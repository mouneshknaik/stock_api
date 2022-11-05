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
import { LiveWatchComponent } from './live-watch/live-watch.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatNativeDateModule,
    MatFormFieldModule,MatInputModule,
    BrowserAnimationsModule,

  ],
  providers: [CacheInterceptor,NewCacheInterceptor,CacheResolverService,
    // { provide: HTTP_INTERCEPTORS, useClass: NewCacheInterceptor, multi: true },
  ],
  bootstrap: [AppComponent
  ]
})
export class AppModule { }
