import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { selectUser } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.css'],
})

export class BioComponent {
  user$!: Observable<User | null>;
  originalUser!: User | null;
  user: User = {} as User;
  dob: Date = new Date();
  

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.user$.subscribe((u) => {
    if (u) {
      this.originalUser = JSON.parse(JSON.stringify(u)); 
      this.user = JSON.parse(JSON.stringify(u));
     
    }
  });
  }

  changed = {
    basic: false,
    address: false,
    contact: false,
  };

  onChange(category: string) {
    switch (category) {
    case 'contact':
      this.changed.contact =
        this.user.phone !== this.originalUser?.phone ||
        this.user.email !== this.originalUser?.email;
      break;
  }
   
  }

  save(category: string) {
   
  }

  cancel(category: string) {
    
  }

  
}
