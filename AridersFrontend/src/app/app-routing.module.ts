import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  { path:'home',component: HomeComponent},
  {path:'footer',component:FooterComponent},
  {path:'signup',component:SignupComponent},
  {path:'signin',component:SigninComponent},
  {path:'admin',component:AdminComponent,canActivate:[adminGuard]},
  {path:'profile',component:ProfileComponent,canActivate: [authGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
