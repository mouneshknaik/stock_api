import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { PageComponent } from './page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';


@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    PageRoutingModule,
    HttpClientModule
  ],
  exports:[PageComponent],
  providers:[{ provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },]
})
export class PageModule { }
