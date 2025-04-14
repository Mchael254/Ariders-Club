import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ariders';

  constructor(private auth:AuthService){}

  ngOnInit():void{
    this.auth.supabase.auth.onAuthStateChange((event, session)=>{
     if(event === 'SIGNED_IN'){
      const user = session?.user
      
      this.auth.currentUser.set({
        email:user?.email!,
        firstName:user?.user_metadata?.['firstName'] ?? 'No name'
      });

     }else if(event === 'SIGNED_OUT'){
      this.auth.currentUser.set(null)

     }
    })

  }
}
