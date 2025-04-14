import { Injectable, signal } from '@angular/core';
import { createClient, AuthResponse } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  currentUser = signal<{email:string, firstName:string} | null> (null)
 
  //supabase connection
  supabase = createClient(environment.supabaseUrl,environment.supabaseKey)

  //user registration
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

  //user login
  login(email:string, password:string):Observable<AuthResponse>{

    const promise = this.supabase.auth.signInWithPassword({
      email,
      password
    });

    return from(promise)

  }

  get currentUserValue() {
    return this.currentUser();
  }
  

  //user logout
  logout():void{
    this.supabase.auth.signOut()
  }

  ngOnInit():void{
    const user = this.currentUser();
    if(user){
      localStorage.setItem('userDetails', JSON.stringify(user))
    }

    this.getStoredUser()

  }

  getStoredUser(){
    const parsedUser = localStorage.getItem('userDetails');
    return parsedUser ? JSON.parse(parsedUser) : null;
  }
  


}
