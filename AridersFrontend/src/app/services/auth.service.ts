import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }

  private baseUrl = 'http://localhost:3000/user'

  register(userData:any):Observable<any>{
    const url = `${this.baseUrl}/registerMember`;
    return this.http.post(url, userData)

  }

  login(loginData:any):Observable<any>{
    const url = `${this.baseUrl}/loginMember`;
    return this.http.post(url,loginData )
  }

}
