import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpService } from './http.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, delay, finalize, map, retryWhen, timeout } from 'rxjs/operators';



@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private httpService: HttpService){}


  /**
   * It intercepts the request, sets the loading to true, sets a timeout of 1 second, retries the
   * request 3 times, sets the loading to false, and returns an empty observable if the request fails
   * @param req - HttpRequest<any> - The request object
   * @param {HttpHandler} next - HttpHandler - the next interceptor in the chain
   * @returns Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const defaultTimeout = 1000
    console.log('intercepted')
    this.httpService.setLoading(true, req.url);
    return next.handle(req).pipe(timeout(defaultTimeout),
    retryWhen(err=>{
      let retries = 1;
      return err.pipe(
        delay(1000),
        map(error=>{
          if (retries++ ===3){
            this.httpService.setLoading(false, req.url);
            throw error
          }
          return error;
        })
      )
    }),catchError(err=>{
      console.log(err)
        this.httpService.setLoading(false, req.url);
      return EMPTY
    }), finalize(()=>{
        this.httpService.setLoading(false, req.url);
    })
  )
};
  }
  