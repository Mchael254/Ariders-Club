import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponsesService } from '../services/responses.service';
import { AuthService } from '../services/auth.service';
import { signupForm } from '../interfaces/authInterface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

  constructor(private fb: FormBuilder,
    private response: ResponsesService,
    private auth: AuthService,
    private router: Router) { }

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],

  });

  loadingLine: boolean = false

  //all fields validator
  allFieldsValidator() {
    Object.values(this.signupForm.controls).forEach(control => {
      control.markAsTouched();
    })
    return;
  }

  //password validator
  passwordMatch(): boolean {
    this.loadingLine = true

    const password = this.signupForm.get('password')?.value;
    const confirmPassword = this.signupForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.response.showError('Passwords do not match ⚠️');
      this.loadingLine = false;
      return false;
    }

    setTimeout(() => {
      this.loadingLine = false;
    }, 3000);

    return true;

  }

  onSignUp() {
    this.allFieldsValidator()
    
    if(!this.passwordMatch()){
      return;
    }

    const form = this.signupForm.getRawValue() as signupForm
    console.log(form);
    
    this.auth.register(form.firstName, form.lastName, form.email, form.password, form.phoneNumber).subscribe(
      result => {
        if (result.error) {
          const errorMessage = result.error.message
          this.response.showError(`${errorMessage}`)
        } else {
          this.router.navigate(['/signin'])
        }

      }

    )

  }


}
