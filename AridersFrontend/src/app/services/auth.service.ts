import { Injectable } from '@angular/core';
import { createClient, AuthResponse } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  supabase = createClient(environment.supabaseUrl,environment.supabaseKey)

  register(firstName:string,lastName:string,email:string,password:string,phoneNumber:string):Observable<AuthResponse>{
    const promise = this.supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
          phoneNumber,
          firstName,
          lastName
        }
      }
    });

    return from(promise)

  }
}
