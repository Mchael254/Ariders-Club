import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  
  constructor(private fb:FormBuilder){}
  
  signupForm = this.fb.group({
    firstName: ['',Validators.required],
    lastName: ['',Validators.required],
    email: ['',Validators.required,Validators.email],
    phoneNumber: ['',Validators.required],
    password: ['',Validators.required],
    confirmPassword: ['',Validators.required],

  });




  onSignUp(){
    this.loadingLine = true
    console.log('submitted form:',this.signupForm.value, this.signupForm.invalid)

  }

  loadingLine:boolean = false

}
