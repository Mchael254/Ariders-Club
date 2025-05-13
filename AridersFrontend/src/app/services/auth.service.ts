import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, tap } from 'rxjs';
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

  private baseUrl = 'https://ariders-club.onrender.com/user'

  register(userData: any): Observable<any> {
    const url = `https://aidnxywieovjglfrcwty.supabase.co/functions/v1/signupMember`;

    return this.http.post(url, userData, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': environment.supabaseKey,
        'Authorization': `Bearer ${environment.supabaseKey}`
      }
    })

  }

  // Login with supabase
  login(loginData: { email: string; password: string }): Observable<any> {
    return from(this.supabase.auth.signInWithPassword(loginData)).pipe(
      tap(response => console.log('Supabase response from service:', response))
    );
  }

  logout() {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_role');
  localStorage.removeItem('auth_profile_image');
}
  
}
