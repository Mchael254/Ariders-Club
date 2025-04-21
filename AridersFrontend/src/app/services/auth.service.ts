import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }
  private supabase: SupabaseClient;

  private baseUrl = 'http://localhost:3000/user'

  register(userData: any): Observable<any> {
    const url = `https://aidnxywieovjglfrcwty.supabase.co/functions/v1/signupMember`;

    return this.http.post(url, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

  }

  // Login with supabase
  login(loginData: { email: string; password: string }): Observable<any> {
    return from(this.supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password
    }));
  }






}
