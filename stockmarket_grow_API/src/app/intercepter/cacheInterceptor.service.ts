import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpResponse,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';
import { CacheService } from './cacheService';
import { Router } from '@angular/router';


@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  expairTime=1000*60*60*2;//
  constructor(private cache: CacheService,private router:Router) {}
  excludeURL=[
    "5",
    "6"
  ];
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(this.cache.showData());
    let urlSTring=(new URL(request.urlWithParams)).pathname.substring(1);
    if (request.method == 'GET' || (request.method == 'POST') && !this.excludeURL.includes(urlSTring)) {
      let nowDate=new Date().getTime();
      if(this.cache.has(request) && this.cache.getTimeExpairy(request,this.expairTime)<nowDate){
        console.log('api cache expaired');
        this.cache.delete(request);
      }
      if (!this.cache.has(request)) {
        const response = next.handle(request).pipe(
          // finalize(() => this.cache.delete(request)),
          shareReplay({ refCount: true, bufferSize: 1 })
        );
        let nowDate=new Date().getTime();
        this.cache.setData(request,response,nowDate)
      }
      return this.cache.get(request);
    }else{
      return next.handle(request);
    }
  }
  public clearCache(){
    this.cache.deletall();
  }
}