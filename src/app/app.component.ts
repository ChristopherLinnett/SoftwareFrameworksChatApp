import { Component, enableProdMode, OnDestroy, OnInit } from '@angular/core';
import { HttpInterceptorService } from './shared/services/http-interceptor.service';
import { HttpService } from './shared/services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  loading: boolean = false;
  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
    this.listenForLoading()
  }

  setLoading(loading:boolean){
    this.loading = loading
  }
  listenForLoading(){
    this.httpService.loadingObserver.subscribe((loading)=>{
      this.loading = loading
    })
  }
}
