import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as AuthActions from '../store/auth/auth.actions';


import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ResponsesService } from '../services/responses.service';
import { selectAuthError, selectAuthRole, selectIsAuthenticated } from '../store/auth/auth.selectors';
import { loginForm } from '../interfaces/authInterface';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private response: ResponsesService,
    private router: Router,
    private store: Store
  ) {}

  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  loadingLine: boolean = false;

  ngOnInit(): void {
    // Handle login result (auth + role)
    combineLatest([
      this.store.select(selectIsAuthenticated),
      this.store.select(selectAuthRole),
      this.store.select(selectAuthError)
    ])
      .pipe(filter(([auth, role, error]) => auth || !!error)) 
      .subscribe(([authenticated, role, error]) => {
        this.loadingLine = false;

        if (authenticated) {
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'member') {
            this.router.navigate(['/profile']);
          } else {
            this.router.navigate(['/home']);
          }
        }

        if (error) {
          this.response.showError(error); 
        }
      });
  }

  inputValidator(): boolean {
    const email = this.signinForm.get('email')?.value || '';
    const password = this.signinForm.get('password')?.value || '';

    if (password === '' || email === '' || password.length < 8) {
      this.response.showWarning('Check fields ⚠️');
      return false;
    }

    return true;
  }

  onSignIn(): void {
    this.loadingLine = true;

    if (!this.inputValidator()) {
      this.loadingLine = false;
      return;
    }

    const form = this.signinForm.getRawValue() as loginForm;

    this.store.dispatch(AuthActions.login({ email: form.email, password: form.password }));
  }
}
