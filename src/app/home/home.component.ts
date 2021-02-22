import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpResponse } from '@angular/common/http';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

	products = [];

	constructor(private apiService: ApiService, private dataService: DataService) { }

	ngOnInit() {
    this.dataService.sendGetRequest().pipe(takeUntil(this.componentDestroyed(this))).subscribe((res: HttpResponse<any>)=>{  
      console.log(res);  
      this.products = res.body;  
    })  
	}

  componentDestroyed(component: OnDestroy) {
    const oldNgOnDestroy = component.ngOnDestroy;
    const destroy$ = new ReplaySubject<void>(1);
    component.ngOnDestroy = () => {
      oldNgOnDestroy.apply(component);
      destroy$.next(undefined);
      destroy$.complete();
    };
    return destroy$;
  }

  public firstPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.first).pipe(takeUntil(this.componentDestroyed(this))).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.products = res.body;
    })
  }
  public previousPage() {

    if (this.dataService.prev !== undefined && this.dataService.prev !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.prev).pipe(takeUntil(this.componentDestroyed(this))).subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.products = res.body;
      })
    }

  }
  public nextPage() {
    if (this.dataService.next !== undefined && this.dataService.next !== '') {
      this.products = [];
      this.dataService.sendGetRequestToUrl(this.dataService.next).pipe(takeUntil(this.componentDestroyed(this))).subscribe((res: HttpResponse<any>) => {
        console.log(res);
        this.products = res.body;
      })
    }
  }
  public lastPage() {
    this.products = [];
    this.dataService.sendGetRequestToUrl(this.dataService.last).pipe(takeUntil(this.componentDestroyed(this))).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.products = res.body;
    })
  }



  ngOnDestroy() {

  }

}
