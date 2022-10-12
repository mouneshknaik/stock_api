import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor(){
    
  }
  private requests: Record<string, any> = {};
  
  public has(request: HttpRequest<any>): boolean {
    return this.key(request) in this.requests;
  }  
  
//   public getData(request: HttpRequest<any>): Observable<HttpEvent<any>> {
//     return this.requests[this.key(request)];
//   }
  public get(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.requests[this.key(request)];
  }
  public getTimeExpairy(request: HttpRequest<any>,expairyTime:number): number {
    return this.requests[this.key(request)]?.time + expairyTime;
  }
  public setData(request: HttpRequest<any>, response: any,time:number): void {
    response['time']=time;
    this.requests[this.key(request)] =response;
  }
//   public set(request: HttpRequest<any>, response: any): void {
//     this.requests[this.key(request)] =response;
//   }
  public delete(request: HttpRequest<any>): void {
    delete this.requests[this.key(request)];
  }
  
  private key(request: HttpRequest<any>): string {
    return [request.urlWithParams, JSON.stringify(request.body),request.responseType].join('#');
  }
  public deletall():void{
    this.requests={}
  }
  showData(){
    return(this.requests);
  }
}