import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  faBars = faBars; 
  sideNavOpen:boolean = false;
  currentView = 'profile';

  toggleSideNav(){
    this.sideNavOpen = !this.sideNavOpen

  }

  setView(view:string){
    this.currentView = view;
    this.sideNavOpen = false;

  }

}
