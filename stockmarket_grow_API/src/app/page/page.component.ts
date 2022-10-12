import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheInterceptor } from '../intercepter/cacheInterceptor.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  myData: any;

  constructor(private http:HttpClient,public cacheInterceptor:CacheInterceptor,public router:Router) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/1').subscribe((val:any)=>{
      this.myData = val?.data
    })
  }

}
