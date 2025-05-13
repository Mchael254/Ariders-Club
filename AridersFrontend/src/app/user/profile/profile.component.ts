import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faBars, faPen, faUser } from '@fortawesome/free-solid-svg-icons';
import { ResponsesService } from '../../services/responses.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { Store } from '@ngrx/store';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user$!: Observable<User | null>;

  constructor(
    private fb: FormBuilder,
    private response: ResponsesService,
    private auth: AuthService,
    private http: HttpClient,
    private store: Store,
    private router: Router,
  ) {
    this.user$ = this.store.select(selectUser);
  }
  faBars = faBars;
  faPen = faPen;

  sideNavOpen: boolean = false;
  currentView = 'bio';
  loadingLine: boolean = false;
  profileMini: boolean = true;
  editProfileBtn: boolean = true;
  profileBtn: boolean = true;
  userEmail: string = '';
  profileEdit: boolean = false;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  userDetails: any;
  editMode = false;

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }

  setView(view: string): void {
    this.currentView = view;
    this.sideNavOpen = false;
  }

  // profile edit
  profielForm = this.fb.group({
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i),
      ],
    ],
    confirmPassword: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.minLength(8)]],
  });

  inputValidator(): boolean {
    const email = this.profielForm.get('email')?.value;
    const password = this.profielForm.get('password')?.value;
    const confrimPassword = this.profielForm.get('confirmPassword')?.value;

    if (email == '' || password == '' || confrimPassword == '') {
      this.response.showError('check input fields ⚠️');

      return false;
    }

    if (password === confrimPassword) {
      this.response.showError('check input fields ⚠️');
      return false;
    }

    return true;
  }

  editProfile() {
    this.editProfileBtn = true;
    this.profileBtn = false;
    this.profileMini = false;
    this.profileEdit = true;
  }

  onEditProfile() {
    this.loadingLine = true;
    // if(!this.inputValidator()){
    //   this.loadingLine = true
    //   return;
    // }

    this.editProfileBtn = false;
    this.profileBtn = true;
    this.profileEdit = false;
    this.profileMini = true;
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Optionally: you can also store the file to upload later
      this.selectedFile = file;
    }
  }

  cancelImageChange(): void {
    this.previewImage = null;
    this.selectedFile = null;
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    const userId = '99443178-66b5-44bb-9b0a-f119e6b4083e';

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('userId', userId);
    this.http
      .post<any>('http://localhost:3000/user/upload-profile-picture', formData)
      .subscribe({
        next: (response) => {
          this.previewImage = null;
          this.response.showSuccess('profile pic updated');
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  // change bio
  bioSubmit() {
    this.editMode = false;
  }

  cancelEditBio() {
    this.editMode = false;
  }
}
