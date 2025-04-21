import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, pipe, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ResponsesService } from '../services/responses.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router:Router, private response:ResponsesService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    let authReq = req

    if(token){
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
    }

    return next.handle(authReq).pipe(
      catchError((error:HttpErrorResponse)=>{
        if(error.status === 401 || error.status === 401){
          localStorage.removeItem('authToken');
          this.router.navigate(['/signin'])
          
        }
        this.response.showError('signin again')
        return throwError(() => error);

      })
      
    )
    
  }
  
}
