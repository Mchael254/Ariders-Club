import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient, private router:Router) { }

  private baseUrl = 'https://ariders-club.onrender.com/user'

  register(userData:any):Observable<any>{
    const url = `${this.baseUrl}/registerMember`;
    return this.http.post(url, userData)

  }

  login(loginData:any):Observable<any>{
    const url = `${this.baseUrl}/loginMember`;
    return this.http.post(url,loginData )
  }

  isLoggedIn():boolean{
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  autoLogout(expiry: number) {
    const now = Math.floor(Date.now() / 1000);
    const timeout = (expiry - now) * 1000;
    setTimeout(() => {
      this.router.navigate(['/signin']);
    }, timeout);
  }
  

}
