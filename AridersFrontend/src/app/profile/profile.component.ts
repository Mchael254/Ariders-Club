import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { ResponsesService } from '../services/responses.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(private fb:FormBuilder, private response: ResponsesService,private auth:AuthService){}
  faBars = faBars; 

  sideNavOpen:boolean = false;
  currentView = 'profile';
  loadingLine:boolean = false
  profileMini:boolean = false
  editProfileBtn:boolean = true
  userEmail:string = ''


  toggleSideNav(){
    this.sideNavOpen = !this.sideNavOpen

  }

  setView(view:string):void{
    this.currentView = view;
    this.sideNavOpen = false;
  }

  // profile edit
  profielForm = this.fb.group({
    password:['',[Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)]],
    confirmPassword:['',[Validators.required]],
    email:['',[Validators.required, Validators.minLength(8)]]


  })

  inputValidator():boolean{
    const email = this.profielForm.get('email')?.value;
    const password = this.profielForm.get('password')?.value;
    const confrimPassword = this.profielForm.get('confirmPassword')?.value;

    if(email == '' || password == '' || confrimPassword == ''){
      this.response.showError('check input fields ⚠️')

      return false;
    }

    if(password === confrimPassword){
      this.response.showError('check input fields ⚠️')
      return false;
    }
    
    return true;

  }

  onEditProfile(){
    if(!this.inputValidator()){
      this.loadingLine = true
      return;
    }
  }

  userDetails:any

  ngOnInit(){
    this.userDetails = this.auth.getStoredUser();
    console.log(this.userDetails);
    
  }

 



}
