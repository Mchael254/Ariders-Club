import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ResponsesService } from '../services/responses.service';
import { AuthService } from '../services/auth.service';
import { loginForm } from '../interfaces/authInterface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  constructor(private fb: FormBuilder, private response: ResponsesService,
    private auth: AuthService, private router: Router) { }

  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)]],
    password: ['', [Validators.required, Validators.minLength(8)]],

  });

  loadingLine: boolean = false

  inputValidator(): boolean {
    this.loadingLine = true;

    const email = this.signinForm.get('email')?.value || '';
    const password = this.signinForm.get('password')?.value || '';

    if (password === '' || email === '' || password.length < 8) {
      this.response.showError('check fields ⚠️');
      return false;
    }

    return true;
  }

  onSignIn() {
    this.loadingLine = true

    if (!this.inputValidator()) {
      this.loadingLine = false
      return;
    }

    const form = this.signinForm.getRawValue() as loginForm
    const loginData = {
      email: form.email,
      password: form.password
    }
    this.auth.login(loginData).subscribe({
      next: async ({ data, error }) => {
        if (error) {
          this.response.showError(error.message);
          return;
        }
    
        const session = data.session;
        const role = session?.user?.user_metadata?.role || 'member';
        console.log(role);
  
        this.response.showSuccess('Login successful');

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        const errorMessage = err?.error?.message || err?.error?.error || 'An unexpected error occurred';
        this.response.showError(errorMessage);
        console.error('Registration error:', err);
        this.loadingLine = false
      }
    
    });


  }

}
