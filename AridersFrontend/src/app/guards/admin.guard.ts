import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { catchError, from, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const supabaseUrl = environment.supabaseUrl
const supabaseAnonKey = environment.supabaseAnonKey; 
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  return from(supabase.auth.getSession()).pipe(
     map(({ data, error }) => {
       const session = data?.session;
       const role = session?.user?.user_metadata?.['role'];
 
       if (session && role === 'admin') {
         return true;
       }
 
       return router.createUrlTree(['/signin']);
     }),
     catchError((err) => {
       console.error('Auth guard error:', err);
       return [router.createUrlTree(['/signin'])];
     })
   );

};
